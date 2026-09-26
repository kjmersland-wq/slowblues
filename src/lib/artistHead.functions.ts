import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { parseArtistRow } from "@/integrations/d1/artistRow";
import type { ArtistRecord } from "./artists";

// Despite the name this returns the FULL row: the same loader feeds both <head>
// (meta/JSON-LD, all 5 locales) and the server-rendered profile body, so
// crawlers see the complete biography in the first HTML instead of "Loading…".
export const loadArtistForHead = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const row = await db
      .prepare("SELECT * FROM artists WHERE slug = ?")
      .bind(data.slug)
      .first();
    return { artist: (row ? parseArtistRow(row) : null) as ArtistRecord | null };
  });
