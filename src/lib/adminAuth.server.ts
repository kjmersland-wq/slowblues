// Replaces Supabase Auth. SlowBlues has a single shared admin account, so
// instead of a users/sessions table we use one shared password (stored as a
// hashed Cloudflare secret) and a stateless, HMAC-signed session cookie.
//
// Required Cloudflare secrets (see checklist at the end of the migration
// summary for the exact `wrangler secret put` commands):
//   ADMIN_PASSWORD_HASH  — hex SHA-256 digest of the admin password
//   SESSION_SECRET        — random string used to sign session cookies
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getCookie, getRequest, setCookie, deleteCookie } from "@tanstack/react-start/server";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required secret/env var: ${name}`);
  return value;
}

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return bytesToHex(digest);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(str.length / 4) * 4, "=");
  return atob(padded);
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return bytesToHex(sig);
}

async function createSessionToken(): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_SECONDS * 1000 });
  const encodedPayload = base64UrlEncode(payload);
  const signature = await hmacSign(getEnv("SESSION_SECRET"), encodedPayload);
  return `${encodedPayload}.${signature}`;
}

async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;
  const expectedSignature = await hmacSign(getEnv("SESSION_SECRET"), encodedPayload);
  if (!timingSafeEqual(signature, expectedSignature)) return false;
  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as { exp: number };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const hash = await sha256Hex(password);
  return timingSafeEqual(hash, getEnv("ADMIN_PASSWORD_HASH").trim().toLowerCase());
}

// Server-function middleware — protects admin-only server functions.
// Usage: createServerFn(...).middleware([requireAdmin]).handler(...)
export const requireAdmin = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const request = getRequest();
  if (!request?.headers) throw new Error("Unauthorized");
  const token = getCookie(COOKIE_NAME);
  const valid = await verifySessionToken(token);
  if (!valid) throw new Error("Unauthorized: not signed in");
  return next({ context: { isAdmin: true } });
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    const ok = await verifyAdminPassword(data.password);
    if (!ok) throw new Error("Feil passord");
    const token = await createSessionToken();
    setCookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { ok: true as const };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(COOKIE_NAME);
  const isAdmin = await verifySessionToken(token);
  return { isAdmin };
});
