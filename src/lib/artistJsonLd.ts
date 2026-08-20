import type { ArtistRecord } from "./artists";
import { artistDetailPath, artistsListPath, type ArtistLocale } from "./locale";

const SITE = "https://www.slow-blues.com";

const BREADCRUMB_LABELS: Record<ArtistLocale, { home: string; artists: string }> = {
  no: { home: "Hjem", artists: "Artister" },
  en: { home: "Home", artists: "Artists" },
  sv: { home: "Hem", artists: "Artister" },
  de: { home: "Startseite", artists: "Künstler" },
  pl: { home: "Strona główna", artists: "Artyści" },
};

// Discography/signature_songs live per-locale (<field>_en, <field>_no, ...)
// once a row has gone through parseArtistRow(). JSON-LD doesn't need to match
// the page's locale, so prefer the requested locale, then fall back through
// en/no (the two locales guaranteed full content by the editorial standard)
// to whichever locale actually has data.
function pickAnyLocale<T>(a: Record<string, any>, field: string, locale: ArtistLocale): T[] {
  for (const l of [locale, "en", "no", "sv", "de", "pl"] as const) {
    const v = a[`${field}_${l}`];
    if (Array.isArray(v) && v.length) return v as T[];
  }
  return [];
}

export function buildArtistJsonLd(a: ArtistRecord, canonicalUrl: string, imageUrl?: string | null, locale: ArtistLocale = "en") {
  const sameAs = Object.values(a.social_links ?? {}).filter(Boolean) as string[];
  if (a.website_url) sameAs.push(a.website_url);
  for (const ex of a.external_links ?? []) if (ex?.url) sameAs.push(ex.url);

  const isBand = /band|brothers|orchestra|combo|trio|quartet|quintet/i.test(a.name);
  const richInstruments = pickAnyLocale<{ name: string }>(a as any, "instruments", locale);
  const knowsAbout = a.instruments_simple?.length
    ? a.instruments_simple
    : Array.from(new Set(richInstruments.map((i) => i.name).filter(Boolean)));
  const personOrGroup: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isBand ? "MusicGroup" : "Person",
    "@id": canonicalUrl,
    name: a.name,
    url: canonicalUrl,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(a.alt_name ? { alternateName: a.alt_name } : {}),
    ...(a.born ? { birthDate: a.born } : {}),
    ...(a.died ? { deathDate: a.died } : {}),
    ...(a.birth_place ? { birthPlace: a.birth_place } : {}),
    ...(a.styles?.length ? { genre: a.styles } : (a as any).tag ? { genre: [(a as any).tag] } : {}),
    ...(knowsAbout.length ? { knowsAbout } : {}),
    ...(sameAs.length ? { sameAs: Array.from(new Set(sameAs)) } : {}),
  };

  const discography = pickAnyLocale<{ title: string; year?: number | string; label?: string }>(a as any, "discography", locale);
  const albums = discography.slice(0, 25).map((d) => ({
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: d.title,
    ...(d.year ? { datePublished: String(d.year) } : {}),
    ...(d.label ? { recordLabel: d.label } : {}),
    byArtist: { "@type": isBand ? "MusicGroup" : "Person", name: a.name },
  }));

  // Some rows store signature_songs as {title,year,note} objects rather than
  // plain strings (see pickLangArray in lib/artists.ts for the same issue on
  // the render path) -- coerce so JSON-LD `name` is always a string.
  const signatureSongsRaw = pickAnyLocale<string | { title?: string; name?: string }>(a as any, "signature_songs", locale);
  const signatureSongs = signatureSongsRaw.map((s) => (typeof s === "string" ? s : s?.title ?? s?.name ?? "")).filter(Boolean);
  const recordings = signatureSongs.slice(0, 20).map((s) => ({
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: s,
    byArtist: { "@type": isBand ? "MusicGroup" : "Person", name: a.name },
  }));

  return [personOrGroup, ...albums, ...recordings];
}

export function buildBreadcrumb(a: ArtistRecord, locale: ArtistLocale) {
  const labels = BREADCRUMB_LABELS[locale] ?? BREADCRUMB_LABELS.en;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: labels.home, item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: labels.artists, item: `${SITE}${artistsListPath(locale)}` },
      { "@type": "ListItem", position: 3, name: a.name, item: `${SITE}${artistDetailPath(locale, a.slug)}` },
    ],
  };
}
