
## Scope

Four workstreams. Built in this order so the highest-value automation lands first.

---

### 1. Weekly newsletter automation (MailerLite + Lovable AI)

**Pipeline (runs Monday 20:30 CET via pg_cron → `/api/public/hooks/weekly-newsletter`):**

1. Gather inputs:
   - Latest blues news (Firecrawl search: "blues music news", festivals, obituaries — last 7 days, English sources).
   - New reviews from `blues_reviews` published since last edition.
   - New guestbook entries (count, for "welcome to new readers" line).
   - New MailerLite subscribers since last edition (welcome block).
2. Lovable AI (`google/gemini-3-flash-preview`) drafts the edition in Kjell's voice (personal, warm, English only). System prompt enforces:
   - Editor's personal tone (sample tone seeded from existing newsletters).
   - News-with-context, never just headlines.
   - Editor note about Warsaw move included in every edition until move date (configurable; auto-stops after 31 Aug 2026).
   - Internal links to slow-blues.com reviews/artist pages + external links to sources.
3. Render via existing `renderNewsletterHTML` template in `src/lib/newsletterTemplate.ts` (no new template).
4. POST to MailerLite Campaigns API: create campaign → schedule for Monday 21:00 Europe/Oslo. No send if no content gathered (logged to `newsletter_runs` table).

**Admin page** `/admin/newsletter` — list scheduled/sent runs, "preview next edition now" button, "force send" override.

**Tables:**
- `newsletter_runs` (id, scheduled_for, status, mailerlite_campaign_id, draft_html, source_summary, created_at).

---

### 2. Ticker (auto news feed + admin)

**Table** `ticker_items`: id, text (jsonb i18n: en/no/de/fr/es/pl), href, source (`admin`|`auto`), pinned, expires_at, created_at.

**Admin page** `/admin/ticker` — create/edit/delete items, pin, set expiry, multilingual text fields. Auto-translates EN → NO/DE/FR/ES/PL via Lovable AI on save.

**Auto job** runs 3×/day (08:00, 13:00, 18:00 CET) via pg_cron → `/api/public/hooks/ticker-refresh`: Firecrawl search blues news headlines, dedupe vs existing, insert top 3 as `source='auto'` with 48h expiry, auto-translated.

**Frontend:** new `<NewsTicker />` component in `SiteHeader.tsx` (slim marquee under nav). Reads from `ticker_items` where not expired, pinned first, then newest. Includes pinned Warsaw-move item.

---

### 3. /news route + dynamic surfaces refresh

- New public route `src/routes/news.index.tsx`: lists last 30 days of auto-curated news + recent reviews + recent newsletter editions. SSR with loader-fed OG tags. Hreflang for all locales.
- New `news_items` table (id, title jsonb i18n, summary jsonb i18n, source_url, image_url, published_at, kind: `news`|`festival`|`obituary`). Populated by the same Firecrawl pipeline that feeds the ticker (one fetch, two outputs).
- Homepage: add "Latest news" strip pulling top 4 from `news_items`.
- Sitemap: include /news.

Evergreen pages (artists, history, styles, etc.) untouched.

---

### 4. Guestbook polish

- Update `src/routes/guestbook.tsx` intro copy: warm, personal welcome in Kjell's voice (all locales via i18n dict).
- Add "Leave a greeting" CTA above the form, more prominent placement.
- Add link to guestbook in `SiteFooter.tsx` if missing.

---

## Technical details

**Secrets:** `MAILERLITE_API_KEY` (✓), `LOVABLE_API_KEY` (✓). Firecrawl needs the connector — I'll link it via `standard_connectors--connect` when we start step 1.

**Cron URLs (stable prod):** `https://project--866b24d0-92bc-4065-a1b1-d03f56aa92e9.lovable.app/api/public/hooks/*`. All hook routes verify a shared `apikey` (Supabase anon key) header.

**Auto-translation:** Lovable AI Gateway, batch per item, cached in jsonb columns. Translations happen at write-time so reads stay fast.

**Editor note logic:** hardcoded boolean `now() < '2026-09-01'` in the AI prompt builder; trivially removed later.

**No marketing emails:** newsletter is a personal weekly letter to opted-in subscribers — fits app-email policy.

---

## Build order (one PR each)

1. Tables (`newsletter_runs`, `ticker_items`, `news_items`) + RLS + grants.
2. Firecrawl connector + shared news-gather server fn.
3. Ticker: component, admin page, auto-refresh hook, cron.
4. Newsletter: AI draft fn, MailerLite scheduler, hook route, cron, admin page.
5. /news route + homepage strip + sitemap entry.
6. Guestbook copy + footer link.

---

## What I will NOT do without further confirmation

- Touch evergreen content pages (artists, history, styles, instruments, gear, etc.).
- Change the existing newsletter HTML template design.
- Add marketing/promotional content to the newsletter.
- Send a real newsletter — the first scheduled run will sit as a draft in MailerLite for you to approve once, then auto-send weekly.

Approve and I'll start with step 1.
