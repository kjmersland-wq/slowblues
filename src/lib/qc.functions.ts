import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/adminAuth.server";
import { getDB, parseJsonColumn } from "@/integrations/d1/client";

export const fetchQCData = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const db = getDB();
    const [artistsRes, imagesRes] = await Promise.all([
      db
        .prepare(
          "SELECT slug,name,img,biography_en,biography_no,biography_sv,biography_de,youtube_video_ids,seo_title_en,short,region FROM artists ORDER BY name ASC LIMIT 1000",
        )
        .all(),
      db.prepare("SELECT artist_slug FROM artist_images WHERE verified = 1 AND is_primary = 1").all(),
    ]);
    const artists = (artistsRes.results ?? []).map((r: any) => ({
      ...r,
      youtube_video_ids: parseJsonColumn(r.youtube_video_ids, []),
    }));
    const verifiedSlugs = (imagesRes.results ?? []).map((r: any) => r.artist_slug as string);
    return { artists, verifiedSlugs };
  });
