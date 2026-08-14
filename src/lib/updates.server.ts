// Fully algorithmic "artist updates" feed — no AI/LLM anywhere in this file.
// Reuses the same tables the news ticker (newsfeed.server.ts) already reads
// live, plus artist_edit_log for real per-artist sync-engine events
// (new Discogs releases, new tour-date links). All automation that fills
// these tables already runs on sync-worker's existing crons (see
// sync-worker/wrangler.jsonc — daily RSS sync, weekly discogs/tours/etc.);
// this file only reads what's already there, on every /updates request.

export type UpdateType = "release" | "tour" | "review" | "video" | "news";

export type UpdateItem = {
  id: string;
  type: UpdateType;
  date: string; // ISO — always a real timestamp from the source, never invented
  title: string; // plain fact, straight from the source field(s) — no generated prose
  artistName?: string;
  artistHref?: string; // internal /artists/{slug} link, only set when the artist exists in our DB
  href: string; // primary click target for the card
  external?: boolean; // true => href leaves the site
  sourceName?: string;
  sourceUrl?: string; // secondary "original source" link when it differs from href
  autoDetected?: boolean; // Discogs-sync releases not yet editorially reviewed
};

const DISCOGS_AUTO_NOTE = "Auto-detected via Discogs sync — unreviewed, pending editorial enrichment.";
const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function slugTitle(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function fromReviews(db: D1Database): Promise<UpdateItem[]> {
  const { results } = await db
    .prepare(
      `SELECT slug, artist_slug, artist_name, album_title, verdict_en, total_score, published_at
       FROM blues_reviews WHERE status = 'published' AND published_at IS NOT NULL
       ORDER BY published_at DESC LIMIT 25`,
    )
    .all<{ slug: string; artist_slug: string | null; artist_name: string; album_title: string; verdict_en: string | null; total_score: number | null; published_at: string }>();

  return (results ?? []).map((r) => {
    const score = r.total_score ? ` — ${Number(r.total_score).toFixed(1)}/10` : "";
    return {
      id: `review-${r.slug}`,
      type: "review" as const,
      date: r.published_at,
      title: `${r.artist_name} — ${r.album_title}${score}`,
      artistName: r.artist_name,
      artistHref: r.artist_slug ? `/artists/${r.artist_slug}` : undefined,
      href: `/reviews/${r.slug}`,
    };
  });
}

async function fromVideos(db: D1Database): Promise<UpdateItem[]> {
  const { results } = await db
    .prepare(
      `SELECT video_id, title, artist_slug, category, published_at, created_at, is_official_channel
       FROM youtube_videos WHERE status = 'approved'
       ORDER BY created_at DESC LIMIT 25`,
    )
    .all<{ video_id: string; title: string | null; artist_slug: string; category: string; published_at: string | null; created_at: string; is_official_channel: number }>();

  return (results ?? [])
    .filter((v) => v.artist_slug && v.video_id)
    .map((v) => ({
      id: `video-${v.video_id}`,
      type: "video" as const,
      date: v.published_at ?? v.created_at,
      title: v.title ?? "New performance",
      artistHref: `/artists/${v.artist_slug}`,
      href: `/artists/${v.artist_slug}#video-${v.video_id}`,
      sourceName: "YouTube",
      // Only ever link to YouTube — Slow-Blues plays exclusively via YouTube.
      // Skip the external watch-link (not the whole card) if the ID fails
      // the basic 11-char shape check; surfaced separately by the link audit.
      sourceUrl: YOUTUBE_ID_RE.test(v.video_id) ? `https://www.youtube.com/watch?v=${v.video_id}` : undefined,
    }));
}

async function fromConcerts(db: D1Database): Promise<UpdateItem[]> {
  const { results } = await db
    .prepare(
      `SELECT slug, title, artist_name, artist_slug, event_type, venue, city, country, event_date, ticket_url, published_at
       FROM concerts WHERE status = 'published' AND published_at IS NOT NULL
       ORDER BY published_at DESC LIMIT 25`,
    )
    .all<{ slug: string; title: string; artist_name: string | null; artist_slug: string | null; event_type: string | null; venue: string | null; city: string | null; country: string | null; event_date: string | null; ticket_url: string | null; published_at: string }>();

  return (results ?? []).map((c) => {
    const where = [c.venue, c.city, c.country].filter(Boolean).join(", ");
    const when = c.event_date ? new Date(c.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
    const parts = [c.title, where, when].filter(Boolean);
    let ticketUrl: string | undefined;
    try {
      if (c.ticket_url) ticketUrl = new URL(c.ticket_url).toString();
    } catch {
      ticketUrl = undefined;
    }
    return {
      id: `concert-${c.slug}`,
      type: "tour" as const,
      date: c.published_at,
      title: parts.join(" — "),
      artistName: c.artist_name ?? undefined,
      artistHref: c.artist_slug ? `/artists/${c.artist_slug}` : undefined,
      href: `/concerts/${c.slug}`,
      sourceName: ticketUrl ? "Tickets" : undefined,
      sourceUrl: ticketUrl,
    };
  });
}

async function fromExternalNews(db: D1Database): Promise<UpdateItem[]> {
  const [{ results: items }, { results: artists }] = await Promise.all([
    db
      .prepare(
        `SELECT id, text, href, source, published_at, created_at
         FROM ticker_items ORDER BY COALESCE(published_at, created_at) DESC LIMIT 30`,
      )
      .all<{ id: string; text: string; href: string | null; source: string; published_at: string | null; created_at: string }>(),
    db.prepare(`SELECT slug, name FROM artists`).all<{ slug: string; name: string }>(),
  ]);

  // Longest-name-first so "B.B. King" is preferred over a shorter substring
  // of the same string ever matching a different, shorter artist name.
  const artistList = (artists ?? []).filter((a) => a.name && a.name.trim().length >= 4).sort((a, b) => b.name.length - a.name.length);

  function matchArtist(text: string): { slug: string; name: string } | undefined {
    for (const a of artistList) {
      const escaped = a.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = new RegExp(`\\b${escaped}\\b`, "i").exec(text);
      if (!match) continue;
      // Reject e.g. "Elmore James" matching inside "Elmore James Jr." — a
      // suffix right after the matched name means it's naming a different,
      // distinct person, not the artist on file.
      const after = text.slice(match.index + match[0].length);
      if (/^\s*,?\s*(Jr\.?|Sr\.?|II|III|IV)\b/i.test(after)) continue;
      return a;
    }
    return undefined;
  }

  return (items ?? [])
    .filter((t) => t.href)
    .map((t) => {
      const matched = matchArtist(t.text);
      return {
        id: t.id,
        type: "news" as const,
        date: t.published_at ?? t.created_at,
        title: t.text,
        artistName: matched?.name,
        artistHref: matched ? `/artists/${matched.slug}` : undefined,
        href: t.href!,
        external: true,
        sourceName: t.source,
        sourceUrl: t.href!,
      };
    });
}

async function fromDiscographyReleases(db: D1Database): Promise<UpdateItem[]> {
  const { results: logRows } = await db
    .prepare(
      `SELECT artist_slug, MAX(edited_at) as last_edited
       FROM artist_edit_log WHERE fields_changed LIKE '%discography_i18n%'
       GROUP BY artist_slug ORDER BY last_edited DESC LIMIT 30`,
    )
    .all<{ artist_slug: string; last_edited: string }>();

  if (!logRows || logRows.length === 0) return [];
  const slugs = logRows.map((r) => r.artist_slug);
  const placeholders = slugs.map(() => "?").join(",");
  const { results: artists } = await db
    .prepare(`SELECT slug, name, discography_i18n FROM artists WHERE slug IN (${placeholders})`)
    .bind(...slugs)
    .all<{ slug: string; name: string; discography_i18n: string }>();

  const dateBySlug = new Map(logRows.map((r) => [r.artist_slug, r.last_edited]));
  const out: UpdateItem[] = [];

  for (const artist of artists ?? []) {
    const discography = parseJson<Record<string, Array<{ year: number; title: string; label?: string; notes?: string }>>>(
      artist.discography_i18n,
      {},
    );
    const entries = discography.en ?? [];
    for (const entry of entries) {
      if (entry.notes !== DISCOGS_AUTO_NOTE) continue;
      out.push({
        id: `release-${artist.slug}-${entry.year}-${slugTitle(entry.title)}`,
        type: "release",
        date: dateBySlug.get(artist.slug) ?? new Date().toISOString(),
        title: `${entry.title} (${entry.year})${entry.label ? ` — ${entry.label}` : ""}`,
        artistName: artist.name,
        artistHref: `/artists/${artist.slug}`,
        href: `/artists/${artist.slug}`,
        sourceName: "Discogs",
        autoDetected: true,
      });
    }
  }
  return out;
}

async function fromTourLinks(db: D1Database): Promise<UpdateItem[]> {
  const { results: logRows } = await db
    .prepare(
      `SELECT artist_slug, MAX(edited_at) as last_edited
       FROM artist_edit_log WHERE fields_changed LIKE '%tour_dates_url%'
       GROUP BY artist_slug ORDER BY last_edited DESC LIMIT 30`,
    )
    .all<{ artist_slug: string; last_edited: string }>();

  if (!logRows || logRows.length === 0) return [];
  const slugs = logRows.map((r) => r.artist_slug);
  const placeholders = slugs.map(() => "?").join(",");
  const { results: artists } = await db
    .prepare(`SELECT slug, name, sync_data FROM artists WHERE slug IN (${placeholders})`)
    .bind(...slugs)
    .all<{ slug: string; name: string; sync_data: string }>();

  const dateBySlug = new Map(logRows.map((r) => [r.artist_slug, r.last_edited]));
  const out: UpdateItem[] = [];

  for (const artist of artists ?? []) {
    const syncData = parseJson<{ tour_dates_url?: string }>(artist.sync_data, {});
    if (!syncData.tour_dates_url) continue;
    let tourUrl: string | undefined;
    try {
      tourUrl = new URL(syncData.tour_dates_url).toString();
    } catch {
      continue; // malformed URL from the source — skip rather than link a broken href
    }
    out.push({
      id: `tour-${artist.slug}`,
      type: "tour",
      date: dateBySlug.get(artist.slug) ?? new Date().toISOString(),
      title: artist.name,
      artistName: artist.name,
      artistHref: `/artists/${artist.slug}`,
      href: `/artists/${artist.slug}`,
      sourceName: "Tour dates",
      sourceUrl: tourUrl,
    });
  }
  return out;
}

export async function buildArtistUpdates(db: D1Database): Promise<UpdateItem[]> {
  const [reviews, videos, concerts, news, releases, tours] = await Promise.all([
    fromReviews(db).catch((e) => { console.error("updates: reviews source failed", e); return []; }),
    fromVideos(db).catch((e) => { console.error("updates: videos source failed", e); return []; }),
    fromConcerts(db).catch((e) => { console.error("updates: concerts source failed", e); return []; }),
    fromExternalNews(db).catch((e) => { console.error("updates: external news source failed", e); return []; }),
    fromDiscographyReleases(db).catch((e) => { console.error("updates: discography source failed", e); return []; }),
    fromTourLinks(db).catch((e) => { console.error("updates: tour-links source failed", e); return []; }),
  ]);

  const all = [...reviews, ...videos, ...concerts, ...news, ...releases, ...tours];

  const seen = new Set<string>();
  const deduped: UpdateItem[] = [];
  for (const item of all) {
    if (!item.title || !item.href || !item.date) continue; // no empty/incomplete cards
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    deduped.push(item);
  }

  deduped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return deduped.slice(0, 60);
}
