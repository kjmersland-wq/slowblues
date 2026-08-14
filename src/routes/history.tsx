import { createFileRoute } from "@tanstack/react-router";
import { SafeImage } from "@/components/SafeImage";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { IMG } from "@/data/images";
import { timelineEvents } from "@/data/timeline";

// Local public-domain timeline images (Library of Congress / Wikimedia Commons)
const timelineImages = import.meta.glob("@/assets/timeline/*.jpg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const timelineImageByYear: Record<number, string> = {};
for (const [path, url] of Object.entries(timelineImages)) {
  const match = path.match(/(\d{4})-/);
  if (match) timelineImageByYear[parseInt(match[1], 10)] = url;
}

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({ meta: [
    { title: "History of the Blues — SlowBlues" },
    { name: "description", content: "From Mississippi cotton fields to Chicago's electric clubs — the full story of the blues." },
    { property: "og:title", content: "History of the Blues — SlowBlues" },
    { property: "og:image", content: IMG.cottonField },
  ]}),
});

const CATEGORY_LABELS: Record<string, { no: string; en: string; sv: string; de: string; pl: string }> = {
  origin: { no: "Opphav", en: "Origin", sv: "Ursprung", de: "Ursprung", pl: "Początki" },
  recording: { no: "Innspilling", en: "Recording", sv: "Inspelning", de: "Aufnahme", pl: "Nagranie" },
  migration: { no: "Migrasjon", en: "Migration", sv: "Migration", de: "Migration", pl: "Migracja" },
  artist: { no: "Artist", en: "Artist", sv: "Artist", de: "Künstler", pl: "Artysta" },
  milestone: { no: "Milepæl", en: "Milestone", sv: "Milstolpe", de: "Meilenstein", pl: "Kamień milowy" },
};

const ERAS = [
  { years: "1865 — 1890", title: "Emancipation & the Field Holler", body: "After abolition, African-American workers carry call-and-response work songs, spirituals and African scale memory into the Mississippi Delta. The blues form begins to crystallise as a personal lament rather than a communal song.", img: IMG.cottonField },
  { years: "1903", title: "W.C. Handy hears it on a train", body: "Bandleader W.C. Handy is asleep on a platform in Tutwiler, Mississippi when a ragged guitarist plays slide with a knife and sings about \"goin' where the Southern cross the Dog.\" Handy later calls it \"the weirdest music I had ever heard\" — and the first documented description of a blues song.", img: IMG.delta },
  { years: "1920", title: "First blues record", body: "Mamie Smith's \"Crazy Blues\" on Okeh sells 75,000 copies in its first month and proves there is a vast Black record-buying public. The \"race records\" industry is born overnight.", img: IMG.microphone },
  { years: "1926 — 1932", title: "Country blues on wax", body: "Field-recording teams travel south with portable disc cutters. Blind Lemon Jefferson, Charley Patton, Son House and a young Robert Johnson make the first generation of Delta recordings that we still listen to today.", img: IMG.guitar },
  { years: "1936 — 1937", title: "Robert Johnson sessions", body: "In two short sessions (San Antonio and Dallas) Johnson cuts 29 songs that would become the most influential body of work in the music's history. He dies the next year at 27.", img: IMG.robertJohnson },
  { years: "1940s", title: "The Great Migration plugs in", body: "Hundreds of thousands of Black Mississippians move north to Chicago for factory work and take the Delta blues with them. To be heard over a loud crowd in a South-Side bar, the guitar gets an amplifier.", img: IMG.jukeJoint },
  { years: "1947", title: "Chess Records, Chicago", body: "Two Polish-Jewish immigrant brothers, Leonard and Phil Chess, take over Aristocrat Records and rename it Chess. Over the next two decades they record Muddy Waters, Howlin' Wolf, Little Walter, Sonny Boy Williamson II, Bo Diddley, Chuck Berry, Etta James and dozens more.", img: IMG.chessRecords },
  { years: "1958", title: "Muddy shocks Britain", body: "Muddy Waters tours Britain with a Telecaster turned up loud. Folk critics are appalled, but a generation of teenagers — including the future Rolling Stones, Yardbirds and Cream — never recovers.", img: IMG.amp },
  { years: "1962 — 1969", title: "British invasion of the blues", body: "The Stones (named after a Muddy song), John Mayall's Bluesbreakers, Cream, Fleetwood Mac, Led Zeppelin — British rock is essentially Chicago blues louder and longer. Many of the original Chess artists tour Europe for the first time.", img: IMG.stage },
  { years: "1980s — today", title: "Living tradition", body: "Stevie Ray Vaughan, Robert Cray, Bonnie Raitt and Buddy Guy keep the music in arenas. A new generation — Gary Clark Jr., Larkin Poe, Christone \"Kingfish\" Ingram, Joanne Shaw Taylor — proves the blues is not a museum piece.", img: IMG.crowd },
];

function HistoryPage() {
  const { t, lang } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.history.eyebrow} title={t.pages.history.title} lead={t.pages.history.lead} img={IMG.cottonField} />
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-16">
          {ERAS.map((e, i) => (
            <article key={e.years} className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 ? "md:[direction:rtl]" : ""}`}>
              <div className="md:[direction:ltr]">
                <div className="text-xs tracking-[0.25em] text-gold uppercase mb-2">{e.years}</div>
                <h2 className="font-display text-3xl mb-3">{e.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{e.body}</p>
              </div>
              <div className="md:[direction:ltr] aspect-[4/3] rounded-lg overflow-hidden border border-border">
                <SafeImage src={e.img} alt={e.title} loading="lazy" className="size-full object-cover" />
              </div>
            </article>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-16">{t.common.photoBy}: Library of Congress / Wikimedia Commons · {t.common.publicDomain} & Unsplash</p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <header className="mb-10 text-center">
          <div className="text-xs tracking-[0.25em] text-gold uppercase mb-2">
            {tr(lang, { no: "År for år", en: "Year by year", sv: "År för år", de: "Jahr für Jahr", pl: "Rok po roku" })}
          </div>
          <h2 className="font-display text-3xl md:text-4xl">
            {tr(lang, { no: "Detaljert tidslinje · 1865 — 2025", en: "Detailed Timeline · 1865 — 2025", sv: "Detaljerad tidslinje · 1865 — 2025", de: "Detaillierte Zeitleiste · 1865 — 2025", pl: "Szczegółowa oś czasu · 1865 — 2025" })}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            {tr(lang, {
              no: "Hver dokumenterte milepæl i musikkens historie — fra frigjøringen til dagens nye generasjon.",
              en: "Every documented milestone in the music's history — from emancipation to today's new generation.",
              sv: "Varje dokumenterad milstolpe i musikens historia — från frigörelsen till dagens nya generation.",
              de: "Jeder dokumentierte Meilenstein in der Geschichte der Musik — von der Emanzipation bis zur heutigen neuen Generation.",
              pl: "Każdy udokumentowany kamień milowy w historii tej muzyki — od zniesienia niewolnictwa po dzisiejsze nowe pokolenie.",
            })}
          </p>
        </header>

        <ol className="space-y-6">
          {timelineEvents.map((ev) => {
            const img = timelineImageByYear[ev.year];
            const evTitle = lang === "no" ? ev.titleNo : lang === "sv" ? ev.titleSv : lang === "de" ? ev.titleDe : lang === "pl" ? ev.titlePl : ev.title;
            const evDescription = lang === "no" ? ev.descriptionNo : lang === "sv" ? ev.descriptionSv : lang === "de" ? ev.descriptionDe : lang === "pl" ? ev.descriptionPl : ev.description;
            return (
              <li key={ev.year} className="bg-card/60 border border-border rounded-lg overflow-hidden grid md:grid-cols-[200px_1fr] gap-0">
                {img ? (
                  <div className="aspect-[4/3] md:aspect-auto md:h-full overflow-hidden bg-card border-b md:border-b-0 md:border-r border-border">
                    <SafeImage src={img} alt={evTitle} loading="lazy" className="size-full object-cover" />
                  </div>
                ) : (
                  <div className="hidden md:flex items-center justify-center bg-card border-r border-border">
                    <span className="font-display text-4xl text-gold">{ev.year}</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-display text-2xl text-gold">{ev.year}</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{tr(lang, CATEGORY_LABELS[ev.category])}</span>
                  </div>
                  <h3 className="font-display text-xl">{evTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{evDescription}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </PageShell>
  );
}
