import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import type { ArtistRecord } from "./artists";

const COLUMNS =
  "id, slug, name, alt_name, short, short_en, short_no, short_sv, seo_title_en, seo_title_no, seo_title_sv, seo_description_en, seo_description_no, seo_description_sv, biography_en, biography_no, biography_sv, biography_de, img, og_image, born, died, birth_place, country, region";

export const loadArtistForHead = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const row = await db
      .prepare(`SELECT ${COLUMNS} FROM artists WHERE slug = ?`)
      .bind(data.slug)
      .first();
    return { artist: (row ?? null) as ArtistRecord | null };
  });
