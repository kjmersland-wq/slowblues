# Learn to Play — flagged for review

Nothing in the Phase 1 slice (L0, G1, H1) carries a `needsExpertReview` flag — the technique content (holding a guitar/harmonica, tuning, the train rhythm, A7/D7 shapes) is basic, uncontroversial instrument mechanics, not a disputed historical or theoretical claim. Flagging is reserved for actual uncertainty, not applied as a blanket disclaimer.

Two things worth a native/expert eye before they matter, both **forward-looking** (not blocking Phase 1):

## 1. Note-naming convention (H vs. B) — Phase 3 concern
German and Nordic traditions use "H" for B natural and "B" for B-flat; this hasn't come up yet because Phase 1's chords (A7, D7, E7) don't include a B-natural. It will matter once Phase 2 migrates the lessons that do reference a B chord (the old E-key lessons use B7). Recommendation: keep chord letters as A7/D7/E7/B7 consistently in the UI everywhere (don't silently swap to "H7" in German), and add one short locale-specific note on the relevant lesson('s) Understand step explaining the naming difference, written by a native speaker in Phase 3 — not guessed by translation.

## 2. The 12-bar counter's independence from the video, in the UI itself
`TwelveBarCounter` runs its own Web Audio click track (`src/components/learn/TwelveBarCounter.tsx`) and is completely unsynced from whichever YouTube video sits above it on a "Play with the track" step — this is by design (the brief explicitly asked for the disclosure, not for real sync, which YouTube's IFrame API doesn't cleanly support for arbitrary third-party videos with unknown downbeats). The renderer already prints "This click track runs independently — it does not sync with the video above" under every counter instance (`StepLessonRenderer.tsx`). Flagging this here so it isn't quietly dropped in a future redesign — a learner counting against a visual grid that silently drifts from the audio would be worse than no counter at all.

## Not yet checked (out of Phase 1 scope, listed so Phase 2 doesn't rediscover it)
- Exact in-video timing for any `start`/`end` trim on the Phase 2/3 media candidates (G2-G5, H2-H5 videos) — oEmbed verification confirms a video is real and correctly titled, not that a specific second offset lands where a caption claims. None of the Phase 1 media uses a guessed trim point (L0/G1/H1 either play the full video or don't set `end` at all).
- Whether JustinGuitar's/Tomlin Leckie's/LearnTheHarmonica.com's actual on-screen chord chart matches the A/D/E7 or G harmonica forms assumed here (the brief's own §2 instruction: "Verify the A and G tracks' forms against the chord chart shown in the video") — not done yet for the Phase 2 videos, since Phase 1 doesn't embed any of the instructional (non-backing) Phase-2 videos.
