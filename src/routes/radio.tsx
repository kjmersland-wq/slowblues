import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { RADIO_SHOWS } from "@/data/blues";
import { IMG } from "@/data/images";
import { bluesRadioStations } from "@/data/bluesRadio";
import { Play, Radio as RadioIcon, ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/radio")({
  component: RadioPage,
  head: () => ({
    meta: [
      { title: "Blues Radio — SlowBlues" },
      { name: "description", content: "Bluesradio og bluesprogrammer fra Norge, Norden og hele verden — live streams, ukentlige programmer og spillelister." },
      { property: "og:title", content: "Blues Radio — SlowBlues" },
      { property: "og:image", content: IMG.microphone },
    ],
  }),
});

const REGIONS = [
  { id: "all", labelEn: "All", labelNo: "Alle" },
  { id: "norway", labelEn: "Norway", labelNo: "Norge" },
  { id: "nordic", labelEn: "Nordic", labelNo: "Norden" },
  { id: "world", labelEn: "World", labelNo: "Verden" },
] as const;

function RadioPage() {
  const { t, lang } = useI18n();
  const no = lang === "no" || lang === "sv";
  const [region, setRegion] = useState<string>("all");
  const stations = region === "all" ? bluesRadioStations : bluesRadioStations.filter((s) => s.region === region);

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.radio.eyebrow} title={t.pages.radio.title} lead={t.pages.radio.lead} img={IMG.microphone} />

      <section className="max-w-5xl mx-auto px-6 py-12">
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
        <div className="space-y-2 mb-14">
          {RADIO_SHOWS.map((s) => (
            <div key={s.time} className="grid grid-cols-[80px_1fr_1fr] gap-4 items-center bg-card/40 border border-border rounded-md px-4 py-3">
              <div className="font-display text-gold">{s.time}</div>
              <div className="font-display text-lg">{s.show}</div>
              <div className="text-sm text-muted-foreground">{s.host}</div>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl mb-2 inline-flex items-center gap-2"><RadioIcon className="size-5 text-gold" /> {no ? "Bluesprogrammer & stasjoner" : "Blues programs & stations"}</h2>
        <p className="text-sm text-muted-foreground mb-6">{no ? `${bluesRadioStations.length} kuraterte bluesprogrammer fra hele verden.` : `${bluesRadioStations.length} curated blues programs from around the world.`}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {REGIONS.map((r) => (
            <button key={r.id} onClick={() => setRegion(r.id)} className={`px-4 py-1.5 rounded-full text-sm transition ${region === r.id ? "bg-gold text-primary-foreground" : "bg-card border border-border hover:border-gold/50"}`}>
              {no ? r.labelNo : r.labelEn}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {stations.map((s) => (
            <article key={s.id} className="bg-card/60 border border-border rounded-xl p-5 hover:border-gold/40 transition">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-gold uppercase mb-2">
                <MapPin className="size-3" /> {no ? s.countryNo : s.country}
              </div>
              <h3 className="font-display text-lg mb-2 leading-tight">{s.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{no ? s.descriptionNo : s.descriptionEn}</p>
              <div className="flex flex-wrap gap-3 text-xs">
                <a href={s.listenUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-gold hover:underline"><Play className="size-3" /> {no ? "Lytt" : "Listen"} {s.listenNote && <span className="text-muted-foreground">({s.listenNote})</span>}</a>
                <a href={s.website} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-muted-foreground hover:text-gold">{no ? "Nettside" : "Website"} <ExternalLink className="size-3" /></a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
