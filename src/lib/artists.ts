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
  sales?: string;
  notes?: string;
  musicians_count?: number;
};
export type AwardEntry = { year: number | string; title: string; category?: string; note?: string };

export type ArtistRecord = {
  id: string;
  slug: string;
  name: string;
  alt_name: string | null;
  tag: string;
  era: string | null;
  region: string | null;
  img: string | null;
  short: string | null;
  born: string | null;
  died: string | null;
  origin: string | null;
  active_years: string | null;
  influence_note: string | null;
  bio: string[];
  signature_songs: string[];
  influences: string[];
  labels: string[];
  instruments_simple: string[];
  legacy: string | null;
  family: FamilyEntry[];
  formative: string[];
  instruments: InstrumentEntry[];
  anecdotes: string[];
  collaborators: CollaboratorEntry[];
  videos: VideoEntry[];
  discography: DiscographyEntry[];
  awards: AwardEntry[];
  related_slugs: string[];
  sort_order: number;
};

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
    related_slugs: row.related_slugs ?? [],
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
