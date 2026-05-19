CREATE TABLE public.concerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  artist_name text,
  artist_slug text,
  event_type text NOT NULL DEFAULT 'concert',
  status text NOT NULL DEFAULT 'draft',
  venue text,
  city text,
  country text,
  event_date date,
  end_date date,
  ticket_url text,
  youtube_video_id text,
  cover_image text,
  description_en text,
  description_no text,
  description_sv text,
  description_de text,
  seo_title_en text,
  seo_description_en text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_concerts_status_date ON public.concerts(status, event_date DESC);
CREATE INDEX idx_concerts_artist_slug ON public.concerts(artist_slug);

ALTER TABLE public.concerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published concerts are public"
  ON public.concerts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins see all concerts"
  ON public.concerts FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert concerts"
  ON public.concerts FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update concerts"
  ON public.concerts FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete concerts"
  ON public.concerts FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_concerts_updated_at
  BEFORE UPDATE ON public.concerts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();