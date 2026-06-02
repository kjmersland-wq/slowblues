-- 1. Remove broad listing SELECT on storage.objects for public buckets.
DROP POLICY IF EXISTS "Review covers are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Artist images are publicly readable" ON storage.objects;

-- 2. Switch all review-covers admin policies to private.has_role
DROP POLICY IF EXISTS "Admins upload review covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins update review covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete review covers" ON storage.objects;

CREATE POLICY "Admins upload review covers"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-covers' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update review covers"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'review-covers' AND private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'review-covers' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete review covers"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'review-covers' AND private.has_role(auth.uid(), 'admin'::app_role));

-- 3. Drop the publicly callable role-check function. RLS uses private.has_role.
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- 4. Tighten public INSERT policies with length validation
DROP POLICY IF EXISTS "Anyone can send a contact message" ON public.contact_messages;
CREATE POLICY "Anyone can send a contact message"
  ON public.contact_messages FOR INSERT TO public
  WITH CHECK (
    length(name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 320
    AND email LIKE '%_@_%.__%'
    AND length(message) BETWEEN 1 AND 5000
  );

DROP POLICY IF EXISTS "Anyone can sign the guestbook" ON public.guestbook_entries;
CREATE POLICY "Anyone can sign the guestbook"
  ON public.guestbook_entries FOR INSERT TO public
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND (location IS NULL OR length(location) <= 100)
    AND length(message) BETWEEN 1 AND 2000
  );