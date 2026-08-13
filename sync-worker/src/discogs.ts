import { appendDiscographyEntries, getArtistsWithDiscogsId, mergeSyncData, parseJson, updateDiscography, writeAuditLog } from "./db";
import type { DiscographyEntry, Env, RunSummary } from "./types";

const UA = "SlowBlues-SyncEngine/1.0 (+https://www.slow-blues.com)";

function headers(env: Env): HeadersInit {
  const h: Record<string, string> = { "User-Agent": UA };
  if (env.DISCOGS_TOKEN) h.Authorization = `Discogs token=${env.DISCOGS_TOKEN}`;
  return h;
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

type DiscogsRelease = {
  id: number;
  title: string;
  year?: number;
  label?: string;
  role: string;
  type: string;
};

async function fetchArtistReleases(env: Env, discogsArtistId: string): Promise<DiscogsRelease[]> {
  const url = `https://api.discogs.com/artists/${discogsArtistId}/releases?sort=year&sort_order=desc&per_page=50`;
  const res = await fetch(url, { headers: headers(env) });
  if (!res.ok) throw new Error(`Discogs ${res.status} for artist ${discogsArtistId}`);
  const data = (await res.json()) as { releases?: DiscogsRelease[] };
  return data.releases ?? [];
}

/**
 * Deterministic Discogs sync: for every artist with a stored discogs_artist_id,
 * fetch their release list and append (never edit/remove) any "Main"-role
 * release whose (year, title) isn't already present in discography_i18n.
 * New entries carry a note flagging them as auto-detected and unreviewed —
 * editorial staff can enrich them with producer/musicians/commentary later,
 * exactly like every other discography row.
 */
export async function runDiscogsSync(env: Env): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  const notes: string[] = [];
  let artistsSeen = 0;
  let artistsChanged = 0;

  const artists = await getArtistsWithDiscogsId(env, 10);
  artistsSeen = artists.length;
  notes.push(`${artists.length} artist(s) processed this run (bounded batch, staleness-ordered).`);

  for (const artist of artists) {
    const syncIds = parseJson<{ discogs_artist_id?: string }>(artist.sync_ids, {});
    const discogsId = syncIds.discogs_artist_id;
    if (!discogsId) continue;

    try {
      const releases = await fetchArtistReleases(env, discogsId);
      const mainReleases = releases.filter((r) => r.role === "Main" && r.year);

      const candidateEntries: DiscographyEntry[] = mainReleases.map((r) => ({
        year: r.year!,
        title: r.title,
        label: r.label || undefined,
        notes: "Auto-detected via Discogs sync — unreviewed, pending editorial enrichment.",
      }));

      const existing = parseJson<Record<string, DiscographyEntry[]>>(artist.discography_i18n, {});
      const { merged, addedCount } = appendDiscographyEntries(existing, candidateEntries);

      if (addedCount > 0) {
        await updateDiscography(env, artist.id, JSON.stringify(merged));
        await writeAuditLog(env, artist.slug, ["discography_i18n"], `added ${addedCount} new release(s) from Discogs`);
        artistsChanged++;
        notes.push(`${artist.name}: +${addedCount} release(s)`);
      }

      await mergeSyncData(env, artist, {
        last_run: { source: "discogs", at: new Date().toISOString(), summary: `checked ${releases.length} releases, added ${addedCount}` },
      });
    } catch (e) {
      errors.push(`${artist.name} (${discogsId}): ${e instanceof Error ? e.message : String(e)}`);
    }

    // Discogs unauthenticated rate limit is 25 req/min (one per 2.4s) —
    // 1.1s spacing wasn't enough and produced 429s in testing.
    await sleep(2600);
  }

  return {
    module: "discogs",
    startedAt,
    finishedAt: new Date().toISOString(),
    artistsSeen,
    artistsChanged,
    errors,
    notes,
  };
}
