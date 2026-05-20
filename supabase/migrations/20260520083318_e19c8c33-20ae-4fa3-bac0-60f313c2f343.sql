
ALTER TABLE public.artists
  ADD COLUMN IF NOT EXISTS press_quotes jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS facebook_url text,
  ADD COLUMN IF NOT EXISTS link_check jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Backfill website_url and facebook_url from existing social_links jsonb
UPDATE public.artists
SET website_url = COALESCE(website_url, social_links->>'website'),
    facebook_url = COALESCE(facebook_url, social_links->>'facebook')
WHERE social_links ? 'website' OR social_links ? 'facebook';
