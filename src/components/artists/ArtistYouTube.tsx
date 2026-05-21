import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PlayCircle, X, ChevronLeft, ChevronRight, Loader2, Music2, Disc3 } from "lucide-react";
import { searchYouTube, type YTVideo } from "@/lib/youtube.functions";

type Tab = "live" | "music";
const TTL = 24 * 60 * 60 * 1000;

const LIVE_RX = /\b(concert|live|konsert|show|festival|tour|gig|sesjon|session)\b/i;
const MUSIC_RX = /\b(album|official|lyric|music\s*video|singel|single|studio|audio|mv)\b/i;

function readCache<T = YTVideo[]>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (Date.now() - t > TTL) return null;
    return v as T;
  } catch {
    return null;
  }
}
function writeCache<T>(key: string, v: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), v }));
  } catch {}
}

async function fetchArtistVideos(name: string): Promise<YTVideo[]> {
  const key = `yt:artist:${name.toLowerCase()}`;
  const cached = readCache<YTVideo[]>(key);
  if (cached) return cached;

  const queries = [`${name} concert live`, `${name} album official`];
  const results = await Promise.all(
    queries.map((q) =>
      searchYouTube({ data: { query: q, max: 50 } }).catch(() => ({ videos: [] as YTVideo[] })),
    ),
  );
  const seen = new Set<string>();
  const merged: YTVideo[] = [];
  for (const r of results)
    for (const v of r.videos) {
      if (!seen.has(v.id)) {
        seen.add(v.id);
        merged.push(v);
      }
    }
  merged.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
  writeCache(key, merged);
  return merged;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("no-NO", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

/**
 * Robust YouTube thumbnail. Tries hq → mq → default → dark card.
 * Always renders something visible — never a grey placeholder box.
 */
export function YTThumb({
  videoId,
  alt,
  className = "",
}: {
  videoId: string;
  alt?: string;
  className?: string;
}) {
  const fallbacks = useMemo(
    () => [
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/default.jpg`,
    ],
    [videoId],
  );
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-black via-card to-black border border-gold/20 text-gold ${className}`}
        aria-label={alt}
      >
        <Music2 className="size-6 opacity-70" />
      </div>
    );
  }

  return (
    <img
      src={fallbacks[idx]}
      alt={alt ?? ""}
      loading="lazy"
      className={className}
      onError={() => {
        if (idx < fallbacks.length - 1) setIdx(idx + 1);
        else setFailed(true);
      }}
    />
  );
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
    setLoading(true);
    setError(null);
    fetchArtistVideos(artistName)
      .then((v) => {
        if (cancelled) return;
        setVideos(v);
        setLoading(false);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(String(e?.message ?? e));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [artistName]);

  const filtered = useMemo(() => {
    if (tab === "live") return videos.filter((v) => LIVE_RX.test(v.title) || LIVE_RX.test(v.description));
    return videos.filter((v) => MUSIC_RX.test(v.title) || MUSIC_RX.test(v.description));
  }, [videos, tab]);

  useEffect(() => {
    setVisible(12);
  }, [tab]);

  const shown = filtered.slice(0, visible);

  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length],
  );
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length],
  );

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
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Henter videoer fra YouTube…
        </div>
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
        <TabBtn active={tab === "live"} onClick={() => setTab("live")}>
          Konserter &amp; Live
        </TabBtn>
        <TabBtn active={tab === "music"} onClick={() => setTab("music")}>
          Album &amp; Musikk
        </TabBtn>
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
                <YTThumb
                  videoId={v.id}
                  alt={v.title}
                  className="size-full object-cover opacity-90 group-hover:opacity-100 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                  <span className="flex size-14 items-center justify-center rounded-full bg-gold/95 text-black shadow-lg group-hover:scale-110 transition">
                    <PlayCircle className="size-8" />
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium line-clamp-2 mb-1">{v.title}</h4>
                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>{formatDate(v.publishedAt)}</span>
                  <span className="text-gold/80 truncate ml-2">{v.channelTitle}</span>
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
        <VideoModal
          videoId={active.id}
          title={active.title}
          subtitle={`${active.channelTitle} · ${formatDate(active.publishedAt)}`}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}

function VideoModal({
  videoId,
  title,
  subtitle,
  onClose,
  onPrev,
  onNext,
}: {
  videoId: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 size-10 rounded-full bg-card/80 border border-border flex items-center justify-center hover:text-gold"
        aria-label="Lukk"
      >
        <X className="size-5" />
      </button>
      {onPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-card/80 border border-border flex items-center justify-center hover:text-gold"
          aria-label="Forrige"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-card/80 border border-border flex items-center justify-center hover:text-gold"
          aria-label="Neste"
        >
          <ChevronRight className="size-6" />
        </button>
      )}
      <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-video w-full rounded-xl overflow-hidden border border-gold/30 bg-black">
          <iframe
            key={videoId}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="size-full"
          />
        </div>
        <div className="mt-3 text-center">
          <h3 className="font-display text-xl text-gold">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </div>
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
      className={`px-4 py-2 text-sm border-b-2 -mb-px transition ${
        active ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/* =====================================================
   Discography videos: shared modal with prev/next
   ===================================================== */

type DiscoEntry = { key: string; title: string; videoId: string };

type DiscoCtx = {
  register: (e: DiscoEntry) => void;
  unregister: (key: string) => void;
  open: (key: string) => void;
};

const DiscographyVideoContext = createContext<DiscoCtx | null>(null);

export function DiscographyVideos({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<DiscoEntry[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const register = useCallback((e: DiscoEntry) => {
    setList((cur) => {
      const i = cur.findIndex((x) => x.key === e.key);
      if (i === -1) return [...cur, e];
      if (cur[i].videoId === e.videoId && cur[i].title === e.title) return cur;
      const next = cur.slice();
      next[i] = e;
      return next;
    });
  }, []);

  const unregister = useCallback((key: string) => {
    setList((cur) => cur.filter((x) => x.key !== key));
  }, []);

  const open = useCallback((key: string) => setActiveKey(key), []);
  const close = useCallback(() => setActiveKey(null), []);

  const activeIdx = activeKey ? list.findIndex((x) => x.key === activeKey) : -1;
  const active = activeIdx >= 0 ? list[activeIdx] : null;

  const prev = useCallback(() => {
    if (list.length === 0 || activeIdx < 0) return;
    setActiveKey(list[(activeIdx - 1 + list.length) % list.length].key);
  }, [list, activeIdx]);

  const next = useCallback(() => {
    if (list.length === 0 || activeIdx < 0) return;
    setActiveKey(list[(activeIdx + 1) % list.length].key);
  }, [list, activeIdx]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, prev, next]);

  const value = useMemo<DiscoCtx>(() => ({ register, unregister, open }), [register, unregister, open]);

  return (
    <DiscographyVideoContext.Provider value={value}>
      {children}
      {active && (
        <VideoModal
          videoId={active.videoId}
          title={active.title}
          subtitle={`Diskografi · ${activeIdx + 1} / ${list.length}`}
          onClose={close}
          onPrev={list.length > 1 ? prev : undefined}
          onNext={list.length > 1 ? next : undefined}
        />
      )}
    </DiscographyVideoContext.Provider>
  );
}

/** Lazy YouTube lookup for a discography row.
 *  Renders a 80×45 thumbnail with play overlay; clicking opens the shared modal.
 *  If wrapped in <DiscographyVideos>, prev/next steps through all sibling rows.
 *  Falls back to a self-contained modal if no provider is present.
 */
export function AlbumYouTubeCell({
  artistName,
  albumTitle,
  watchLabel = "Se",
  initialVideoId,
}: {
  artistName: string;
  albumTitle: string;
  watchLabel?: string;
  initialVideoId?: string | null;
}) {
  const [id, setId] = useState<string | null>(initialVideoId ?? null);
  const [loading, setLoading] = useState(!initialVideoId);
  const [localOpen, setLocalOpen] = useState(false);
  const ctx = useContext(DiscographyVideoContext);

  // Stable key for this row
  const keyRef = useRef(`${artistName}::${albumTitle}`.toLowerCase());
  const key = keyRef.current;

  useEffect(() => {
    if (initialVideoId) {
      setId(initialVideoId);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const cacheKey = `yt:album:${artistName.toLowerCase()}:${albumTitle.toLowerCase()}`;
    const cached = readCache<YTVideo[]>(cacheKey);
    if (cached && cached[0]) {
      setId(cached[0].id);
      setLoading(false);
      return;
    }
    searchYouTube({ data: { query: `${artistName} ${albumTitle} full album official`, max: 1 } })
      .then((r) => {
        if (cancelled) return;
        const first = r.videos?.[0];
        if (first) {
          setId(first.id);
          writeCache(cacheKey, [first]);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [artistName, albumTitle, initialVideoId]);

  // Register with provider so prev/next can walk all rows
  useEffect(() => {
    if (!ctx || !id) return;
    ctx.register({ key, title: `${artistName} — ${albumTitle}`, videoId: id });
    return () => ctx.unregister(key);
  }, [ctx, id, key, artistName, albumTitle]);

  if (loading) {
    return (
      <div
        className="inline-flex items-center justify-center bg-black/60 border border-border rounded-md text-muted-foreground/60"
        style={{ width: 80, height: 45 }}
        aria-label="Søker…"
      >
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }
  if (!id) return <span className="text-muted-foreground">—</span>;

  const handleClick = () => {
    if (ctx) ctx.open(key);
    else setLocalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${watchLabel}: ${albumTitle}`}
        className="group relative inline-block overflow-hidden rounded-md border border-gold/30 hover:border-gold transition shadow-sm"
        style={{ width: 80, height: 45 }}
      >
        <YTThumb videoId={id} alt={albumTitle} className="absolute inset-0 size-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition">
          <span className="flex size-6 items-center justify-center rounded-full bg-gold text-black shadow group-hover:scale-110 transition">
            <PlayCircle className="size-4" />
          </span>
        </span>
      </button>
      {!ctx && localOpen && (
        <VideoModal
          videoId={id}
          title={`${artistName} — ${albumTitle}`}
          onClose={() => setLocalOpen(false)}
        />
      )}
    </>
  );
}
