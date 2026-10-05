-- Adds finer visitor detail to pageviews: geolocation beyond country, and
-- coarse device/browser/OS categories. Still no cookies, no raw IPs, and no
-- raw user-agent strings stored — region/city come from Cloudflare's free
-- geolocation (no IP storage needed to get them), and device/browser/os are
-- derived from the user-agent at ingest time into one of a handful of fixed
-- categories (see parseUserAgent in src/lib/analytics.ts), then discarded.
--
-- Trade-off worth knowing: city-level location is detailed enough that a
-- single visitor from a small city is effectively identifiable on a
-- low-traffic site. That's a deliberate choice made by the site owner from
-- /stats, not an incidental side effect.

ALTER TABLE pageviews ADD COLUMN region TEXT;  -- e.g. "California", from Cloudflare
ALTER TABLE pageviews ADD COLUMN city   TEXT;  -- e.g. "San Jose", from Cloudflare
ALTER TABLE pageviews ADD COLUMN device TEXT;  -- "desktop" | "mobile" | "tablet"
ALTER TABLE pageviews ADD COLUMN browser TEXT; -- "Chrome" | "Safari" | "Firefox" | "Edge" | "Other"
ALTER TABLE pageviews ADD COLUMN os     TEXT;  -- "macOS" | "Windows" | "iOS" | "Android" | "Linux" | "Other"
