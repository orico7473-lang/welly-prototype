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

## Mixpanel analytics (consent-gated)

This website is a React/Vite application. The official Mixpanel JavaScript browser SDK is loaded from its supported CDN **only after the visitor accepts optional analytics**. No npm package is required. The public project token defaults to `601a3d5d08242759bd09aeca6a633db8` in `src/analytics.js`, and can be overridden by `VITE_MIXPANEL_TOKEN`. Check the Mixpanel project's data residency; for an EU or India project configure `VITE_MIXPANEL_API_HOST` for the appropriate endpoint.

On first visit, the website shows an Accept/Decline analytics panel. Analytics is off until accepted. Visitors can reopen the choice via **Analytics preferences** in the footer. Existing acceptance persists using local storage. Autocapture and session replay are disabled to avoid collecting sensitive form data.

Currently implemented:
- `page_viewed` for consenting visitors, with the public pathname only (no URL query or form content).
- `signup_started` when registration is chosen or its form is engaged; marketing entry source/experiment included only when known.
- `signup_completed` after successful email/phone verification with an authoritative Supabase user ID (not for an unverified signup or ambiguous Google login).
- `onboarding_step_viewed` on username setup for authenticated users lacking a username. `time_since_signup_seconds` is included only when the browser knows a prior verified signup.
- `browse_started` on visiting the services/catalog page.
- `product_inquiry_started` when someone clicks a product's WhatsApp order link. This is **not** a completed purchase.

**Not wired:** `product_viewed` (no product detail page), `add_to_cart`, `cart_viewed`, `checkout_started`, `purchase_completed`, and `first_purchase_within_24h`. This site presently uses WhatsApp product enquiries and Calendly bookings, with no in-app shopping cart, checkout, order confirmation or first-order history. Do not fabricate transaction events from WhatsApp clicks. These must be implemented once the actual store/cart/order backend or verified payment webhook is available. See `AGENTS.md` for event definitions.

To verify: deploy the Hostinger build, open the site, accept analytics and navigate to Services/Register. Then check Mixpanel **Data → Events/Live View** for `page_viewed`, `browse_started`, and `signup_started`. A successful GitHub build is **not** proof that Mixpanel received events. SDK requests can be blocked by browser extensions/network filters and the configured Mixpanel region must match the project.
