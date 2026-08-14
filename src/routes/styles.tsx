import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { STYLES } from "@/data/blues";
import { IMG } from "@/data/images";

export const Route = createFileRoute("/styles")({
  component: StylesPage,
  head: () => ({ meta: [
    { title: "Blues Styles — SlowBlues" },
    { name: "description", content: "Delta, Chicago, Texas, British, Piedmont, Jump, Soul, Modern — the dialects of the blues." },
    { property: "og:title", content: "Blues Styles — SlowBlues" },
    { property: "og:image", content: IMG.guitar },
  ]}),
});

function StylesPage() {
  const { t, lang } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.styles.eyebrow} title={t.pages.styles.title} lead={t.pages.styles.lead} img={IMG.guitar} />
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {STYLES.map((s) => (
          <article key={s.slug} className="grid md:grid-cols-3 gap-6 bg-card/50 border border-border rounded-xl p-6 hover:border-gold/40 transition">
            <div>
              <div className="text-xs tracking-[0.25em] text-gold uppercase mb-1">{s.era}</div>
              <h2 className="font-display text-3xl mb-2">{s.name}</h2>
              <div className="text-sm text-muted-foreground">📍 {s.origin}</div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <p className="text-foreground/85 leading-relaxed">{s.desc}</p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-1.5">{tr(lang, { no: "Instrumenter", en: "Instruments", sv: "Instrument", de: "Instrumente", pl: "Instrumenty" })}</div>
                  <ul className="text-sm space-y-0.5">
                    {s.instruments.map((i) => <li key={i} className="text-muted-foreground">• {i}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-1.5">{tr(lang, { no: "Lyd", en: "Sound", sv: "Ljud", de: "Klang", pl: "Brzmienie" })}</div>
                  <p className="text-sm text-muted-foreground italic">{s.feel}</p>
                  <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-1.5 mt-3">{tr(lang, { no: "Sentrale artister", en: "Key artists", sv: "Centrala artister", de: "Wichtige Künstler", pl: "Kluczowi artyści" })}</div>
                  <p className="text-sm text-muted-foreground">{s.artists.join(" · ")}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
