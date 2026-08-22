-- Formal, classified link store + continuously-growing "Artist Updates"
-- feed + per-artist source network, as specified by the editor for the
-- "ARTIST LINKS -- UTEN DUPLIKATER" standard (2026-08-22).
--
-- These are ADDITIVE side tables, keyed by artist_slug like the other
-- per-artist side tables (artist_images, artist_qc_flags, youtube_videos,
-- artist_edit_log) -- NOT a replacement for the existing rendered fields
-- on `artists` (external_links, article_references, social_links,
-- website_url, facebook_url, booking_info). Those JSON fields remain what
-- the site currently reads and renders. artist_links is the structured,
-- deduplicated, verifiable link store that a future admin UI and the
-- Artist Updates monitor read from; keeping both in sync is an editorial
-- step, not something this migration automates.
--
-- Music/video links are deliberately NOT duplicated into artist_links --
-- the existing youtube_videos table (see schema above) already covers
-- that with its own category/status/verification fields. artist_links
-- covers OFFICIAL, BIOGRAPHY, BLUES, CONCERT, FESTIVAL, BOOKING, NEWS,
-- REFERENCE and SOCIAL link types; MUSIC/YOUTUBE stays in youtube_videos.

-- =========================================================
-- ARTIST LINKS (classified, verifiable external links)
-- =========================================================
CREATE TABLE artist_links (
  id            TEXT PRIMARY KEY,
  artist_slug   TEXT NOT NULL,
  url           TEXT NOT NULL,
  title         TEXT NOT NULL,
  link_type     TEXT NOT NULL CHECK (link_type IN
                  ('OFFICIAL','BIOGRAPHY','BLUES','CONCERT','FESTIVAL',
                   'BOOKING','NEWS','REFERENCE','SOCIAL')),
  domain        TEXT,
  active        INTEGER NOT NULL DEFAULT 1,
  date_added    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_verified TEXT,
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (artist_slug, url)
);

CREATE INDEX idx_artist_links_slug   ON artist_links(artist_slug);
CREATE INDEX idx_artist_links_type   ON artist_links(artist_slug, link_type);
CREATE INDEX idx_artist_links_active ON artist_links(active);

CREATE TRIGGER trg_artist_links_updated_at
  AFTER UPDATE ON artist_links
  FOR EACH ROW
  BEGIN
    UPDATE artist_links SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =========================================================
-- ARTIST SOURCES (source network the Artist Updates monitor checks)
-- =========================================================
CREATE TABLE artist_sources (
  id           TEXT PRIMARY KEY,
  artist_slug  TEXT NOT NULL,
  source_url   TEXT NOT NULL,
  source_type  TEXT NOT NULL CHECK (source_type IN
                 ('official_website','youtube','facebook','instagram','x',
                  'label','management','booking_agency','festival','venue',
                  'blues_publication','blues_organisation',
                  'music_publication','other')),
  label        TEXT,
  active       INTEGER NOT NULL DEFAULT 1,
  last_checked TEXT,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (artist_slug, source_url)
);

CREATE INDEX idx_artist_sources_slug ON artist_sources(artist_slug);

CREATE TRIGGER trg_artist_sources_updated_at
  AFTER UPDATE ON artist_sources
  FOR EACH ROW
  BEGIN
    UPDATE artist_sources SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =========================================================
-- ARTIST UPDATES (continuously-growing, searchable update feed)
-- Deduped on (artist_slug, source_url, title) -- an ingestion step must
-- check for an existing row with the same triple before inserting.
-- =========================================================
CREATE TABLE artist_updates (
  id           TEXT PRIMARY KEY,
  artist_slug  TEXT NOT NULL,
  update_type  TEXT NOT NULL CHECK (update_type IN
                 ('new_song','new_album','new_video','concert','festival',
                  'interview','award','news','member_change','tour',
                  'career','other')),
  title        TEXT NOT NULL,
  description  TEXT,
  source_url   TEXT NOT NULL,
  youtube_id   TEXT,
  image_url    TEXT,
  event_date   TEXT,
  published_at TEXT,
  status       TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (artist_slug, source_url, title)
);

CREATE INDEX idx_artist_updates_slug ON artist_updates(artist_slug, published_at DESC);
CREATE INDEX idx_artist_updates_type ON artist_updates(artist_slug, update_type);

CREATE TRIGGER trg_artist_updates_updated_at
  AFTER UPDATE ON artist_updates
  FOR EACH ROW
  BEGIN
    UPDATE artist_updates SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
