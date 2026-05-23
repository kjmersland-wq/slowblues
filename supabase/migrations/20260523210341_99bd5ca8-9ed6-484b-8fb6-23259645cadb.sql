CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;

ALTER POLICY "Admins delete edit log" ON public.artist_edit_log
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins insert edit log" ON public.artist_edit_log
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins read edit log" ON public.artist_edit_log
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins delete artist images" ON public.artist_images
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins insert artist images" ON public.artist_images
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins see all artist images" ON public.artist_images
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins update artist images" ON public.artist_images
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins delete qc flags" ON public.artist_qc_flags
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins insert qc flags" ON public.artist_qc_flags
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins see qc flags" ON public.artist_qc_flags
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins update qc flags" ON public.artist_qc_flags
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins delete artists" ON public.artists
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins insert artists" ON public.artists
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins update artists" ON public.artists
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins delete reviews" ON public.blues_reviews
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins insert reviews" ON public.blues_reviews
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins see all reviews" ON public.blues_reviews
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins update reviews" ON public.blues_reviews
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins delete concerts" ON public.concerts
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins insert concerts" ON public.concerts
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins see all concerts" ON public.concerts
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins update concerts" ON public.concerts
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins delete contact" ON public.contact_messages
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins read contact" ON public.contact_messages
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins delete guestbook" ON public.guestbook_entries
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins delete roles" ON public.user_roles
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins insert roles" ON public.user_roles
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins update roles" ON public.user_roles
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Users view own roles" ON public.user_roles
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins delete videos" ON public.youtube_videos
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins insert videos" ON public.youtube_videos
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins see all videos" ON public.youtube_videos
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins update videos" ON public.youtube_videos
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));