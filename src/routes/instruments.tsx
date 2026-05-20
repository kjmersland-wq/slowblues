import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { instrumentsHistory, instrumentCategories, instrumentImages, type InstrumentHistory } from "@/data/instruments";
import { SafeImage } from "@/components/SafeImage";
import { useState } from "react";

export const Route = createFileRoute("/instruments")({
  component: InstrumentsPage,
  head: () => ({
    meta: [
      { title: "Blues Instruments & Gear — SlowBlues" },
      { name: "description", content: "Gitarer, munnspill, forsterkere og utstyret som formet bluesens lyd — fra National-resonatoren til Fender Tweed." },
      { property: "og:title", content: "Blues Instruments & Gear — SlowBlues" },
      { property: "og:image", content: IMG.guitar },
    ],
    links: [{ rel: "canonical", href: "https://sslow-blues.lovable.app/instruments" }],
  }),
});

function InstrumentsPage() {
  const [cat, setCat] = useState<string>("all");
  const filtered: InstrumentHistory[] = cat === "all" ? instrumentsHistory : instrumentsHistory.filter((i) => i.category === cat);

  return (
    <PageShell>
      <PageHero eyebrow="Instrumenter & utstyr" title="Bluesens gear-historie" lead="Fra resonatorer og munnspill til Fender Tweed-forsterkere — verktøyene som ga bluesen sin stemme." img={IMG.guitar} />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setCat("all")} className={`px-4 py-1.5 rounded-full text-sm transition ${cat === "all" ? "bg-gold text-primary-foreground" : "bg-card border border-border hover:border-gold/50"}`}>Alle</button>
          {instrumentCategories.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${cat === c.id ? "bg-gold text-primary-foreground" : "bg-card border border-border hover:border-gold/50"}`}>{c.label}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((i) => {
            const img = instrumentImages[i.id];
            return (
            <article key={i.id} className="bg-card/60 border border-border rounded-xl overflow-hidden hover:border-gold/40 transition flex flex-col">
              {img && (
                <a href={img.creditUrl ?? img.url} target="_blank" rel="noreferrer" className="block aspect-[4/3] overflow-hidden bg-black/40 border-b border-border">
                  <SafeImage src={img.url} alt={i.name} loading="lazy" className="size-full object-cover hover:scale-105 transition duration-700" />
                </a>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-2">{i.category} {i.yearsProduced && `· ${i.yearsProduced}`}</div>
                <h2 className="font-display text-2xl mb-2">{i.name}</h2>
                {i.manufacturer && <div className="text-xs text-muted-foreground mb-3">{i.manufacturer}</div>}
                <p className="text-sm leading-relaxed mb-3">{i.description}</p>
                <p className="text-sm leading-relaxed text-muted-foreground mb-4"><span className="text-gold">Blues-betydning:</span> {i.bluesSignificance}</p>
                {i.famousUsers.length > 0 && (
                  <div>
                    <div className="text-[10px] tracking-[0.2em] text-gold uppercase mb-1.5">Kjente brukere</div>
                    <ul className="text-sm space-y-1">
                      {i.famousUsers.map((u) => (
                        <li key={u.name}>
                          {u.slug ? (
                            <Link to="/artists/$slug" params={{ slug: u.slug }} className="text-gold hover:underline">{u.name}</Link>
                          ) : (
                            <span>{u.name}</span>
                          )}
                          {u.notes && <span className="text-muted-foreground"> — {u.notes}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {img && (
                  <div className="text-[10px] text-muted-foreground/70 mt-4 pt-3 border-t border-border/50">
                    Foto: {img.creditUrl ? <a href={img.creditUrl} target="_blank" rel="noreferrer" className="hover:text-gold">{img.credit}</a> : img.credit}
                  </div>
                )}
              </div>
            </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
