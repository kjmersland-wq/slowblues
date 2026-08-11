import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { parseJsonColumn } from "@/integrations/d1/client";

const LIST_COLUMNS =
  "id,slug,artist_slug,artist_name,album_title,release_year,label,blues_style,cover_image,title_en,title_no,title_de,verdict_en,verdict_no,verdict_de,score_songwriting,score_instrumentation,score_production,total_score,published_at";

export const fetchPublishedReviews = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDB();
  const { results } = await db
    .prepare(`SELECT ${LIST_COLUMNS} FROM blues_reviews WHERE status = 'published' ORDER BY published_at DESC LIMIT 100`)
    .all<Record<string, any>>();
  return results ?? [];
});

export const fetchPublishedReviewBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const row = await db
      .prepare("SELECT * FROM blues_reviews WHERE slug = ? AND status = 'published'")
      .bind(data.slug)
      .first<Record<string, any>>();
    if (!row) return null;
    return { ...row, tracks: parseJsonColumn(row.tracks, []) };
  });
