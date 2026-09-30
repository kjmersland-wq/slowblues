-- News-ticker batch system: replaces the old "compute live on every
-- request, cap at 8, freshness-gate everything at 7 days" design, which
-- left the strip looking near-empty and repeating the same 2-3 IN MEMORIAM
-- cards. Same idea as quiz_cycles/quiz_cycle_questions: a cron job builds
-- and locks a batch twice a week (Mon 00:00 / Thu 00:00, Europe/Oslo), and
-- the site just reads whichever batch covers "now" -- content never
-- changes mid-batch even if RSS ticks in, and it's never rebuilt on a
-- pageview.

CREATE TABLE ticker_batches (
  batch_key    TEXT PRIMARY KEY,   -- e.g. 'T-2026-W40-A' (Mon-Wed) / '...-B' (Thu-Sun)
  period_start TEXT NOT NULL,      -- Europe/Oslo calendar date, inclusive
  period_end   TEXT NOT NULL,      -- Europe/Oslo calendar date, inclusive
  item_count   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- One row per ticker item, already localized into all 5 site languages at
-- build time (label_json/text_json = {"en":...,"no":...,"sv":...,"de":...,"pl":...}),
-- so the read path is a single SELECT + JSON.parse, no per-request
-- translation or DB joins.
CREATE TABLE ticker_batch_items (
  id          TEXT PRIMARY KEY,
  batch_key   TEXT NOT NULL REFERENCES ticker_batches(batch_key),
  position    INTEGER NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('birthday', 'onthisday', 'memoriam', 'release', 'concert', 'external', 'house', 'youtube')),
  flag        TEXT,
  href        TEXT NOT NULL,
  external    INTEGER NOT NULL DEFAULT 0,
  source_name TEXT,
  label_json  TEXT NOT NULL,
  text_json   TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ticker_batch_items_batch ON ticker_batch_items(batch_key, position);
