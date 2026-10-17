-- Cookie-free page-view measurement (replaces all earlier counters).
-- Written by POST /api/collect (src/routes/api.collect.ts), read by the
-- /admin/traffic page (src/lib/traffic.functions.ts).
--
-- Privacy by design: no raw IP address, no cookie, no localStorage id.
--   * visitor_hash is SHA-256(daily salt + site + IP + user-agent), truncated.
--     The day is part of the input, so the same person gets a different hash
--     tomorrow and cannot be followed across days. The IP itself is never stored.
--   * path is the pathname only (no query string, no #fragment).
--   * referrer is the referring hostname only, and NULL for same-site navigation.
--   * country comes from Cloudflare's CF-IPCountry header, when present.
CREATE TABLE pageviews (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  site          TEXT NOT NULL,   -- hostname, lower-case, without "www." (data-site on the script tag)
  path          TEXT NOT NULL,
  referrer      TEXT,            -- hostname only; NULL = direct / unknown / internal
  device        TEXT CHECK (device IN ('mobile', 'tablet', 'desktop')),
  country       TEXT,            -- ISO 3166-1 alpha-2 from CF-IPCountry; NULL = unknown
  lang          TEXT,            -- navigator.language, e.g. "nb-NO"
  visitor_hash  TEXT,            -- daily-rotating anonymous hash, used only to count unique visitors per day
  created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP  -- UTC
);

CREATE INDEX idx_pageviews_site_created ON pageviews(site, created_at);
CREATE INDEX idx_pageviews_created ON pageviews(created_at);
