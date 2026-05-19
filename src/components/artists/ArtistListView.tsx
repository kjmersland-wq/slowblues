import { Link } from "@tanstack/react-router";
import { SafeImage } from "@/components/SafeImage";
import { useArtists, pickLang, type Lang } from "@/lib/artists";
import { resolveArtistImage } from "@/lib/artistImageMap";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  artistDetailPath, artistsListPath,
  SUPPORTED_LOCALES, localeLabel, type ArtistLocale,
} from "@/lib/locale";

const T = {
  no: { search: "Søk artister…", all: "Alle", region: "Region", country: "Land", genre: "Sjanger", era: "Epoke", language: "Språk", showing: "av", artists: "artister", noMatch: "Ingen artister matcher filteret.", clear: "Nullstill" },
  en: { search: "Search artists…", all: "All", region: "Region", country: "Country", genre: "Genre", era: "Era", language: "Language", showing: "of", artists: "artists", noMatch: "No artists match your filter.", clear: "Clear" },
  sv: { search: "Sök artister…", all: "Alla", region: "Region", country: "Land", genre: "Genre", era: "Era", language: "Språk", showing: "av", artists: "artister", noMatch: "Inga artister matchar filtret.", clear: "Rensa" },
  de: { search: "Künstler suchen…", all: "Alle", region: "Region", country: "Land", genre: "Genre", era: "Epoche", language: "Sprache", showing: "von", artists: "Künstlern", noMatch: "Keine Künstler entsprechen dem Filter.", clear: "Zurücksetzen" },
} as const;

export function ArtistListView({ locale }: { locale: ArtistLocale }) {
  const lang = locale as Lang;
  const t = T[locale];
  const { data, loading, error } = useArtists();
  const [region, setRegion] = useState("all");
  const [country, setCountry] = useState("all");
  const [genre, setGenre] = useState("all");
  const [era, setEra] = useState("all");
  const [q, setQ] = useState("");

  const facets = useMemo(() => {
    const regions = new Set<string>(), countries = new Set<string>(), genres = new Set<string>(), eras = new Set<string>();
    for (const a of data ?? []) {
      if (a.region) regions.add(a.region);
      if (a.country) countries.add(a.country);
      (a.styles ?? []).forEach((s) => genres.add(s));
      if (a.era) eras.add(a.era);
    }
    return {
      regions: [...regions].sort(),
      countries: [...countries].sort(),
      genres: [...genres].sort(),
      eras: [...eras].sort(),
    };
  }, [data]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter((a) => {
      if (region !== "all" && a.region !== region) return false;
      if (country !== "all" && a.country !== country) return false;
      if (era !== "all" && a.era !== era) return false;
      if (genre !== "all" && !(a.styles ?? []).includes(genre)) return false;
      if (!term) return true;
      return (
        a.name.toLowerCase().includes(term) ||
        (a.search_terms ?? []).some((s) => s.toLowerCase().includes(term)) ||
        (a.birth_place ?? "").toLowerCase().includes(term)
      );
    });
  }, [data, region, country, era, genre, q]);

  const hasFilter = region !== "all" || country !== "all" || era !== "all" || genre !== "all" || q.length > 0;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Language switcher */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground mr-2">{t.language}:</span>
        {SUPPORTED_LOCALES.map((l) => (
          <Link key={l} to={artistsListPath(l)} className={`px-3 py-1 rounded-full text-xs border transition ${l === locale ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground hover:text-gold hover:border-gold/50"}`}>
            {localeLabel(l)}
          </Link>
        ))}
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <label className="flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2 lg:col-span-2">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} className="bg-transparent outline-none text-sm w-full" />
        </label>
        <FacetSelect label={t.region} value={region} onChange={setRegion} options={facets.regions} all={t.all} />
        <FacetSelect label={t.country} value={country} onChange={setCountry} options={facets.countries} all={t.all} />
        <FacetSelect label={t.era} value={era} onChange={setEra} options={facets.eras} all={t.all} />
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <FacetChips value={genre} onChange={setGenre} options={facets.genres.slice(0, 24)} all={t.all} />
        {hasFilter && (
          <button onClick={() => { setRegion("all"); setCountry("all"); setEra("all"); setGenre("all"); setQ(""); }} className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold">
            <X className="size-3" /> {t.clear}
          </button>
        )}
      </div>

      {error && <p className="text-center text-destructive py-8">{error}</p>}
      {loading && !data && <p className="text-center text-muted-foreground py-16">…</p>}
      {data && <p className="text-xs text-muted-foreground mb-4">{filtered.length} {t.showing} {data.length} {t.artists}</p>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((a) => {
          const img = resolveArtistImage(a.img);
          const short = pickLang(a, lang, "short") ?? a.short;
          return (
            <Link key={a.slug} to={artistDetailPath(locale, a.slug)} className="group bg-card/50 border border-border rounded-lg overflow-hidden hover:border-gold/60 transition">
              <div className="aspect-[3/4] overflow-hidden bg-muted/20">
                {img && <SafeImage src={img} alt={a.name} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />}
              </div>
              <div className="p-4">
                <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-1">{a.country ?? a.region}{a.era && ` · ${a.era}`}</div>
                <h3 className="font-display text-xl mb-1">{a.name}</h3>
                {short && <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{short}</p>}
              </div>
            </Link>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && <p className="text-center text-muted-foreground py-16">{t.noMatch}</p>}
    </section>
  );
}

function FacetSelect({ label, value, onChange, options, all }: { label: string; value: string; onChange: (v: string) => void; options: string[]; all: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-gold/60">
        <option value="all">{all}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function FacetChips({ value, onChange, options, all }: { value: string; onChange: (v: string) => void; options: string[]; all: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={() => onChange("all")} className={`px-2.5 py-1 rounded-full text-xs border transition ${value === "all" ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground hover:text-gold hover:border-gold/50"}`}>{all}</button>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`px-2.5 py-1 rounded-full text-xs border transition ${value === o ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground hover:text-gold hover:border-gold/50"}`}>{o}</button>
      ))}
    </div>
  );
}
