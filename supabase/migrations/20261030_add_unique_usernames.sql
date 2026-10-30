-- Existing accounts may choose a username at their next sign-in.
alter table public.profiles add column if not exists username text;
alter table public.profiles add constraint profiles_username_format_check
  check (username is null or username ~ '^[A-Za-z0-9_]{3,20}$');
create unique index profiles_username_unique_lower_idx
  on public.profiles (lower(username)) where username is not null;
