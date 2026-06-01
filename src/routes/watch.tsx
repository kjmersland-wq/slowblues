import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { YouTubeGrid } from "@/components/YouTubeEmbed";
import { searchYouTube } from "@/lib/youtube.functions";
import { IMG } from "@/data/images";
import { Search, Loader2, ExternalLink } from "lucide-react";
import { useI18n, tr } from "@/i18n";

export const Route = createFileRoute("/watch")({
  component: WatchPage,
  head: () => ({
    meta: [
      { title: "Watch — Blues on YouTube — SlowBlues" },
      { name: "description", content: "Live performances, interviews, sessions and rare blues footage — curated from YouTube." },
      { property: "og:title", content: "Watch — Blues on YouTube" },
      { property: "og:image", content: IMG.microphone },
    ],
  }),
});

type Preset = { q: string; label: string };
type Category = { key: string; label: { no: string; en: string; sv: string; de: string; pl?: string }; presets: Preset[] };

const CATEGORIES: Category[] = [
  {
    key: "slow",
    label: { no: "Slow blues & sjel", en: "Slow blues & soul", sv: "Slow blues & själ", de: "Slow Blues & Seele" },
    presets: [
      { q: "Slow blues live performance", label: "Slow blues live" },
      { q: "Slow blues jam session", label: "Slow blues jam" },
      { q: "B.B. King The Thrill Is Gone live", label: "B.B. King — Thrill Is Gone" },
      { q: "Gary Moore Still Got The Blues live", label: "Gary Moore — Still Got The Blues" },
      { q: "Etta James I'd Rather Go Blind live", label: "Etta James — I'd Rather Go Blind" },
      { q: "Albert King Born Under a Bad Sign", label: "Albert King — Born Under a Bad Sign" },
    ],
  },
  {
    key: "legends",
    label: { no: "Legender", en: "Legends", sv: "Legender", de: "Legenden" },
    presets: [
      { q: "Muddy Waters live performance", label: "Muddy Waters live" },
      { q: "Howlin Wolf live", label: "Howlin' Wolf live" },
      { q: "John Lee Hooker interview", label: "John Lee Hooker interview" },
      { q: "Buddy Guy live", label: "Buddy Guy live" },
      { q: "Stevie Ray Vaughan Texas Flood live", label: "SRV — Texas Flood" },
      { q: "Eric Clapton Crossroads live", label: "Clapton — Crossroads" },
      { q: "Albert Collins live", label: "Albert Collins live" },
      { q: "Freddie King live", label: "Freddie King live" },
    ],
  },
  {
    key: "modern",
    label: { no: "Moderne mestre", en: "Modern masters", sv: "Moderna mästare", de: "Moderne Meister" },
    presets: [
      { q: "Tedeschi Trucks Band live", label: "Tedeschi Trucks Band" },
      { q: "Susan Tedeschi Derek Trucks", label: "Susan Tedeschi & Derek Trucks" },
      { q: "Joe Bonamassa live", label: "Joe Bonamassa live" },
      { q: "Gary Clark Jr live", label: "Gary Clark Jr" },
      { q: "Christone Kingfish Ingram live", label: "Christone 'Kingfish' Ingram" },
      { q: "Marcus King Band live", label: "Marcus King Band" },
      { q: "Samantha Fish live", label: "Samantha Fish" },
      { q: "Larkin Poe live", label: "Larkin Poe" },
    ],
  },
  {
    key: "acoustic",
    label: { no: "Akustisk & Delta", en: "Acoustic & Delta", sv: "Akustiskt & Delta", de: "Akustisch & Delta" },
    presets: [
      { q: "Robert Johnson Cross Road Blues", label: "Robert Johnson" },
      { q: "Son House Death Letter live", label: "Son House — Death Letter" },
      { q: "Mississippi John Hurt live", label: "Mississippi John Hurt" },
      { q: "Lightnin' Hopkins live", label: "Lightnin' Hopkins" },
      { q: "Skip James Devil Got My Woman", label: "Skip James" },
      { q: "Big Bill Broonzy live", label: "Big Bill Broonzy" },
      { q: "Eric Bibb acoustic blues", label: "Eric Bibb acoustic" },
      { q: "Keb Mo acoustic live", label: "Keb' Mo' acoustic" },
    ],
  },
  {
    key: "interviews",
    label: { no: "Intervjuer & dokumentar", en: "Interviews & documentaries", sv: "Intervjuer & dokumentärer", de: "Interviews & Dokus" },
    presets: [
      { q: "B.B. King interview", label: "B.B. King interview" },
      { q: "Buddy Guy interview", label: "Buddy Guy interview" },
      { q: "Devil at the Crossroads Robert Johnson documentary", label: "Robert Johnson — doc" },
      { q: "Martin Scorsese The Blues documentary", label: "Scorsese — The Blues" },
      { q: "Chicago Blues documentary", label: "Chicago Blues — doc" },
      { q: "Mississippi Delta Blues documentary", label: "Delta Blues — doc" },
    ],
  },
  {
    key: "festivals",
    label: { no: "Festivaler & jam", en: "Festivals & jams", sv: "Festivaler & jam", de: "Festivals & Jams" },
    presets: [
      { q: "Crossroads Guitar Festival blues", label: "Crossroads Festival" },
      { q: "Notodden Blues Festival live", label: "Notodden Blues Festival" },
      { q: "Chicago Blues Festival live", label: "Chicago Blues Festival" },
      { q: "King Biscuit Blues Festival", label: "King Biscuit Festival" },
      { q: "North Sea Jazz blues live", label: "North Sea Jazz — blues" },
      { q: "Montreux Jazz blues live", label: "Montreux — blues" },
    ],
  },
];

function WatchPage() {
  const { lang } = useI18n();
  const search = useServerFn(searchYouTube);
  const [query, setQuery] = useState<string>("Slow blues live performance");

  const { data, isFetching, error } = useQuery({
    queryKey: ["yt-search", query],
    queryFn: () => search({ data: { query, max: 12 } }),
    enabled: query.length > 0,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });

  const quotaError = !!data?.error && /quota|429/i.test(data.error);

  const T = {
    eyebrow: tr(lang, { no: "Se", en: "Watch", pl: "Obejrzyj", sv: "Titta", de: "Sehen" }),
    title: tr(lang, { no: "Blues på YouTube", en: "Blues on YouTube", pl: "Blues na YouTube", sv: "Blues på YouTube", de: "Blues auf YouTube" }),
    lead: tr(lang, {
      no: "Hver video på SlowBlues hentes fra YouTube – det eneste stedet vi stoler på for fulle konserter, intervjuer og de dypeste bluesperlene.",
      en: "Every video on SlowBlues is sourced from YouTube — the only place we trust for full performances, interviews and the deep cuts that keep the music alive.", pl: "Każdy film na SlowBlues pochodzi z YouTube — jedynego miejsca, któremu ufamy w kwestii pełnych wykonań, wywiadów i głębokich utworów, które utrzymują muzykę przy życiu.",
      sv: "Varje video på SlowBlues hämtas från YouTube – den enda plats vi litar på för hela konserter, intervjuer och de djupaste bluespärlorna.",
      de: "Jedes Video auf SlowBlues stammt von YouTube – dem einzigen Ort, dem wir bei kompletten Konzerten, Interviews und tiefen Blues-Schätzen vertrauen.",
    }),
    searchPlaceholder: tr(lang, {
      no: "Søk artister, sanger, festivaler…",
      en: "Search artists, songs, festivals…", pl: "Szukaj artystów, utworów, festiwali…",
      sv: "Sök artister, låtar, festivaler…",
      de: "Künstler, Songs, Festivals suchen…",
    }),
    searchBtn: tr(lang, { no: "Søk YouTube", en: "Search YouTube", pl: "Szukaj na YouTube", sv: "Sök YouTube", de: "YouTube suchen" }),
    loading: tr(lang, { no: "Laster fra YouTube…", en: "Loading from YouTube…", pl: "Ładowanie z YouTube…", sv: "Laddar från YouTube…", de: "Lädt von YouTube…" }),
    unreachable: tr(lang, {
      no: "Får ikke kontakt med YouTube akkurat nå. Prøv igjen om litt.",
      en: "Unable to reach YouTube right now. Try again shortly.", pl: "Nie można teraz dosięgnąć YouTube. Spróbuj ponownie wkrótce.",
      sv: "Når inte YouTube just nu. Försök igen om en stund.",
      de: "YouTube ist gerade nicht erreichbar. Bitte später erneut versuchen.",
    }),
    quotaTitle: tr(lang, {
      no: "Dagens YouTube-søkekvote er brukt opp",
      en: "Today's YouTube search quota has been used up", pl: "Dzisiejszy limit wyszukań na YouTube został wyczerpany",
      sv: "Dagens YouTube-sökkvot är slut",
      de: "Das heutige YouTube-Suchkontingent ist aufgebraucht",
    }),
    quotaDesc: tr(lang, {
      no: "Bruk knappene under – de åpner samme søk direkte på YouTube.",
      en: "Use the buttons below — they open the same search directly on YouTube.", pl: "Użyj poniższych przycisków — otwierają one to samo wyszukiwanie bezpośrednio na YouTube.",
      sv: "Använd knapparna nedan – de öppnar samma sökning direkt på YouTube.",
      de: "Nutze die Schaltflächen unten – sie öffnen die gleiche Suche direkt auf YouTube.",
    }),
    noResults: tr(lang, { no: "Ingen treff for", en: "No results for", pl: "Brak wyników dla", sv: "Inga träffar för", de: "Keine Treffer für" }),
    openOnYouTube: tr(lang, { no: "Åpne på YouTube", en: "Open on YouTube", pl: "Otwórz na YouTube", sv: "Öppna på YouTube", de: "Auf YouTube öffnen" }),
  };

  return (
    <PageShell>
      <PageHero eyebrow={T.eyebrow} title={T.title} lead={T.lead} img={IMG.microphone} />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const q = String(fd.get("q") || "").trim();
            if (q) setQuery(q);
          }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={query}
              placeholder={T.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 bg-card border border-gold/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
            {T.searchBtn}
          </button>
        </form>

        <div className="space-y-6 mb-10">
          {CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <h2 className="text-xs uppercase tracking-[0.18em] text-gold/80 mb-2">{cat.label[lang] ?? cat.label.en}</h2>
              <div className="flex flex-wrap gap-2">
                {cat.presets.map((p) => {
                  const active = query === p.q;
                  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(p.q)}`;
                  return (
                    <div key={p.q} className="inline-flex rounded-full overflow-hidden border border-gold/20">
                      <button
                        onClick={() => setQuery(p.q)}
                        className={`text-xs px-3 py-1.5 transition ${
                          active ? "bg-gold text-black" : "bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p.label}
                      </button>
                      <a
                        href={ytUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={T.openOnYouTube}
                        title={T.openOnYouTube}
                        className="px-2 py-1.5 bg-card/60 text-muted-foreground hover:text-gold hover:bg-card transition border-l border-gold/20"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {isFetching && (
          <div className="flex items-center gap-2 text-muted-foreground py-12">
            <Loader2 className="h-4 w-4 animate-spin" /> {T.loading}
          </div>
        )}

        {error && <p className="text-sm text-red-400 py-6">{T.unreachable}</p>}

        {quotaError && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 my-4">
            <p className="text-sm font-semibold text-amber-300">{T.quotaTitle}</p>
            <p className="text-sm text-amber-200/80 mt-1">{T.quotaDesc}</p>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-gold hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> {T.openOnYouTube}: "{query}"
            </a>
          </div>
        )}

        {data?.error && !quotaError && <p className="text-sm text-amber-400 py-6">{data.error}</p>}

        {data?.videos && data.videos.length > 0 && <YouTubeGrid videos={data.videos} />}

        {data && !isFetching && data.videos.length === 0 && !data.error && (
          <p className="text-muted-foreground py-12">
            {T.noResults} "{query}".
          </p>
        )}
      </section>
    </PageShell>
  );
}
