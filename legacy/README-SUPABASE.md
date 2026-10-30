# WELLY DE BEST — Supabase integration

The `wellydebest` Supabase project has a `reviews` table, RLS policies, and private `welly-reviews` storage bucket.

## Start
1. Copy `.env.example` to `.env`.
2. Run `npm install`, then `npm run dev` or `npm run build`.
3. In Supabase Authentication → Providers, enable Google and supply Google OAuth credentials; configure Site URL and redirect URLs for the deployed domain and localhost. Email confirmation must be enabled in Auth settings.
4. Create an admin user via normal signup, then set their `raw_app_meta_data.welly_role` to `admin` using a secure server-side admin operation; never allow a browser to assign admin roles. Sign out and in again to refresh claims.
5. Add your deployment domain to Auth redirect allowlist.

## Important limitations
- Verified booking badges require an independently verified completed-booking integration; admin status can set the badge but it is not automated.
- Review uploads are private and delivered via signed URLs; uploaded files have 25MB limits.
- The dashboard handles review moderation, featured reviews, and pending edits, but not customer account management or booking sync yet.
- This code has not been browser-tested in this environment.
