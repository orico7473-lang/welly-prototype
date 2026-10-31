-- Run once in the wellydebest Supabase project.
-- The production database migration was applied on 2026-10-31.
alter table public.services add column if not exists discount_percent integer not null default 0;
do $$
begin
 if not exists (
  select 1 from pg_constraint
  where conname = 'services_discount_percent_range'
    and conrelid = 'public.services'::regclass
 ) then
  alter table public.services add constraint services_discount_percent_range
   check (discount_percent between 0 and 100);
 end if;
end
$$;
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(btrim(name)) between 1 and 120),
 description text not null default '',
 price numeric(12,2) not null check (price>=0),
 discount_percent integer not null default 0 check(discount_percent between 0 and 100),
 stock_quantity integer not null default 0 check(stock_quantity>=0),
 image_url text,
 is_active boolean not null default true,
 display_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
grant select on public.products to anon;
grant select,insert,update,delete on public.products to authenticated;
drop policy if exists "products visible to shoppers and admins" on public.products;
create policy "products visible to shoppers and admins" on public.products
 for select to anon,authenticated using (is_active or (select public.is_welly_admin()));
drop policy if exists "products admin insert" on public.products;
create policy "products admin insert" on public.products
 for insert to authenticated with check ((select public.is_welly_admin()));
drop policy if exists "products admin update" on public.products;
create policy "products admin update" on public.products
 for update to authenticated using ((select public.is_welly_admin())) with check ((select public.is_welly_admin()));
drop policy if exists "products admin delete" on public.products;
create policy "products admin delete" on public.products
 for delete to authenticated using ((select public.is_welly_admin()));
