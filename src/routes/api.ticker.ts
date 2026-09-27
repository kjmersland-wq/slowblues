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
        const lang = (langParam && VALID_LANGS.has(langParam) ? langParam : "no") as "no" | "en" | "sv" | "de" | "pl";
        const data = await buildNewsTicker(db, lang);
        return Response.json(data, {
          headers: { "Cache-Control": "public, max-age=120, stale-while-revalidate=600" },
        });
      },
    },
  },
});
