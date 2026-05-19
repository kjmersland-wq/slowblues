## Hva jeg fant i arkivet

Arkivet `slow-blues-copilot-full-project-audit` inneholder en mye rikere artistdatabase enn det som finnes i nåværende prosjekt:

- **~360 artister** fordelt på 10 datafiler:
  - `artists.ts` (amerikansk hovedbase, 264 artister), `modernAmericanArtists.ts`, `canadianArtists.ts`, `africanArtists.ts`, `australianArtists.ts`
  - `scandinavianArtists.ts` (35 nordiske, med country: norway/sweden/denmark/finland/iceland)
  - `britishArtists.ts` (13), `europeanArtists.ts` + 3 wave-filer (34 totalt)
- **Bildemapping**: `artistImages.ts`, `scandinavianArtistImages.ts`, `britishArtistImages.ts`, `europeanArtistImages.ts` (lokale `src/assets/artists/*.webp|jpg`)
- **Rikt felt-sett pr. artist**: id, name, birthName, born, died, birthPlace, era, eraLabel, activePeriod, biography (en/no/de), family, formativeExperiences (en/no/de), instruments, anecdotes (en/no), collaborators, keyRecordings (med Spotify-IDer, komponister, musikere), awards, influence (en/no), styles, youtubeVideoIds, socialLinks, searchTerms, videoSearchQuery
- **Språk i kilden**: engelsk + norsk overalt, tysk på en delmengde. **Svensk finnes ikke** i kildedataene.

## Viktig om svensk

Du ba om No/En/Sv, men svenske oversettelser eksisterer **ikke** i arkivet. Per din regel "ingen fake data" lager jeg **ikke** falske svenske tekster. Skjemaet får svenske kolonner som står tomme (null), så de kan fylles inn senere via admin eller maskinoversettelse. Tysk bevares der det finnes (`*_de`).

## 1. Databaseskjema (migrasjon)

Utvider eksisterende `artists`-tabell + legger til normaliserte hjelpetabeller. Alle tekstfelt har `_en`, `_no`, `_sv`, `_de`-varianter der kilden har flerspråklig.

```
artists  (utvidet)
├── identitet:        id, slug (unik), name, birth_name, alt_name
├── geografi:         country (enum), region (enum), birth_place, origin
├── liv:              born, died, active_period, active_years
├── klassifisering:   era, era_label_en, era_label_no, era_label_sv,
│                     tag, styles text[], categories text[]
├── biografi:         biography_en, biography_no, biography_sv, biography_de
├── kort:             short_en, short_no, short_sv
├── influence:        influence_en, influence_no, influence_sv,
│                     influence_note
├── SEO:              seo_title_en/_no/_sv, seo_description_en/_no/_sv,
│                     canonical_slug, og_image
├── medier:           img, gallery_images text[], image_credit,
│                     youtube_video_ids text[], video_search_query
├── lenker:           social_links jsonb, external_links jsonb,
│                     article_references jsonb
├── ruter:            base_path (/artists, /artists/scandinavian, …),
│                     route_path (full URL), related_slugs text[]
├── JSONB-seksjoner:  family, formative (en/no/de), instruments,
│                     anecdotes (en/no), collaborators,
│                     key_recordings, awards, signature_songs,
│                     influences, labels, search_terms
└── meta:             sort_order, source_file, source_region
```

`country` enum: `usa | canada | uk | norway | sweden | denmark | finland | iceland | germany | france | netherlands | italy | spain | poland | ireland | south-africa | australia | other`.
`region` enum: `american | scandinavian | british | european | african | australian | other`.

**RLS**: behold dagens regler (alle leser, admin skriver).

Ingen data slettes — eksisterende 38 artister i databasen oppdateres ved upsert på `slug` (skjemaet er bakoverkompatibelt).

## 2. Bildeoverføring

- Kopier alle filer fra `src/assets/artists/` i arkivet → `src/assets/artists/` i prosjektet.
- Behold lokale ES6-importer for bilder (best optimalisering) — bygger en lookup `slug → import` i `src/lib/artistImageMap.ts` generert fra de fire image-filene.

## 3. Ekstraksjonsskript

`scripts/extract-artists.ts` (kjøres lokalt):

1. Bruker `tsx` til å importere alle 10 data-filene direkte (de er gyldig TS med konstant-eksports).
2. Normaliserer hver post til DB-rad-struktur (mapper feltnavn `biography → biography_en`, osv.).
3. Utleder `country` per fil (canadianArtists → canada, britishArtists → uk, scandinavianArtists bruker eksisterende `country`-felt).
4. Genererer `seo_title_{en,no}` og `seo_description_{en,no}` automatisk fra eksisterende navn + era + biography-snippet (engelsk + norsk eksisterer, derfor reell — ikke fake). `_sv` settes null.
5. Genererer `route_path` som `${base_path}/${slug}`.
6. Bygger `related_slugs` ved enkel matching mot `collaborators.slug` der det finnes.
7. Skriver resultatet til `scripts/extracted-artists.json` for inspeksjon, deretter upsert til DB i batcher på 50.

## 4. Frontend-oppdateringer

- `src/lib/artists.ts`: utvid `ArtistRecord`-typen med nye felt + språkvarianter.
- `useArtists()` får valgfri `lang`-parameter; helper `pickLang(record, 'en'|'no'|'sv')` velger riktig felt med fallback (sv → no → en).
- `src/routes/artists.tsx`: viser artister filtrert på `region` og `country` (nye filter-chips).
- `src/routes/artists.$slug.tsx`: bruker språkvalg fra `useI18n()`-konteksten, viser alle seksjoner inkl. styles, youtube-IDer, social/external links, article references.
- **Nye ruter** (SEO-vennlig hierarki, matcher original prosjektstruktur):
  - `/artists` — alle
  - `/artists/scandinavian`, `/artists/british`, `/artists/european`, `/artists/african`, `/artists/australian`, `/artists/american`
  - `/artists/$slug` — eksisterende detaljside (uendret URL)
- `head()` i hver rute leser `seo_title_{lang}` / `seo_description_{lang}` fra DB.

## 5. Sitemap

`src/routes/api/public/sitemap[.]xml.ts` server-route som henter alle artist-slugs + region-sider og genererer `sitemap.xml` med `hreflang` for no/en/sv.

## 6. Leveranserekkefølge

1. **Migrasjon** (skjemautvidelse) → din godkjenning
2. **Bildekopiering** + image map
3. **Ekstraksjon + upsert** (kjør scriptet, lagre `extracted-artists.json` for revisjon)
4. **Frontend**: språkhjelpere, utvidet detaljside, nye region-ruter
5. **Sitemap** + hreflang
6. **Verifikasjon**: tell rader, sjekk at /artists/lonnie-johnson fortsatt fungerer, åpne 3 vilkårlige artister på no/en

## Teknisk

- All ekstraksjon kjøres lokalt mot kildefiler i `/tmp/audit/...`. Ingen kall til opphavlige Lovable-prosjekter.
- Bruker `supabase-js` med service-role-key i Node-script for upsert (RLS forblir streng for browser-klienten).
- Eksisterende `ARTISTS`/`PROFILES`-konstanter beholdes som typede konstanter for backwards-kompatible imports, men DB blir sannhetskilde.
- Ingen Lonnie Johnson-overskriving (han er allerede i DB med showcase-data).
