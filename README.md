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
## Keeping YouTube links fresh

```
python scripts/youtube_links.py --all --check-only      # cheap: detect dead links
python scripts/youtube_links.py --all --emit-sql         # + replacement search, writes out/youtube/
```
Review out/youtube/report.md, then (after Kjell says yes) apply with
`npx wrangler d1 execute slowblues --remote --file out/youtube/update.sql`.
Requires YOUTUBE_API_KEY in .dev.vars. Details: header of scripts/youtube_links.py.
