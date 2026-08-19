import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { parseJsonColumn } from "@/integrations/d1/client";

export type ConcertReview = {
  id: string;
  artist_slug: string;
  artist_name: string;
  event_name: string;
  venue: string | null;
  city: string | null;
  country: string | null;
  event_date: string | null;
  event_year: number | null;
  quote_text: string;
  quote_text_i18n: Partial<Record<"no" | "en" | "sv" | "de" | "pl", string>>;
  quote_language: string;
  review_author: string | null;
  publication_name: string | null;
  source_url: string | null;
  sort_order: number;
};

const CONCERT_REVIEW_COLUMNS =
  "id,artist_slug,artist_name,event_name,venue,city,country,event_date,event_year,quote_text,quote_text_i18n,quote_language,review_author,publication_name,source_url,sort_order";

export const fetchConcertReviewsByArtistSlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const { results } = await db
      .prepare(`SELECT ${CONCERT_REVIEW_COLUMNS} FROM concert_reviews WHERE artist_slug = ? AND status = 'published' ORDER BY sort_order ASC, event_date DESC`)
      .bind(data.slug)
      .all<Record<string, any>>();
    return (results ?? []).map((r) => ({
      ...r,
      quote_text_i18n: parseJsonColumn(r.quote_text_i18n, {}),
    })) as ConcertReview[];
  });
