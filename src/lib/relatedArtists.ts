import type { ArtistRecord } from "./artists";

export function computeRelated(artist: ArtistRecord, all: ArtistRecord[], limit = 8): ArtistRecord[] {
  const bySlug = new Map(all.map((a) => [a.slug, a]));
  const scored = new Map<string, { a: ArtistRecord; score: number }>();

  const add = (slug: string, score: number) => {
    if (slug === artist.slug) return;
    const a = bySlug.get(slug);
    if (!a) return;
    const cur = scored.get(slug);
    if (cur) cur.score += score;
    else scored.set(slug, { a, score });
  };

  // Explicit related
  artist.related_slugs.forEach((s) => add(s, 10));

  const styles = new Set((artist.styles ?? []).map((s) => s.toLowerCase()));
  for (const other of all) {
    if (other.slug === artist.slug) continue;
    let score = 0;
    if (artist.country && other.country === artist.country) score += 3;
    if (artist.era && other.era === artist.era) score += 2;
    if (artist.region && other.region === artist.region) score += 1;
    const overlap = (other.styles ?? []).filter((s) => styles.has(s.toLowerCase())).length;
    score += overlap * 2;
    if (score > 0) add(other.slug, score);
  }

  return [...scored.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.a);
}
