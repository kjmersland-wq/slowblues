-- Quiz content fixes, 2026-09-30. Already applied by hand against the live
-- D1 database (see project notes) -- this migration exists so a fresh
-- database built from 0001..0008 ends up in the same corrected state.
--
-- 1) audio-5 ("Listen to this voice - who is singing?", answer Mavis
--    Staples / The Staple Singers) has no matching SlowBlues artist
--    profile at all, so it can never satisfy the "audio must already be
--    tied to an artist on the site" rule. Rejected rather than deleted --
--    keeps the historical record, just excluded from the validated pool.
UPDATE quiz_questions
SET status = 'rejected',
    validation_notes = 'No SlowBlues artist profile exists for The Staple Singers / Mavis Staples -- source-on-site rule cannot be satisfied. Needs a real artist page before this can be reused.'
WHERE id = 'audio-5';

-- 2) The other 7 audio-guess questions (audio-1..4, audio-6..8) use real,
--    verified recordings by the correct artist (checked via YouTube oEmbed
--    against each artist's own signature songs), but the video ID had
--    never been added to that artist's own youtube_video_ids column --
--    so the clip wasn't actually "already on the artist's page" as the
--    rule requires. Backfilling (append-only, only when still empty)
--    makes the existing questions compliant instead of discarding them.
UPDATE artists SET youtube_video_ids = '["VMUt8KdDtTY"]' WHERE slug = 'howlin-wolf' AND (youtube_video_ids IS NULL OR youtube_video_ids = '[]');
UPDATE artists SET youtube_video_ids = '["zGXEWmDmraY"]' WHERE slug = 'etta-james' AND (youtube_video_ids IS NULL OR youtube_video_ids = '[]');
UPDATE artists SET youtube_video_ids = '["SgXSomPE_FY"]' WHERE slug = 'bb-king' AND (youtube_video_ids IS NULL OR youtube_video_ids = '[]');
UPDATE artists SET youtube_video_ids = '["ClpR3fOKPRA"]' WHERE slug = 'buddy-guy' AND (youtube_video_ids IS NULL OR youtube_video_ids = '[]');
UPDATE artists SET youtube_video_ids = '["fLU1Qbaclfg"]' WHERE slug = 'christone-kingfish-ingram' AND (youtube_video_ids IS NULL OR youtube_video_ids = '[]');
UPDATE artists SET youtube_video_ids = '["HxkqDe7DN8g"]' WHERE slug = 'little-walter' AND (youtube_video_ids IS NULL OR youtube_video_ids = '[]');
UPDATE artists SET youtube_video_ids = '["i0hVIrQm0KM"]' WHERE slug = 'stevie-ray-vaughan' AND (youtube_video_ids IS NULL OR youtube_video_ids = '[]');
