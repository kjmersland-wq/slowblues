import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { STYLES } from "@/data/blues";
import { IMG } from "@/data/images";
import { useState } from "react";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
  head: () => ({ meta: [
    { title: "Compare Blues Styles — SlowBlues" },
    { name: "description", content: "Place two blues styles side by side and see the differences." },
    { property: "og:title", content: "Compare Blues Styles — SlowBlues" },
  ]}),
});

function ComparePage() {
  const { t } = useI18n();
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
              <h2 className="font-display text-3xl mb-3">{s.name}</h2>
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
