import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { ArtistRecord } from "./artists";

export const loadArtistForHead = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const { data: row } = await supabaseAdmin
      .from("artists")
      .select(
        "id, slug, name, alt_name, short, short_en, short_no, short_sv, seo_title_en, seo_title_no, seo_title_sv, seo_description_en, seo_description_no, seo_description_sv, biography_en, biography_no, biography_sv, biography_de, img, og_image, born, died, birth_place, country, region",
      )
      .eq("slug", data.slug)
      .maybeSingle();
    return { artist: (row ?? null) as ArtistRecord | null };
  });
