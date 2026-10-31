// Consent-gated Mixpanel browser SDK for the WELLY DE BEST React/Vite site.
// The project token is public; never put Mixpanel API secrets in browser code.
const TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '601a3d5d08242759bd09aeca6a633db8';
const API_HOST = import.meta.env.VITE_MIXPANEL_API_HOST;
const CONSENT_KEY = 'welly-analytics-consent';
const SIGNUP_KEY = 'welly-mixpanel-signup';
const SDK_URL = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
let initialized = false;
let loading = false;
const pending = [];

export const timestampUtc = () => new Date().toISOString();

export function analyticsConsent() {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}
const allowed = () => typeof window !== 'undefined' && analyticsConsent() === 'accepted';

function flush() {
  if (!initialized || !allowed()) return;
  while (pending.length) {
    const [method, ...args] = pending.shift();
    try { window.mixpanel?.[method]?.(...args); } catch (error) {
      if (import.meta.env.DEV) console.warn('Mixpanel tracking failed', error);
    }
  }
}

function ensureSDK() {
  if (!allowed()) return;
  if (initialized) {
    flush();
    return;
  }
  if (loading) return;
  loading = true;
  const script = document.createElement('script');
  script.src = SDK_URL;
  script.async = true;
  script.onload = () => {
    loading = false;
    if (!allowed()) return;
    if (!window.mixpanel) return;
    try {
      window.mixpanel.init(TOKEN, {
        persistence: 'localStorage',
        track_pageview: false,
        autocapture: false,
        record_sessions_percent: 0,
        ...(API_HOST ? { api_host: API_HOST } : {})
      });
      initialized = true;
      flush();
    } catch (error) {
      if (import.meta.env.DEV) console.warn('Mixpanel initialization failed', error);
    }
  };
  script.onerror = () => {
    loading = false;
    pending.length = 0;
    if (import.meta.env.DEV) console.warn('Mixpanel SDK could not load.');
  };
  document.head.appendChild(script);
}

function call(method, ...args) {
  if (!allowed()) return;
  pending.push([method, ...args]);
  ensureSDK();
  flush();
}

export function trackEvent(event, properties = {}) {
  if (!allowed()) return;
  call('track', event, { ...properties, timestamp_utc: properties.timestamp_utc || timestampUtc() });
}
export function identifyUser(userId) {
  if (userId) call('identify', String(userId));
}
export function resetAnalytics() {
  if (!initialized || !allowed()) return;
  call('reset');
}

export function trackPageViewed() {
  trackEvent('page_viewed', { page_path: location.pathname });
}
export function initializeAnalytics() {
  if (allowed()) trackPageViewed();
}
export function setAnalyticsConsent(decision) {
  const value = decision ? 'accepted' : 'declined';
  try { localStorage.setItem(CONSENT_KEY, value); } catch { return; }
  if (decision) {
    if (initialized) window.mixpanel?.opt_in_tracking();
    trackPageViewed();
  } else {
    pending.length = 0;
    if (initialized) {
      window.mixpanel?.opt_out_tracking();
      window.mixpanel?.reset();
    }
    try { sessionStorage.removeItem(SIGNUP_KEY); } catch {}
  }
  window.dispatchEvent(new CustomEvent('welly:analytics-consent', { detail: value }));
}
export function openAnalyticsPreferences() {
  window.dispatchEvent(new Event('welly:open-analytics-preferences'));
}

// Only verified signup completions should call this. Never include email, passwords or OTP.
export function recordSignupCompleted(userId, signupMethod) {
  if (!userId || !allowed()) return;
  const at = timestampUtc();
  try { sessionStorage.setItem(SIGNUP_KEY, JSON.stringify({ userId: String(userId), at })); } catch {}
  identifyUser(userId); // important: identify before the completion event
  trackEvent('signup_completed', { user_id: String(userId), signup_method: signupMethod, plan_or_tier: 'standard', timestamp_utc: at });
}
export function timeSinceSignupSeconds(userId) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SIGNUP_KEY) || 'null');
    if (saved?.userId !== String(userId)) return undefined;
    const delta = (Date.now() - Date.parse(saved.at)) / 1000;
    return Number.isFinite(delta) && delta >= 0 ? Math.round(delta) : undefined;
  } catch { return undefined; }
}
