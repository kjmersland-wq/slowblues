// Cloudflare D1 accessor. Nitro's cloudflare-module preset (used by
// @tanstack/react-start on Cloudflare) attaches bindings to the incoming
// request as `request.runtime.cloudflare.env` — see
// node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
// and node_modules/nitro/dist/docs/1.deploy/2.providers/5.cloudflare.md.
// A static `import ... from "cloudflare:workers"` is NOT usable here: it
// only resolves inside the final Worker bundle, not in the SSR build step
// TanStack Start/Vite runs first, so it breaks `vite build`.
import { getRequest } from "@tanstack/react-start/server";

type RequestWithCloudflare = Request & { runtime?: { cloudflare?: { env?: { DB?: D1Database } } } };

export function getDB(): D1Database {
  const request = getRequest() as RequestWithCloudflare | undefined;
  const db = request?.runtime?.cloudflare?.env?.DB;
  if (!db) {
    throw new Error(
      "Missing D1 binding 'DB'. Check the d1_databases entry in wrangler.jsonc and that you're running via wrangler dev / a deployed Worker (not plain node/vite preview).",
    );
  }
  return db;
}

// Parses the JSON-string columns (text[]/jsonb equivalents) that schema.sql
// stores as TEXT back into arrays/objects. Falls back to `fallback` on null,
// missing, or malformed input instead of throwing.
export function parseJsonColumn<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || value.length === 0) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
