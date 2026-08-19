-- Adds a canonical booking-contact field and a dedicated concert/festival
-- reviews table, and consolidates the official-website value.
--
-- Official website previously lived in up to 3 places: the unused
-- artists.website_url column, social_links.website (written only by the
-- admin "Fullfor fra kilder" Wikidata enrichment step), and
-- sync_data.official_website (an unreviewed suggestion staged by the
-- sync-worker, never read anywhere). Going forward artists.website_url is
-- the single canonical field an editor confirms and the site reads from.
-- This migration backfills it from social_links.website where empty; it
-- deliberately does not strip social_links.website in the same pass, so
-- artistJsonLd.ts's sameAs builder (which already reads social_links) keeps
-- working until the code change that also reads website_url is deployed.
--
-- booking_info is a single JSON object (NOT i18n -- booking facts don't
-- vary by viewer locale). Tri-state per subfield: key absent = not yet
-- researched; key present with value null = confirmed not publicly
-- documented (never guess); key present with a string = verified value.
-- Shape: {"booking_agency":"..."|null, "agent_name":"..."|null,
--   "booking_email":"..."|null, "booking_phone":"..."|null,
--   "booking_url":"..."|null, "source_url":"...", "note":"..."}

ALTER TABLE artists ADD COLUMN booking_info TEXT NOT NULL DEFAULT '{}';

UPDATE artists
SET website_url = json_extract(social_links, '$.website')
WHERE website_url IS NULL
  AND json_extract(social_links, '$.website') IS NOT NULL
  AND json_extract(social_links, '$.website') != '';

-- SQLite has no ALTER TRIGGER -- drop and recreate (same technique as 0003)
-- to add booking_info to the content-column list so edits to it bump
-- updated_at like every other real content field.
DROP TRIGGER trg_artists_updated_at;

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
-- listings, no verdict/quote fields). quote_text/quote_language are
-- deliberately NOT i18n: a review's language belongs to its source
-- publication, not the site visitor's locale, matching the site rule that
-- direct quotes are always kept verbatim in their original language.
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
