-- Fixes a real bug: the old trigger bumped artists.updated_at on ANY
-- column write, including sync-worker's housekeeping-only columns
-- (link_check, sync_ids, sync_data). That made healthcheck runs make
-- untouched artists (e.g. Eric Clapton, Elmore James) look "recently
-- updated" -- polluting both the homepage newsticker's "recently updated
-- artists" section (crowding out genuine news with recycled non-news) and
-- /sitemap.xml's <lastmod> (falsely signaling content changes to search
-- engines).
--
-- Fix: use SQLite's "UPDATE OF <columns>" trigger clause so updated_at
-- only bumps when a write touches an actual content column. Housekeeping
-- writes that touch ONLY link_check/sync_ids/sync_data no longer fire it.
-- Every other write path (admin edits, seed.sql, artist-profile scripts)
-- is unaffected -- this only narrows an over-broad trigger, nothing else
-- changes.

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
    related_slugs, sort_order
  ON artists
  FOR EACH ROW
  BEGIN
    UPDATE artists SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
