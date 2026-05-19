import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { AlertTriangle, Image as ImageIcon, Languages, Youtube, FileText, Search } from "lucide-react";

type ArtistRow = {
  slug: string;
  name: string;
  img: string | null;
  biography_en: string | null;
  biography_no: string | null;
  biography_sv: string | null;
  biography_de: string | null;
  youtube_video_ids: string[] | null;
  seo_title_en: string | null;
  short: string | null;
  region: string | null;
};

type FlagSet = {
  missing_image: boolean;
  unverified_image: boolean;
  missing_bio_en: boolean;
  missing_bio_no: boolean;
  missing_bio_sv: boolean;
  missing_bio_de: boolean;
  missing_videos: boolean;
  missing_seo: boolean;
  score: number; // 0-100 completeness
};

function computeFlags(a: ArtistRow, verifiedImages: Set<string>): FlagSet {
  const hasImg = !!a.img && a.img.length > 0;
  const f: FlagSet = {
    missing_image: !hasImg,
    unverified_image: hasImg && !verifiedImages.has(a.slug),
    missing_bio_en: !a.biography_en,
    missing_bio_no: !a.biography_no,
    missing_bio_sv: !a.biography_sv,
    missing_bio_de: !a.biography_de,
    missing_videos: !(a.youtube_video_ids && a.youtube_video_ids.length > 0),
    missing_seo: !a.seo_title_en,
    score: 0,
  };
  const checks = [
    hasImg && !f.unverified_image,
    !f.missing_bio_en,
    !f.missing_bio_no,
    !f.missing_bio_sv,
    !f.missing_bio_de,
    !f.missing_videos,
    !f.missing_seo,
  ];
  f.score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  return f;
}

export const Route = createFileRoute("/admin/quality")({
  component: QCPage,
  head: () => ({ meta: [{ title: "QC Dashboard — SlowBlues Admin" }, { name: "robots", content: "noindex" }] }),
});

type Filter = "all" | "needs_image" | "needs_bio_no" | "needs_bio_de" | "needs_videos" | "needs_seo" | "incomplete";

function QCPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [verifiedImages, setVerifiedImages] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setBusy(true);
      const [aRes, iRes] = await Promise.all([
        supabase
          .from("artists")
          .select("slug,name,img,biography_en,biography_no,biography_sv,biography_de,youtube_video_ids,seo_title_en,short,region")
          .order("name", { ascending: true })
          .limit(1000),
        supabase.from("artist_images").select("artist_slug").eq("verified", true).eq("is_primary", true),
      ]);
      setArtists((aRes.data ?? []) as ArtistRow[]);
      setVerifiedImages(new Set((iRes.data ?? []).map((r: any) => r.artist_slug)));
      setBusy(false);
    })();
  }, [isAdmin]);

  const enriched = useMemo(
    () => artists.map((a) => ({ a, f: computeFlags(a, verifiedImages) })),
    [artists, verifiedImages],
  );

  const stats = useMemo(() => {
    const total = enriched.length;
    const c = {
      total,
      missing_image: 0,
      unverified_image: 0,
      missing_bio_no: 0,
      missing_bio_de: 0,
      missing_videos: 0,
      missing_seo: 0,
      avg_score: 0,
    };
    let sum = 0;
    for (const { f } of enriched) {
      if (f.missing_image) c.missing_image++;
      if (f.unverified_image) c.unverified_image++;
      if (f.missing_bio_no) c.missing_bio_no++;
      if (f.missing_bio_de) c.missing_bio_de++;
      if (f.missing_videos) c.missing_videos++;
      if (f.missing_seo) c.missing_seo++;
      sum += f.score;
    }
    c.avg_score = total ? Math.round(sum / total) : 0;
    return c;
  }, [enriched]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched.filter(({ a, f }) => {
      if (q && !a.name.toLowerCase().includes(q) && !a.slug.toLowerCase().includes(q)) return false;
      switch (filter) {
        case "needs_image":
          return f.missing_image || f.unverified_image;
        case "needs_bio_no":
          return f.missing_bio_no;
        case "needs_bio_de":
          return f.missing_bio_de;
        case "needs_videos":
          return f.missing_videos;
        case "needs_seo":
          return f.missing_seo;
        case "incomplete":
          return f.score < 60;
        default:
          return true;
      }
    });
  }, [enriched, search, filter]);

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Laster…</div>
      </PageShell>
    );
  }
  if (user && !isAdmin) {
    return (
      <PageShell>
        <PageHero eyebrow="Admin" title="Ingen tilgang" lead="Kontoen din har ikke admin-rolle." img={IMG.pianoNight} />
      </PageShell>
    );
  }

  const filterChips: Array<[Filter, string, number]> = [
    ["all", "All", stats.total],
    ["needs_image", "Needs image", stats.missing_image + stats.unverified_image],
    ["needs_bio_no", "Missing NO bio", stats.missing_bio_no],
    ["needs_bio_de", "Missing DE bio", stats.missing_bio_de],
    ["needs_videos", "No YouTube", stats.missing_videos],
    ["needs_seo", "Missing SEO", stats.missing_seo],
    ["incomplete", "Score < 60%", enriched.filter(({ f }) => f.score < 60).length],
  ];

  return (
    <PageShell>
      <PageHero
        eyebrow="Admin · QC"
        title="Quality Control"
        lead={`Average artist completeness: ${stats.avg_score}% across ${stats.total} artists`}
        img={IMG.pianoNight}
      />

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<ImageIcon className="size-4" />} label="Missing images" value={stats.missing_image} total={stats.total} tone="error" />
          <StatCard icon={<AlertTriangle className="size-4" />} label="Unverified images" value={stats.unverified_image} total={stats.total} tone="warn" />
          <StatCard icon={<Youtube className="size-4" />} label="No YouTube" value={stats.missing_videos} total={stats.total} tone="warn" />
          <StatCard icon={<Languages className="size-4" />} label="Missing NO bio" value={stats.missing_bio_no} total={stats.total} tone="info" />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artists…"
              className="w-full pl-9 pr-3 py-2 rounded-md bg-card border border-border text-sm focus:outline-none focus:border-gold"
            />
          </div>
          {filterChips.map(([key, label, n]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition ${
                filter === key
                  ? "bg-gold text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-gold/50"
              }`}
            >
              {label} <span className="opacity-60">({n})</span>
            </button>
          ))}
        </div>

        {busy && <p className="text-sm text-muted-foreground text-center py-8">Loading artists…</p>}

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3">Artist</th>
                <th className="text-left p-3">Region</th>
                <th className="text-center p-3">Img</th>
                <th className="text-center p-3">EN</th>
                <th className="text-center p-3">NO</th>
                <th className="text-center p-3">SV</th>
                <th className="text-center p-3">DE</th>
                <th className="text-center p-3">YT</th>
                <th className="text-center p-3">SEO</th>
                <th className="text-right p-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ a, f }) => (
                <tr key={a.slug} className="border-t border-border hover:bg-card/30">
                  <td className="p-3">
                    <Link to="/artists/$slug" params={{ slug: a.slug }} className="font-medium hover:text-gold">
                      {a.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{a.slug}</div>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{a.region ?? "—"}</td>
                  <td className="p-3 text-center">
                    {f.missing_image ? <Dot tone="error" title="No image" /> : f.unverified_image ? <Dot tone="warn" title="Unverified" /> : <Dot tone="ok" />}
                  </td>
                  <td className="p-3 text-center">{f.missing_bio_en ? <Dot tone="error" /> : <Dot tone="ok" />}</td>
                  <td className="p-3 text-center">{f.missing_bio_no ? <Dot tone="warn" /> : <Dot tone="ok" />}</td>
                  <td className="p-3 text-center">{f.missing_bio_sv ? <Dot tone="info" /> : <Dot tone="ok" />}</td>
                  <td className="p-3 text-center">{f.missing_bio_de ? <Dot tone="info" /> : <Dot tone="ok" />}</td>
                  <td className="p-3 text-center">{f.missing_videos ? <Dot tone="warn" /> : <Dot tone="ok" />}</td>
                  <td className="p-3 text-center">{f.missing_seo ? <Dot tone="warn" /> : <Dot tone="ok" />}</td>
                  <td className="p-3 text-right">
                    <span className={`font-mono text-xs ${f.score >= 80 ? "text-emerald-400" : f.score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                      {f.score}%
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !busy && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-muted-foreground text-sm">
                    No artists match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-muted-foreground flex items-center gap-2">
          <FileText className="size-3" />
          Image policy: SlowBlues never auto-generates AI portraits. Missing images stay flagged here until verified manually.
        </p>
      </section>
    </PageShell>
  );
}

function StatCard({ icon, label, value, total, tone }: { icon: React.ReactNode; label: string; value: number; total: number; tone: "error" | "warn" | "info" }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  const color = tone === "error" ? "text-red-400" : tone === "warn" ? "text-amber-400" : "text-sky-400";
  return (
    <div className="p-4 rounded-lg bg-card/60 border border-border">
      <div className={`flex items-center gap-2 text-xs uppercase tracking-wider ${color}`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-2xl">{value}</span>
        <span className="text-xs text-muted-foreground">/ {total} ({pct}%)</span>
      </div>
    </div>
  );
}

function Dot({ tone, title }: { tone: "ok" | "warn" | "error" | "info"; title?: string }) {
  const color =
    tone === "ok" ? "bg-emerald-500/70" : tone === "error" ? "bg-red-500/80" : tone === "warn" ? "bg-amber-500/80" : "bg-sky-500/70";
  return <span title={title} className={`inline-block size-2 rounded-full ${color}`} />;
}
