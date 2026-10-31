-- Only returns the signed-in user's own storage objects.
create or replace function public.account_deletion_objects()
returns table(bucket_id text, name text)
language sql security definer set search_path = ''
as $$
  select o.bucket_id, o.name from storage.objects o
  where o.owner_id = (select auth.uid())::text;
$$;
revoke all on function public.account_deletion_objects() from public, anon;
grant execute on function public.account_deletion_objects() to authenticated;

