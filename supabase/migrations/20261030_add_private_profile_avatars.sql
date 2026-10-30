insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('welly-avatars','welly-avatars',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "avatar owner upload" on storage.objects for insert to authenticated
with check (bucket_id = 'welly-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatar owner read" on storage.objects for select to authenticated
using (bucket_id = 'welly-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
