
## Mål
Erstatte statisk `ARTISTS`/`PROFILES` med en database-drevet artistmodell som støtter alle ni seksjonene fra skjermbildene, og bygge admin-UI for redigering/oppretting.

## 1. Database

Én `artists`-tabell med skalarfelt + JSONB for strukturerte lister (raskere å bygge enn 10 koblede tabeller, gir én form per artist i admin):

```
artists
├── slug (PK, unik)            ├── tag, era, region
├── name, alt_name             ├── img (URL/sti)
├── short (kortbeskrivelse)    ├── born, died, origin
├── active_years               ├── bio (text[]) — avsnitt
├── influence_note (text)      ├── sort_order (int)
└── JSONB-kolonner:
    ├── family            [{ relation, name, note }]
    ├── formative         [string]
    ├── instruments       [{ category, name, years, note }]
    ├── anecdotes         [string]
    ├── collaborators     [{ name, years, note }]
    ├── videos            [{ kind: "featured"|"more", title, youtube_id, channel, duration, views, thumbnail, note }]
    ├── discography       [{ year, title, composers, producer, label, chart, sales, notes, musicians_count }]
    ├── awards            [{ year, title, category, note }]
    ├── related_slugs     [string]
    ├── signature_songs   [string]
    ├── influences        [string]
    └── labels            [string]
```

RLS: alle kan lese (`SELECT true`), kun admin kan skrive (`has_role(auth.uid(),'admin')`).

Seed: alle eksisterende `ARTISTS` + `PROFILES` migreres inn. Lonnie Johnson fylles komplett som mal for alle ni seksjoner.

## 2. Frontend — lesing

- `src/lib/artists.ts` — hooks: `useArtists()`, `useArtist(slug)` via supabase-klient med React Query–stil caching i state.
- `src/routes/artists.tsx` — leser fra DB i stedet for `ARTISTS`-konstant. Beholder filter/søk.
- `src/routes/artists.$slug.tsx` — utvides med seksjonsblokker som **kun rendres når data finnes**, så tomme artister ser like ryddige ut som i dag:
  1. Hero (eksisterende)
  2. Bio (eksisterende)
  3. Familie og privatliv
  4. Formende opplevelser
  5. Instrumenter og utstyr (3 kolonner: gitar / annet / vokal)
  6. Historier og anekdoter
  7. Samarbeidspartnere
  8. Se & Lytt (utvalgt YouTube-embed + karusell)
  9. Diskografi (tabell)
  10. Priser og anerkjennelse
  11. Relaterte artister (lenker)
  12. Del-knapper (eksisterende) + kilder

## 3. Admin — redigering

Utvide `src/routes/admin.tsx` med ny fane "Artister":
- Liste over alle artister med søk + "Rediger" / "Slett" / "Ny artist"
- Redigeringsskjema (`src/components/admin/ArtistEditor.tsx`) med:
  - Skalarfelt: navn, slug, tag, era, kort, bilde-URL, født, død, opprinnelse, aktive år
  - Bio: tekstarea (split på `\n\n` til avsnitt)
  - Repeater-komponenter for hver liste/JSONB-seksjon (legg til/fjern rad)
- Lagre via `supabase.from('artists').upsert(...)`

## 4. Bakoverkompatibilitet
- `ARTISTS`/`PROFILES`-konstantene blir kun brukt som seed; eksisterende referanser (f.eks. `__root.tsx` head, `gallery.tsx`) byttes til DB-fetch der det er behov, ellers beholdes for typede falbacks.
- `IMG`-bilder fortsetter å fungere — artister bruker eksisterende URL-er.

## Teknisk
- Migration: opprett tabell + indekser (slug, tag, sort_order) + RLS-policies + `updated_at`-trigger.
- Seed: én stor `INSERT … VALUES (…)` via `supabase--insert` etter migrasjonen er godkjent.
- Frontend bruker eksisterende `supabase`-klient (browser-side) siden alle lesninger er offentlige og admin-skriving går gjennom RLS med innlogget session.
- Ingen server-fns trengs.

## Leveranseplan (rekkefølge)
1. Migration → din godkjenning
2. Seed eksisterende artister + komplett Lonnie Johnson
3. Frontend: hook + lese-side oppdateringer
4. Admin: liste + editor
5. Test og verifiser
