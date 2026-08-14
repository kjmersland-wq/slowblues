// Site-wide search — pure algorithmic scoring, no AI/LLM. Table sizes here
// (artists ~80, reviews ~15, concerts small) are small enough that fetching
// the bounded candidate set and scoring in JS is the proportionate approach
// (mirrors newsfeed.server.ts's live-read pattern) rather than adding SQL
// LIKE-index machinery for what is not a large-N problem.
import { STYLES, FESTIVALS } from "@/data/blues";
import { instrumentsHistory } from "@/data/instruments";
import { artistDetailPath, type ArtistLocale } from "@/lib/locale";

export type SearchResultType = "artist" | "review" | "concert" | "style" | "instrument" | "festival";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  href: string;
  score: number;
};

// Light fold so "norsk/engelsk tegnsetting" (ø/å/æ/ö/ä/ü/etc, curly quotes,
// dashes) doesn't block an otherwise-matching query — not a full Unicode
// normalizer, just the diacritics that actually occur in this catalog.
const DIACRITIC_MAP: Record<string, string> = {
  ø: "o", å: "a", æ: "ae", ö: "o", ä: "a", ü: "u", é: "e", è: "e",
  ñ: "n", ł: "l", ą: "a", ę: "e", ś: "s", ć: "c", ż: "z", ź: "z", ń: "n", ó: "o",
};

function fold(s: string): string {
  return s
    .toLowerCase()
    .split("")
    .map((c) => DIACRITIC_MAP[c] ?? c)
    .join("")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Tiered relevance: exact > starts-with > word-starts-with > substring.
function scoreText(text: string | null | undefined, q: string): number {
  if (!text || !q) return 0;
  const t = fold(text);
  if (!t) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 85;
  if (t.split(" ").some((w) => w.startsWith(q))) return 70;
  if (t.includes(q)) return 40;
  return 0;
}

function best(...scores: number[]): number {
  return Math.max(0, ...scores);
}

type ArtistRow = { slug: string; name: string; alt_name: string | null; short_en: string | null; short_no: string | null; country: string | null };
type ReviewRow = { slug: string; artist_slug: string | null; artist_name: string; album_title: string };
type ConcertRow = { slug: string; title: string; artist_name: string | null; venue: string | null; city: string | null };

async function searchArtists(db: D1Database, q: string, lang: ArtistLocale): Promise<SearchResult[]> {
  const { results } = await db.prepare(`SELECT slug, name, alt_name, short_en, short_no, country FROM artists`).all<ArtistRow>();
  const out: SearchResult[] = [];
  for (const a of results ?? []) {
    // Artist is the priority result type — weight 1.0, no discount vs. other kinds.
    const score = best(scoreText(a.name, q), scoreText(a.alt_name, q) - 5);
    if (score <= 0) continue;
    out.push({
      id: `artist-${a.slug}`,
      type: "artist",
      title: a.name,
      subtitle: [a.country, a.short_no ?? a.short_en].filter(Boolean).join(" — "),
      href: artistDetailPath(lang, a.slug),
      score,
    });
  }
  return out;
}

async function searchReviews(db: D1Database, q: string): Promise<SearchResult[]> {
  const { results } = await db
    .prepare(`SELECT slug, artist_slug, artist_name, album_title FROM blues_reviews WHERE status = 'published'`)
    .all<ReviewRow>();
  const out: SearchResult[] = [];
  for (const r of results ?? []) {
    const score = best(scoreText(r.album_title, q), scoreText(r.artist_name, q)) * 0.9;
    if (score <= 0) continue;
    out.push({
      id: `review-${r.slug}`,
      type: "review",
      title: `${r.artist_name} — ${r.album_title}`,
      subtitle: "Review",
      href: `/reviews/${r.slug}`,
      score,
    });
  }
  return out;
}

async function searchConcerts(db: D1Database, q: string): Promise<SearchResult[]> {
  const { results } = await db
    .prepare(`SELECT slug, title, artist_name, venue, city FROM concerts WHERE status = 'published'`)
    .all<ConcertRow>();
  const out: SearchResult[] = [];
  for (const c of results ?? []) {
    const score = best(scoreText(c.title, q), scoreText(c.artist_name, q), scoreText(c.venue, q) - 10, scoreText(c.city, q) - 10) * 0.85;
    if (score <= 0) continue;
    out.push({
      id: `concert-${c.slug}`,
      type: "concert",
      title: c.title,
      subtitle: [c.artist_name, c.venue, c.city].filter(Boolean).join(" — "),
      href: `/concerts/${c.slug}`,
      score,
    });
  }
  return out;
}

// Styles, instruments and festivals have no per-item detail route/anchor in
// the app today — results link to the relevant list page rather than a
// fabricated slug/anchor that would 404.
function searchStyles(q: string): SearchResult[] {
  const out: SearchResult[] = [];
  for (const s of STYLES) {
    const score = best(scoreText(s.name, q), scoreText(s.desc, q) - 20, scoreText(s.artists.join(" "), q) - 10) * 0.6;
    if (score <= 0) continue;
    out.push({ id: `style-${s.slug}`, type: "style", title: s.name, subtitle: s.era, href: "/styles", score });
  }
  return out;
}

function searchInstruments(q: string): SearchResult[] {
  const out: SearchResult[] = [];
  for (const i of instrumentsHistory) {
    const score = best(scoreText(i.name, q), scoreText(i.manufacturer, q) - 10) * 0.6;
    if (score <= 0) continue;
    out.push({ id: `instrument-${i.id}`, type: "instrument", title: i.name, subtitle: i.manufacturer, href: "/instruments", score });
  }
  return out;
}

function searchFestivals(q: string): SearchResult[] {
  const out: SearchResult[] = [];
  for (const f of FESTIVALS) {
    const score = best(scoreText(f.name, q), scoreText(f.city, q) - 10) * 0.6;
    if (score <= 0) continue;
    out.push({ id: `festival-${f.name}`, type: "festival", title: f.name, subtitle: [f.city, f.country].filter(Boolean).join(", "), href: "/festivals", score });
  }
  return out;
}

export async function runSiteSearch(db: D1Database, rawQuery: string, lang: ArtistLocale): Promise<SearchResult[]> {
  const q = fold(rawQuery);
  if (!q) return [];

  const [artists, reviews, concerts] = await Promise.all([
    searchArtists(db, q, lang).catch((e) => { console.error("search: artists failed", e); return []; }),
    searchReviews(db, q).catch((e) => { console.error("search: reviews failed", e); return []; }),
    searchConcerts(db, q).catch((e) => { console.error("search: concerts failed", e); return []; }),
  ]);
  const styles = searchStyles(q);
  const instruments = searchInstruments(q);
  const festivals = searchFestivals(q);

  const all = [...artists, ...reviews, ...concerts, ...styles, ...instruments, ...festivals];
  all.sort((a, b) => b.score - a.score);
  return all.slice(0, 30);
}
