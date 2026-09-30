# Learn to Play — media candidates

Verification method: `GET https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json`. `200` + a title matching the expected content = `verified: true`. This is a title/existence check only — it confirms the video is real and correctly described, not the exact in-video timing of any `start`/`end` clip (nobody on this pass watched full runtimes; see the note under each row that uses a guess).

All 15 seed candidates from the brief were checked 2026-10 and are `verified: true`. None needed a replacement search this round.

| Slot | ID | Title (from oEmbed) | Channel | verified |
|---|---|---|---|---|
| Backing A, 60 BPM | `sQGcIWF29t4` | A - Slow 12 Bar Blues Backing Track (60bpm) | Cliff Smith Backing Tracks | true |
| Backing E, 60 BPM | `JBFMvizGDiI` | E - Slow 12 Bar Blues Backing Track (60bpm) | Cliff Smith Backing Tracks | true |
| Backing G, 60 BPM | `utYggSK_vps` | G - Slow 12 Bar Blues Backing Track (60bpm) | Cliff Smith Backing Tracks | true |
| Harp backing G, quick change | `-5yMMo-uDbE` | Easy Slow 12 Bar Blues Harmonica Backing Track in G | LearnTheHarmonica.com | true |
| Harp backing G, slow | `NP7XefeRXSM` | 12 Bar Blues Slow Harmonica Backing Track in G | Tomlin Leckie | true |
| Guitar 12-bar lesson (G2) | `rLm99QI8eWs` | How to Play 12 Bar Blues on Guitar for Beginners | JustinGuitar | true |
| Guitar shuffle (G3) | `0TxlHjPK0yk` | 12 Bar Blues Style (Guitar Lesson BC-183) Guitar for beginners Stage 8 | JustinGuitar | true |
| Guitar minor pentatonic licks (G4) | `Gu2esZ-PzFM` | 5 Blues Guitar Licks from Minor Pentatonic Scales | JustinGuitar | true |
| Harp first lesson (H1) | `1XiuD2SFaV8` | very first blues harmonica lesson | Gussow's classic blues harmonica videos | true |
| Harp single notes (H2) | `9w8QYW5Wsh0` | How To Play Single Notes On Harmonica | Tomlin Leckie | true |
| Harp 2nd position (H3) | `ZGHE1NhFYhU` | What is 2nd Position/Cross Harp on Harmonica? \| Positions Lesson for Blues Harmonica | LearnTheHarmonica.com | true |
| Harp slow 12-bar, C harp (H3/H4) | `TEQ5Cp3nr_E` | Slow 12 bar blues - Beginner Blues C Harmonica Lesson + free harp tab | Tomlin Leckie | true |
| Listen: Bright Lights, Big City | `Q5gTmNKrj9s` | Bright Lights, Big City | Jimmy Reed - Topic | true |
| Reward: SRV live | `i0hVIrQm0KM` | Stevie Ray Vaughan - Pride and Joy (from Live at the El Mocambo) | stevierayvaughnVEVO | true — already on site, linked on Stevie Ray Vaughan's own profile (`artists.youtube_video_ids`) |
| Reward: Juke, Little Walter | `3J3eGUATzaY` | Juke | Little Walter - Topic | true, but see note below |

**Note on the Juke reward slot:** `3J3eGUATzaY` verified fine, but the site already has a *different*, already-verified "Juke" upload wired in and linked on Little Walter's own artist profile: `HxkqDe7DN8g` (also "Little Walter - Topic"). Phase 1 uses the already-linked `HxkqDe7DN8g` for consistency with the artist-profile-linking rule established elsewhere in this course, rather than introduce a second, unlinked Juke ID. `3J3eGUATzaY` is recorded here as a verified alternate, not discarded.

## Gaps (not filled — reported back per the brief, not guessed)
- **G1 hold/tuning video**: no candidate given or found yet. Phase 1 ships G1's "Watch" step as an illustration (hold diagram) instead of a video, per the model's own "video OR illustration when no video fits" rule. A real search for a genuine beginner hold/tuning clip is still open.
- **Two-finger A7/D7/E7 change demo**: same gap — no verified candidate. G1's chord-change practice ladder is text + illustration only in Phase 1.
- **H4 riff (no-bend)** and **H5 bend**: no candidates given; out of Phase 1 scope (Phase 1 = L0, G1, H1 only) but flagged now so Phase 2 doesn't stall on the same gap.
- **G5 slide**: no candidate; also out of Phase 1 scope, flagged for Phase 2.
- **75/90 BPM backing tracks**: none found in the Cliff Smith catalogue searched so far (60 BPM only, in A/E/G). The 12-bar counter's own BPM selector (Web Audio click, independent of any video) covers 75/90 without needing a matching video — see `docs/review-needed.md` for the "counter doesn't sync with video" disclosure this requires in the UI.

## Key-standard change mid-project
The course's locked key standard flipped twice in the same week: E/A-harp (previous round, to match Juke) → A/C-harp-in-G (this round, per the new spec, confirmed by the site owner over E/A-harp when asked directly). Phase 1 (L0, G1, H1) is built entirely on the new A/C-harp-in-G standard. Lessons G2–G5 and H2–H5 have **not** been migrated yet (that's Phase 2) and currently still reflect the previous E/A-harp standard on the live site — meaning until Phase 2 ships, the two tracks are internally inconsistent (L0/G1/H1 in A or G, G2-5/H2-5 in E). This is a known, temporary state inherent to shipping Phase 1 for review before Phase 2, not an oversight.
