CREATE TABLE public.artist_edit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_slug text NOT NULL,
  fields_changed text[] NOT NULL DEFAULT '{}',
  edited_by uuid,
  edited_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_artist_edit_log_slug_time ON public.artist_edit_log (artist_slug, edited_at DESC);

ALTER TABLE public.artist_edit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read edit log" ON public.artist_edit_log
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert edit log" ON public.artist_edit_log
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete edit log" ON public.artist_edit_log
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));