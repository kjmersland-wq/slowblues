import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { STYLES } from "@/data/blues";
import { IMG } from "@/data/images";
import { STYLE_EXAMPLES } from "@/data/styleExamples";
import { useRef, useState } from "react";
import { Music, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
  head: () => ({ meta: [
    { title: "Compare Blues Styles — SlowBlues" },
    { name: "description", content: "Place two blues styles side by side and see the differences." },
    { property: "og:title", content: "Compare Blues Styles — SlowBlues" },
  ]}),
});

function ComparePage() {
  const { t, lang } = useI18n();
  const [a, setA] = useState(STYLES[0].slug);
  const [b, setB] = useState(STYLES[1].slug);
  const A = STYLES.find((s) => s.slug === a)!;
  const B = STYLES.find((s) => s.slug === b)!;

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.compare.eyebrow} title={t.pages.compare.title} lead={t.pages.compare.lead} img={IMG.amp} />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <Picker label={t.pages.compare.pickA} value={a} onChange={setA} />
          <Picker label={t.pages.compare.pickB} value={b} onChange={setB} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[A, B].map((s, i) => (
            <div key={i} className="bg-card/60 border border-border rounded-xl p-6">
              <div className="text-xs tracking-[0.25em] text-gold uppercase mb-1">{s.era}</div>
              <StyleName slug={s.slug} name={s.name} lang={lang} />
              <p className="text-sm text-muted-foreground mb-4">📍 {s.origin}</p>
              <p className="text-foreground/85 leading-relaxed mb-5">{s.desc}</p>
              <Row label="Instruments" value={s.instruments.join(", ")} />
              <Row label="Feel" value={s.feel} />
              <Row label="Key artists" value={s.artists.join(" · ")} />
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

// Hover (or focus / tap) the style name to open a small popup with real recordings of that style:
// song + artist, and a player that only loads when a track is clicked (browsers do not allow sound
// to start on hover alone). The tracks come from scripts/style_examples.py (src/data/styleExamples.ts).
function StyleName({ slug, name, lang }: { slug: string; name: string; lang: Parameters<typeof tr>[0] }) {
  const examples = STYLE_EXAMPLES[slug] ?? [];
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const show = () => { clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => { setOpen(false); setCurrent(null); }, 250); };
  const cur = current !== null ? examples[current] : null;

  if (examples.length === 0) return <h2 className="font-display text-3xl mb-3">{name}</h2>;
  return (
    <div className="relative mb-3" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <h2
        tabIndex={0}
        onClick={() => (open ? setOpen(false) : show())}
        className="font-display text-3xl inline-flex items-center gap-3 cursor-pointer outline-none focus-visible:text-gold"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {name} <Music className="size-5 text-gold" aria-hidden />
      </h2>
      <div className="text-[10px] tracking-[0.2em] text-gold/80 uppercase mt-1">
        {tr(lang, { no: "Hold markøren her og hør ekte eksempler", en: "Hover to hear real examples", sv: "Håll muspekaren här och lyssna på riktiga exempel", de: "Mit der Maus darüber fahren und echte Beispiele hören", pl: "Najedź kursorem, by posłuchać prawdziwych przykładów" })}
      </div>
      {open && (
        <div role="dialog" aria-label={name} className="absolute left-0 top-full mt-2 z-30 w-[min(24rem,88vw)] rounded-xl border border-gold/40 bg-card shadow-2xl p-4">
          <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-3">
            {tr(lang, { no: "Hør", en: "Listen", sv: "Lyssna", de: "Anhören", pl: "Posłuchaj" })} — {name}
          </div>
          <ul className="space-y-1 mb-3">
            {examples.map((ex, i) => (
              <li key={ex.id}>
                <button
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`w-full text-left rounded-md px-3 py-2 border transition ${current === i ? "border-gold bg-gold/10" : "border-border hover:border-gold/60"}`}
                >
                  <div className="text-sm text-foreground leading-snug">▶ {ex.song}</div>
                  <div className="text-xs text-muted-foreground">{ex.artist}</div>
                </button>
              </li>
            ))}
          </ul>
          {cur && (
            <div>
              <div className="aspect-video w-full rounded-md overflow-hidden bg-black">
                <iframe
                  key={cur.id}
                  src={`https://www.youtube-nocookie.com/embed/${cur.id}?autoplay=1&rel=0&playsinline=1`}
                  title={`${cur.artist} — ${cur.song}`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                <span className="text-foreground/85">{cur.song} — {cur.artist}</span>
                <a href={`https://www.youtube.com/watch?v=${cur.id}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline inline-flex items-center gap-1 shrink-0">
                  YouTube <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Picker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-2">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-card border border-border rounded-md px-4 py-3 text-sm focus:border-gold outline-none">
        {STYLES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
      </select>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2 border-t border-border/60">
      <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-1">{label}</div>
      <div className="text-sm text-foreground/85">{value}</div>
    </div>
  );
}
