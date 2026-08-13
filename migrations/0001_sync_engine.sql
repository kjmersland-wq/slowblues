-- Sync-engine schema migration: adds external-ID and dynamic-data storage
-- used by the scheduled sync-worker. Additive only, and deliberately just
-- 2 new columns (JSON-packed) rather than 7 separate ones: the live
-- artists table already has 95 columns and D1 enforces a 100-column
-- ceiling per table, so we consolidate to leave headroom.
--
-- sync_ids   = {"mbid":"...", "discogs_artist_id":"...", "wikidata_qid":"..."}
-- sync_data  = {"official_website":"...", "booking_contact":"...",
--               "tour_dates_url":"...", "last_run":{"source":"...","at":"...","summary":"..."}}

ALTER TABLE artists ADD COLUMN sync_ids TEXT NOT NULL DEFAULT '{}';
ALTER TABLE artists ADD COLUMN sync_data TEXT NOT NULL DEFAULT '{}';
