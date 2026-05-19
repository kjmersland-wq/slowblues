import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { WORLD_PINS } from "@/data/blues";
import { IMG } from "@/data/images";

export const Route = createFileRoute("/worldmap")({
  component: WorldMapPage,
  head: () => ({ meta: [
    { title: "Blues World Map — SlowBlues" },
    { name: "description", content: "Clubs, festivals and pilgrimages on the global blues map." },
    { property: "og:title", content: "Blues World Map — SlowBlues" },
  ]}),
});

function WorldMapPage() {
  const { t } = useI18n();

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.worldmap.eyebrow} title={t.pages.worldmap.title} lead={t.pages.worldmap.lead} img={IMG.road} />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="relative rounded-xl overflow-hidden border border-border bg-card/40 mb-8">
          <div className="aspect-[2/1] relative bg-[radial-gradient(circle_at_center,var(--color-card),var(--color-background))]">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg"
              alt="World map"
              className="absolute inset-0 size-full object-cover opacity-30"
            />
            {WORLD_PINS.map((p) => {
              const x = ((p.lng + 180) / 360) * 100;
              const y = ((90 - p.lat) / 180) * 100;
              return (
                <div key={p.name} className="absolute -translate-x-1/2 -translate-y-1/2 group" style={{ left: `${x}%`, top: `${y}%` }}>
                  <div className="size-3 rounded-full bg-gold ring-4 ring-gold/20 group-hover:ring-gold/40 transition" />
                  <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-card border border-border rounded-md px-3 py-1.5 text-xs">
                    <div className="font-display text-gold">{p.name}</div>
                    <div className="text-muted-foreground">{p.type}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">Map: Wikimedia Commons · Public Domain</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORLD_PINS.map((p) => (
            <div key={p.name} className="bg-card/60 border border-border rounded-lg p-4">
              <div className="font-display text-lg text-gold">{p.name}</div>
              <div className="text-sm text-muted-foreground">{p.type}</div>
              <div className="text-[11px] text-muted-foreground mt-2">{p.lat.toFixed(2)}°, {p.lng.toFixed(2)}°</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
