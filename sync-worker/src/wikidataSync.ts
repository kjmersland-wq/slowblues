import { getArtistsWithWikidataQid, mergeSyncIdsAndData, parseJson } from "./db";
import type { ArtistRow, Env, RunSummary, SyncData, SyncIds } from "./types";

const UA = "SlowBlues-SyncEngine/1.0 (https://www.slow-blues.com; editor@slow-blues.com)";
const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

type SparqlBinding = Record<string, { type: string; value: string }>;

function buildQuery(qids: string[]): string {
  const values = qids.map((q) => `wd:${q}`).join(" ");
  return `
    SELECT ?item ?website ?mbid ?discogsId
    WHERE {
      VALUES ?item { ${values} }
      OPTIONAL { ?item wdt:P856 ?website. }
      OPTIONAL { ?item wdt:P434 ?mbid. }
      OPTIONAL { ?item wdt:P1953 ?discogsId. }
    }
  `;
}

function qidFromUri(uri: string): string {
  const m = uri.match(/Q\d+$/);
  return m ? m[0] : uri;
}

/**
 * Deterministic Wikidata metadata refresh via SPARQL. Batches artists with a
 * stored wikidata_qid into one query (bounded to 20 per run — see db.ts for
 * why every module caps its batch: D1 writes count against the same
 * per-invocation subrequest budget as fetch() calls, so this only issues
 * ONE write per artist that actually has something new to fill, via
 * mergeSyncIdsAndData, and skips entirely for artists with nothing to add —
 * no bookkeeping write "just because we looked."
 *
 * Only ever FILLS currently-empty fields (official_website, mbid,
 * discogs_artist_id) — an editor who already set/corrected a value is never
 * overwritten, since the worker only writes when the existing field is
 * null/empty.
 */
export async function runWikidataSync(env: Env): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  const notes: string[] = [];
  let artistsSeen = 0;
  let artistsChanged = 0;

  const artists = await getArtistsWithWikidataQid(env, 20);
  artistsSeen = artists.length;
  notes.push(`${artists.length} artist(s) processed this run (bounded batch, staleness-ordered).`);

  if (artists.length === 0) {
    return { module: "wikidata", startedAt, finishedAt: new Date().toISOString(), artistsSeen, artistsChanged, errors, notes };
  }

  const byQid = new Map<string, ArtistRow>();
  for (const a of artists) {
    const qid = parseJson<{ wikidata_qid?: string }>(a.sync_ids, {}).wikidata_qid;
    if (qid) byQid.set(qid, a);
  }

  try {
    const query = buildQuery([...byQid.keys()]);
    const res = await fetch(SPARQL_ENDPOINT, {
      method: "POST",
      headers: {
        "User-Agent": UA,
        Accept: "application/sparql-results+json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `query=${encodeURIComponent(query)}`,
    });
    if (!res.ok) throw new Error(`Wikidata SPARQL ${res.status}`);
    const data = (await res.json()) as { results: { bindings: SparqlBinding[] } };

    for (const row of data.results.bindings) {
      const qid = qidFromUri(row.item?.value ?? "");
      const artist = byQid.get(qid);
      if (!artist) continue;

      const dataPatch: Partial<SyncData> = {};
      if (!artist.website_url && row.website?.value) dataPatch.official_website = row.website.value;

      const existingSyncIds = parseJson<Record<string, unknown>>(artist.sync_ids, {});
      const idPatch: Partial<SyncIds> = {};
      if (!existingSyncIds.mbid && row.mbid?.value) idPatch.mbid = row.mbid.value;
      if (!existingSyncIds.discogs_artist_id && row.discogsId?.value) idPatch.discogs_artist_id = row.discogsId.value;

      const hasChange = Object.keys(dataPatch).length > 0 || Object.keys(idPatch).length > 0;
      dataPatch.last_run = { source: "wikidata", at: new Date().toISOString(), summary: hasChange ? "filled empty field(s)" : "checked, no changes" };

      // Always write last_run for artists actually present in the SPARQL
      // response (so staleness ordering advances), but as ONE combined
      // write — never two — to keep the per-artist subrequest cost at 1.
      await mergeSyncIdsAndData(env, artist, idPatch, dataPatch);
      if (hasChange) {
        artistsChanged++;
        notes.push(`${artist.name}: filled ${[...Object.keys(dataPatch).filter((k) => k !== "last_run"), ...Object.keys(idPatch)].join(", ")}`);
      }
    }
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }

  return {
    module: "wikidata",
    startedAt,
    finishedAt: new Date().toISOString(),
    artistsSeen,
    artistsChanged,
    errors,
    notes,
  };
}
