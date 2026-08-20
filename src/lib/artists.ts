import { useEffect, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { parseArtistRow } from "@/integrations/d1/artistRow";

export type FamilyEntry = { relation: string; name: string; note?: string };
export type InstrumentEntry = { category: "Gitar" | "Vokal" | "Annet" | string; name: string; years?: string; note?: string };
export type CollaboratorEntry = { name: string; years?: string; note?: string };
export type VideoEntry = {
  kind: "featured" | "more";
  title: string;
  youtube_id: string;
  channel?: string;
  duration?: string;
  views?: string;
  thumbnail?: string;
  note?: string;
};
export type DiscographyEntry = {
  year: number | string;
  title: string;
  composers?: string;
  producer?: string;
  label?: string;
  chart?: string;
  chart_position?: string;
  sales?: string;
  sales_estimate?: string;
  notes?: string;
  musicians_count?: number;
  musicians?: Array<{ name: string; instrument?: string }>;
  youtube_id?: string;
};
export type PressQuote = {
  quote: string;
  author: string;
  role?: string;
  source_title?: string;
  source_url?: string;
  year?: number | string;
};
export type AwardEntry = { year: number | string; title: string; category?: string; note?: string };
export type BookingInfo = {
  booking_agency?: string | null;
  agent_name?: string | null;
  booking_email?: string | null;
  booking_phone?: string | null;
  booking_url?: string | null;
  source_url?: string;
  note?: string;
};

export type Lang = "en" | "no" | "sv" | "de" | "pl";

export type ArtistRecord = {
  id: string;
  slug: string;
  name: string;
  alt_name: string | null;
  tag: string;
  era: string | null;
  era_label_en: string | null;
  era_label_no: string | null;
  era_label_sv: string | null;
  era_label_de: string | null;
  era_label_pl: string | null;
  region: string | null;
  country: string | null;
  base_path: string | null;
  route_path: string | null;
  img: string | null;
  og_image: string | null;
  image_credit: string | null;
  gallery_images: string[];
  youtube_video_ids: string[];
  short: string | null;
  short_en: string | null;
  short_no: string | null;
  short_sv: string | null;
  short_de: string | null;
  short_pl: string | null;
  biography_en: string | null;
  biography_no: string | null;
  biography_sv: string | null;
  biography_de: string | null;
  biography_pl: string | null;
  influence_en: string | null;
  influence_no: string | null;
  influence_sv: string | null;
  influence_de: string | null;
  influence_pl: string | null;
  seo_title_en: string | null;
  seo_title_no: string | null;
  seo_title_sv: string | null;
  seo_title_de: string | null;
  seo_title_pl: string | null;
  seo_description_en: string | null;
  seo_description_no: string | null;
  seo_description_sv: string | null;
  seo_description_de: string | null;
  seo_description_pl: string | null;
  born: string | null;
  died: string | null;
  birth_place: string | null;
  birth_name: string | null;
  origin: string | null;
  active_years: string | null;
  influence_note: string | null;
  bio: string[];
  signature_songs: string[];
  influences: string[];
  labels: string[];
  instruments_simple: string[];
  styles: string[];
  categories: string[];
  search_terms: string[];
  social_links: Record<string, string>;
  external_links: Array<{ label?: string; url: string }>;
  article_references: Array<{ title?: string; url: string }>;
  legacy: string | null;
  family: FamilyEntry[];
  formative: string[];
  instruments: InstrumentEntry[];
  anecdotes: string[];
  collaborators: CollaboratorEntry[];
  videos: VideoEntry[];
  discography: DiscographyEntry[];
  awards: AwardEntry[];
  press_quotes: PressQuote[];
  website_url: string | null;
  facebook_url: string | null;
  booking_info: BookingInfo;
  link_check: Record<string, { status?: number | string; checked_at?: string }>;
  related_slugs: string[];
  sort_order: number;
};

// Strict locale pick — no fallback. Returns localized value or null.
export function pickLang(
  record: ArtistRecord,
  lang: Lang,
  field: "biography" | "short" | "influence" | "seo_title" | "seo_description" | "era_label",
): string | null {
  const r = record as any;
  return r[`${field}_${lang}`] ?? null;
}

// Localized array (signature_songs, influences). No fallback.
// Renders as plain strings (`ArtistRecord[field]: string[]`), but some rows
// have stored richer { title, year, note } objects in this slot instead --
// React throws "Objects are not valid as a React child" if one of those
// reaches JSX directly, so coerce any non-string entry to the same
// "Title (Year) — Note" string format the editorial template itself uses.
export function pickLangArray(
  record: ArtistRecord,
  lang: Lang,
  field: "signature_songs" | "influences",
): string[] {
  const r = record as any;
  const v = r[`${field}_${lang}`];
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const title = item.title ?? item.name ?? "";
        const year = item.year ? ` (${item.year})` : "";
        const note = item.note ? ` — ${item.note}` : "";
        return `${title}${year}${note}`.trim();
      }
      return item == null ? "" : String(item);
    })
    .filter(Boolean);
}

// Localized jsonb array (family, formative, anecdotes, instruments,
// collaborators, discography, awards, press_quotes). No fallback.
export function pickLangJsonb<T = any>(
  record: ArtistRecord,
  lang: Lang,
  field:
    | "family"
    | "formative"
    | "anecdotes"
    | "instruments"
    | "collaborators"
    | "discography"
    | "awards"
    | "press_quotes",
): T[] {
  const r = record as any;
  const v = r[`${field}_${lang}`];
  return Array.isArray(v) ? (v as T[]) : [];
}


function normalise(row: any): ArtistRecord {
  return {
    ...row,
    bio: row.bio ?? [],
    signature_songs: row.signature_songs ?? [],
    influences: row.influences ?? [],
    labels: row.labels ?? [],
    instruments_simple: row.instruments_simple ?? [],
    family: Array.isArray(row.family) ? row.family : [],
    formative: Array.isArray(row.formative) ? row.formative : [],
    instruments: Array.isArray(row.instruments) ? row.instruments : [],
    anecdotes: Array.isArray(row.anecdotes) ? row.anecdotes : [],
    collaborators: Array.isArray(row.collaborators) ? row.collaborators : [],
    videos: Array.isArray(row.videos) ? row.videos : [],
    discography: Array.isArray(row.discography) ? row.discography : [],
    awards: Array.isArray(row.awards) ? row.awards : [],
    press_quotes: Array.isArray(row.press_quotes) ? row.press_quotes : [],
    website_url: row.website_url ?? null,
    facebook_url: row.facebook_url ?? null,
    booking_info: row.booking_info ?? {},
    link_check: row.link_check ?? {},
    related_slugs: row.related_slugs ?? [],
    gallery_images: row.gallery_images ?? [],
    youtube_video_ids: row.youtube_video_ids ?? [],
    styles: row.styles ?? [],
    categories: row.categories ?? [],
    search_terms: row.search_terms ?? [],
    social_links: row.social_links ?? {},
    external_links: Array.isArray(row.external_links) ? row.external_links : [],
    article_references: Array.isArray(row.article_references) ? row.article_references : [],
  } as ArtistRecord;
}

export type ArtistStats = { artistCount: number; countryCount: number };

// Powers the homepage hero's "N+ Artists from M+ Countries" line -- both
// numbers are live counts, never hardcoded. countryCount only counts the
// normalized `country` column, excluding null/blank values.
export const fetchArtistStats = createServerFn({ method: "GET" }).handler(async (): Promise<ArtistStats> => {
  const db = getDB();
  const row = await db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM artists) AS artist_count,
        (SELECT COUNT(DISTINCT country) FROM artists WHERE country IS NOT NULL AND TRIM(country) != '') AS country_count`,
    )
    .first<{ artist_count: number; country_count: number }>();
  return { artistCount: row?.artist_count ?? 0, countryCount: row?.country_count ?? 0 };
});

export const fetchArtists = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDB();
  const { results } = await db
    .prepare("SELECT * FROM artists ORDER BY sort_order ASC, name ASC")
    .all();
  return (results ?? []).map((r) => parseArtistRow(r as Record<string, unknown>));
});

export const fetchArtistBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const row = await db.prepare("SELECT * FROM artists WHERE slug = ?").bind(data.slug).first();
    return row ? parseArtistRow(row as Record<string, unknown>) : null;
  });

export function useArtists() {
  const [data, setData] = useState<ArtistRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const rows = await fetchArtists();
      setData(rows.map(normalise));
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  return { data, error, loading, refresh };
}

export function useArtist(slug: string) {
  const [data, setData] = useState<ArtistRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchArtistBySlug({ data: { slug } })
      .then((row) => {
        if (cancelled) return;
        setData(row ? normalise(row) : null);
      })
      .catch((e: any) => {
        if (!cancelled) setError(e?.message ?? "Failed to load artist");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  return { data, error, loading };
}
