import type { ArtistLocale } from "./locale";

// Listing-page copy. The profile count is ALWAYS passed in from the live
// `artists` table (fetchArtistStats) -- never hardcode a number here.
const COPY: Record<ArtistLocale, { title: string; eyebrow: (n: number) => string; lead: (n: number) => string }> = {
  no: {
    title: "Artister",
    eyebrow: (n) => `${n}+ profiler`,
    lead: (n) => `${n}+ bluesartist-profiler — pionerene, mestrene og dagens stemmer.`,
  },
  en: {
    title: "Artists",
    eyebrow: (n) => `${n}+ profiles`,
    lead: (n) => `${n}+ blues artist profiles — pioneers, masters and today's voices.`,
  },
  sv: {
    title: "Artister",
    eyebrow: (n) => `${n}+ profiler`,
    lead: (n) => `${n}+ artistprofiler — pionjärerna, mästarna och dagens röster.`,
  },
  de: {
    title: "Künstler",
    eyebrow: (n) => `${n}+ Profile`,
    lead: (n) => `${n}+ Blues-Künstlerprofile — Pioniere, Meister und heutige Stimmen.`,
  },
  pl: {
    title: "Artyści",
    eyebrow: (n) => `${n}+ profili`,
    lead: (n) => `${n}+ profili bluesmanów — pionierzy, mistrzowie i głosy dnia dzisiejszego.`,
  },
};

export function artistListCopy(locale: ArtistLocale, count: number) {
  const c = COPY[locale];
  // count === 0 only when the DB call failed -- drop the number rather than print "0+".
  const n = count > 0 ? count : 0;
  return {
    title: c.title,
    eyebrow: n ? c.eyebrow(n) : "Hall of Fame",
    lead: n ? c.lead(n) : c.lead(0).replace(/^0\+\s*/, ""),
  };
}

// schema.org ItemList for an artist archive page.
export function buildArtistItemList(
  site: string,
  artists: Array<{ slug: string; name: string }>,
  pathFor: (slug: string) => string,
  name: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: artists.length,
    itemListElement: artists.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site}${pathFor(a.slug)}`,
      name: a.name,
    })),
  };
}
