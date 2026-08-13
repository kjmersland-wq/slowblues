-- Adds published_at to ticker_items so externally-sourced RSS items sort
-- by their real publish date rather than fetch time. ticker_items is a
-- small dedicated table (8 columns), nowhere near D1's 100-column ceiling,
-- so a plain ALTER TABLE is safe here (unlike the artists table).
ALTER TABLE ticker_items ADD COLUMN published_at TEXT;
