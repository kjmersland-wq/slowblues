import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from "react";
import { ExternalLink, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { WORLD_PINS, type WorldPin, type WorldPinCategory } from "@/data/blues";
import { IMG } from "@/data/images";

const WORLDMAP_URL = "https://www.slow-blues.com/worldmap";
const WORLDMAP_DESCRIPTION =
  "Clubs, festivals, gravesites, museums, radio stations and pilgrimages on the global blues map — from Clarksdale to Tokyo, Warsaw to Cape Town.";

// Maps a WorldPin's category to the closest valid schema.org type for the
// ItemList below. Kept intentionally coarse -- these are map markers, not
// full venue/event records, so we only assert what we actually know.
const PIN_SCHEMA_TYPE: Record<WorldPinCategory, string> = {
  cradle: "Place",
  club: "MusicVenue",
  festival: "Festival",
  museum: "Museum",
  grave: "Cemetery",
  label: "Organization",
  studio: "Place",
  radio: "RadioStation",
  pilgrimage: "TouristAttraction",
};

export const Route = createFileRoute("/worldmap")({
  component: WorldMapPage,
  head: () => ({
    meta: [
      { title: "Blues World Map — SlowBlues" },
      { name: "description", content: WORLDMAP_DESCRIPTION },
      { property: "og:title", content: "Blues World Map — SlowBlues" },
      { property: "og:description", content: WORLDMAP_DESCRIPTION },
      { property: "og:url", content: WORLDMAP_URL },
      { property: "og:type", content: "website" },
      { property: "og:image", content: IMG.clarksdale },
    ],
    links: [{ rel: "canonical", href: WORLDMAP_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${WORLDMAP_URL}#list`,
          name: "Blues World Map",
          description: WORLDMAP_DESCRIPTION,
          url: WORLDMAP_URL,
          numberOfItems: WORLD_PINS.length,
          itemListElement: WORLD_PINS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": PIN_SCHEMA_TYPE[p.category],
              name: p.name,
              ...(p.url ? { url: p.url } : {}),
              ...(p.description ? { description: p.description } : {}),
              geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
              ...(p.city || p.country
                ? { address: { "@type": "PostalAddress", ...(p.city ? { addressLocality: p.city } : {}), ...(p.country ? { addressCountry: p.country } : {}) } }
                : {}),
            },
          })),
        }),
      },
    ],
  }),
});

type CategoryMeta = {
  label: string;
  color: string; // hsl/oklch token
  dot: string; // tailwind bg class
};

const CATEGORY_META: Record<WorldPinCategory, CategoryMeta> = {
  cradle: { label: "Cradle / Scene", color: "#e0a458", dot: "bg-[#e0a458]" },
  club: { label: "Clubs", color: "#e94f37", dot: "bg-[#e94f37]" },
  festival: { label: "Festivals", color: "#f5d76e", dot: "bg-[#f5d76e]" },
  museum: { label: "Museums", color: "#9b59b6", dot: "bg-[#9b59b6]" },
  grave: { label: "Gravesites", color: "#cfd2cd", dot: "bg-[#cfd2cd]" },
  label: { label: "Labels", color: "#3aaed8", dot: "bg-[#3aaed8]" },
  studio: { label: "Studios", color: "#5cbdb9", dot: "bg-[#5cbdb9]" },
  radio: { label: "Radio", color: "#2dd4a8", dot: "bg-[#2dd4a8]" },
  pilgrimage: { label: "Pilgrimage", color: "#d4842a", dot: "bg-[#d4842a]" },
};

const CATEGORY_ORDER: WorldPinCategory[] = [
  "cradle",
  "club",
  "festival",
  "museum",
  "grave",
  "label",
  "studio",
  "radio",
  "pilgrimage",
];

function WorldMapPage() {
  const { t } = useI18n();
  const [active, setActive] = useState<Set<WorldPinCategory>>(
    () => new Set(CATEGORY_ORDER),
  );

  // Zoom + pan state
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const MIN = 1;
  const MAX = 12;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const zoomBy = (factor: number) => {
    setScale((s) => {
      const next = clamp(s * factor, MIN, MAX);
      // re-center pan within bounds
      const bound = (next - 1) * 50;
      setTx((p) => clamp(p, -bound, bound));
      setTy((p) => clamp(p, -bound, bound));
      return next;
    });
  };
  const reset = () => {
    setScale(1);
    setTx(0);
    setTy(0);
  };

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    const rect = e.currentTarget.getBoundingClientRect();
    // convert px delta into % of container, then divide by scale
    const pctX = (dx / rect.width) * 100 / scale;
    const pctY = (dy / rect.height) * 100 / scale;
    const bound = (scale - 1) * 50;
    setTx(clamp(dragRef.current.tx + pctX, -bound, bound));
    setTy(clamp(dragRef.current.ty + pctY, -bound, bound));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };


  const toggle = (c: WorldPinCategory) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      if (next.size === 0) return new Set(CATEGORY_ORDER);
      return next;
    });
  };

  const visible = useMemo(
    () => WORLD_PINS.filter((p) => active.has(p.category)),
    [active],
  );

  const grouped = useMemo(() => {
    const m = new Map<WorldPinCategory, WorldPin[]>();
    for (const c of CATEGORY_ORDER) m.set(c, []);
    for (const p of visible) m.get(p.category)!.push(p);
    return m;
  }, [visible]);

  return (
    <PageShell>
      <PageHero
        eyebrow={t.pages.worldmap.eyebrow}
        title={t.pages.worldmap.title}
        lead={t.pages.worldmap.lead}
        img={IMG.road}
      />
      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActive(new Set(CATEGORY_ORDER))}
            className="text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-border hover:border-gold text-muted-foreground hover:text-gold transition"
          >
            All ({WORLD_PINS.length})
          </button>
          {CATEGORY_ORDER.map((c) => {
            const meta = CATEGORY_META[c];
            const count = WORLD_PINS.filter((p) => p.category === c).length;
            const on = active.has(c);
            return (
              <button
                key={c}
                onClick={() => toggle(c)}
                className={`text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border transition flex items-center gap-2 ${on ? "border-foreground/40 text-foreground bg-card/60" : "border-border text-muted-foreground opacity-50 hover:opacity-100"}`}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                {meta.label} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Map */}
        <div className="relative rounded-xl overflow-hidden border border-border bg-card/40 mb-10">
          {/* Zoom controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-card/80 backdrop-blur border border-border rounded-md p-1">
            <button
              type="button"
              onClick={() => zoomBy(1.5)}
              aria-label="Zoom in"
              className="size-8 grid place-items-center hover:text-gold transition"
            >
              <ZoomIn className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => zoomBy(1 / 1.5)}
              aria-label="Zoom out"
              className="size-8 grid place-items-center hover:text-gold transition"
            >
              <ZoomOut className="size-4" />
            </button>
            <button
              type="button"
              onClick={reset}
              aria-label="Reset zoom"
              className="size-8 grid place-items-center hover:text-gold transition"
            >
              <RotateCcw className="size-4" />
            </button>
            <div className="text-[10px] text-center text-muted-foreground font-mono px-1">
              {scale.toFixed(1)}×
            </div>
          </div>

          <div
            className="aspect-[2/1] relative bg-[radial-gradient(circle_at_center,var(--color-card),var(--color-background))] overflow-hidden touch-none select-none"
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ cursor: scale > 1 ? (dragRef.current ? "grabbing" : "grab") : "default" }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
                transformOrigin: "center center",
                transition: dragRef.current ? "none" : "transform 0.15s ease-out",
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg"
                alt="World map"
                className="absolute inset-0 size-full object-cover opacity-25 pointer-events-none"
                draggable={false}
              />
              {visible.map((p, i) => {
                const x = ((p.lng + 180) / 360) * 100;
                const y = ((90 - p.lat) / 180) * 100;
                const meta = CATEGORY_META[p.category];
                // Counter-scale the pin so it stays the same visual size when zoomed
                const pinScale = 1 / scale;
                const content = (
                  <>
                    <span
                      className="block size-2.5 rounded-full ring-2 ring-background/50 group-hover:scale-150 transition"
                      style={{ backgroundColor: meta.color }}
                    />
                    <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 mt-2 z-10 whitespace-nowrap bg-card/95 backdrop-blur border border-border rounded-md px-3 py-1.5 text-xs shadow-lg">
                      <div className="font-display text-gold">{p.name}</div>
                      <div className="text-muted-foreground">{p.type}</div>
                      <div
                        className="text-[10px] uppercase tracking-wider mt-0.5"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </div>
                    </div>
                  </>
                );
                const style = {
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) scale(${pinScale})`,
                } as const;
                return p.url ? (
                  <a
                    key={`${p.name}-${i}`}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute group cursor-pointer"
                    style={style}
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={`${p.name}-${i}`}
                    className="absolute group"
                    style={style}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="absolute bottom-2 right-3 text-[10px] text-muted-foreground z-10 bg-background/60 backdrop-blur px-2 py-0.5 rounded">
            Scroll / pinch to zoom · drag to pan · {visible.length} places
          </p>
        </div>


        {/* Grouped lists */}
        <div className="space-y-10">
          {CATEGORY_ORDER.map((c) => {
            const items = grouped.get(c) ?? [];
            if (items.length === 0) return null;
            const meta = CATEGORY_META[c];
            return (
              <div key={c}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <h2 className="font-display text-2xl text-foreground">
                    {meta.label}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    ({items.length})
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((p) => {
                    const Card = p.url ? "a" : "div";
                    const cardProps = p.url
                      ? {
                          href: p.url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {};
                    return (
                      <Card
                        key={p.name}
                        {...cardProps}
                        className={`block bg-card/60 border border-border rounded-lg p-4 transition ${p.url ? "hover:border-gold/60 hover:bg-card/80" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-display text-lg text-gold leading-tight">
                            {p.name}
                          </div>
                          {p.url && (
                            <ExternalLink className="size-3.5 text-muted-foreground mt-1 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {p.type}
                        </div>
                        <div className="text-[11px] text-muted-foreground/70 mt-2 font-mono">
                          {p.lat.toFixed(2)}°, {p.lng.toFixed(2)}°
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
