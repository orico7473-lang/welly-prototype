# WELLY DE BEST — Cinematic Silver / Black Update

## New
- First-visit animated cinematic entrance with skip option; replays on a new browser session.
- Animated sign-in / sign-up / password recovery modal, email and Google authentication through existing Supabase project.
- Silver / obsidian design refinements, smoother image motion, hover transitions, atmospheric hero and mobile layouts.
- Original pages, booking, gallery, testimonials, admin and client assets preserved.

## Run
`npm install` then `npm run dev`. For deployment use `npm run build` and deploy the `dist` folder to Netlify.

## Important
The authentication modal uses the existing Supabase project. Configure the Google provider and authorized redirect URLs in Supabase. Email verification/reset also depends on the Supabase Auth settings. The original testimonials page retains its own inline auth form for now. No actual cinematic video files were embedded; the entrance animates the client's supplied image to avoid licensing and bandwidth issues.
