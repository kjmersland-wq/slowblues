import { useEffect, useMemo, useState, useCallback } from "react";
import { PlayCircle, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { searchYouTube, type YTVideo } from "@/lib/youtube.functions";

type Tab = "live" | "music";
const TTL = 24 * 60 * 60 * 1000;

const LIVE_RX = /\b(concert|live|konsert|show|festival|tour|gig|sesjon|session)\b/i;
const MUSIC_RX = /\b(album|official|lyric|music\s*video|singel|single|studio|audio|mv)\b/i;

function readCache(key: string): YTVideo[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (Date.now() - t > TTL) return null;
    return v as YTVideo[];
  } catch {
    return null;
  }
}
function writeCache(key: string, v: YTVideo[]) {
  try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch {}
}

async function fetchArtistVideos(name: string): Promise<YTVideo[]> {
  const key = `yt:artist:${name.toLowerCase()}`;
  const cached = readCache(key);
  if (cached) return cached;

  const queries = [
    `${name} concert live`,
    `${name} album official`,
  ];
  const results = await Promise.all(
    queries.map((q) => searchYouTube({ data: { query: q, max: 50 } }).catch(() => ({ videos: [] as YTVideo[] }))),
  );
  const seen = new Set<string>();
  const merged: YTVideo[] = [];
  for (const r of results) for (const v of r.videos) {
    if (!seen.has(v.id)) { seen.add(v.id); merged.push(v); }
  }
  merged.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
  writeCache(key, merged);
  return merged;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("no-NO", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return ""; }
}

export function ArtistYouTube({ artistName, title = "Se & Lytt" }: { artistName: string; title?: string }) {
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("live");
  const [visible, setVisible] = useState(12);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    fetchArtistVideos(artistName).then((v) => {
      if (cancelled) return;
      setVideos(v); setLoading(false);
    }).catch((e) => { if (!cancelled) { setError(String(e?.message ?? e)); setLoading(false); } });
    return () => { cancelled = true; };
  }, [artistName]);

  const filtered = useMemo(() => {
    if (tab === "live") return videos.filter((v) => LIVE_RX.test(v.title) || LIVE_RX.test(v.description));
    return videos.filter((v) => MUSIC_RX.test(v.title) || MUSIC_RX.test(v.description));
  }, [videos, tab]);

  useEffect(() => { setVisible(12); }, [tab]);

  const shown = filtered.slice(0, visible);

  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(() => setOpenIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)), [filtered.length]);
  const next = useCallback(() => setOpenIdx((i) => (i === null ? null : (i + 1) % filtered.length)), [filtered.length]);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, close, prev, next]);

  if (loading) {
    return (
      <section>
        <SectionHeader title={title} />
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Henter videoer fra YouTube…</div>
      </section>
    );
  }
  if (error || videos.length === 0) {
    return null;
  }

  const active = openIdx !== null ? filtered[openIdx] : null;

  return (
    <section>
      <SectionHeader title={title} count={videos.length} />

      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-border">
        <TabBtn active={tab === "live"} onClick={() => setTab("live")}>Konserter &amp; Live</TabBtn>
        <TabBtn active={tab === "music"} onClick={() => setTab("music")}>Album &amp; Musikk</TabBtn>
      </div>

      {shown.length === 0 ? (
        <p className="text-muted-foreground">Ingen videoer i denne kategorien.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setOpenIdx(i)}
              className="group text-left border border-border rounded-lg overflow-hidden bg-card/40 hover:border-gold/60 transition"
            >
              <div className="relative aspect-video bg-black">
                <img src={v.thumbnail} alt={v.title} loading="lazy" className="size-full object-cover opacity-90 group-hover:opacity-100 transition" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                  <PlayCircle className="size-14 text-gold drop-shadow-lg" />
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium line-clamp-2 mb-1">{v.title}</h4>
                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>{formatDate(v.publishedAt)}</span>
                  <span className="text-gold/80">{v.channelTitle}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {filtered.length > visible && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisible((n) => n + 12)}
            className="px-5 py-2 rounded-lg border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20 transition text-sm"
          >
            Last inn flere ({filtered.length - visible})
          </button>
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button type="button" onClick={(e) => { e.stopPropagation(); close(); }} className="absolute top-4 right-4 size-10 rounded-full bg-card/80 border border-border flex items-center justify-center hover:text-gold" aria-label="Lukk">
            <X className="size-5" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-card/80 border border-border flex items-center justify-center hover:text-gold" aria-label="Forrige">
            <ChevronLeft className="size-6" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-card/80 border border-border flex items-center justify-center hover:text-gold" aria-label="Neste">
            <ChevronRight className="size-6" />
          </button>
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-gold/30 bg-black">
              <iframe
                key={active.id}
                src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="size-full"
              />
            </div>
            <div className="mt-3 text-center">
              <h3 className="font-display text-xl text-gold">{active.title}</h3>
              <p className="text-sm text-muted-foreground">{active.channelTitle} · {formatDate(active.publishedAt)}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <PlayCircle className="size-6 text-gold" />
      <h2 className="font-display text-3xl text-gold">{title}</h2>
      {typeof count === "number" && count > 0 && (
        <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/15 border border-gold/40 text-gold">
          {count} videoer
        </span>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm border-b-2 -mb-px transition ${active ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

/** Lazy YouTube lookup for a discography row. Caches result for 24h. */
export function AlbumYouTubeCell({ artistName, albumTitle, watchLabel = "Se" }: { artistName: string; albumTitle: string; watchLabel?: string }) {
  const [id, setId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const key = `yt:album:${artistName.toLowerCase()}:${albumTitle.toLowerCase()}`;
    const cached = readCache(key);
    if (cached && cached[0]) { setId(cached[0].id); setLoading(false); return; }
    searchYouTube({ data: { query: `${artistName} ${albumTitle} full album official`, max: 1 } })
      .then((r) => {
        if (cancelled) return;
        const first = r.videos?.[0];
        if (first) { setId(first.id); writeCache(key, [first]); }
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [artistName, albumTitle]);

  if (loading) return <span className="text-muted-foreground/60 text-xs">…</span>;
  if (!id) return <span className="text-muted-foreground">—</span>;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 text-gold hover:text-amber-200 underline underline-offset-4">
        <PlayCircle className="size-3.5" /> {watchLabel}
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <button type="button" onClick={(e) => { e.stopPropagation(); setOpen(false); }} className="absolute top-4 right-4 size-10 rounded-full bg-card/80 border border-border flex items-center justify-center hover:text-gold" aria-label="Lukk">
            <X className="size-5" />
          </button>
          <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden border border-gold/30 bg-black" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
              title={albumTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="size-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
