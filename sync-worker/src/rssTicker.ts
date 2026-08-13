import type { Env, RunSummary } from "./types";

const UA = "SlowBlues-SyncEngine/1.0 (+https://www.slow-blues.com; ticker RSS sync)";

// Only feeds that actually exist go here. Bluesnews.no runs a bespoke CMS
// with no RSS/Atom infrastructure (confirmed: no <link rel=alternate>, no
// /feed path, not listed in its own sitemap.xml) — there is nothing to
// parse, so it's deliberately absent rather than silently broken. The
// Blues Foundation's own site (blues.org) has no feed either.
//
// Living Blues publishes in English; Jefferson Blues Magazine publishes in
// Swedish. Both are kept as-is in their original language — this is a
// deterministic, non-AI engine, so there's no reliable automated
// translation step, and a mistranslated headline is worse than a Swedish
// one. The ticker's [SOURCE] label already makes the origin clear.
const FEEDS: Array<{ source: string; url: string }> = [
  { source: "Jefferson Blues Magazine", url: "https://jeffersonbluesmag.com/feed/" },
  { source: "Living Blues", url: "https://livingblues.com/feed/" },
];

const ITEMS_PER_FEED = 8;

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

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  nbsp: " ", mdash: "—", ndash: "–", hellip: "…",
  lsquo: "'", rsquo: "'", ldquo: "“", rdquo: "”",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code))) // numeric, e.g. &#8211; or &#038;
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))) // hex, e.g. &#x2013;
    .replace(/&([a-zA-Z]+);/g, (m, name) => NAMED_ENTITIES[name] ?? m) // named
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
 * Fetches Jefferson Blues Magazine and Living Blues RSS feeds and replaces
 * each source's ticker_items rows wholesale with today's fetch — a daily
 * "fresh snapshot" per source (per the '1x per day' request), not an
 * ever-accumulating archive. Each source's old rows are deleted, then the
 * current top ITEMS_PER_FEED are inserted; if a feed fetch fails, that
 * source's existing rows are left untouched rather than wiped with
 * nothing to replace them.
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

      // Replace, don't accumulate: clear this source's previous snapshot
      // before inserting today's, so the ticker only ever shows the
      // current day's top items per source.
      await env.DB.prepare(`DELETE FROM ticker_items WHERE source = ?`).bind(feed.source).run();

      for (const item of items) {
        const id = stableId(feed.source, item);
        const publishedAt = item.pubDate ? safeIso(item.pubDate) : null;
        await env.DB.prepare(
          `INSERT INTO ticker_items (id, text, href, source, pinned, published_at)
           VALUES (?, ?, ?, ?, 0, ?)`
        )
          .bind(id, item.title, item.link, feed.source, publishedAt)
          .run();
      }

      artistsChanged += items.length;
      notes.push(`${feed.source}: replaced with today's ${items.length} item(s)`);
    } catch (e) {
      errors.push(`${feed.source}: ${e instanceof Error ? e.message : String(e)} (existing items left untouched)`);
    }
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
