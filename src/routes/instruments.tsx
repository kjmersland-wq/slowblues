import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { instrumentsHistory, instrumentCategories, instrumentImages, type InstrumentHistory } from "@/data/instruments";
import { SafeImage } from "@/components/SafeImage";
import { useState } from "react";
import { useI18n, tr } from "@/i18n";
import { artistDetailPath } from "@/lib/locale";

export const Route = createFileRoute("/instruments")({
  component: InstrumentsPage,
  head: () => ({
    meta: [
      { title: "Blues Instruments & Gear — SlowBlues" },
      { name: "description", content: "Gitarer, munnspill, forsterkere og utstyret som formet bluesens lyd — fra National-resonatoren til Fender Tweed." },
      { property: "og:title", content: "Blues Instruments & Gear — SlowBlues" },
      { property: "og:description", content: "Gitarer, munnspill, forsterkere og utstyret som formet bluesens lyd — fra National-resonatoren til Fender Tweed." },
      { property: "og:url", content: "https://www.slow-blues.com/instruments" },
      { property: "og:image", content: IMG.guitar },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/instruments" }],
  }),
});

const CATEGORY_LABELS: Record<string, { no: string; en: string; sv: string; de: string; pl: string }> = {
  guitars: { no: "Gitarer", en: "Guitars", sv: "Gitarrer", de: "Gitarren", pl: "Gitary" },
  harmonicas: { no: "Munnspill", en: "Harmonicas", sv: "Munspel", de: "Mundharmonikas", pl: "Harmonijki ustne" },
  amplifiers: { no: "Forsterkere", en: "Amplifiers", sv: "Förstärkare", de: "Verstärker", pl: "Wzmacniacze" },
  other: { no: "Annet utstyr", en: "Other Equipment", sv: "Annan utrustning", de: "Sonstiges Equipment", pl: "Inny sprzęt" },
};

function InstrumentsPage() {
  const [cat, setCat] = useState<string>("all");
  const { lang } = useI18n();
  const filtered: InstrumentHistory[] = cat === "all" ? instrumentsHistory : instrumentsHistory.filter((i) => i.category === cat);

  return (
    <PageShell>
      <PageHero
        eyebrow={tr(lang, { no: "Instrumenter & utstyr", en: "Instruments & gear", sv: "Instrument & utrustning", de: "Instrumente & Equipment", pl: "Instrumenty i sprzęt" })}
        title={tr(lang, {
          no: "Bluesens gear-historie",
          en: "The gear history of the blues",
          sv: "Bluesens utrustningshistoria",
          de: "Die Gear-Geschichte des Blues",
          pl: "Historia sprzętu w bluesie",
        })}
        lead={tr(lang, {
          no: "Fra resonatorer og munnspill til Fender Tweed-forsterkere — verktøyene som ga bluesen sin stemme.",
          en: "From resonators and harmonicas to Fender Tweed amps — the tools that gave the blues its voice.",
          sv: "Från resonatorer och munspel till Fender Tweed-förstärkare — verktygen som gav bluesen dess röst.",
          de: "Von Resonatoren und Mundharmonikas bis zu Fender-Tweed-Verstärkern — die Werkzeuge, die dem Blues seine Stimme gaben.",
          pl: "Od gitar rezonansowych i harmonijek po wzmacniacze Fender Tweed — narzędzia, które dały bluesowi jego głos.",
        })}
        img={IMG.guitar}
      />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setCat("all")} className={`px-4 py-1.5 rounded-full text-sm transition ${cat === "all" ? "bg-gold text-primary-foreground" : "bg-card border border-border hover:border-gold/50"}`}>
            {tr(lang, { no: "Alle", en: "All", sv: "Alla", de: "Alle", pl: "Wszystkie" })}
          </button>
          {instrumentCategories.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${cat === c.id ? "bg-gold text-primary-foreground" : "bg-card border border-border hover:border-gold/50"}`}>
              {tr(lang, CATEGORY_LABELS[c.id] ?? { no: c.label, en: c.label })}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((i) => {
            const img = instrumentImages[i.id];
            return (
            <article key={i.id} className="bg-card/60 border border-border rounded-xl overflow-hidden hover:border-gold/40 transition flex flex-col">
              {img && (
                <a href={img.creditUrl ?? img.url} target="_blank" rel="noopener noreferrer" className="block aspect-[4/3] overflow-hidden bg-black/40 border-b border-border">
                  <SafeImage src={img.url} alt={i.name} loading="lazy" className="size-full object-cover hover:scale-105 transition duration-700" />
                </a>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-2">{tr(lang, CATEGORY_LABELS[i.category] ?? { no: i.category, en: i.category })} {i.yearsProduced && `· ${i.yearsProduced}`}</div>
                <h2 className="font-display text-2xl mb-2">{i.name}</h2>
                {i.manufacturer && <div className="text-xs text-muted-foreground mb-3">{i.manufacturer}</div>}
                <p className="text-sm leading-relaxed mb-3">{i.description}</p>
                <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                  <span className="text-gold">
                    {tr(lang, { no: "Blues-betydning", en: "Blues significance", sv: "Bluesbetydelse", de: "Bedeutung für den Blues", pl: "Znaczenie dla bluesa" })}:
                  </span> {i.bluesSignificance}
                </p>
                {i.famousUsers.length > 0 && (
                  <div>
                    <div className="text-[10px] tracking-[0.2em] text-gold uppercase mb-1.5">
                      {tr(lang, { no: "Kjente brukere", en: "Famous users", sv: "Kända användare", de: "Bekannte Nutzer", pl: "Znani użytkownicy" })}
                    </div>
                    <ul className="text-sm space-y-1">
                      {i.famousUsers.map((u) => (
                        <li key={u.name}>
                          {u.slug ? (
                            <Link to={artistDetailPath(lang, u.slug) as any} className="text-gold hover:underline">{u.name}</Link>
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
                    {tr(lang, { no: "Foto", en: "Photo", sv: "Foto", de: "Foto", pl: "Zdjęcie" })}: {img.creditUrl ? <a href={img.creditUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">{img.credit}</a> : img.credit}
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
