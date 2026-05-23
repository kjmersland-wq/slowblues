ALTER TABLE public.blues_reviews
  ADD COLUMN IF NOT EXISTS tracks jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS youtube_album_url text;