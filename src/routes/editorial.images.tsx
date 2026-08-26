import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { UnsplashImage } from "@/components/UnsplashImage";
import { searchUnsplash, trackUnsplashDownload, type UnsplashPhoto } from "@/lib/unsplash.functions";
import { searchPexelsPhotos, searchPixabayPhotos, type PexelsPhoto, type PixabayPhoto } from "@/lib/stockphotos.functions";
import { IMG } from "@/data/images";
import { Search, Loader2, Copy, Check, ExternalLink } from "lucide-react";
import { useI18n, tr } from "@/i18n";

export const Route = createFileRoute("/editorial/images")({
  component: ImagesPage,
  head: () => ({
    meta: [
      { title: "Editorial Images — SlowBlues" },
      { name: "description", content: "Search Unsplash, Pexels and Pixabay for editorial photography — heroes, atmospherics, portraits — with attribution-ready markup." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const PRESETS = ["blues guitar", "smoky bar stage", "harmonica close up", "vinyl record", "jazz club new orleans", "delta mississippi", "concert crowd silhouette", "vintage microphone"] as const;

type Source = "unsplash" | "pexels" | "pixabay";
type Orient = "landscape" | "portrait" | "square";

function ImagesPage() {
  const [source, setSource] = useState<Source>("unsplash");
  const [query, setQuery] = useState("blues guitar stage");
  const [orient, setOrient] = useState<Orient>("landscape");
  const { lang } = useI18n();

  return (
    <PageShell>
      <PageHero
        eyebrow={tr(lang, { no: "Redaksjonelt", en: "Editorial", sv: "Redaktionellt", de: "Redaktion", pl: "Redakcja" })}
        title={tr(lang, { no: "Bildebibliotek", en: "Image Library", sv: "Bildbibliotek", de: "Bildbibliothek", pl: "Biblioteka zdjęć" })}
        lead={tr(lang, {
          no: "Søk i Unsplash, Pexels og Pixabay side om side. Klikk Bruk på et bilde for å kopiere attribusjonsklar HTML — og registrer bruken hos kilden der det kreves.",
          en: "Search Unsplash, Pexels and Pixabay side by side. Click Use on any photo to copy attribution-ready HTML — and register the use with the source where required.",
          sv: "Sök i Unsplash, Pexels och Pixabay sida vid sida. Klicka på Använd för ett foto för att kopiera attributionsklar HTML — och registrera användningen hos källan där det krävs.",
          de: "Durchsuche Unsplash, Pexels und Pixabay nebeneinander. Klicke bei einem Foto auf Verwenden, um attributionsfertiges HTML zu kopieren — und registriere die Nutzung bei der Quelle, wo erforderlich.",
          pl: "Przeszukuj Unsplash, Pexels i Pixabay jednocześnie. Kliknij Użyj przy zdjęciu, aby skopiować gotowy do atrybucji kod HTML — i zarejestruj wykorzystanie u źródła, gdzie jest to wymagane.",
        })}
        img={IMG.microphone}
      />

      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Source tabs */}
        <div className="flex gap-2 mb-5 border-b border-gold/20">
          {(["unsplash", "pexels", "pixabay"] as Source[]).map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition border-b-2 -mb-px ${
                source === s ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const q = String(fd.get("q") || "").trim();
            if (q) setQuery(q);
          }}
          className="flex flex-col md:flex-row gap-3 mb-5"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={query}
              placeholder={`${tr(lang, { no: "Søk", en: "Search", sv: "Sök", de: "Suchen", pl: "Szukaj" })} ${source}…`}
              className="w-full pl-11 pr-4 py-3 bg-card border border-gold/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
            />
          </div>
          <select
            value={orient}
            onChange={(e) => setOrient(e.target.value as Orient)}
            className="px-4 py-3 bg-card border border-gold/30 rounded-lg text-foreground focus:outline-none focus:border-gold"
          >
            <option value="landscape">{tr(lang, { no: "Liggende", en: "Landscape", sv: "Liggande", de: "Querformat", pl: "Poziomo" })}</option>
            <option value="portrait">{tr(lang, { no: "Stående", en: "Portrait", sv: "Stående", de: "Hochformat", pl: "Pionowo" })}</option>
            <option value="square">{tr(lang, { no: "Kvadratisk", en: "Square", sv: "Kvadratisk", de: "Quadratisch", pl: "Kwadratowo" })}</option>
          </select>
          <button type="submit" className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
            {tr(lang, { no: "Søk", en: "Search", sv: "Sök", de: "Suchen", pl: "Szukaj" })}
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-10">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setQuery(p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                query === p ? "bg-gold text-black border-gold" : "bg-card border-gold/20 text-muted-foreground hover:border-gold/60 hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {source === "unsplash" && <UnsplashResults query={query} orient={orient} />}
        {source === "pexels" && <PexelsResults query={query} orient={orient} />}
        {source === "pixabay" && <PixabayResults query={query} orient={orient} />}
      </section>
    </PageShell>
  );
}

/* ---------------- Unsplash ---------------- */

function UnsplashResults({ query, orient }: { query: string; orient: Orient }) {
  const search = useServerFn(searchUnsplash);
  const track = useServerFn(trackUnsplashDownload);
  const orientation = orient === "square" ? "squarish" : orient;
  const [copied, setCopied] = useState<string | null>(null);

  const { data, isFetching, error } = useQuery({
    queryKey: ["unsplash", query, orientation],
    queryFn: () => search({ data: { query, orientation, perPage: 18 } }),
    enabled: query.length > 0,
    staleTime: 30 * 60 * 1000,
  });

  const use = async (p: UnsplashPhoto) => {
    await track({ data: { downloadLocation: p.links.downloadLocation } });
    const html =
      `<img src="${p.urls.regular}" alt="${esc(p.altDescription ?? p.description ?? "")}" width="${p.width}" height="${p.height}" />\n` +
      `<p>Photo by <a href="${p.user.profileUrl}" target="_blank" rel="noopener noreferrer">${p.user.name}</a> on <a href="${p.links.html}" target="_blank" rel="noopener noreferrer">Unsplash</a></p>`;
    await navigator.clipboard.writeText(html);
    setCopied(p.id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <ResultsShell isFetching={isFetching} error={error} apiError={data?.error} empty={!isFetching && data?.photos.length === 0}>
      {data?.photos.map((p) => (
        <PhotoCard
          key={p.id}
          image={<UnsplashImage photo={p} size="small" className="aspect-[4/3]" />}
          credit={`${p.user.name} · Unsplash`}
          externalUrl={p.links.html}
          copied={copied === p.id}
          onUse={() => use(p)}
        />
      ))}
    </ResultsShell>
  );
}

/* ---------------- Pexels ---------------- */

function PexelsResults({ query, orient }: { query: string; orient: Orient }) {
  const search = useServerFn(searchPexelsPhotos);
  const orientation = orient;
  const [copied, setCopied] = useState<number | null>(null);

  const { data, isFetching, error } = useQuery({
    queryKey: ["pexels", query, orientation],
    queryFn: () => search({ data: { query, orientation, perPage: 18 } }),
    enabled: query.length > 0,
    staleTime: 30 * 60 * 1000,
  });

  const use = async (p: PexelsPhoto) => {
    const html =
      `<img src="${p.src.large}" alt="${esc(p.alt)}" width="${p.width}" height="${p.height}" />\n` +
      `<p>Photo by <a href="${p.photographerUrl}" target="_blank" rel="noopener noreferrer">${p.photographer}</a> on <a href="${p.url}" target="_blank" rel="noopener noreferrer">Pexels</a></p>`;
    await navigator.clipboard.writeText(html);
    setCopied(p.id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <ResultsShell isFetching={isFetching} error={error} apiError={data?.error} empty={!isFetching && data?.photos.length === 0}>
      {data?.photos.map((p) => (
        <PhotoCard
          key={p.id}
          image={
            <figure className="relative overflow-hidden rounded-lg aspect-[4/3]" style={{ backgroundColor: p.avgColor }}>
              <img src={p.src.medium} alt={p.alt} loading="lazy" className="w-full h-full object-cover" />
              <figcaption className="absolute bottom-2 right-2 z-10 rounded bg-black/55 backdrop-blur-sm px-2 py-1 text-[10px] text-white/90">
                Photo by{" "}
                <a href={p.photographerUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {p.photographer}
                </a>{" "}
                on{" "}
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline">
                  Pexels
                </a>
              </figcaption>
            </figure>
          }
          credit={`${p.photographer} · Pexels`}
          externalUrl={p.url}
          copied={copied === p.id}
          onUse={() => use(p)}
        />
      ))}
    </ResultsShell>
  );
}

/* ---------------- Pixabay ---------------- */

function PixabayResults({ query, orient }: { query: string; orient: Orient }) {
  const search = useServerFn(searchPixabayPhotos);
  const orientation = orient === "landscape" ? "horizontal" : orient === "portrait" ? "vertical" : "all";
  const [copied, setCopied] = useState<number | null>(null);

  const { data, isFetching, error } = useQuery({
    queryKey: ["pixabay", query, orientation],
    queryFn: () => search({ data: { query, orientation, perPage: 18 } }),
    enabled: query.length > 0,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const use = async (p: PixabayPhoto) => {
    const html =
      `<img src="${p.large}" alt="${esc(p.tags)}" width="${p.width}" height="${p.height}" />\n` +
      `<p>Image by <a href="${p.userUrl}" target="_blank" rel="noopener noreferrer">${p.user}</a> on <a href="${p.pageUrl}" target="_blank" rel="noopener noreferrer">Pixabay</a></p>`;
    await navigator.clipboard.writeText(html);
    setCopied(p.id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <ResultsShell isFetching={isFetching} error={error} apiError={data?.error} empty={!isFetching && data?.photos.length === 0}>
      {data?.photos.map((p) => (
        <PhotoCard
          key={p.id}
          image={
            <figure className="relative overflow-hidden rounded-lg aspect-[4/3] bg-card">
              <img src={p.webformat} alt={p.tags} loading="lazy" className="w-full h-full object-cover" />
              <figcaption className="absolute bottom-2 right-2 z-10 rounded bg-black/55 backdrop-blur-sm px-2 py-1 text-[10px] text-white/90">
                <a href={p.userUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {p.user}
                </a>{" "}
                ·{" "}
                <a href={p.pageUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  Pixabay
                </a>
              </figcaption>
            </figure>
          }
          credit={`${p.user} · Pixabay`}
          externalUrl={p.pageUrl}
          copied={copied === p.id}
          onUse={() => use(p)}
        />
      ))}
    </ResultsShell>
  );
}

/* ---------------- shared bits ---------------- */

function ResultsShell({
  isFetching,
  error,
  apiError,
  empty,
  children,
}: {
  isFetching: boolean;
  error: unknown;
  apiError: string | null | undefined;
  empty: boolean | undefined;
  children: React.ReactNode;
}) {
  const { lang } = useI18n();
  return (
    <>
      {isFetching && (
        <div className="flex items-center gap-2 text-muted-foreground py-12">
          <Loader2 className="h-4 w-4 animate-spin" /> {tr(lang, { no: "Laster bilder …", en: "Loading photos…", sv: "Läser in bilder …", de: "Fotos werden geladen …", pl: "Wczytywanie zdjęć…" })}
        </div>
      )}
      {error && <p className="text-sm text-red-400 py-6">{tr(lang, { no: "Nettverksfeil — prøv igjen om litt.", en: "Network error — try again shortly.", sv: "Nätverksfel — försök igen om en stund.", de: "Netzwerkfehler — bitte versuchen Sie es in Kürze erneut.", pl: "Błąd sieci — spróbuj ponownie za chwilę." })}</p>}
      {apiError && <p className="text-sm text-amber-400 py-6">{apiError}</p>}
      {empty && <p className="text-muted-foreground py-12">{tr(lang, { no: "Ingen resultater.", en: "No results.", sv: "Inga resultat.", de: "Keine Ergebnisse.", pl: "Brak wyników." })}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
    </>
  );
}

function PhotoCard({
  image,
  credit,
  externalUrl,
  copied,
  onUse,
}: {
  image: React.ReactNode;
  credit: string;
  externalUrl: string;
  copied: boolean;
  onUse: () => void;
}) {
  const { lang } = useI18n();
  return (
    <div className="flex flex-col gap-3">
      {image}
      <div className="flex items-center gap-2">
        <button
          onClick={onUse}
          title={`${tr(lang, { no: "Kopier HTML", en: "Copy HTML", sv: "Kopiera HTML", de: "HTML kopieren", pl: "Kopiuj HTML" })} — credit: ${credit}`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-gold text-black text-sm font-semibold hover:bg-gold/90 transition"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied
            ? tr(lang, { no: "Kopiert", en: "Copied", sv: "Kopierat", de: "Kopiert", pl: "Skopiowano" })
            : tr(lang, { no: "Bruk (kopier HTML)", en: "Use (copy HTML)", sv: "Använd (kopiera HTML)", de: "Verwenden (HTML kopieren)", pl: "Użyj (kopiuj HTML)" })}
        </button>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md border border-gold/30 text-muted-foreground hover:text-gold hover:border-gold transition"
          aria-label={tr(lang, { no: "Åpne kilde", en: "Open source", sv: "Öppna källa", de: "Quelle öffnen", pl: "Otwórz źródło" })}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function esc(s: string) {
  return s.replace(/"/g, "&quot;");
}
