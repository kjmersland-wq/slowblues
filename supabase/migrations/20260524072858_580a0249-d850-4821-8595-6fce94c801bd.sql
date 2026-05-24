
insert into storage.buckets (id, name, public)
values ('artist-images', 'artist-images', true)
on conflict (id) do nothing;

create policy "Artist images are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'artist-images');

create policy "Admins upload artist images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'artist-images' and private.has_role(auth.uid(), 'admin'));

create policy "Admins update artist images files"
on storage.objects for update
to authenticated
using (bucket_id = 'artist-images' and private.has_role(auth.uid(), 'admin'));

create policy "Admins delete artist images files"
on storage.objects for delete
to authenticated
using (bucket_id = 'artist-images' and private.has_role(auth.uid(), 'admin'));
