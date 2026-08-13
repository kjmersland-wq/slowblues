export interface Env {
  DB: D1Database;
  // Self-referencing Service Binding — see wrangler.jsonc. Used to dispatch
  // each sync module as its own independent Worker invocation.
  SELF: Fetcher;
  // Optional secrets — set via `wrangler secret put <NAME>` from sync-worker/.
  // Every module that needs one degrades gracefully (skip + log) when absent.
  DISCOGS_TOKEN?: string;
  BANDSINTOWN_APP_ID?: string;
  SONGKICK_API_KEY?: string;
}

export interface SyncIds {
  mbid?: string;
  discogs_artist_id?: string;
  wikidata_qid?: string;
}

export interface SyncData {
  official_website?: string;
  booking_contact?: string;
  tour_dates_url?: string;
  last_run?: {
    source: string;
    at: string;
    summary: string;
  };
}

export interface ArtistRow {
  id: string;
  slug: string;
  name: string;
  died: string | null;
  img: string | null;
  website_url: string | null;
  facebook_url: string | null;
  external_links: string; // JSON array
  article_references: string; // JSON array
  videos: string; // JSON array
  discography_i18n: string; // JSON {en:[...], no:[...]}
  link_check: string; // JSON object
  sync_ids: string; // JSON SyncIds
  sync_data: string; // JSON SyncData
}

export interface DiscographyEntry {
  year: number;
  title: string;
  producer?: string;
  label?: string;
  notes?: string;
  musicians?: Array<{ name: string; instrument: string }>;
  youtube_id?: string;
}

export interface RunSummary {
  module: string;
  startedAt: string;
  finishedAt: string;
  artistsSeen: number;
  artistsChanged: number;
  errors: string[];
  notes: string[];
}
