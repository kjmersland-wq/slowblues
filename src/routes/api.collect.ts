import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";

// Cookie-free page-view collector. Receives the JSON payload sent by
// public/tracker.js (via sendBeacon, so the body usually arrives as text/plain)
// and stores one anonymous row per page view in the `pageviews` table.
//
// What is deliberately NOT stored: the IP address, the query string, the URL
// fragment, the full referrer URL, the page title, the screen size and any
// identifier kept in the browser. See migrations/0013_pageviews.sql.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const MAX_BODY_BYTES = 4096;
const DEVICES = new Set(["mobile", "tablet", "desktop"]);
const BOT_UA =
  /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python-requests|axios/i;
// Pages that must never show up in statistics (admin area, login).
const IGNORED_PATH = /^\/(?:admin|login)(?:\/|$)/;
// Paths that carry a secret token: keep the page, drop the token.
const TOKEN_PATHS: [RegExp, string][] = [[/^(\/learn\/play\/feedback\/delete\/)[^/]+/, "$1:token"]];

function ok(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function cleanSite(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const site = value
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
  return /^[a-z0-9]([a-z0-9.-]{0,98}[a-z0-9])?$/.test(site) ? site : null;
}

// Pathname only: no query string, no fragment. Token-carrying paths are masked.
function cleanPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let path = value.split(/[?#]/)[0] ?? "";
  if (!path.startsWith("/")) return null;
  path = path.slice(0, 300);
  if (path.length > 1) path = path.replace(/\/+$/, "");
  for (const [pattern, replacement] of TOKEN_PATHS) path = path.replace(pattern, replacement);
  return path || "/";
}

// Referring hostname only, and nothing for navigation inside the same site.
function cleanReferrer(value: unknown, site: string): string | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const host = new URL(value).hostname.toLowerCase().replace(/^www\./, "");
    if (!host || host === site || host.endsWith(`.${site}`)) return null;
    return host.slice(0, 100);
  } catch {
    return null;
  }
}

function cleanLang(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const lang = value.trim().slice(0, 12);
  return /^[A-Za-z]{2,3}(?:[-_][A-Za-z0-9]{2,8})*$/.test(lang) ? lang : null;
}

// CF-IPCountry is an ISO 3166-1 alpha-2 code; "XX" = unknown, "T1" = Tor.
function cleanCountry(value: string | null): string | null {
  const code = value?.trim().toUpperCase() ?? "";
  return /^[A-Z]{2}$/.test(code) && code !== "XX" && code !== "T1" ? code : null;
}

// Anonymous, daily-rotating visitor id: SHA-256 over (secret + day + site + IP + user-agent),
// truncated. The IP only exists in memory for the length of this request.
async function visitorHash(site: string, ip: string, userAgent: string): Promise<string | null> {
  if (!ip) return null;
  const day = new Date().toISOString().slice(0, 10);
  const secret = process.env.SESSION_SECRET ?? "slowblues-pageviews";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${secret}|${day}|${site}|${ip}|${userAgent}`),
  );
  return Array.from(new Uint8Array(digest).slice(0, 12))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const Route = createFileRoute("/api/collect")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS_HEADERS }),

      POST: async ({ request }) => {
        try {
          const userAgent = request.headers.get("user-agent") ?? "";
          if (BOT_UA.test(userAgent)) return ok();

          const raw = await request.text();
          if (!raw || raw.length > MAX_BODY_BYTES) return ok();

          let body: Record<string, unknown>;
          try {
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return ok();
            body = parsed as Record<string, unknown>;
          } catch {
            return ok();
          }

          // Only page views are counted; other events (e.g. "outbound") are accepted but not stored.
          if (body.event !== "pageview") return ok();

          const site = cleanSite(body.site);
          const path = cleanPath(body.path);
          if (!site || !path || IGNORED_PATH.test(path)) return ok();

          const device =
            typeof body.device === "string" && DEVICES.has(body.device) ? body.device : null;
          const ip = request.headers.get("cf-connecting-ip") ?? "";

          await getDB()
            .prepare(
              `INSERT INTO pageviews (site, path, referrer, device, country, lang, visitor_hash)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
            )
            .bind(
              site,
              path,
              cleanReferrer(body.referrer, site),
              device,
              cleanCountry(request.headers.get("cf-ipcountry")),
              cleanLang(body.lang),
              await visitorHash(site, ip, userAgent),
            )
            .run();
        } catch (error) {
          // Measurement must never break a page or leak details to the caller.
          console.error("[collect] failed:", error);
        }
        return ok();
      },
    },
  },
});
