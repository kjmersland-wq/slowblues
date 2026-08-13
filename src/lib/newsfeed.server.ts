// Shared ticker-building logic — used by both the getNewsTicker TanStack
// server function (src/lib/newsfeed.functions.ts) and the public
// /api/ticker route (src/routes/api.ticker.ts), so there is exactly one
// place that knows how to assemble the ticker.

export type TickerItem = {
  id: string;
  kind: "review" | "youtube" | "artist" | "blog" | "editorial" | "concert" | "external";
  flag?: string;
  label: string;
  text: string;
  href: string;
  timestamp: string; // ISO
  priority: number;
  external?: boolean; // true => open in a new tab, not internal SPA nav
  sourceName?: string; // e.g. "Jefferson Blues Magazine" — external items only
};

const FLAG_BY_COUNTRY: Record<string, string> = {
  Norway: "🇳🇴", Sweden: "🇸🇪", Denmark: "🇩🇰", Finland: "🇫🇮",
  "United Kingdom": "🇬🇧", UK: "🇬🇧", England: "🇬🇧",
  Germany: "🇩🇪", France: "🇫🇷", Italy: "🇮🇹", Spain: "🇪🇸",
  Netherlands: "🇳🇱", Belgium: "🇧🇪", Ireland: "🇮🇪",
  USA: "🇺🇸", "United States": "🇺🇸", Canada: "🇨🇦",
  Australia: "🇦🇺", Japan: "🇯🇵",
};

export async function buildNewsTicker(db: D1Database): Promise<{ items: TickerItem[]; generatedAt: string }> {
  const out: TickerItem[] = [];
  const now = Date.now();

  // 1) Latest published reviews
  try {
    const { results: reviews } = await db
      .prepare(
        `SELECT slug, artist_name, album_title, total_score, verdict_en, published_at, updated_at
         FROM blues_reviews WHERE status = 'published'
         ORDER BY published_at DESC LIMIT 12`,
      )
      .all();
    for (const r of (reviews ?? []) as any[]) {
      if (!r.slug) continue;
      const score = r.total_score ? ` — ${Number(r.total_score).toFixed(1)}/10` : "";
      out.push({
        id: `rev-${r.slug}`,
        kind: "review",
        label: "REVIEW",
        text: `${r.artist_name} — ${r.album_title}${score}${r.verdict_en ? `. ${r.verdict_en}` : ""}`,
        href: `/reviews/${r.slug}`,
        timestamp: r.published_at ?? r.updated_at ?? new Date().toISOString(),
        priority: 100,
      });
    }
  } catch (e) {
    console.error("ticker reviews failed:", e);
  }

  // 2) Approved YouTube videos
  try {
    const { results: videos } = await db
      .prepare(
        `SELECT video_id, title, artist_slug, category, published_at, created_at, is_official_channel
         FROM youtube_videos WHERE status = 'approved'
         ORDER BY created_at DESC LIMIT 10`,
      )
      .all();
    for (const v of (videos ?? []) as any[]) {
      if (!v.video_id || !v.artist_slug) continue;
      const tag =
        v.category === "live" ? "LIVE" :
        v.category === "interview" ? "INTERVIEW" :
        v.category === "documentary" ? "DOC" : "PERFORMANCE";
      out.push({
        id: `yt-${v.video_id}`,
        kind: "youtube",
        label: `▶ ${tag}`,
        text: `${v.title ?? "New performance"}${v.is_official_channel ? " (official)" : ""}`,
        href: `/artists/${v.artist_slug}#video-${v.video_id}`,
        timestamp: v.published_at ?? v.created_at ?? new Date().toISOString(),
        priority: 80,
      });
    }
  } catch (e) {
    console.error("ticker youtube failed:", e);
  }

  // 3) Recently updated artists with editorial content
  try {
    const { results: artists } = await db
      .prepare(
        `SELECT slug, name, country, era_label_en, short_en, updated_at, died
         FROM artists ORDER BY updated_at DESC LIMIT 20`,
      )
      .all();
    for (const a of (artists ?? []) as any[]) {
      if (!a.slug || !a.short_en) continue;
      const flag = a.country ? FLAG_BY_COUNTRY[a.country] : undefined;
      const obit = a.died && a.died.trim().length > 0;
      out.push({
        id: `art-${a.slug}`,
        kind: "artist",
        flag,
        label: obit ? "IN MEMORIAM" : a.era_label_en ?? "PROFILE",
        text: `${a.name} — ${a.short_en}`,
        href: `/artists/${a.slug}`,
        timestamp: a.updated_at ?? new Date().toISOString(),
        priority: obit ? 95 : 60,
      });
    }
  } catch (e) {
    console.error("ticker artists failed:", e);
  }

  // 4) Upcoming concerts & festivals
  try {
    const today = new Date().toISOString().slice(0, 10);
    const { results: concerts } = await db
      .prepare(
        `SELECT slug, title, artist_name, event_type, venue, city, country, event_date, is_featured, published_at
         FROM concerts WHERE status = 'published' AND event_date >= ?
         ORDER BY event_date ASC LIMIT 15`,
      )
      .bind(today)
      .all();
    for (const c of (concerts ?? []) as Array<{
      slug: string; title: string; artist_name: string | null;
      event_type: string | null; venue: string | null; city: string | null;
      country: string | null; event_date: string | null;
      is_featured: number | null; published_at: string | null;
    }>) {
      if (!c.slug) continue;
      const flag = c.country ? FLAG_BY_COUNTRY[c.country] : undefined;
      const label =
        c.event_type === "festival" ? "FESTIVAL" :
        c.event_type === "tour" ? "TOUR" : "CONCERT";
      const where = [c.venue, c.city].filter(Boolean).join(", ");
      const when = c.event_date
        ? new Date(c.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : "";
      const parts = [c.title, c.artist_name, where, when].filter(Boolean);
      out.push({
        id: `con-${c.slug}`,
        kind: "concert",
        flag,
        label,
        text: parts.join(" — "),
        href: `/concerts/${c.slug}`,
        timestamp: c.published_at ?? new Date().toISOString(),
        priority: c.is_featured ? 90 : 75,
      });
    }
  } catch (e) {
    console.error("ticker concerts failed:", e);
  }

  // 5) External news — RSS items synced into ticker_items by
  // sync-worker's rssTicker module (every 6h). Never written to by
  // anything else; internal items above are always read live from their
  // own tables, not duplicated into this table.
  try {
    const nowIso = new Date().toISOString();
    const { results: external } = await db
      .prepare(
        `SELECT id, text, href, source, pinned, published_at, created_at
         FROM ticker_items
         WHERE (expires_at IS NULL OR expires_at > ?)
         ORDER BY pinned DESC, COALESCE(published_at, created_at) DESC
         LIMIT 15`,
      )
      .bind(nowIso)
      .all();
    for (const t of (external ?? []) as Array<{
      id: string; text: string; href: string | null; source: string;
      pinned: number | null; published_at: string | null; created_at: string;
    }>) {
      if (!t.href) continue;
      out.push({
        // t.id is already prefixed "ext-..." by sync-worker's rssTicker
        // module — don't double it.
        id: t.id,
        kind: "external",
        label: `[${t.source.toUpperCase()}]`,
        text: t.text,
        href: t.href,
        timestamp: t.published_at ?? t.created_at,
        priority: t.pinned ? 110 : 70,
        external: true,
        sourceName: t.source,
      });
    }
  } catch (e) {
    console.error("ticker external failed:", e);
  }

  const byRank = (a: TickerItem, b: TickerItem) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  };
  out.sort(byRank);

  // Ticker shows a curated 5, round-robined across content kinds rather
  // than a flat priority ranking — reviews have the highest priority of
  // any single kind, so a flat top-5 (or even a naive "one per kind, then
  // backfill by raw priority") kept landing on mostly-or-all reviews the
  // moment there were more than 5 published, starving out external news,
  // artist highlights, concerts and videos entirely. Round-robin: take one
  // from each kind in turn (already sorted by priority+recency within the
  // kind), looping back for a 2nd/3rd item from kinds that still have more
  // once others run dry, until 5 slots are filled.
  const KIND_ORDER: TickerItem["kind"][] = ["review", "external", "artist", "concert", "youtube"];
  const byKind = new Map<TickerItem["kind"], TickerItem[]>(KIND_ORDER.map((k) => [k, out.filter((i) => i.kind === k)]));
  const picked: TickerItem[] = [];
  let round = 0;
  while (picked.length < 5 && KIND_ORDER.some((k) => (byKind.get(k)?.length ?? 0) > round)) {
    for (const kind of KIND_ORDER) {
      if (picked.length >= 5) break;
      const item = byKind.get(kind)?.[round];
      if (item) picked.push(item);
    }
    round++;
  }
  picked.sort(byRank);

  return { items: picked.slice(0, 5), generatedAt: new Date(now).toISOString() };
}
