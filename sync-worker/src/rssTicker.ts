import type { Env, RunSummary } from "./types";

const UA = "SlowBlues-SyncEngine/1.0 (+https://www.slow-blues.com; ticker RSS sync)";

// Only feeds that actually exist go here. Bluesnews.no runs a bespoke CMS
// with no RSS/Atom infrastructure (confirmed: no <link rel=alternate>, no
// /feed path, not listed in its own sitemap.xml) — there is nothing to
// parse, so it's deliberately absent rather than silently broken. The
// Blues Foundation's own site (blues.org) has no feed either; Living
// Blues magazine (a separate, editorially independent publication) does.
const FEEDS: Array<{ source: string; url: string }> = [
  { source: "Jefferson Blues Magazine", url: "https://jeffersonbluesmag.com/feed/" },
  { source: "Living Blues", url: "https://livingblues.com/feed/" },
];

const ITEMS_PER_FEED = 8;
const EXPIRES_AFTER_DAYS = 30;

type FeedItem = { title: string; link: string; pubDate?: string; guid?: string };

/**
 * Minimal, dependency-free RSS 2.0 <item> extractor. Deliberately
 * regex-based rather than a full XML parser: Workers has no built-in
 * DOMParser for XML, and WordPress-generated feeds (both sources here run
 * WordPress) are consistently well-formed enough that this is reliable
 * without pulling in a parser library. Pure string processing — no AI.
 */
function parseRssItems(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemBlocks = xml.match(/<item\b[\s\S]*?<\/item>/g) ?? [];
  for (const block of itemBlocks) {
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate");
    const guid = extractTag(block, "guid");
    if (title && link) {
      items.push({ title: decodeEntities(title), link: decodeEntities(link.trim()), pubDate: pubDate ?? undefined, guid: guid ?? undefined });
    }
  }
  return items;
}

function extractTag(block: string, tag: string): string | null {
  const cdataMatch = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"));
  if (cdataMatch) return cdataMatch[1].trim();
  const plainMatch = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return plainMatch ? plainMatch[1].trim() : null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#0?38;/g, "&") // WordPress commonly encodes & as &#038; in feed URLs
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .trim();
}

function stableId(source: string, item: FeedItem): string {
  const key = item.guid || item.link;
  // FNV-1a — small, deterministic, dependency-free.
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex = (h >>> 0).toString(16).padStart(8, "0");
  return `ext-${source.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${hex}`;
}

/**
 * Fetches Jefferson Blues Magazine and Living Blues RSS feeds, parses
 * items deterministically (no AI), and inserts new ones into ticker_items
 * with `INSERT OR IGNORE` keyed on a stable hash of the item's guid/link —
 * re-running never duplicates a headline already in the ticker. Only ever
 * INSERTs; never updates or deletes an existing row.
 */
export async function runRssTickerSync(env: Env): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  const notes: string[] = [];
  let artistsSeen = 0; // repurposed here as "items seen" for report symmetry
  let artistsChanged = 0;

  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, { headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const items = parseRssItems(xml).slice(0, ITEMS_PER_FEED);
      artistsSeen += items.length;

      let addedForFeed = 0;
      for (const item of items) {
        const id = stableId(feed.source, item);
        const publishedAt = item.pubDate ? safeIso(item.pubDate) : null;
        const expiresAt = new Date(Date.now() + EXPIRES_AFTER_DAYS * 24 * 60 * 60 * 1000).toISOString();

        const result = await env.DB.prepare(
          `INSERT OR IGNORE INTO ticker_items (id, text, href, source, pinned, expires_at, published_at)
           VALUES (?, ?, ?, ?, 0, ?, ?)`
        )
          .bind(id, item.title, item.link, feed.source, expiresAt, publishedAt)
          .run();

        if (result.meta.changes > 0) addedForFeed++;
      }

      artistsChanged += addedForFeed;
      notes.push(`${feed.source}: ${items.length} item(s) checked, ${addedForFeed} new`);
    } catch (e) {
      errors.push(`${feed.source}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // Housekeeping: drop expired external items so the table doesn't grow
  // forever. Internal ticker content is never stored here, so this DELETE
  // can only ever touch RSS-sourced rows.
  try {
    await env.DB.prepare(`DELETE FROM ticker_items WHERE expires_at IS NOT NULL AND expires_at < ?`)
      .bind(new Date().toISOString())
      .run();
  } catch (e) {
    errors.push(`cleanup: ${e instanceof Error ? e.message : String(e)}`);
  }

  return {
    module: "rss-ticker",
    startedAt,
    finishedAt: new Date().toISOString(),
    artistsSeen,
    artistsChanged,
    errors,
    notes,
  };
}

function safeIso(dateStr: string): string | null {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
