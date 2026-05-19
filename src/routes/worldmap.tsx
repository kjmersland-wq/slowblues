import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { WORLD_PINS, type WorldPin, type WorldPinCategory } from "@/data/blues";
import { IMG } from "@/data/images";

export const Route = createFileRoute("/worldmap")({
  component: WorldMapPage,
  head: () => ({
    meta: [
      { title: "Blues World Map — SlowBlues" },
      {
        name: "description",
        content:
          "Clubs, festivals, gravesites, museums, radio stations and pilgrimages on the global blues map — from Clarksdale to Tokyo.",
      },
      { property: "og:title", content: "Blues World Map — SlowBlues" },
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
          <div className="aspect-[2/1] relative bg-[radial-gradient(circle_at_center,var(--color-card),var(--color-background))]">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg"
              alt="World map"
              className="absolute inset-0 size-full object-cover opacity-25"
            />
            {visible.map((p, i) => {
              const x = ((p.lng + 180) / 360) * 100;
              const y = ((90 - p.lat) / 180) * 100;
              const meta = CATEGORY_META[p.category];
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
              const style = { left: `${x}%`, top: `${y}%` } as const;
              return p.url ? (
                <a
                  key={`${p.name}-${i}`}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={style}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={`${p.name}-${i}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={style}
                >
                  {content}
                </div>
              );
            })}
          </div>
          <p className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">
            Map: Wikimedia Commons · Public Domain · {visible.length} places
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
