-- Expose verified account emails only to the site administrator for manual booking checks.
create or replace function public.admin_review_contacts() returns table(user_id uuid, email text)
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_welly_admin() then
    raise exception 'Administrator access required' using errcode='42501';
  end if;
  return query select distinct u.id, u.email::text from auth.users u
    join public.reviews r on r.user_id=u.id
    where u.email is not null and u.email_confirmed_at is not null;
end $$;
revoke all on function public.admin_review_contacts() from public, anon;
grant execute on function public.admin_review_contacts() to authenticated;
