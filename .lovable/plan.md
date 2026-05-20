# SlowBlues — Berik artistprofiler fra zip-data

Berik alle 353 artistprofiler med rikere data fra den opplastede zip-en, gjør strukturelle endringer som gjelder universelt, og bygg verktøy for lenkeverifikasjon. Jeg fabrikkerer ikke data — artister som ikke finnes i zip-en eller andre verifiserbare kilder beholder tomme felter til du fyller dem inn manuelt.

## Hva zip-en faktisk inneholder

Zip-en har detaljerte data for ca. 70–120 artister fordelt på `scandinavianArtists.ts`, `britishArtists.ts`, `europeanArtists.ts`, `africanArtists.ts`, `australianArtists.ts`, `canadianArtists.ts`, `modernAmericanArtists.ts` og `artists.ts` (US). Datastrukturen inkluderer for hver innspilling: `musicians[]`, `chartPosition`, `sales`, `producer`, `composers[]`, `spotifyTrackId`. På artistnivå finnes `family[]`, `collaborators[]`, `socialLinks` (website/facebook/instagram/youtube/spotify) og `youtubeVideoIds[]`.

Pressitater/kritikersitater finnes som fritekst inne i `biographyEn` (f.eks. "Blueprint magazine called him..."), ikke som strukturerte felt. Disse må jeg ekstrahere manuelt eller la deg legge til via admin.

## Fase 1 — Skjemaendringer (universelt)

Ett migrationsskritt mot `artists`-tabellen:

- Legg til kolonne `press_quotes jsonb NOT NULL DEFAULT '[]'` med form `[{ quote, author, role, source_title, source_url, year }]`.
- Legg til kolonne `website_url text` og `facebook_url text` (utledet fra `social_links`, men eksplisitte felter gjør lenkesjekken enklere).
- Legg til kolonne `link_check jsonb DEFAULT '{}'` for resultat av siste HEAD-sjekk: `{ website: { status, checked_at }, facebook: { status, checked_at } }`.

Discography-strukturen utvider jeg via koden (jsonb krever ingen schema-endring). Hver discography-entry kan nå inneholde `musicians[]`, `chart_position`, `sales_estimate`, `youtube_id` i tillegg til eksisterende felter.

## Fase 2 — Dataimport fra zip

Skriv `scripts/import-zip-enrichment.ts` som:

1. Leser alle artist-arrays fra zip-en
2. For hver artist matcher mot eksisterende `slug` i Supabase
3. **Beriker uten å overskrive eksisterende verdier**:
   - `discography` → erstatter med zip-versjon kun hvis zip har flere entries eller flere felter per entry (musicians/chartPosition/sales/producer/composers)
   - `family` → erstatter hvis zip har flere entries
   - `collaborators` → merge
   - `social_links` → fyller inn manglende felter (website, facebook, instagram, youtube) — fjerner spotify
   - `youtube_video_ids` → merge unike IDs
4. Kjører som server-funksjon, ikke som vilkårlig migrasjon, så du ser logg over hva som ble oppdatert.

## Fase 3 — Fjern Spotify og legg til YouTube-embed på album

I `ArtistDetailView.tsx`:

- Fjern Spotify-knapp/lenke helt fra Diskografi-seksjonen og hero
- Behold andre lyttelenker (Bandcamp, Apple Music på reviews-objekter)
- For hver discography-entry: hvis `youtube_id` finnes, vis "Spill på YouTube"-lenke som åpner `youtube-nocookie.com/embed/<id>` i et innebygd lite preview-vindu (samme COEP-fix som konsertsiden)
- Vis `musicians[]`, `chart_position`, `sales_estimate` per album når feltene finnes (skjul hvis tomme)
- Legg til ny seksjon "Pressomtaler" som rendrer `press_quotes[]` med sitat, forfatter/rolle, og klikkbar kildelenke

Konsertsiden (`concerts.$slug.tsx`) har allerede YouTube-embed via `youtube_video_id`. Sjekk at alle konsertrader har feltet utfylt og merge inn fra zip der mulig.

## Fase 4 — Lenkeverifikasjon (admin-verktøy, ikke auto-slett)

Ny rute `/admin/links` som:

- Lister alle artister med website/facebook fra `social_links`
- Knapp "Kjør sjekk" → server-funksjon som gjør HEAD-request med 5s timeout for alle 353 artisters lenker (batch på 20 parallelt)
- Lagrer status (`200`/`404`/`timeout`/`dns_fail`) i `link_check`-kolonnen
- Viser tabell med "Døde lenker" filtrert
- Du sletter manuelt via en "Fjern denne lenken"-knapp per rad — ingen auto-sletting

## Fase 5 — Pressitater fra zip-biografier

Skriv `scripts/extract-press-quotes.ts` som regex-skanner zip-ens biographyEn-felt etter mønstre som `"X magazine called him 'Y'"`, `"Z said 'W'"`, `"according to Q,"`, og pre-fyller `press_quotes` med utkast som du kan godkjenne i admin (felt `verified: false` til du sjekker av).

For artister hvor zip ikke har kildebare sitater, lar jeg feltet stå tomt.

## Hva som IKKE skjer i denne runden

- Ingen syntetiske/AI-genererte sitater eller salgstall
- Ingen auto-sletting av lenker (kun rapportering)
- Artister utenfor zip-en får kun strukturelle endringer (Spotify fjernet, nye tomme seksjoner), ikke nytt innhold
- Ingen Wikipedia/Wikidata-scraping i denne runden (kan komme som Fase 6 hvis du ønsker)

## Tekniske detaljer

- Migration: én SQL-fil legger til `press_quotes`, `website_url`, `facebook_url`, `link_check`
- Importer: `scripts/import-zip-enrichment.ts` kjøres lokalt med `bun run` mot service-role-key, ikke via klienten
- Lenkesjekk: `createServerFn` med `requireSupabaseAuth` + admin-rolle, kjører `Promise.all` i batches
- Frontend: kun endringer i `src/components/artists/ArtistDetailView.tsx`
- TypeScript-typer i `src/lib/artists.ts` utvides med `musicians`, `chart_position`, `sales_estimate`, `youtube_id` på `DiscographyEntry` og ny `PressQuote`-type
