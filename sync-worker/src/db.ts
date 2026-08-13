import type { ArtistRow, DiscographyEntry, Env, SyncData, SyncIds } from "./types";

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

const COLUMNS = `id, slug, name, died, img, website_url, facebook_url, external_links,
            article_references, videos, discography_i18n, link_check, sync_ids, sync_data`;

// Cloudflare Workers cap subrequests (fetch + D1 queries together) per
// invocation at 50 on the default plan. Every list query below is bounded
// and ordered "staleness first" (never-synced artists, then
// longest-since-synced) so each weekly run makes real progress and the
// full 76-artist catalog rotates through over several weeks, without ever
// risking a "too many subrequests" failure mid-run.
export async function getArtistsWithDiscogsId(env: Env, limit: number): Promise<ArtistRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT ${COLUMNS}
     FROM artists
     WHERE json_extract(sync_ids, '$.discogs_artist_id') IS NOT NULL
     ORDER BY json_extract(sync_data, '$.last_run.at') ASC NULLS FIRST, name ASC
     LIMIT ?`
  ).bind(limit).all<ArtistRow>();
  return results ?? [];
}

export async function getArtistsWithMbid(env: Env, limit: number): Promise<ArtistRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT ${COLUMNS}
     FROM artists
     WHERE json_extract(sync_ids, '$.mbid') IS NOT NULL
     ORDER BY json_extract(sync_data, '$.last_run.at') ASC NULLS FIRST, name ASC
     LIMIT ?`
  ).bind(limit).all<ArtistRow>();
  return results ?? [];
}

export async function getArtistsWithWikidataQid(env: Env, limit: number): Promise<ArtistRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT ${COLUMNS}
     FROM artists
     WHERE json_extract(sync_ids, '$.wikidata_qid') IS NOT NULL
     ORDER BY json_extract(sync_data, '$.last_run.at') ASC NULLS FIRST, name ASC
     LIMIT ?`
  ).bind(limit).all<ArtistRow>();
  return results ?? [];
}

export async function getLivingArtists(env: Env, limit: number): Promise<ArtistRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT ${COLUMNS}
     FROM artists
     WHERE died IS NULL OR died = ''
     ORDER BY json_extract(sync_data, '$.last_run.at') ASC NULLS FIRST, name ASC
     LIMIT ?`
  ).bind(limit).all<ArtistRow>();
  return results ?? [];
}

export async function getArtistsForHealthCheck(env: Env, limit: number): Promise<ArtistRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT ${COLUMNS}
     FROM artists
     ORDER BY json_extract(link_check, '$._checked_at') ASC NULLS FIRST, name ASC
     LIMIT ?`
  ).bind(limit).all<ArtistRow>();
  return results ?? [];
}

/**
 * Merges new discography entries into the existing i18n discography object
 * WITHOUT ever touching, reordering, or removing existing entries. Dedup key
 * is (year, normalized title). Only entries whose key doesn't already exist
 * are appended — this is the core guarantee behind "never overwrite editorial
 * content": the worker can only ADD rows, never edit or delete one.
 */
export function appendDiscographyEntries(
  existing: Record<string, DiscographyEntry[]>,
  newEntries: DiscographyEntry[],
  locales: string[] = ["en", "no"]
): { merged: Record<string, DiscographyEntry[]>; addedCount: number } {
  const merged: Record<string, DiscographyEntry[]> = { ...existing };
  let addedCount = 0;

  const keyOf = (e: DiscographyEntry) => `${e.year}::${e.title.trim().toLowerCase()}`;

  for (const locale of locales) {
    const current = Array.isArray(merged[locale]) ? merged[locale] : [];
    const existingKeys = new Set(current.map(keyOf));
    const toAdd = newEntries.filter((e) => !existingKeys.has(keyOf(e)));
    if (toAdd.length > 0) {
      merged[locale] = [...current, ...toAdd];
      if (locale === locales[0]) addedCount = toAdd.length;
    }
  }

  return { merged, addedCount };
}

export async function writeAuditLog(
  env: Env,
  artistSlug: string,
  fieldsChanged: string[],
  summary: string
): Promise<void> {
  if (fieldsChanged.length === 0) return;
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO artist_edit_log (id, artist_slug, fields_changed, edited_by, edited_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
  )
    .bind(id, artistSlug, JSON.stringify(fieldsChanged), `sync-engine: ${summary}`)
    .run();
}

export async function updateDiscography(
  env: Env,
  artistId: string,
  discographyJson: string
): Promise<void> {
  await env.DB.prepare(`UPDATE artists SET discography_i18n = ? WHERE id = ?`)
    .bind(discographyJson, artistId)
    .run();
}

export async function updateLinkCheck(env: Env, artistId: string, linkCheckJson: string): Promise<void> {
  await env.DB.prepare(`UPDATE artists SET link_check = ? WHERE id = ?`).bind(linkCheckJson, artistId).run();
}

export async function mergeSyncData(env: Env, row: ArtistRow, patch: Partial<SyncData>): Promise<void> {
  const current = parseJson<SyncData>(row.sync_data, {});
  const merged: SyncData = { ...current, ...patch };
  await env.DB.prepare(`UPDATE artists SET sync_data = ? WHERE id = ?`)
    .bind(JSON.stringify(merged), row.id)
    .run();
}

export async function mergeSyncIds(env: Env, row: ArtistRow, patch: Partial<SyncIds>): Promise<void> {
  const current = parseJson<SyncIds>(row.sync_ids, {});
  const merged: SyncIds = { ...current, ...patch };
  await env.DB.prepare(`UPDATE artists SET sync_ids = ? WHERE id = ?`)
    .bind(JSON.stringify(merged), row.id)
    .run();
}

/** Single-statement variant that updates sync_ids AND sync_data together —
 * halves the D1 subrequest cost versus calling mergeSyncIds + mergeSyncData
 * separately, which matters once an artist has several fields to fill. */
export async function mergeSyncIdsAndData(
  env: Env,
  row: ArtistRow,
  idPatch: Partial<SyncIds>,
  dataPatch: Partial<SyncData>
): Promise<void> {
  const mergedIds: SyncIds = { ...parseJson<SyncIds>(row.sync_ids, {}), ...idPatch };
  const mergedData: SyncData = { ...parseJson<SyncData>(row.sync_data, {}), ...dataPatch };
  await env.DB.prepare(`UPDATE artists SET sync_ids = ?, sync_data = ? WHERE id = ?`)
    .bind(JSON.stringify(mergedIds), JSON.stringify(mergedData), row.id)
    .run();
}
