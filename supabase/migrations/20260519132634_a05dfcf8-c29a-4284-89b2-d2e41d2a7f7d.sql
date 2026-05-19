
CREATE TABLE public.artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  alt_name text,
  tag text NOT NULL DEFAULT 'Modern',
  era text,
  region text,
  img text,
  short text,
  born text,
  died text,
  origin text,
  active_years text,
  influence_note text,
  bio text[] NOT NULL DEFAULT '{}',
  signature_songs text[] NOT NULL DEFAULT '{}',
  influences text[] NOT NULL DEFAULT '{}',
  labels text[] NOT NULL DEFAULT '{}',
  instruments_simple text[] NOT NULL DEFAULT '{}',
  legacy text,
  family jsonb NOT NULL DEFAULT '[]'::jsonb,
  formative jsonb NOT NULL DEFAULT '[]'::jsonb,
  instruments jsonb NOT NULL DEFAULT '[]'::jsonb,
  anecdotes jsonb NOT NULL DEFAULT '[]'::jsonb,
  collaborators jsonb NOT NULL DEFAULT '[]'::jsonb,
  videos jsonb NOT NULL DEFAULT '[]'::jsonb,
  discography jsonb NOT NULL DEFAULT '[]'::jsonb,
  awards jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_slugs text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_artists_tag ON public.artists(tag);
CREATE INDEX idx_artists_sort ON public.artists(sort_order, name);

ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artists are public to read"
  ON public.artists FOR SELECT
  USING (true);

CREATE POLICY "Admins insert artists"
  ON public.artists FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update artists"
  ON public.artists FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete artists"
  ON public.artists FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER artists_set_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();
