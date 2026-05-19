// Server-only Wikidata client.
// Public API — no key required. Wikidata requires a descriptive User-Agent.
// Docs:
//   https://www.wikidata.org/wiki/Wikidata:Data_access
//   https://www.mediawiki.org/wiki/Wikibase/API
//
// EDITORIAL RULE: This module returns STRUCTURED FACTS ONLY.
// It never returns Wikipedia biography text or descriptions longer than
// Wikidata's one-line "description" field. All long-form prose on SlowBlues
// must be written by the editorial team.

const API = "https://www.wikidata.org/w/api.php";
const UA = "SlowBlues/1.0 (https://sslow-blues.lovable.app; editor@slowblues.no) Wikidata-enrichment";

type Cached<T> = { value: T; expires: number };
const cache = new Map<string, Cached<unknown>>();
const TTL_MS = 24 * 60 * 60 * 1000; // 24h — Wikidata facts change slowly

function getCached<T>(k: string): T | null {
  const hit = cache.get(k);
  if (hit && hit.expires > Date.now()) return hit.value as T;
  cache.delete(k);
  return null;
}
function setCached<T>(k: string, v: T) {
  cache.set(k, { value: v, expires: Date.now() + TTL_MS });
}

async function wdGet<T>(params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams({ ...params, format: "json", origin: "*" });
  const key = qs.toString();
  const cached = getCached<T>(key);
  if (cached) return cached;

  const res = await fetch(`${API}?${qs.toString()}`, {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Wikidata ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as T;
  setCached(key, data);
  return data;
}

// -------- search --------

export type WDSearchHit = {
  qid: string;
  label: string;
  description: string; // one-liner from Wikidata (NOT a biography)
  url: string;
};

type SearchResp = {
  search: Array<{ id: string; label: string; description?: string; concepturi: string }>;
};

export async function searchEntities(query: string, lang = "en", limit = 8): Promise<WDSearchHit[]> {
  const data = await wdGet<SearchResp>({
    action: "wbsearchentities",
    search: query,
    language: lang,
    uselang: lang,
    type: "item",
    limit: String(Math.min(Math.max(limit, 1), 20)),
  });
  return data.search.map((s) => ({
    qid: s.id,
    label: s.label,
    description: s.description ?? "",
    url: s.concepturi,
  }));
}

// -------- entity fetch --------

type ClaimValue = {
  mainsnak: {
    snaktype: string;
    datavalue?: {
      value:
        | string
        | { id: string }
        | { time: string; precision: number }
        | { amount: string };
      type: string;
    };
  };
};

type EntitiesResp = {
  entities: Record<
    string,
    {
      id: string;
      labels?: Record<string, { value: string }>;
      descriptions?: Record<string, { value: string }>;
      claims?: Record<string, ClaimValue[]>;
      sitelinks?: Record<string, { title: string; url?: string }>;
    }
  >;
};

const PROPS = {
  instanceOf: "P31",
  dateOfBirth: "P569",
  dateOfDeath: "P570",
  placeOfBirth: "P19",
  placeOfDeath: "P20",
  countryOfCitizenship: "P27",
  genre: "P136",
  instrument: "P1303",
  occupation: "P106",
  influencedBy: "P737",
  influenced: "P738",
  recordLabel: "P264",
  officialWebsite: "P856",
  image: "P18",
  musicBrainz: "P434",
  discogs: "P1953",
  allMusic: "P1728",
  spotify: "P1902",
  youtubeChannel: "P2397",
} as const;

export type ArtistFacts = {
  qid: string;
  label: string;
  description: string;            // Wikidata one-liner only
  dateOfBirth?: string;           // ISO date
  dateOfDeath?: string;
  placeOfBirth?: { qid: string; label: string };
  countryOfCitizenship?: Array<{ qid: string; label: string }>;
  genres: Array<{ qid: string; label: string }>;
  instruments: Array<{ qid: string; label: string }>;
  occupations: Array<{ qid: string; label: string }>;
  influencedBy: Array<{ qid: string; label: string }>;
  influenced: Array<{ qid: string; label: string }>;
  recordLabels: Array<{ qid: string; label: string }>;
  officialWebsite?: string;
  imageUrl?: string;              // Commons image URL (public domain / CC where applicable)
  externalIds: {
    musicBrainz?: string;
    discogs?: string;
    allMusic?: string;
    spotify?: string;
    youtubeChannel?: string;
  };
  wikidataUrl: string;
  wikipediaUrl?: string;          // reference link only — do not copy text
};

function commonsImageUrl(filename: string): string {
  const f = filename.replace(/ /g, "_");
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=1200`;
}

function parseTime(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  // Wikidata times look like "+1936-07-30T00:00:00Z"
  const m = raw.match(/^[+-]?(\d{1,4})-(\d{2})-(\d{2})/);
  if (!m) return undefined;
  const [, y, mo, d] = m;
  return `${y.padStart(4, "0")}-${mo}-${d}`;
}

function getStringClaim(claims: Record<string, ClaimValue[]> | undefined, prop: string): string | undefined {
  const c = claims?.[prop]?.[0];
  if (!c?.mainsnak.datavalue) return undefined;
  const v = c.mainsnak.datavalue.value;
  return typeof v === "string" ? v : undefined;
}

function getTimeClaim(claims: Record<string, ClaimValue[]> | undefined, prop: string): string | undefined {
  const c = claims?.[prop]?.[0];
  const v = c?.mainsnak.datavalue?.value;
  if (v && typeof v === "object" && "time" in v) return parseTime(v.time);
  return undefined;
}

function getItemClaims(claims: Record<string, ClaimValue[]> | undefined, prop: string): string[] {
  const arr = claims?.[prop] ?? [];
  return arr
    .map((c) => c.mainsnak.datavalue?.value)
    .filter((v): v is { id: string } => !!v && typeof v === "object" && "id" in v)
    .map((v) => v.id);
}

async function resolveLabels(qids: string[], lang = "en"): Promise<Record<string, string>> {
  const unique = Array.from(new Set(qids)).filter(Boolean);
  if (!unique.length) return {};
  const out: Record<string, string> = {};
  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50);
    const data = await wdGet<EntitiesResp>({
      action: "wbgetentities",
      ids: batch.join("|"),
      props: "labels",
      languages: `${lang}|en`,
    });
    for (const id of batch) {
      const e = data.entities[id];
      out[id] = e?.labels?.[lang]?.value ?? e?.labels?.en?.value ?? id;
    }
  }
  return out;
}

export async function getArtistFacts(qid: string, lang = "en"): Promise<ArtistFacts> {
  const data = await wdGet<EntitiesResp>({
    action: "wbgetentities",
    ids: qid,
    props: "labels|descriptions|claims|sitelinks/urls",
    languages: `${lang}|en`,
    sitefilter: `${lang}wiki|enwiki`,
  });
  const e = data.entities[qid];
  if (!e) throw new Error(`Wikidata entity ${qid} not found`);

  const claims = e.claims;
  const itemRefs: string[] = [];

  const placeOfBirthQid = getItemClaims(claims, PROPS.placeOfBirth)[0];
  if (placeOfBirthQid) itemRefs.push(placeOfBirthQid);

  const citizenshipQids = getItemClaims(claims, PROPS.countryOfCitizenship);
  const genreQids = getItemClaims(claims, PROPS.genre);
  const instrumentQids = getItemClaims(claims, PROPS.instrument);
  const occupationQids = getItemClaims(claims, PROPS.occupation);
  const influencedByQids = getItemClaims(claims, PROPS.influencedBy);
  const influencedQids = getItemClaims(claims, PROPS.influenced);
  const labelQids = getItemClaims(claims, PROPS.recordLabel);

  itemRefs.push(
    ...citizenshipQids,
    ...genreQids,
    ...instrumentQids,
    ...occupationQids,
    ...influencedByQids.slice(0, 15),
    ...influencedQids.slice(0, 15),
    ...labelQids
  );

  const labels = await resolveLabels(itemRefs, lang);
  const toLabeled = (ids: string[]) => ids.map((id) => ({ qid: id, label: labels[id] ?? id }));

  const image = getStringClaim(claims, PROPS.image);
  const wikipediaUrl =
    e.sitelinks?.[`${lang}wiki`]?.url ??
    e.sitelinks?.enwiki?.url ??
    (e.sitelinks?.enwiki?.title
      ? `https://en.wikipedia.org/wiki/${encodeURIComponent(e.sitelinks.enwiki.title.replace(/ /g, "_"))}`
      : undefined);

  return {
    qid: e.id,
    label: e.labels?.[lang]?.value ?? e.labels?.en?.value ?? qid,
    description: e.descriptions?.[lang]?.value ?? e.descriptions?.en?.value ?? "",
    dateOfBirth: getTimeClaim(claims, PROPS.dateOfBirth),
    dateOfDeath: getTimeClaim(claims, PROPS.dateOfDeath),
    placeOfBirth: placeOfBirthQid ? { qid: placeOfBirthQid, label: labels[placeOfBirthQid] ?? placeOfBirthQid } : undefined,
    countryOfCitizenship: toLabeled(citizenshipQids),
    genres: toLabeled(genreQids),
    instruments: toLabeled(instrumentQids),
    occupations: toLabeled(occupationQids),
    influencedBy: toLabeled(influencedByQids.slice(0, 15)),
    influenced: toLabeled(influencedQids.slice(0, 15)),
    recordLabels: toLabeled(labelQids),
    officialWebsite: getStringClaim(claims, PROPS.officialWebsite),
    imageUrl: image ? commonsImageUrl(image) : undefined,
    externalIds: {
      musicBrainz: getStringClaim(claims, PROPS.musicBrainz),
      discogs: getStringClaim(claims, PROPS.discogs),
      allMusic: getStringClaim(claims, PROPS.allMusic),
      spotify: getStringClaim(claims, PROPS.spotify),
      youtubeChannel: getStringClaim(claims, PROPS.youtubeChannel),
    },
    wikidataUrl: `https://www.wikidata.org/wiki/${e.id}`,
    wikipediaUrl,
  };
}
