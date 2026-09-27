import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { buildNewsTicker } from "@/lib/newsfeed.server";

const VALID_LANGS = new Set(["no", "en", "sv", "de", "pl"]);

// Public JSON endpoint for the homepage newsticker. Same underlying query
// as the getNewsTicker server function (src/lib/newsfeed.functions.ts) —
// both call buildNewsTicker so there is one source of truth.
//
// ?lang=xx only affects the house/internal items' text (see HOUSE_LINKS in
// newsfeed.server.ts) -- external/review/artist/concert/youtube items are
// unaffected, same as before. The query string is part of the cache key, so
// each language caches separately under the Cache-Control below.
export const Route = createFileRoute("/api/ticker")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const db = getDB();
        const langParam = new URL(request.url).searchParams.get("lang");
        // Default matches the homepage's own established fallback (src/i18n)
        // for a missing/invalid lang -- not "no". A client that ever requests
        // this without a valid ?lang= must land on the same language the
        // rest of an unprefixed page already defaults to, not silently on
        // Norwegian regardless of what the visitor is actually looking at.
        const lang = (langParam && VALID_LANGS.has(langParam) ? langParam : "en") as "no" | "en" | "sv" | "de" | "pl";
        const data = await buildNewsTicker(db, lang);
        return Response.json(data, {
          headers: { "Cache-Control": "public, max-age=120, stale-while-revalidate=600" },
        });
      },
    },
  },
});
