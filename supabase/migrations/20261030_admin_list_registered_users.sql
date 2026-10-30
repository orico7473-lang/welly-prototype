create or replace function public.admin_list_users(page_offset integer default 0, page_size integer default 50)
returns table(user_id uuid, email text, phone text, username text, full_name text, created_at timestamptz, last_sign_in_at timestamptz, is_confirmed boolean)
language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null or not public.is_welly_admin() then raise exception 'Administrator access required' using errcode='42501'; end if;
 return query select u.id, u.email::text, u.phone::text, p.username, p.full_name, u.created_at, u.last_sign_in_at, (u.email_confirmed_at is not null or u.phone_confirmed_at is not null)
 from auth.users u left join public.profiles p on p.id=u.id
 order by u.created_at desc, u.id
 limit least(greatest(coalesce(page_size,50),1),100) offset greatest(coalesce(page_offset,0),0);
end $$;
revoke all on function public.admin_list_users(integer,integer) from public, anon;
grant execute on function public.admin_list_users(integer,integer) to authenticated;
