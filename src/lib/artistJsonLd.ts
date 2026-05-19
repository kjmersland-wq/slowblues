import type { ArtistRecord } from "./artists";

export function buildArtistJsonLd(a: ArtistRecord, canonicalUrl: string, imageUrl?: string | null) {
  const sameAs = Object.values(a.social_links ?? {}).filter(Boolean) as string[];
  for (const ex of a.external_links ?? []) if (ex?.url) sameAs.push(ex.url);

  const isBand = /band|brothers|orchestra|combo|trio|quartet|quintet/i.test(a.name);
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
    ...(a.styles?.length ? { genre: a.styles } : {}),
    ...(sameAs.length ? { sameAs: Array.from(new Set(sameAs)) } : {}),
  };

  const albums = (a.discography ?? []).slice(0, 25).map((d) => ({
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: d.title,
    ...(d.year ? { datePublished: String(d.year) } : {}),
    ...(d.label ? { recordLabel: d.label } : {}),
    byArtist: { "@type": isBand ? "MusicGroup" : "Person", name: a.name },
  }));

  const recordings = (a.signature_songs ?? []).slice(0, 20).map((s) => ({
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: s,
    byArtist: { "@type": isBand ? "MusicGroup" : "Person", name: a.name },
  }));

  return [personOrGroup, ...albums, ...recordings];
}

export function buildBreadcrumb(a: ArtistRecord, basePath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${basePath}/` },
      { "@type": "ListItem", position: 2, name: "Artists", item: `${basePath}/artists` },
      { "@type": "ListItem", position: 3, name: a.name, item: `${basePath}/artists/${a.slug}` },
    ],
  };
}
