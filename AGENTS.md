# Mixpanel tracking contract — WELLY DE BEST

**Stack:** JavaScript / React 18 / Vite 5 (client-side SPA-style routing via page loads), Supabase Auth and database, Hostinger GitHub Actions deployment.

**SDK:** Mixpanel browser SDK from official CDN, loaded after explicit optional analytics consent; initialized in `src/analytics.js` with token `601a3d5d08242759bd09aeca6a633db8` or `VITE_MIXPANEL_TOKEN`. No events before consent. An account ID is set through `identify()` after authenticated sign-in; call `reset()` on sign-out.

**Privacy:** Do not track passwords, OTPs, emails, reviews, uploaded media, or free-text inputs. No heatmaps, automatic tracking, or session replay until explicitly assessed for privacy. Users can revoke analytics from the footer. Check Mixpanel data residency before trusting production ingestion.

## Event plan

| Event | Status | Source/trigger |
| --- | --- | --- |
| `signup_started` | Implemented | `src/Auth.jsx`: choose registration or engage registration form; properties `signup_method`, `entry_source`, optional `experiment_id`, `timestamp_utc`. |
| `signup_completed` | Implemented for verified code signup | `src/Auth.jsx` -> `src/analytics.js`: only after successful Supabase `verifyOtp` with user ID; `user_id`, `signup_method`, `plan_or_tier: standard`, timestamp. Google sign-up completion not inferred from OAuth sign-in. |
| `onboarding_step_viewed` | Implemented | `src/UsernameSetup.jsx`: username setup after checking the profile; `onboarding_step: username_setup`, `step_index: 1`, optional accurate `time_since_signup_seconds`, timestamp. |
| `browse_started` | Implemented | `src/main.jsx`: Services/catalog page entry; `browse_entry_point`, `filters_applied: false`, `search_term_present: false`, timestamp. |
| `product_viewed` | Not applicable yet | No product detail screen/route; displaying a catalog card is not a product detail view. |
| `add_to_cart` | Blocked by missing feature | No cart or Add to Cart action. |
| `cart_viewed` | Blocked by missing feature | No cart view. |
| `checkout_started` | Blocked by missing feature | No integrated checkout; WhatsApp is an external enquiry channel. |
| `purchase_completed` | Blocked by missing source of truth | No order-completed backend webhook or order records. Never infer purchases from WhatsApp clicks or booking-page views. |
| `first_purchase_within_24h` | Blocked by missing source of truth | Requires authoritative signup and first-confirmed-order records, order IDs, and reliable timestamps. Derive server-side with idempotency. |
| `page_viewed` | Additional implemented event | `src/analytics.js`: consenting page load; public path only. |
| `product_inquiry_started` | Additional implemented event | `src/main.jsx`: WhatsApp product order click (not a purchase). |

**Future checkout implementation:** Track cart/checkout from actual user actions; fire purchase events only after the backend verifies the payment/order. Use stable order IDs and Mixpanel deduplication identifiers to avoid repeats. `first_purchase_within_24h` must be emitted exactly once per user based on backend first-order history (not on a browser guess).

**QA:** No event volume or screenshot proves receipt until events are observed in Mixpanel Live View. Verify anonymous browsing, code-verified signup identity, consent opt-out, repeat navigation, and no sensitive properties. Production API host defaults to US unless `VITE_MIXPANEL_API_HOST` is configured.
