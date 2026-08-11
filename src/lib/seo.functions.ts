import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/adminAuth.server";
import { getDB } from "@/integrations/d1/client";

const LANGS = ["no", "sv", "en", "de"] as const;
const SEO_COLS = LANGS.flatMap((l) => [`seo_title_${l}`, `seo_description_${l}`]).join(",");

export const fetchSeoData = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const db = getDB();
    const [a, r] = await Promise.all([
      db.prepare(`SELECT slug,name,img,og_image,${SEO_COLS} FROM artists ORDER BY name ASC`).all<Record<string, any>>(),
      db
        .prepare(`SELECT slug,artist_name,album_title,status,cover_image,${SEO_COLS} FROM blues_reviews ORDER BY updated_at DESC`)
        .all<Record<string, any>>(),
    ]);
    return { artists: a.results ?? [], reviews: r.results ?? [] };
  });
