import { getArtistsForHealthCheck, parseJson, updateLinkCheck, writeAuditLog } from "./db";
import type { ArtistRow, Env, RunSummary } from "./types";

const UA = "SlowBlues-SyncEngine/1.0 (+https://www.slow-blues.com; link health check)";

// See db.ts: D1 queries count against the same 50-subrequest-per-invocation
// budget as fetch() calls. At up to ~4 URL checks + 1 write per artist,
// 6 artists/run stays safely under that cap while still rotating through
// the whole catalog every couple of weeks.
const BATCH_SIZE = 6;

type LinkResult = { url: string; ok: boolean; status: number | null; checked_at: string };
type LinkCheck = Record<string, LinkResult | LinkResult[] | string>;

/**
 * Runs `items` through `worker` with at most `limit` in flight at once.
 */
async function withConcurrency<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function runOne() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runOne));
  return results;
}

export async function checkUrl(url: string): Promise<LinkResult & { error?: string }> {
  const checked_at = new Date().toISOString();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    // GET only, no HEAD: HEAD requests from Workers hang against some CDNs
    // (observed against upload.wikimedia.org specifically — GET is instant,
    // HEAD reliably times out there). Range header keeps the transfer tiny
    // since we only care about the status code, not the body.
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Range: "bytes=0-1023" },
    });
    clearTimeout(timer);
    return { url, ok: res.status >= 200 && res.status < 400, status: res.status, checked_at };
  } catch (e) {
    clearTimeout(timer);
    return { url, ok: false, status: null, checked_at, error: e instanceof Error ? `${e.name}: ${e.message}` : String(e) };
  }
}

async function checkYouTube(youtubeId: string): Promise<LinkResult> {
  const url = `https://www.youtube.com/watch?v=${youtubeId}`;
  const checked_at = new Date().toISOString();
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, {
      headers: { "User-Agent": UA },
    });
    return { url, ok: res.ok, status: res.status, checked_at };
  } catch {
    return { url, ok: false, status: null, checked_at };
  }
}

type ExternalLink = { url?: string; label?: string };
type ArticleRef = { url?: string; title?: string };
type Video = { youtube_id?: string; title?: string };

/**
 * Read-only health check across img, website_url, facebook_url,
 * external_links, article_references and video YouTube IDs. Writes results
 * into the existing `link_check` JSON column (same shape/spirit as the
 * admin link-checker at src/lib/link-check.functions.ts) plus a top-level
 * `_checked_at` marker used to order staleness for the NEXT run's batch —
 * never deletes or edits the underlying URL/video data itself, only flags
 * status. Hiding broken resources in the UI is a frontend concern that
 * reads this column; the worker's job is strictly detection + flagging.
 */
export async function runHealthCheck(env: Env): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  const notes: string[] = [];
  let artistsSeen = 0;
  let artistsChanged = 0;
  let brokenTotal = 0;

  const artists = await getArtistsForHealthCheck(env, BATCH_SIZE);
  artistsSeen = artists.length;

  for (const artist of artists) {
    try {
      const r = await checkOneArtist(artist);
      if (r.changed) artistsChanged++;
      brokenTotal += r.brokenCount;
    } catch (e) {
      errors.push(`${artist.name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  notes.push(`Checked ${artists.length} artist(s) this run (bounded batch, staleness-ordered); ${brokenTotal} broken link(s)/video(s) flagged.`);

  return {
    module: "healthcheck",
    startedAt,
    finishedAt: new Date().toISOString(),
    artistsSeen,
    artistsChanged,
    errors,
    notes,
  };

  async function checkOneArtist(artist: ArtistRow): Promise<{ changed: boolean; brokenCount: number }> {
    const linkCheck: LinkCheck = { _checked_at: new Date().toISOString() };
    let brokenCount = 0;

    const targets: Array<{ key: string; value: string }> = [];
    if (artist.img && /^https?:\/\//.test(artist.img)) targets.push({ key: "img", value: artist.img });
    if (artist.website_url) targets.push({ key: "website_url", value: artist.website_url });
    if (artist.facebook_url) targets.push({ key: "facebook_url", value: artist.facebook_url });

    const externalUrls = parseJson<ExternalLink[]>(artist.external_links, [])
      .map((l) => l.url)
      .filter((u): u is string => !!u);
    const articleUrls = parseJson<ArticleRef[]>(artist.article_references, [])
      .map((r) => r.url)
      .filter((u): u is string => !!u);
    const videoIds = parseJson<Video[]>(artist.videos, [])
      .map((v) => v.youtube_id)
      .filter((v): v is string => !!v);

    if (targets.length === 0 && externalUrls.length === 0 && articleUrls.length === 0 && videoIds.length === 0) {
      await updateLinkCheck(env, artist.id, JSON.stringify(linkCheck));
      return { changed: true, brokenCount: 0 };
    }

    // At most 4 concurrent fetches total for this one artist.
    const [singleResults, externalResults, articleResults, videoResults] = await Promise.all([
      withConcurrency(targets, 4, (t) => checkUrl(t.value)),
      withConcurrency(externalUrls, 4, checkUrl),
      withConcurrency(articleUrls, 4, checkUrl),
      withConcurrency(videoIds, 4, checkYouTube),
    ]);

    targets.forEach((t, i) => {
      linkCheck[t.key] = singleResults[i];
      if (!singleResults[i].ok) brokenCount++;
    });
    if (externalResults.length > 0) {
      linkCheck.external_links = externalResults;
      brokenCount += externalResults.filter((r) => !r.ok).length;
    }
    if (articleResults.length > 0) {
      linkCheck.article_references = articleResults;
      brokenCount += articleResults.filter((r) => !r.ok).length;
    }
    if (videoResults.length > 0) {
      linkCheck.videos = videoResults;
      brokenCount += videoResults.filter((r) => !r.ok).length;
    }

    await updateLinkCheck(env, artist.id, JSON.stringify(linkCheck));
    if (brokenCount > 0) {
      await writeAuditLog(env, artist.slug, ["link_check"], `flagged ${brokenCount} broken link(s)/video(s)`);
    }
    return { changed: true, brokenCount };
  }
}
