
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-covers', 'review-covers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Review covers are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-covers');

CREATE POLICY "Admins upload review covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'review-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update review covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'review-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete review covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'review-covers' AND public.has_role(auth.uid(), 'admin'));
