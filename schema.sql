-- Cloudflare D1 schema for SlowBlues
-- Replaces the Supabase/Postgres schema (see supabase/migrations/ + src/integrations/supabase/types.ts).
--
-- Notes on the Postgres -> SQLite (D1) translation:
--   uuid        -> TEXT   (ids are generated in app code with crypto.randomUUID())
--   text[]      -> TEXT   (stored as a JSON array string, e.g. '["a","b"]')
--   jsonb       -> TEXT   (stored as a JSON string)
--   boolean     -> INTEGER (0/1)
--   timestamptz -> TEXT   (ISO 8601 string, default CURRENT_TIMESTAMP)
--   numeric(3,1)-> REAL
--
-- D1 caps tables at 100 columns. The `artists` table's per-locale rich-JSON
-- fields (family, formative, instruments, anecdotes, collaborators,
-- discography, awards, press_quotes, signature_songs, influences) would need
-- 5 columns each (en/no/sv/de/pl) — 135 columns total, over the limit. Those
-- 5 are folded into one `<field>_i18n` column storing {"en":[...],"no":[...],
-- ...}; the app's read path (parseArtistRow) expands it back into
-- `<field>_en`/`<field>_no`/... on the way out, so nothing above the D1
-- layer has to know about this. See src/integrations/d1/artistRow.ts.
--
-- Row Level Security policies and the Supabase `user_roles` / `has_role()` auth
-- machinery are intentionally NOT ported: admin access is now gated by a single
-- signed-cookie session (see src/lib/adminAuth.server.ts) instead of per-row DB
-- policies, so access control lives in the server function/route layer.

PRAGMA foreign_keys = ON;

-- =========================================================
-- ARTISTS
-- =========================================================
CREATE TABLE artists (
  id                   TEXT PRIMARY KEY,
  slug                 TEXT NOT NULL UNIQUE,
  name                 TEXT NOT NULL,
  alt_name             TEXT,
  tag                  TEXT NOT NULL DEFAULT 'Modern',
  era                  TEXT,
  era_label_en         TEXT,
  era_label_no         TEXT,
  era_label_sv         TEXT,
  era_label_de         TEXT,
  era_label_pl         TEXT,
  region               TEXT,
  country              TEXT,
  base_path            TEXT DEFAULT '/artists',
  route_path           TEXT,
  source_file          TEXT,
  source_region        TEXT,
  img                  TEXT,
  og_image             TEXT,
  image_credit         TEXT,
  gallery_images       TEXT NOT NULL DEFAULT '[]',
  youtube_video_ids    TEXT NOT NULL DEFAULT '[]',
  video_search_query   TEXT,
  short                TEXT,
  short_en             TEXT,
  short_no             TEXT,
  short_sv             TEXT,
  short_de             TEXT,
  short_pl             TEXT,
  biography_en         TEXT,
  biography_no         TEXT,
  biography_sv         TEXT,
  biography_de         TEXT,
  biography_pl         TEXT,
  born                 TEXT,
  died                 TEXT,
  birth_name           TEXT,
  birth_place          TEXT,
  origin               TEXT,
  active_years         TEXT,
  influence_note       TEXT,
  influence_en         TEXT,
  influence_no         TEXT,
  influence_sv         TEXT,
  influence_de         TEXT,
  influence_pl         TEXT,
  bio                  TEXT NOT NULL DEFAULT '[]',
  signature_songs      TEXT NOT NULL DEFAULT '[]',
  signature_songs_i18n TEXT NOT NULL DEFAULT '{}',
  influences           TEXT NOT NULL DEFAULT '[]',
  influences_i18n      TEXT NOT NULL DEFAULT '{}',
  labels               TEXT NOT NULL DEFAULT '[]',
  instruments_simple   TEXT NOT NULL DEFAULT '[]',
  styles               TEXT NOT NULL DEFAULT '[]',
  categories           TEXT NOT NULL DEFAULT '[]',
  search_terms         TEXT NOT NULL DEFAULT '[]',
  legacy               TEXT,
  family               TEXT NOT NULL DEFAULT '[]',
  family_i18n          TEXT NOT NULL DEFAULT '{}',
  formative            TEXT NOT NULL DEFAULT '[]',
  formative_i18n       TEXT NOT NULL DEFAULT '{}',
  instruments          TEXT NOT NULL DEFAULT '[]',
  instruments_i18n     TEXT NOT NULL DEFAULT '{}',
  anecdotes            TEXT NOT NULL DEFAULT '[]',
  anecdotes_i18n       TEXT NOT NULL DEFAULT '{}',
  collaborators        TEXT NOT NULL DEFAULT '[]',
  collaborators_i18n   TEXT NOT NULL DEFAULT '{}',
  videos               TEXT NOT NULL DEFAULT '[]',
  discography          TEXT NOT NULL DEFAULT '[]',
  discography_i18n     TEXT NOT NULL DEFAULT '{}',
  key_recordings       TEXT NOT NULL DEFAULT '[]',
  awards               TEXT NOT NULL DEFAULT '[]',
  awards_i18n          TEXT NOT NULL DEFAULT '{}',
  press_quotes         TEXT NOT NULL DEFAULT '[]',
  press_quotes_i18n    TEXT NOT NULL DEFAULT '{}',
  seo_title_en         TEXT,
  seo_title_no         TEXT,
  seo_title_sv         TEXT,
  seo_title_de         TEXT,
  seo_title_pl         TEXT,
  seo_description_en   TEXT,
  seo_description_no   TEXT,
  seo_description_sv   TEXT,
  seo_description_de   TEXT,
  seo_description_pl   TEXT,
  social_links         TEXT NOT NULL DEFAULT '{}',
  external_links       TEXT NOT NULL DEFAULT '[]',
  article_references   TEXT NOT NULL DEFAULT '[]',
  -- website_url is the SINGLE canonical field for an artist's official
  -- site. Do not write official-website values to social_links.website or
  -- treat sync_data.official_website as authoritative -- that field is
  -- only an unreviewed Wikidata suggestion staged by the sync-worker (see
  -- sync-worker/src/wikidataSync.ts) for an editor to promote here manually.
  website_url          TEXT,
  facebook_url         TEXT,
  link_check           TEXT NOT NULL DEFAULT '{}',
  -- booking_info: single JSON object, NOT i18n (booking facts don't vary
  -- by viewer locale). Tri-state per subfield: key absent = not yet
  -- researched; key present with value null = confirmed "not publicly
  -- documented" (never guess); key present with a string = verified value.
  -- {"booking_agency":"..."|null, "agent_name":"..."|null,
  --  "booking_email":"..."|null, "booking_phone":"..."|null,
  --  "booking_url":"..."|null, "source_url":"...", "note":"..."}
  booking_info          TEXT NOT NULL DEFAULT '{}',
  related_slugs        TEXT NOT NULL DEFAULT '[]',
  sort_order           INTEGER NOT NULL DEFAULT 0,
  created_at           TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- sync_ids: {"mbid":"...", "discogs_artist_id":"...", "wikidata_qid":"..."}
  -- Written by the sync-worker (see /sync-worker) and by the admin Wikidata
  -- import flow. Used to know WHAT to query at MusicBrainz/Discogs — the
  -- worker only ever acts on artists that already have an ID here.
  sync_ids             TEXT NOT NULL DEFAULT '{}',
  -- sync_data: {"official_website":"...", "booking_contact":"...",
  --   "tour_dates_url":"...", "last_run":{"source":"...","at":"...","summary":"..."}}
  sync_data             TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_artists_tag ON artists(tag);
CREATE INDEX idx_artists_sort ON artists(sort_order, name);
CREATE INDEX idx_artists_country ON artists(country);
CREATE INDEX idx_artists_region ON artists(region);
CREATE INDEX idx_artists_era ON artists(era);

-- Only bumps updated_at when an actual content column changes — NOT on
-- link_check/sync_ids/sync_data, which are housekeeping fields written by
-- the sync-worker's health checks and metadata refresh. Those must never
-- make an untouched artist look "recently updated" to the homepage
-- newsticker or /sitemap.xml's <lastmod> (see migrations/0003).
CREATE TRIGGER trg_artists_updated_at
  AFTER UPDATE OF
    slug, name, alt_name, tag, era, era_label_en, era_label_no, era_label_sv, era_label_de, era_label_pl,
    region, country, base_path, route_path, source_file, source_region,
    img, og_image, image_credit, gallery_images, youtube_video_ids, video_search_query,
    short, short_en, short_no, short_sv, short_de, short_pl,
    biography_en, biography_no, biography_sv, biography_de, biography_pl,
    born, died, birth_name, birth_place, origin, active_years,
    influence_note, influence_en, influence_no, influence_sv, influence_de, influence_pl,
    bio, signature_songs, signature_songs_i18n, influences, influences_i18n,
    labels, instruments_simple, styles, categories, search_terms, legacy,
    family, family_i18n, formative, formative_i18n, instruments, instruments_i18n,
    anecdotes, anecdotes_i18n, collaborators, collaborators_i18n, videos,
    discography, discography_i18n, key_recordings, awards, awards_i18n,
    press_quotes, press_quotes_i18n,
    seo_title_en, seo_title_no, seo_title_sv, seo_title_de, seo_title_pl,
    seo_description_en, seo_description_no, seo_description_sv, seo_description_de, seo_description_pl,
    social_links, external_links, article_references, website_url, facebook_url,
    booking_info,
    related_slugs, sort_order
  ON artists
  FOR EACH ROW
  BEGIN
    UPDATE artists SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =========================================================
-- CONCERT REVIEWS (artist-agnostic, many per artist)
-- Distinct from blues_reviews (album reviews) and concerts (event
-- listings, no verdict/quote fields). quote_text holds the original,
-- source-language quote (quote_language records what that language is);
-- quote_text_i18n (added in migration 0007) holds the same quote
-- translated into all 5 site locales, so review excerpts are readable by
-- concert/festival bookers abroad regardless of viewer language -- unlike
-- biography prose, quotes here are deliberately translated, not kept
-- verbatim-only.
-- =========================================================
CREATE TABLE concert_reviews (
  id                TEXT PRIMARY KEY,
  artist_slug       TEXT NOT NULL,
  artist_name       TEXT NOT NULL,
  event_name        TEXT NOT NULL,
  venue             TEXT,
  city              TEXT,
  country           TEXT,
  event_date        TEXT,
  event_year        INTEGER,
  quote_text        TEXT NOT NULL,
  quote_text_i18n   TEXT NOT NULL DEFAULT '{}',
  quote_language    TEXT NOT NULL DEFAULT 'en',
  review_author     TEXT,
  publication_name  TEXT,
  source_url        TEXT,
  status            TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_concert_reviews_artist_slug ON concert_reviews(artist_slug, status, sort_order);

CREATE TRIGGER trg_concert_reviews_updated_at
  AFTER UPDATE ON concert_reviews
  FOR EACH ROW
  BEGIN
    UPDATE concert_reviews SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =========================================================
-- ARTIST EDIT LOG (audit trail for admin edits)
-- =========================================================
CREATE TABLE artist_edit_log (
  id             TEXT PRIMARY KEY,
  artist_slug    TEXT NOT NULL,
  fields_changed TEXT NOT NULL DEFAULT '[]',
  edited_by      TEXT,
  edited_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artist_edit_log_slug_time ON artist_edit_log(artist_slug, edited_at DESC);

-- =========================================================
-- ARTIST IMAGES (verified image mapping)
-- =========================================================
CREATE TABLE artist_images (
  id          TEXT PRIMARY KEY,
  artist_slug TEXT NOT NULL,
  image_url   TEXT NOT NULL,
  source      TEXT NOT NULL CHECK (source IN ('wikimedia', 'unsplash', 'manual', 'archive', 'official', 'pexels', 'pixabay')),
  credit      TEXT,
  credit_url  TEXT,
  is_primary  INTEGER NOT NULL DEFAULT 0,
  verified    INTEGER NOT NULL DEFAULT 0,
  verified_by TEXT,
  verified_at TEXT,
  notes       TEXT,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (artist_slug, image_url)
);

CREATE INDEX idx_artist_images_slug ON artist_images(artist_slug);
CREATE INDEX idx_artist_images_primary ON artist_images(artist_slug, is_primary) WHERE is_primary = 1;

CREATE TRIGGER trg_artist_images_updated_at
  AFTER UPDATE ON artist_images
  FOR EACH ROW
  BEGIN
    UPDATE artist_images SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =========================================================
-- ARTIST QC FLAGS (admin-only quality control)
-- =========================================================
CREATE TABLE artist_qc_flags (
  id           TEXT PRIMARY KEY,
  artist_slug  TEXT NOT NULL,
  flag_type    TEXT NOT NULL,
  severity     TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'error')),
  message      TEXT,
  resolved     INTEGER NOT NULL DEFAULT 0,
  resolved_by  TEXT,
  resolved_at  TEXT,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (artist_slug, flag_type)
);

CREATE INDEX idx_artist_qc_flags_slug ON artist_qc_flags(artist_slug);
CREATE INDEX idx_artist_qc_flags_unresolved ON artist_qc_flags(resolved) WHERE resolved = 0;

CREATE TRIGGER trg_artist_qc_flags_updated_at
  AFTER UPDATE ON artist_qc_flags
  FOR EACH ROW
  BEGIN
    UPDATE artist_qc_flags SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =========================================================
-- YOUTUBE VIDEOS
-- =========================================================
CREATE TABLE youtube_videos (
  id                  TEXT PRIMARY KEY,
  artist_slug         TEXT NOT NULL,
  video_id            TEXT NOT NULL,
  title               TEXT,
  description         TEXT,
  category            TEXT NOT NULL DEFAULT 'performance' CHECK (category IN ('album', 'live', 'interview', 'documentary', 'festival', 'performance', 'music_video')),
  channel_id          TEXT,
  channel_title       TEXT,
  is_official_channel INTEGER NOT NULL DEFAULT 0,
  published_at        TEXT,
  duration_seconds    INTEGER,
  view_count          INTEGER,
  thumbnail_url       TEXT,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  sort_order          INTEGER NOT NULL DEFAULT 0,
  added_by            TEXT,
  created_at          TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (artist_slug, video_id)
);

CREATE INDEX idx_youtube_videos_slug ON youtube_videos(artist_slug);
CREATE INDEX idx_youtube_videos_status ON youtube_videos(status);
CREATE INDEX idx_youtube_videos_category ON youtube_videos(artist_slug, category);

CREATE TRIGGER trg_youtube_videos_updated_at
  AFTER UPDATE ON youtube_videos
  FOR EACH ROW
  BEGIN
    UPDATE youtube_videos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =========================================================
-- BLUES REVIEWS
-- =========================================================
CREATE TABLE blues_reviews (
  id                     TEXT PRIMARY KEY,
  slug                   TEXT NOT NULL UNIQUE,
  artist_slug            TEXT,
  artist_name            TEXT NOT NULL,
  album_title            TEXT NOT NULL,
  release_year           INTEGER,
  label                  TEXT,
  blues_style            TEXT,
  cover_image            TEXT,
  cover_credit           TEXT,
  title_en               TEXT,
  title_no               TEXT,
  title_sv               TEXT,
  title_de               TEXT,
  verdict_en             TEXT,
  verdict_no             TEXT,
  verdict_sv             TEXT,
  verdict_de             TEXT,
  body_en                TEXT,
  body_no                TEXT,
  body_sv                TEXT,
  body_de                TEXT,
  score_vocals           REAL,
  score_instrumentation  REAL,
  score_production       REAL,
  score_songwriting      REAL,
  score_atmosphere       REAL,
  total_score            REAL,
  spotify_album_id       TEXT,
  bandcamp_url           TEXT,
  apple_music_url        TEXT,
  youtube_album_url      TEXT,
  youtube_playlist_id    TEXT,
  seo_title_en           TEXT,
  seo_title_no           TEXT,
  seo_title_sv           TEXT,
  seo_title_de           TEXT,
  seo_description_en     TEXT,
  seo_description_no     TEXT,
  seo_description_sv     TEXT,
  seo_description_de     TEXT,
  reviewer               TEXT,
  tracks                 TEXT NOT NULL DEFAULT '[]',
  status                 TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at           TEXT,
  created_at             TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blues_reviews_artist_slug ON blues_reviews(artist_slug);
CREATE INDEX idx_blues_reviews_status ON blues_reviews(status);
CREATE INDEX idx_blues_reviews_published_at ON blues_reviews(published_at DESC);

CREATE TRIGGER trg_blues_reviews_updated_at
  AFTER UPDATE ON blues_reviews
  FOR EACH ROW
  BEGIN
    UPDATE blues_reviews SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =========================================================
-- CONCERTS
-- =========================================================
CREATE TABLE concerts (
  id                   TEXT PRIMARY KEY,
  slug                 TEXT NOT NULL UNIQUE,
  title                TEXT NOT NULL,
  artist_name          TEXT,
  artist_slug          TEXT,
  event_type           TEXT NOT NULL DEFAULT 'concert',
  status               TEXT NOT NULL DEFAULT 'draft',
  venue                TEXT,
  city                 TEXT,
  country              TEXT,
  event_date           TEXT,
  end_date             TEXT,
  ticket_url           TEXT,
  youtube_video_id     TEXT,
  cover_image          TEXT,
  description_en       TEXT,
  description_no       TEXT,
  description_sv       TEXT,
  description_de       TEXT,
  seo_title_en         TEXT,
  seo_description_en   TEXT,
  is_featured          INTEGER NOT NULL DEFAULT 0,
  sort_order           INTEGER NOT NULL DEFAULT 0,
  published_at         TEXT,
  created_at           TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_concerts_status_date ON concerts(status, event_date DESC);
CREATE INDEX idx_concerts_artist_slug ON concerts(artist_slug);

CREATE TRIGGER trg_concerts_updated_at
  AFTER UPDATE ON concerts
  FOR EACH ROW
  BEGIN
    UPDATE concerts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =========================================================
-- CONTACT MESSAGES (private — admin-only read)
-- =========================================================
CREATE TABLE contact_messages (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
  email      TEXT NOT NULL CHECK (length(email) BETWEEN 3 AND 255),
  message    TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 2000),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- =========================================================
-- GUESTBOOK ENTRIES (public read + public insert)
-- =========================================================
CREATE TABLE guestbook_entries (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 60),
  location   TEXT CHECK (location IS NULL OR length(location) <= 80),
  message    TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 800),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guestbook_created_at ON guestbook_entries(created_at DESC);

-- =========================================================
-- NEWS ITEMS (public read)
-- =========================================================
CREATE TABLE news_items (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL DEFAULT '{}',
  summary      TEXT NOT NULL DEFAULT '{}',
  source_url   TEXT NOT NULL UNIQUE,
  source_name  TEXT,
  image_url    TEXT,
  kind         TEXT NOT NULL DEFAULT 'news',
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_items_published ON news_items(published_at DESC);

CREATE TRIGGER trg_news_items_updated_at
  AFTER UPDATE ON news_items
  FOR EACH ROW
  BEGIN
    UPDATE news_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =========================================================
-- TICKER ITEMS (public read of active items)
-- =========================================================
CREATE TABLE ticker_items (
  id           TEXT PRIMARY KEY,
  text         TEXT NOT NULL DEFAULT '{}',
  href         TEXT,
  source       TEXT NOT NULL DEFAULT 'admin',
  pinned       INTEGER NOT NULL DEFAULT 0,
  expires_at   TEXT,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Real RSS <pubDate>, used for sort order instead of fetch time.
  -- Written by sync-worker's rssTicker module (external items only —
  -- internal reviews/artists/concerts are read live, not written here).
  published_at TEXT
);

CREATE INDEX idx_ticker_items_active ON ticker_items(pinned DESC, created_at DESC);

CREATE TRIGGER trg_ticker_items_updated_at
  AFTER UPDATE ON ticker_items
  FOR EACH ROW
  BEGIN
    UPDATE ticker_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
