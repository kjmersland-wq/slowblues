import { appendDiscographyEntries, getArtistsWithMbid, mergeSyncData, parseJson, updateDiscography, writeAuditLog } from "./db";
import type { DiscographyEntry, Env, RunSummary } from "./types";

// MusicBrainz mandates: descriptive User-Agent, max 1 request/second.
const UA = "SlowBlues-SyncEngine/1.0 (https://www.slow-blues.com; editor@slow-blues.com)";

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

type MBReleaseGroup = {
  id: string;
  title: string;
  "first-release-date"?: string;
  "primary-type"?: string;
};

async function fetchReleaseGroups(mbid: string): Promise<MBReleaseGroup[]> {
  const url = `https://musicbrainz.org/ws/2/release-group?artist=${mbid}&type=album|ep&limit=100&fmt=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`MusicBrainz ${res.status} for artist ${mbid}`);
  const data = (await res.json()) as { "release-groups"?: MBReleaseGroup[] };
  return data["release-groups"] ?? [];
}

type MBTag = { name: string; count: number };

async function fetchArtistTags(mbid: string): Promise<string[]> {
  const url = `https://musicbrainz.org/ws/2/artist/${mbid}?inc=tags&fmt=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`MusicBrainz ${res.status} (tags) for artist ${mbid}`);
  const data = (await res.json()) as { tags?: MBTag[] };
  return (data.tags ?? []).sort((a, b) => b.count - a.count).map((t) => t.name);
}

/**
 * Deterministic MusicBrainz cross-check: for artists with a stored mbid,
 * fetch official album/EP release-groups and append (never edit/remove) any
 * whose (year, title) isn't already in discography_i18n — this catches
 * releases Discogs' catalog might be missing. Also refreshes a lightweight
 * genre-tag list into sync_data for reference; never touches styles/genres
 * fields an editor may have hand-picked.
 */
export async function runMusicBrainzSync(env: Env): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  const notes: string[] = [];
  let artistsSeen = 0;
  let artistsChanged = 0;

  const artists = await getArtistsWithMbid(env, 8);
  artistsSeen = artists.length;
  notes.push(`${artists.length} artist(s) processed this run (bounded batch, staleness-ordered).`);

  for (const artist of artists) {
    const syncIds = parseJson<{ mbid?: string }>(artist.sync_ids, {});
    const mbid = syncIds.mbid;
    if (!mbid) continue;

    try {
      await sleep(1000); // MusicBrainz: max 1 req/sec
      const groups = await fetchReleaseGroups(mbid);

      const candidateEntries: DiscographyEntry[] = groups
        .filter((g) => g["first-release-date"])
        .map((g) => ({
          year: Number(g["first-release-date"]!.slice(0, 4)),
          title: g.title,
          notes: "Auto-detected via MusicBrainz sync — unreviewed, pending editorial enrichment.",
        }))
        .filter((e) => Number.isFinite(e.year) && e.year > 1900);

      const existing = parseJson<Record<string, DiscographyEntry[]>>(artist.discography_i18n, {});
      const { merged, addedCount } = appendDiscographyEntries(existing, candidateEntries);

      if (addedCount > 0) {
        await updateDiscography(env, artist.id, JSON.stringify(merged));
        await writeAuditLog(env, artist.slug, ["discography_i18n"], `added ${addedCount} new release(s) from MusicBrainz`);
        artistsChanged++;
        notes.push(`${artist.name}: +${addedCount} release(s)`);
      }

      await sleep(1000);
      const tags = await fetchArtistTags(mbid);

      await mergeSyncData(env, artist, {
        last_run: {
          source: "musicbrainz",
          at: new Date().toISOString(),
          summary: `checked ${groups.length} release-groups, added ${addedCount}; tags: ${tags.slice(0, 5).join(", ") || "none"}`,
        },
      });
    } catch (e) {
      errors.push(`${artist.name} (${mbid}): ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return {
    module: "musicbrainz",
    startedAt,
    finishedAt: new Date().toISOString(),
    artistsSeen,
    artistsChanged,
    errors,
    notes,
  };
}
