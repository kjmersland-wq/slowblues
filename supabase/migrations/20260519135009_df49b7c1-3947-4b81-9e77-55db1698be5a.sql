
ALTER TABLE public.artists
  ADD COLUMN IF NOT EXISTS birth_name text,
  ADD COLUMN IF NOT EXISTS birth_place text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS base_path text DEFAULT '/artists',
  ADD COLUMN IF NOT EXISTS route_path text,
  ADD COLUMN IF NOT EXISTS source_file text,
  ADD COLUMN IF NOT EXISTS source_region text,

  ADD COLUMN IF NOT EXISTS biography_en text,
  ADD COLUMN IF NOT EXISTS biography_no text,
  ADD COLUMN IF NOT EXISTS biography_sv text,
  ADD COLUMN IF NOT EXISTS biography_de text,

  ADD COLUMN IF NOT EXISTS short_en text,
  ADD COLUMN IF NOT EXISTS short_no text,
  ADD COLUMN IF NOT EXISTS short_sv text,

  ADD COLUMN IF NOT EXISTS influence_en text,
  ADD COLUMN IF NOT EXISTS influence_no text,
  ADD COLUMN IF NOT EXISTS influence_sv text,

  ADD COLUMN IF NOT EXISTS era_label_en text,
  ADD COLUMN IF NOT EXISTS era_label_no text,
  ADD COLUMN IF NOT EXISTS era_label_sv text,

  ADD COLUMN IF NOT EXISTS seo_title_en text,
  ADD COLUMN IF NOT EXISTS seo_title_no text,
  ADD COLUMN IF NOT EXISTS seo_title_sv text,
  ADD COLUMN IF NOT EXISTS seo_description_en text,
  ADD COLUMN IF NOT EXISTS seo_description_no text,
  ADD COLUMN IF NOT EXISTS seo_description_sv text,

  ADD COLUMN IF NOT EXISTS og_image text,
  ADD COLUMN IF NOT EXISTS gallery_images text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS image_credit text,
  ADD COLUMN IF NOT EXISTS youtube_video_ids text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS video_search_query text,

  ADD COLUMN IF NOT EXISTS social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS external_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS article_references jsonb NOT NULL DEFAULT '[]'::jsonb,

  ADD COLUMN IF NOT EXISTS styles text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS categories text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS search_terms text[] NOT NULL DEFAULT '{}',

  ADD COLUMN IF NOT EXISTS family_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS family_no jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS formative_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS formative_no jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS formative_de jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS anecdotes_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS anecdotes_no jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS instruments_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS collaborators_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS key_recordings jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS artists_country_idx ON public.artists (country);
CREATE INDEX IF NOT EXISTS artists_region_idx ON public.artists (region);
CREATE INDEX IF NOT EXISTS artists_era_idx ON public.artists (era);
CREATE INDEX IF NOT EXISTS artists_slug_unique_idx ON public.artists (slug);
