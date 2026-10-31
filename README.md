# Slow Blues

Kan du gjenoppbygge slow-blues.com 100%?  På engelsk

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://slowblues.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/866b24d0-92bc-4065-a1b1-d03f56aa92e9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
## Content scripts (Python, run locally)

Site hosting is Cloudflare Workers (see `wrangler.jsonc`); content lives in D1 and static files in `public/`.
The scripts only *read* D1 (via `npx wrangler login` once) and write review files; nothing is changed in
D1 until you apply a generated SQL file yourself. Python 3 only, no `pip install`.
Test on a few artists with `--artists gary-moore,howlin-wolf,joe-bonamassa` (not `--all`).

| Task | Command | Output |
| --- | --- | --- |
| YouTube: find dead/non-embeddable | `python scripts/youtube_links.py --all --check-only` | `out/youtube/report.md` |
| YouTube: replacements | `python scripts/youtube_links.py --all --emit-sql` | `out/youtube/update.sql` (guarded UPDATEs) |
| YouTube: suggestions for artists with no video | `python scripts/youtube_links.py --all --suggest-missing` | `out/youtube/report.md` |
| Session musicians ("Musikere") | `python scripts/mb_musicians.py "Gary Moore" --merge-slug gary-moore` | dry-run table + `out/mb/gary-moore.sql` |
| Artist count in copy | `python scripts/site_stats.py` then `--write` | edits `dict.ts`, `support.tsx`; `public/data/stats.json` |
| Ticker messages (weekly) | `python scripts/ticker_data.py` | `public/data/ticker.json` |
| Quiz drafts (every 14 days) | `python scripts/quiz_data.py --if-due` | `public/data/quiz.json` |

Workflow: run script -> read the dry-run -> (D1 changes) `npx wrangler d1 execute slowblues --remote --file out/...sql`
-> `git add`/commit/push -> `npm run build` and `npx nitro deploy --prebuilt` (or your Cloudflare Git integration, if connected).
`YOUTUBE_API_KEY` stays in `.dev.vars` (gitignored). D1 writes need your OK first; all five languages must be ready.

Workers notes: the live ticker and quiz are already dynamic (D1 + cron in `sync-worker/`, read by `/api/ticker` and the quiz routes),
so the JSON in `public/data/` is a reviewable/static snapshot, served at `/data/ticker.json` and `/data/quiz.json`. To make a page
use it, `fetch("/data/ticker.json")` on the client; to refresh it automatically instead, run the same logic in a Worker cron trigger (TypeScript port).
