// Schema.org JSON-LD builder for artist pages.
// Wikidata Q-ID is the canonical identifier (sameAs) — search engines use it
// to merge knowledge-graph entries with SlowBlues' editorial pages.

import type { ArtistFacts } from "@/lib/wikidata.functions";

export type ArtistSchemaInput = {
  name: string;
  url: string;                  // canonical SlowBlues URL
  description?: string;         // editorial short — written by SlowBlues, NOT copied from Wikidata
  image?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  nationality?: string[];
  genres?: string[];
  instruments?: string[];
  sameAs?: string[];            // Wikidata, MusicBrainz, Discogs, official site
};

export function buildArtistSchema(input: ArtistSchemaInput): Record<string, unknown> {
  const isDead = !!input.deathDate;
  // MusicGroup for bands isn't decided here — Person works for individual blues artists.
  // If you need MusicGroup, swap "Person" → "MusicGroup" upstream.
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    url: input.url,
  };
  if (input.description) schema.description = input.description;
  if (input.image) schema.image = input.image;
  if (input.birthDate) schema.birthDate = input.birthDate;
  if (isDead) schema.deathDate = input.deathDate;
  if (input.birthPlace) schema.birthPlace = { "@type": "Place", name: input.birthPlace };
  if (input.nationality?.length) schema.nationality = input.nationality;
  if (input.genres?.length) schema.genre = input.genres;
  if (input.instruments?.length) schema.knowsAbout = input.instruments;
  if (input.sameAs?.length) schema.sameAs = input.sameAs.filter(Boolean);
  return schema;
}

/**
 * Convert Wikidata facts → schema.org input, merged with editorial fields.
 * Editorial fields (name, url, description) WIN over Wikidata.
 */
export function mergeFactsToSchema(
  editorial: { name: string; url: string; description?: string; image?: string },
  facts: ArtistFacts | null | undefined
): ArtistSchemaInput {
  if (!facts) return editorial;
  const sameAs: string[] = [facts.wikidataUrl];
  if (facts.wikipediaUrl) sameAs.push(facts.wikipediaUrl);
  if (facts.officialWebsite) sameAs.push(facts.officialWebsite);
  if (facts.externalIds.musicBrainz) sameAs.push(`https://musicbrainz.org/artist/${facts.externalIds.musicBrainz}`);
  if (facts.externalIds.discogs) sameAs.push(`https://www.discogs.com/artist/${facts.externalIds.discogs}`);
  if (facts.externalIds.spotify) sameAs.push(`https://open.spotify.com/artist/${facts.externalIds.spotify}`);
  if (facts.externalIds.youtubeChannel) sameAs.push(`https://www.youtube.com/channel/${facts.externalIds.youtubeChannel}`);

  return {
    ...editorial,
    birthDate: facts.dateOfBirth,
    deathDate: facts.dateOfDeath,
    birthPlace: facts.placeOfBirth?.label,
    nationality: facts.countryOfCitizenship.map((c) => c.label),
    genres: facts.genres.map((g) => g.label),
    instruments: facts.instruments.map((i) => i.label),
    image: editorial.image ?? facts.imageUrl,
    sameAs,
  };
}
