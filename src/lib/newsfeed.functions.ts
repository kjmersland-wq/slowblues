import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";

export type TickerItem = {
  id: string;
  kind: "review" | "youtube" | "artist" | "blog" | "editorial" | "concert";
  flag?: string;
  label: string;
  text: string;
  href: string;
  timestamp: string; // ISO
  priority: number;
};

const FLAG_BY_COUNTRY: Record<string, string> = {
  Norway: "🇳🇴", Sweden: "🇸🇪", Denmark: "🇩🇰", Finland: "🇫🇮",
  "United Kingdom": "🇬🇧", UK: "🇬🇧", England: "🇬🇧",
  Germany: "🇩🇪", France: "🇫🇷", Italy: "🇮🇹", Spain: "🇪🇸",
  Netherlands: "🇳🇱", Belgium: "🇧🇪", Ireland: "🇮🇪",
  USA: "🇺🇸", "United States": "🇺🇸", Canada: "🇨🇦",
  Australia: "🇦🇺", Japan: "🇯🇵",
};

export const getNewsTicker = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getDB();
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


    // Sort: priority desc, then recency desc
    out.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return { items: out.slice(0, 40), generatedAt: new Date(now).toISOString() };
  }
);
