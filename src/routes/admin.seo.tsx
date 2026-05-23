import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { ArrowLeft, AlertTriangle, Check, RefreshCw, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/seo")({
  component: AdminSEO,
  head: () => ({ meta: [{ title: "Admin · SEO-sjekk — SlowBlues" }, { name: "robots", content: "noindex" }] }),
});

const LANGS = ["no", "sv", "en", "de"] as const;
type Lang = typeof LANGS[number];

const TITLE_MAX = 60;
const DESC_MAX = 160;

type ArtistRow = {
  slug: string;
  name: string;
  img: string | null;
  og_image: string | null;
} & Record<`seo_title_${Lang}`, string | null> & Record<`seo_description_${Lang}`, string | null>;

type ReviewRow = {
  slug: string;
  artist_name: string;
  album_title: string;
  status: string;
  cover_image: string | null;
} & Record<`seo_title_${Lang}`, string | null> & Record<`seo_description_${Lang}`, string | null>;

type Issue = { level: "error" | "warn"; msg: string };

function checkSeo(row: any, hasImage: boolean): Issue[] {
  const issues: Issue[] = [];
  for (const l of LANGS) {
    const t = row[`seo_title_${l}`] as string | null;
    const d = row[`seo_description_${l}`] as string | null;
    if (!t || !t.trim()) issues.push({ level: "error", msg: `Mangler title (${l})` });
    else if (t.length > TITLE_MAX) issues.push({ level: "warn", msg: `Title ${l} for lang (${t.length}/${TITLE_MAX})` });
    if (!d || !d.trim()) issues.push({ level: "error", msg: `Mangler description (${l})` });
    else if (d.length > DESC_MAX) issues.push({ level: "warn", msg: `Description ${l} for lang (${d.length}/${DESC_MAX})` });
  }
  if (!hasImage) issues.push({ level: "warn", msg: "Mangler bilde / og:image" });
  return issues;
}

function AdminSEO() {
  const { user, isAdmin, loading } = useAuth();
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [sitemapStatus, setSitemapStatus] = useState<{ ok: boolean; count: number; missing: string[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"artists" | "reviews" | "sitemap">("artists");
  const [onlyIssues, setOnlyIssues] = useState(true);

  const load = async () => {
    setBusy(true);
    const seoCols = LANGS.flatMap((l) => [`seo_title_${l}`, `seo_description_${l}`]).join(",");
    const [a, r] = await Promise.all([
      supabase.from("artists").select(`slug,name,img,og_image,${seoCols}`).order("name"),
      supabase.from("blues_reviews").select(`slug,artist_name,album_title,status,cover_image,${seoCols}`).order("updated_at", { ascending: false }),
    ]);
    setArtists((a.data ?? []) as any);
    setReviews((r.data ?? []) as any);

    // Sitemap check
    try {
      const res = await fetch("/sitemap.xml");
      const xml = await res.text();
      const slugs = (a.data ?? []).map((x: any) => x.slug);
      const missing = slugs.filter((s) => !xml.includes(`/artists/${s}`) && !xml.includes(`/no/artister/${s}`));
      const count = (xml.match(/<url>/g) ?? []).length;
      setSitemapStatus({ ok: res.ok, count, missing });
    } catch {
      setSitemapStatus({ ok: false, count: 0, missing: [] });
    }
    setBusy(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const artistRows = useMemo(() => artists.map((a) => ({
    row: a,
    issues: checkSeo(a, !!(a.img || a.og_image)),
  })), [artists]);

  const reviewRows = useMemo(() => reviews.map((r) => ({
    row: r,
    issues: checkSeo(r, !!r.cover_image),
  })), [reviews]);

  const filtered = (rows: typeof artistRows) => onlyIssues ? rows.filter((r) => r.issues.length > 0) : rows;

  if (loading) return <PageShell><div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Laster…</div></PageShell>;
  if (user && !isAdmin) return <PageShell><div className="max-w-md mx-auto px-6 py-24 text-center text-muted-foreground">Ingen admin-tilgang.</div></PageShell>;

  const artistsWithIssues = artistRows.filter((r) => r.issues.length > 0).length;
  const reviewsWithIssues = reviewRows.filter((r) => r.issues.length > 0).length;

  return (
    <PageShell>
      <PageHero eyebrow="Admin" title="SEO-sjekk" lead="Validerer title/description per språk (no/sv/en/de), bilde, lengder og sitemap-coverage. Viktig for Google." img={IMG.microphone} />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Link to="/admin" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:border-gold">
            <ArrowLeft className="size-4" /> Admin
          </Link>
          <button onClick={load} disabled={busy} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:border-gold disabled:opacity-60">
            <RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} /> Oppdater
          </button>
          <label className="ml-auto inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={onlyIssues} onChange={(e) => setOnlyIssues(e.target.checked)} /> Vis kun rader med problemer
          </label>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <TabBtn active={tab === "artists"} onClick={() => setTab("artists")} label={`Artister (${artistsWithIssues}/${artists.length})`} bad={artistsWithIssues > 0} />
          <TabBtn active={tab === "reviews"} onClick={() => setTab("reviews")} label={`Reviews (${reviewsWithIssues}/${reviews.length})`} bad={reviewsWithIssues > 0} />
          <TabBtn active={tab === "sitemap"} onClick={() => setTab("sitemap")} label="Sitemap" bad={!!sitemapStatus?.missing.length} />
        </div>

        {tab === "artists" && (
          <RowList
            rows={filtered(artistRows)}
            renderLink={(r) => <Link to="/admin/artists/$slug" params={{ slug: r.slug }} className="text-gold hover:underline">{r.name}</Link>}
            liveHref={(r) => `/artists/${r.slug}`}
            subText={(r) => r.slug}
          />
        )}

        {tab === "reviews" && (
          <RowList
            rows={filtered(reviewRows as any)}
            renderLink={(r) => <Link to="/admin/reviews" className="text-gold hover:underline">{r.artist_name} — {r.album_title}</Link>}
            liveHref={(r) => `/reviews/${r.slug}`}
            subText={(r) => `${r.slug} · ${r.status}`}
          />
        )}

        {tab === "sitemap" && sitemapStatus && (
          <div className="bg-card/40 border border-border rounded-lg p-5 space-y-3">
            <p className="text-sm">
              Status: {sitemapStatus.ok ? <span className="text-emerald-400">OK</span> : <span className="text-red-400">Feil ved henting</span>}
              {" · "}URL-er: <strong>{sitemapStatus.count}</strong>
            </p>
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-gold hover:underline">
              Åpne sitemap.xml <ExternalLink className="size-3" />
            </a>
            {sitemapStatus.missing.length > 0 ? (
              <div>
                <p className="text-sm text-amber-300 mb-2 flex items-center gap-2"><AlertTriangle className="size-4" /> {sitemapStatus.missing.length} artister mangler i sitemap:</p>
                <ul className="text-xs font-mono text-muted-foreground space-y-1 max-h-64 overflow-auto">
                  {sitemapStatus.missing.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-emerald-400 flex items-center gap-2"><Check className="size-4" /> Alle artister er med i sitemap.</p>
            )}
            <p className="text-xs text-muted-foreground">
              Sitemap genereres dynamisk fra databasen. Etter at du legger til en ny artist trenger du ikke gjøre noe — den dukker opp ved neste request.
              Google leser den fra <code className="text-gold">https://www.slowblues.no/sitemap.xml</code>.
            </p>
          </div>
        )}
      </section>
    </PageShell>
  );
}

function TabBtn({ active, onClick, label, bad }: { active: boolean; onClick: () => void; label: string; bad: boolean }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-md text-sm border transition ${active ? "bg-gold text-primary-foreground border-gold" : `border-border hover:border-gold ${bad ? "text-amber-300" : ""}`}`}>
      {label}
    </button>
  );
}

function RowList<T extends { slug: string }>({ rows, renderLink, liveHref, subText }: {
  rows: { row: T; issues: Issue[] }[];
  renderLink: (r: T) => React.ReactNode;
  liveHref: (r: T) => string;
  subText: (r: T) => string;
}) {
  if (!rows.length) return <p className="text-sm text-muted-foreground text-center py-12">🎉 Ingen problemer her.</p>;
  return (
    <ul className="space-y-2">
      {rows.map(({ row, issues }) => {
        const errs = issues.filter((i) => i.level === "error").length;
        const warns = issues.filter((i) => i.level === "warn").length;
        return (
          <li key={row.slug} className="bg-card/40 border border-border rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="min-w-0">
                <div className="font-medium">{renderLink(row)}</div>
                <div className="text-xs text-muted-foreground">{subText(row)}</div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {errs > 0 && <span className="px-2 py-1 rounded bg-red-500/10 text-red-300">{errs} feil</span>}
                {warns > 0 && <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300">{warns} adv.</span>}
                {issues.length === 0 && <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 inline-flex items-center gap-1"><Check className="size-3" /> OK</span>}
                <a href={liveHref(row)} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-gold"><ExternalLink className="size-4" /></a>
              </div>
            </div>
            {issues.length > 0 && (
              <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {issues.map((i, idx) => (
                  <li key={idx} className={i.level === "error" ? "text-red-300" : "text-amber-300"}>
                    • {i.msg}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
