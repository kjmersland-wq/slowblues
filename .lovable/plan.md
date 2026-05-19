# SlowBlues Restoration Plan

ZIP-arkivet inneholder det gamle React Router-prosjektet. Det må porteres bit-for-bit til den nåværende TanStack Start-stacken. Jeg foreslår 6 faser, hver leverbar og testbar for seg.

## Hva ZIP-en faktisk inneholder

- **~120 artister** i statiske `.ts`-filer (scandinavianArtists, britishArtists, modernAmericanArtists, europeanArtists×4, africanArtists, australianArtists, canadianArtists, danskBlues, svenskBlues, norskBluesunion)
- **Image-mapper**: `artistImages.ts`, `britishArtistImages.ts`, `europeanArtistImages.ts`, `scandinavianArtistImages.ts` — verifiserte mappinger
- **Reviews-systemet er databasedrevet** (`blues_reviews`-tabell i gammel Supabase). ZIP-en har **koden**, ikke innholdet. Dataen må enten dumpes fra gammel DB eller skrives på nytt. Dette må avklares.
- **Public bilder**: 2.7 MB — artistportretter og galleri
- **60+ sider** og massiv komponentbibliotek (artist, blog, reviews, festival, map, quiz, etc.)

## Fase 1 — Datafundament (databasen)

1. Migrer `artists`-tabellen til å støtte alle felter fra arkivet (mange er allerede der).
2. Opprett **`blues_reviews`**-tabell med multilingual + scoring + status, slik ReviewDetail.tsx forventer.
3. Opprett **`artist_images`** mapping-tabell (artist_slug → image_url, source, verified).
4. Seed-script som importerer alle ~120 artister fra de statiske `.ts`-filene inn i `artists`-tabellen (idempotent — `ON CONFLICT (slug)`).
5. Kopier verifiserte bilder fra `public/images/` inn i prosjektet og koble via `artist_images`.

## Fase 2 — Artist-detaljside (proff mal)

Én generisk rute `/artists/$slug` som henter fra DB og rendrer:

- Hero med verifisert bilde + image-credit
- Bio (EN/NO/SV/DE) med språk-fallback til EN + "Translation pending"-badge
- Career / formative years / family / collaborators
- Diskografi + signature songs
- Influences + related artists (slug-lenker)
- YouTube-mediearkiv (se Fase 4)
- JSON-LD `MusicGroup`/`Person` + Wikidata `sameAs`
- SEO `head()` per artist

Erstatter alle de gamle regionsspesifikke detalj-rutene (BritishArtistDetail, EuropeanArtistDetail, osv.) med én rute.

## Fase 3 — QC-dashboard (admin)

`/admin/quality` lister hver artist med flagg:

- mangler bilde / ikke-verifisert bilde
- mangler bio i EN/NO/SV/DE
- mangler YouTube-videoer
- ødelagt slug eller dupliserte slugs
- manglende SEO-metadata
- ikke koblet til noen reviews

Bilde-policy: **flagg for manuell gjennomgang** — ingen AI-genererte portretter, ingen gjettet auto-assignment. Wikidata P18 (Commons) brukes kun hvis artisten har lagret `wikidata_qid`.

## Fase 4 — YouTube-overhaul

- `youtube_videos`-tabell koblet til artist (kategori: album / live / interview / documentary / festival)
- Server-fn som søker `channelId` for offisielle kanaler først, så verifiserte uploads
- Dedupe på `videoId`
- Admin-UI for å godkjenne/avvise foreslåtte videoer
- Embed-komponent som validerer at video fortsatt eksisterer

## Fase 5 — Reviews-restaurering

**Avhengig av om gammel Supabase-DB er tilgjengelig:**

- **Hvis du har SQL-dump eller export**: importer direkte til ny `blues_reviews`-tabell
- **Hvis ikke**: bygg `blues_reviews` + admin-CRUD + `/reviews` + `/reviews/$slug` med multilingual, scoring, artist-kobling, JSON-LD `Review` schema. Du fyller inn innhold via admin.

Spørsmål jeg trenger svar på: **Har du en eksport av gamle `blues_reviews`-rader?** Hvis ja, last opp som SQL eller JSON.

## Fase 6 — Oversettelse-policy + identitet

- Språk-fallback: vis EN med diskret "Translation pending NO/SV/DE" når lokal mangler. Ingen maskinoversettelse.
- Designgjennomgang av artist-, reviews-, og landingsside slik at det føles redaksjonelt og blues-autentisk (typografi, atmosfære, ikke generisk).
- Endelig fjerne plassholder-innhold på rotsiden.

## Teknisk

- All datalogikk i `createServerFn` (`*.functions.ts`). DB-skriv via `requireSupabaseAuth` + admin-rolle. Aldri `client.server.ts` i klient-kjede.
- Bilder portert til Supabase Storage-bucket `artist-images` (offentlig lesing, kun admin-skriv).
- Migrations: én per fase, med RLS-policies (offentlig SELECT, admin INSERT/UPDATE/DELETE).
- Strenge Zod-validatorer på alle server-fn input.

## Hva jeg foreslår å starte med nå (én leveranse)

**Fase 1 + 2** i denne meldingen: migration for `artists`/`blues_reviews`/`artist_images`/`youtube_videos`, seed-script for ~120 artister, og generisk `/artists/$slug`-detaljside med multilingual + SEO + Wikidata-hook. Det gir deg umiddelbart en proff artist-arkitektur før vi går videre til QC-dashboard, YouTube-overhaul og reviews.

## Spørsmål før jeg starter

1. **Har du SQL/JSON-dump av gamle `blues_reviews`?** (avgjør Fase 5 — restaurering vs ny struktur)
2. **OK å bygge én generisk `/artists/$slug`-rute** og pensjonere de regionsspesifikke detalj-sidene (BritishArtistDetail, EuropeanArtistDetail, ...)? Det gir én sannhetskilde.
3. **OK med bilde-policy "flagg, ikke gjett"** — manglende bilder vises som n​øytral placeholder + admin-flagg, ingen auto-Unsplash/AI?

Si fra, så starter jeg Fase 1+2 umiddelbart i neste melding.
