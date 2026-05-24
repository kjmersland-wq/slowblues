# SlowBlues — Free Historical Image System

**Objective:** 100 % artist image coverage with historically correct, freely-licensed
photos and zero API/key dependency.

## Critical rule — DIRECT DOWNLOAD ONLY

Allowed: Public Domain · Creative Commons · Open Access · No known copyright restrictions.

**NEVER USE:** API keys · OAuth · paid services · Google Image APIs · social-media APIs ·
Getty / Shutterstock APIs · authenticated scraping. Never use Facebook, Instagram, Pinterest.

## Allowed direct sources (priority order)

| # | Source | URL |
|---|--------|-----|
| 1 | Wikimedia Commons | https://commons.wikimedia.org/ |
| 2 | Library of Congress | https://www.loc.gov/collections/ |
| 3 | Library of Congress — Free To Use | https://www.loc.gov/free-to-use/ |
| 4 | Internet Archive | https://archive.org/ |
| 5 | Picryl | https://picryl.com/ |
| 6 | Openverse | https://openverse.org/ |
| 7 | Digital Public Library of America | https://dp.la/ |
| 8 | Smithsonian Open Access | https://www.si.edu/openaccess |
| 9 | National Museum of African American History and Culture | https://nmaahc.si.edu/ |
| 10 | Alabama Department of Archives and History | https://archives.alabama.gov/ |
| 11 | Florida Memory | https://www.floridamemory.com/ |
| 12 | Southern Folklife Collection (UNC) | https://library.unc.edu/wilson/sfc/ |
| 13 | Chicago Public Library Digital Collections | https://www.chipublib.org/digital-collections/ |
| 14 | Europeana | https://www.europeana.eu/ |
| 15 | Flickr Commons | https://www.flickr.com/commons |
| 16 | National Library of Norway | https://www.nb.no/ |
| 17 | DigitaltMuseum | https://digitaltmuseum.no/ |

## Search process (per missing artist)

1. Search exact artist name.
2. Search `"<Name> blues"`, `"<Name> portrait"`, `"<Name> historical photo"`.
3. Extract from HTML: image URL · title · year · photographer · license · source.
4. Verify: correct person · correct era · no duplicates · acceptable quality.
5. Download directly.
6. Store locally: `/public/artists/<artist-slug>/` (or Supabase storage bucket `artist-images`).
7. Generate variants: thumbnail · card · hero · OG image.
8. Save metadata: Artist · Source · License · Photographer · Year · Copyright status.

## Preference rules

Prefer: black-and-white portraits · historical publicity photos · performance images ·
high resolution · portrait orientation · min 600 px width · no watermark.

## Fallback

If no free historical image exists, generate an AI historical-interpretation portrait
and mark it explicitly:

> **AI-generated historical interpretation**

Stored both in `artists.image_credit` and `artist_images.notes`.

## Active scripts in this repo

| Script | Purpose |
|--------|---------|
| `scripts/hunt_images_v2.ts` | Direct-download hunter (Wikipedia, Commons, LoC, Internet Archive, Picryl, Openverse, nb.no, DigitaltMuseum, Europeana, Flickr Commons). No API keys. |
| `scripts/ai_portraits.ts` | AI fallback via Lovable AI (Nano banana). Period-/instrument-/style-aware prompt. Marks output as AI interpretation. |

Run order: hunter first, AI fallback for whatever remains.
