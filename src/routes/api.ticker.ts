import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { buildNewsTicker } from "@/lib/newsfeed.server";

// Public JSON endpoint for the homepage newsticker. Same underlying query
// as the getNewsTicker server function (src/lib/newsfeed.functions.ts) —
// both call buildNewsTicker so there is one source of truth.
export const Route = createFileRoute("/api/ticker")({
  server: {
    handlers: {
      GET: async () => {
        const db = getDB();
        const data = await buildNewsTicker(db);
        return Response.json(data, {
          headers: { "Cache-Control": "public, max-age=120, stale-while-revalidate=600" },
        });
      },
    },
  },
});
