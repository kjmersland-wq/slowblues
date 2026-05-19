# Complete Artist Page Architecture

Building professional, multilingual, SEO-optimized detail pages for all 352 existing artists. Preserves all existing data — no overwrites, no placeholders.

## 1. URL structure (new routes)

Add language-prefixed routes alongside existing `/artists/$slug`:

```text
/artists                       (existing list, default locale = no)
/artists/$slug                 (existing detail, default locale = no)
/en/artists, /en/artists/$slug
/sv/artists, /sv/artists/$slug
/de/artists, /de/artists/$slug
```

Implementation: pathless layout `src/routes/{-$locale}.tsx` reading optional locale param, with child routes `artists.tsx` and `artists.$slug.tsx`. Locale flows via context to `pickLang()`. Existing un-prefixed routes keep working (Norwegian default) — no breaking changes.

## 2. Standardized artist detail page sections

Rebuild `artists.$slug.tsx` to render every section when data exists, gracefully hide when empty:

1. **Hero** — name, hero image, country flag, styles, active years, short intro
2. **Full biography** — long-form bio + career history + musical evolution + influence/legacy
3. **Musical styles** — chip taxonomy from `styles` + `categories`
4. **Discography** — albums from `discography` + `key_recordings` (year, title, label, description, Spotify link)
5. **Famous songs** — `signature_songs` list
6. **Influences & related artists** — `influences` + cards built from `related_slugs` and auto-derived (same country/era/genre)
7. **Embedded media** — YouTube grid from `youtube_video_ids` + `videos`
8. **Gallery** — `gallery_images` + `img` with credit
9. **External links** — `social_links` + `external_links` (Spotify, YouTube, Discogs, Wikipedia, official site)
10. **Article references** — `article_references` blog cross-links

## 3. SEO per page

In `head()`:
- `title` = `seo_title_{lang}` || `${name} — Slow Blues`
- `description` = `seo_description_{lang}` || derived from short
- `og:title`, `og:description`, `og:type=profile`
- `og:image` = `og_image` || resolved hero image (absolute via `getRequestOrigin` server fn)
- `<link rel="canonical">` = `/{locale}/artists/${slug}` (locale-aware, leaf-only)
- `<link rel="alternate" hreflang>` for no/en/sv/de + `x-default`

## 4. Structured data (JSON-LD)

Inline via `head().scripts`:
- **MusicGroup** or **Person** on detail page (name, image, sameAs[social_links], genre, foundingDate from born)
- **MusicAlbum** entries for each discography item
- **MusicRecording** for signature songs
- **BreadcrumbList** for `Home → Artists → {Name}`
- **WebSite** + **Organization** stays in `__root.tsx`

## 5. Internal linking

`src/lib/relatedArtists.ts` — given an artist, compute:
1. Explicit `related_slugs`
2. Same country (limit 6)
3. Same era (limit 6)
4. Overlapping styles (limit 6)

Dedup, rank by overlap, return top 8. Rendered as cards under "Related artists".

## 6. Search + filtering

Extend `/artists` list with:
- Text search (name + search_terms + birth_place)
- Country filter (from distinct `country` values)
- Genre filter (from `styles`)
- Era filter (from `era`)
- Region filter (existing)
- Language switcher (no/en/sv/de) — affects displayed text via `pickLang`

URL-driven via TanStack `validateSearch` so filters are bookmarkable and SSR-friendly.

## 7. Sitemap + hreflang

New `src/routes/sitemap[.]xml.ts`:
- Static routes
- One `<url>` per artist with `<xhtml:link rel="alternate" hreflang>` entries for no/en/sv/de + x-default
- Sourced from DB query of all slugs

`public/robots.txt` keep, no changes needed.

## 8. Language fallback

Centralize in existing `pickLang(record, lang, field)` — already does `sv → no → en`. Verify and add `de` fallback chain (`de → en → no`). Use everywhere text is rendered. **Never invent translations.**

## 9. Files to create / edit

**Create**:
- `src/routes/{-$locale}.tsx` (layout providing locale context)
- `src/routes/{-$locale}/artists.tsx` (list — re-export of existing list logic with locale)
- `src/routes/{-$locale}/artists.$slug.tsx` (detail — re-export)
- `src/lib/locale.tsx` (LocaleContext + `useLocale()` hook, supported locales constant)
- `src/lib/relatedArtists.ts` (relationship computation)
- `src/lib/artistJsonLd.ts` (Schema.org builders)
- `src/lib/origin.functions.ts` (getRequestOrigin server fn for absolute og:image)
- `src/routes/sitemap[.]xml.ts`

**Edit**:
- `src/routes/artists.$slug.tsx` — expand to all 10 sections, full SEO head, JSON-LD
- `src/routes/artists.tsx` — add country/genre/era filters, language switcher, URL search params
- `src/lib/artists.ts` — verify `pickLang` covers de; export filter helpers
- `src/routes/__root.tsx` — ensure WebSite/Organization JSON-LD only

**Preserve untouched**: DB schema (already has all needed columns), all artist data, image assets, admin component.

## 10. Non-goals (explicit)

- No translation generation (only show what exists, fall back per chain)
- No DB schema changes — current schema already supports everything
- No removal/rewrite of existing artists
- No simplification of regional grouping (kept as additional filter)

## Acceptance

- All 352 artists reachable at `/artists/$slug` AND `/{en,sv,de}/artists/$slug`
- Detail page shows all sections that have data; missing sections hidden cleanly
- View-source on a detail page shows route-specific `<title>`, canonical, hreflang, og:*, JSON-LD MusicGroup
- `/sitemap.xml` returns all artist URLs with hreflang alternates
- List page supports text + country + genre + era + region + language filters via URL
