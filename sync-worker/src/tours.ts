import { getLivingArtists, mergeSyncData } from "./db";
import type { Env, RunSummary } from "./types";

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

type BandsintownEvent = { id: string; datetime: string; url: string };

async function fetchBandsintownEvents(name: string, appId: string): Promise<BandsintownEvent[]> {
  const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(name)}/events?app_id=${encodeURIComponent(appId)}&date=upcoming`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (res.status === 404) return []; // artist not found in their catalog — not an error
  if (!res.ok) throw new Error(`Bandsintown ${res.status} for "${name}"`);
  const data = (await res.json()) as BandsintownEvent[] | { message?: string };
  return Array.isArray(data) ? data : [];
}

type SongkickArtistSearch = { resultsPage: { results: { artist?: { artist: Array<{ id: number; displayName: string }> } } } };

async function findSongkickArtistId(name: string, apiKey: string): Promise<number | null> {
  const url = `https://api.songkick.com/api/3.0/search/artists.json?apikey=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(name)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Songkick search ${res.status} for "${name}"`);
  const data = (await res.json()) as SongkickArtistSearch;
  const hit = data.resultsPage?.results?.artist?.artist?.[0];
  return hit?.id ?? null;
}

/**
 * Tour/booking sync for living artists only. Both Bandsintown and Songkick
 * require an approved API credential — this module is fully implemented but
 * skips (with a clear log note) whenever the relevant secret isn't set. Set
 * DISCOGS_TOKEN/BANDSINTOWN_APP_ID/SONGKICK_API_KEY via
 * `wrangler secret put <NAME>` from sync-worker/ to activate.
 *
 * Only writes tour_dates_url — a dynamic field by definition, safe to
 * overwrite on every run — never touches biography or editorial fields.
 */
export async function runTourSync(env: Env): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  const notes: string[] = [];
  let artistsSeen = 0;
  let artistsChanged = 0;

  if (!env.BANDSINTOWN_APP_ID && !env.SONGKICK_API_KEY) {
    notes.push("Skipped: neither BANDSINTOWN_APP_ID nor SONGKICK_API_KEY is configured. Run `wrangler secret put BANDSINTOWN_APP_ID` (or SONGKICK_API_KEY) from sync-worker/ to activate tour syncing.");
    return { module: "tours", startedAt, finishedAt: new Date().toISOString(), artistsSeen, artistsChanged, errors, notes };
  }

  const artists = await getLivingArtists(env, 10);
  artistsSeen = artists.length;
  notes.push(`${artists.length} living artist(s) checked for tour dates (bounded batch, staleness-ordered).`);

  for (const artist of artists) {
    try {
      let tourUrl: string | undefined;
      let eventCount = 0;

      if (env.BANDSINTOWN_APP_ID) {
        const events = await fetchBandsintownEvents(artist.name, env.BANDSINTOWN_APP_ID);
        eventCount = events.length;
        if (events.length > 0) {
          tourUrl = `https://www.bandsintown.com/a/${encodeURIComponent(artist.name)}`;
        }
        await sleep(600);
      }

      if (!tourUrl && env.SONGKICK_API_KEY) {
        const skId = await findSongkickArtistId(artist.name, env.SONGKICK_API_KEY);
        if (skId) {
          tourUrl = `https://www.songkick.com/artists/${skId}`;
        }
        await sleep(600);
      }

      if (tourUrl) {
        await mergeSyncData(env, artist, {
          tour_dates_url: tourUrl,
          last_run: { source: "tours", at: new Date().toISOString(), summary: `${eventCount} upcoming event(s) found` },
        });
        artistsChanged++;
        notes.push(`${artist.name}: ${eventCount} upcoming event(s) → ${tourUrl}`);
      }
    } catch (e) {
      errors.push(`${artist.name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return {
    module: "tours",
    startedAt,
    finishedAt: new Date().toISOString(),
    artistsSeen,
    artistsChanged,
    errors,
    notes,
  };
}
