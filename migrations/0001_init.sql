-- Page view log for the self-hosted analytics (see README → Analytics).
-- No cookies, no raw IPs, no user agents are stored. `visitor` is a
-- truncated SHA-256 of (secret salt, UTC day, IP, user agent); because the
-- day is part of the input, the same person gets an unrelated value every
-- day, so visits can't be linked across days.

CREATE TABLE IF NOT EXISTS pageviews (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  day      TEXT    NOT NULL,  -- YYYY-MM-DD, UTC
  ts       INTEGER NOT NULL,  -- unix epoch milliseconds
  path     TEXT    NOT NULL,  -- pathname only, no query string
  referrer TEXT,              -- external referrer hostname, landing page only
  country  TEXT,              -- ISO 3166-1 alpha-2 from Cloudflare
  visitor  TEXT    NOT NULL   -- daily-rotating hash (see above)
);

CREATE INDEX IF NOT EXISTS idx_pageviews_day ON pageviews (day);
CREATE INDEX IF NOT EXISTS idx_pageviews_day_path ON pageviews (day, path);
