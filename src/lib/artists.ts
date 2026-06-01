import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  biography_en: string | null;
  biography_no: string | null;
  biography_sv: string | null;
  biography_de: string | null;
  influence_en: string | null;
  influence_no: string | null;
  influence_sv: string | null;
  seo_title_en: string | null;
  seo_title_no: string | null;
  seo_title_sv: string | null;
  seo_description_en: string | null;
  seo_description_no: string | null;
  seo_description_sv: string | null;
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
  link_check: Record<string, { status?: number | string; checked_at?: string }>;
  related_slugs: string[];
  sort_order: number;
};

const FALLBACK_CHAIN: Record<Lang, Lang[]> = {
  no: ["no", "en", "sv", "de"],
  en: ["en", "no", "sv", "de"],
  sv: ["sv", "no", "en", "de"],
  de: ["de", "en", "no", "sv"],
};

export function pickLang(
  record: ArtistRecord,
  lang: Lang,
  field: "biography" | "short" | "influence" | "seo_title" | "seo_description" | "era_label",
): string | null {
  const r = record as any;
  for (const l of FALLBACK_CHAIN[lang]) {
    const v = r[`${field}_${l}`];
    if (v) return v;
  }
  return r[field] ?? null;
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

export function useArtists() {
  const [data, setData] = useState<ArtistRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) setError(error.message);
    else setData((data ?? []).map(normalise));
    setLoading(false);
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
    supabase.from("artists").select("*").eq("slug", slug).maybeSingle().then(({ data, error }) => {
      if (cancelled) return;
      if (error) setError(error.message);
      else setData(data ? normalise(data) : null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [slug]);

  return { data, error, loading };
}
