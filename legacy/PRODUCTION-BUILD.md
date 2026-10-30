# Production build checklist

## Build
Requires Node.js 20+ and internet access to install dependencies the first time.

```bash
npm install
npm run build
npm run preview
```

Netlify: publish directory `dist`, build command `npm run build`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables in Netlify. Do not put any secret or service-role key in frontend variables.

## Release blockers
1. Verify the production build succeeds and test in a browser (not verified in this package).
2. Configure Google OAuth provider, email verification, Site URL and redirect URLs in Supabase Auth.
3. Securely assign admin `app_metadata.welly_role=admin` to the intended account; then reauthenticate.
4. Connect verified bookings to completed appointments, or verify them manually with independent evidence.
5. Test anonymous review visibility, customer review ownership, edit moderation, media permissions, and admin approval.
6. Review customer account management requirements: this package currently implements review administration only.

No deployment has been performed.
