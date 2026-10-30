# WELLY DE BEST

React/Vite website with Supabase authentication, testimonials, profiles, and admin moderation.

## Local development

Run `npm ci`. Copy `.env.example` to `.env.local`, fill in the Supabase URL and publishable/anon key, and run `npm run dev`. Build with `npm run build`.

## Netlify

Connect this repository and deploy the `main` branch. `netlify.toml` sets the build command `npm run build`, publish directory `dist`, and SPA routing.

Set these build environment variables in Netlify:

- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable or anon key.
- `VITE_CALENDLY_URL`: `https://calendly.com/wellydebest`.
- `VITE_EMAIL_CODES_READY`: `true` when email codes are configured.
- `VITE_GOOGLE_AUTH_READY`: `true` when Google sign-in is configured.
- `VITE_PHONE_AUTH_READY`: `false` unless phone authentication is configured and tested.

Vite values are visible in browser code. Never commit or use service-role/secret keys, SMTP passwords or OAuth client secrets as Vite variables.

After selecting the Netlify URL, configure Supabase Auth Site URL and redirect URLs for the new domain. Verify login, password reset, testimonials and uploads on the Netlify deployment. Review the privacy and terms drafts before public launch. The existing Supabase project must have the required database and storage setup.

Once continuous deployment is connected, new commits to the production branch trigger Netlify builds. A build must succeed before an update appears.
