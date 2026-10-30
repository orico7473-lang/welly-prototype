# WELLY DE BEST — Cinematic Redesign

This upgrade redesigns the actual homepage and adds a full-screen cinematic entrance, editorial homepage sections, floating silver orbits, animated typography, premium dark-and-silver styling, and a sliding animated account modal (sign in, sign up, reset password, Google sign-in). The entrance plays once per browser tab session, with a Skip Intro button.

## Run

1. Extract the archive and open the `welly-de-best-redesign` folder.
2. Run `npm install` then `npm run dev`.
3. Open the localhost URL shown by Vite.

The homepage and animated account UI display even without Supabase credentials. For **real** authentication and testimonials, copy `.env.example` to `.env`, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, then restart the server. Configure Google OAuth and redirect URLs in Supabase. No credentials are bundled.

Booking links remain pointed to the previously specified Calendly and WhatsApp destinations; confirm them with the client before publishing.

## Design notes

- Built on the provided production source; retained services, gallery, booking, testimonials and admin routes.
- Uses the existing brand and gallery photographs, not footage extracted from the inspiration videos.
- Reduced-motion preferences are supported.
- The source includes a visible interface without requiring login. Supabase is needed for functional login, reviews and admin data.
