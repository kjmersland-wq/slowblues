import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { RADIO_SHOWS } from "@/data/blues";
import { IMG } from "@/data/images";
import { Play, Radio as RadioIcon } from "lucide-react";

export const Route = createFileRoute("/radio")({
  component: RadioPage,
  head: () => ({ meta: [
    { title: "Blues Radio — SlowBlues" },
    { name: "description", content: "24/7 streaming. Classics, new releases and deep dives." },
    { property: "og:title", content: "Blues Radio — SlowBlues" },
    { property: "og:image", content: IMG.microphone },
  ]}),
});

function RadioPage() {
  const { t } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.radio.eyebrow} title={t.pages.radio.title} lead={t.pages.radio.lead} img={IMG.microphone} />
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-card to-card/30 border border-gold/30 rounded-xl p-8 text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-destructive uppercase mb-3">
            <span className="size-2 rounded-full bg-destructive animate-pulse" /> {t.pages.radio.live}
          </div>
          <div className="font-display text-3xl mb-2 gold-gradient-text">Slow Blues Radio</div>
          <div className="text-sm text-muted-foreground mb-6">Now playing — Muddy Waters · "Mannish Boy"</div>
          <button className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90">
            <Play className="size-5" /> {t.common.listenNow}
          </button>
        </div>

        <h2 className="font-display text-2xl mb-4 inline-flex items-center gap-2"><RadioIcon className="size-5 text-gold" /> {t.pages.radio.schedule}</h2>
        <div className="space-y-2">
          {RADIO_SHOWS.map((s) => (
            <div key={s.time} className="grid grid-cols-[80px_1fr_1fr] gap-4 items-center bg-card/40 border border-border rounded-md px-4 py-3">
              <div className="font-display text-gold">{s.time}</div>
              <div className="font-display text-lg">{s.show}</div>
              <div className="text-sm text-muted-foreground">{s.host}</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
