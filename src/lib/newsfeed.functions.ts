import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type TickerItem = {
  id: string;
  kind: "review" | "youtube" | "artist" | "blog" | "editorial";
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
    const out: TickerItem[] = [];
    const now = Date.now();

    // 1) Latest published reviews
    try {
      const { data: reviews } = await supabaseAdmin
        .from("blues_reviews")
        .select("slug, artist_name, album_title, total_score, verdict_en, published_at, updated_at")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(12);
      for (const r of reviews ?? []) {
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
      const { data: videos } = await supabaseAdmin
        .from("youtube_videos")
        .select("video_id, title, artist_slug, category, published_at, created_at, is_official_channel")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(10);
      for (const v of videos ?? []) {
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
      const { data: artists } = await supabaseAdmin
        .from("artists")
        .select("slug, name, country, era_label_en, short_en, updated_at, died")
        .order("updated_at", { ascending: false })
        .limit(20);
      for (const a of artists ?? []) {
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

    // Sort: priority desc, then recency desc
    out.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return { items: out.slice(0, 40), generatedAt: new Date(now).toISOString() };
  }
);
