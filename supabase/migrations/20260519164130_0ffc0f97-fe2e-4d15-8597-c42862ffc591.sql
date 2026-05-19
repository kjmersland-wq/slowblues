-- =========================================================
-- BLUES REVIEWS
-- =========================================================
CREATE TABLE public.blues_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  artist_slug TEXT,
  artist_name TEXT NOT NULL,
  album_title TEXT NOT NULL,
  release_year INTEGER,
  label TEXT,
  blues_style TEXT,
  cover_image TEXT,
  cover_credit TEXT,
  -- Multilingual title/verdict/body
  title_en TEXT,
  title_no TEXT,
  title_sv TEXT,
  title_de TEXT,
  verdict_en TEXT,
  verdict_no TEXT,
  verdict_sv TEXT,
  verdict_de TEXT,
  body_en TEXT,
  body_no TEXT,
  body_sv TEXT,
  body_de TEXT,
  -- Scores (0-10)
  score_vocals NUMERIC(3,1),
  score_instrumentation NUMERIC(3,1),
  score_production NUMERIC(3,1),
  score_songwriting NUMERIC(3,1),
  score_atmosphere NUMERIC(3,1),
  total_score NUMERIC(3,1),
  -- External
  spotify_album_id TEXT,
  bandcamp_url TEXT,
  apple_music_url TEXT,
  youtube_playlist_id TEXT,
  -- SEO
  seo_title_en TEXT,
  seo_title_no TEXT,
  seo_title_sv TEXT,
  seo_title_de TEXT,
  seo_description_en TEXT,
  seo_description_no TEXT,
  seo_description_sv TEXT,
  seo_description_de TEXT,
  -- Editorial
  reviewer TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blues_reviews_artist_slug ON public.blues_reviews(artist_slug);
CREATE INDEX idx_blues_reviews_status ON public.blues_reviews(status);
CREATE INDEX idx_blues_reviews_published_at ON public.blues_reviews(published_at DESC);

ALTER TABLE public.blues_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published reviews are public" ON public.blues_reviews
  FOR SELECT TO public USING (status = 'published');

CREATE POLICY "Admins see all reviews" ON public.blues_reviews
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert reviews" ON public.blues_reviews
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update reviews" ON public.blues_reviews
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete reviews" ON public.blues_reviews
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_blues_reviews_updated_at
  BEFORE UPDATE ON public.blues_reviews
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- ARTIST IMAGES (verified mapping)
-- =========================================================
CREATE TABLE public.artist_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_slug TEXT NOT NULL,
  image_url TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('wikimedia', 'unsplash', 'manual', 'archive', 'official', 'pexels', 'pixabay')),
  credit TEXT,
  credit_url TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (artist_slug, image_url)
);

CREATE INDEX idx_artist_images_slug ON public.artist_images(artist_slug);
CREATE INDEX idx_artist_images_primary ON public.artist_images(artist_slug, is_primary) WHERE is_primary = true;

ALTER TABLE public.artist_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artist images are public" ON public.artist_images
  FOR SELECT TO public USING (verified = true);

CREATE POLICY "Admins see all artist images" ON public.artist_images
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert artist images" ON public.artist_images
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update artist images" ON public.artist_images
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete artist images" ON public.artist_images
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_artist_images_updated_at
  BEFORE UPDATE ON public.artist_images
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- YOUTUBE VIDEOS
-- =========================================================
CREATE TABLE public.youtube_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_slug TEXT NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'performance' CHECK (category IN ('album', 'live', 'interview', 'documentary', 'festival', 'performance', 'music_video')),
  channel_id TEXT,
  channel_title TEXT,
  is_official_channel BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  view_count BIGINT,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  added_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (artist_slug, video_id)
);

CREATE INDEX idx_youtube_videos_slug ON public.youtube_videos(artist_slug);
CREATE INDEX idx_youtube_videos_status ON public.youtube_videos(status);
CREATE INDEX idx_youtube_videos_category ON public.youtube_videos(artist_slug, category);

ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved videos are public" ON public.youtube_videos
  FOR SELECT TO public USING (status = 'approved');

CREATE POLICY "Admins see all videos" ON public.youtube_videos
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert videos" ON public.youtube_videos
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update videos" ON public.youtube_videos
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete videos" ON public.youtube_videos
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_youtube_videos_updated_at
  BEFORE UPDATE ON public.youtube_videos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- ARTIST QC FLAGS (admin-only quality control)
-- =========================================================
CREATE TABLE public.artist_qc_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_slug TEXT NOT NULL,
  flag_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'error')),
  message TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (artist_slug, flag_type)
);

CREATE INDEX idx_artist_qc_flags_slug ON public.artist_qc_flags(artist_slug);
CREATE INDEX idx_artist_qc_flags_unresolved ON public.artist_qc_flags(resolved) WHERE resolved = false;

ALTER TABLE public.artist_qc_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins see qc flags" ON public.artist_qc_flags
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert qc flags" ON public.artist_qc_flags
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update qc flags" ON public.artist_qc_flags
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete qc flags" ON public.artist_qc_flags
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_artist_qc_flags_updated_at
  BEFORE UPDATE ON public.artist_qc_flags
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();