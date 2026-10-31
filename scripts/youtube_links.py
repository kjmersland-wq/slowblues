#!/usr/bin/env python3
"""Check artist YouTube embeds, find replacements, and prepare the D1 update.

Pipeline (read-only until YOU apply the SQL):
  1. Load artists (slug, name, videos, youtube_video_ids) from the live D1
     via `wrangler d1 execute --remote`, or from a JSON export (--from-json).
  2. Check every video id with the YouTube Data API (videos.list, 1 quota
     unit per 50 ids): missing/deleted, private, not embeddable, upload failed.
  3. For each broken video, search for a replacement (search.list, 100 quota
     units each) and score candidates: official/topic/artist channel, title
     match, embeddable, no covers/lessons/reactions.
  4. Write a report (markdown + json) and, with --emit-sql, a guarded UPDATE
     file for the confident replacements only. Nothing is written to D1 here;
     per CLAUDE.md you review the dry-run, say yes, then apply the SQL:
         npx wrangler d1 execute slowblues --remote --file out/youtube/update.sql

Usage:
    python scripts/youtube_links.py --artists gary-moore,howlin-wolf,joe-bonamassa
    python scripts/youtube_links.py --all --emit-sql
    python scripts/youtube_links.py --all --check-only          # no searches, no quota burn
    python scripts/youtube_links.py --from-json artists.json --artists gary-moore

Options worth knowing: --max-searches N caps quota use (default 40 = 4000
units of the 10,000/day free quota); --out-dir changes where reports go.

The key is read from YOUTUBE_API_KEY in .dev.vars (or the environment). It is
sent in a header and never printed or written to any output file.
Stdlib only; no pip install required.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://www.googleapis.com/youtube/v3"
CONFIDENT = 7  # minimum score for a replacement to go into the SQL file

BAD_WORDS = re.compile(
    r"\b(cover|lesson|tutorial|how to|reaction|karaoke|tribute|backing track|"
    r"tab|tabs|jam track|instrumental version|slowed|nightcore|8d)\b",
    re.I,
)
OFFICIAL_CHANNEL = re.compile(r"(vevo|- topic$|official|records|music)$", re.I)


# --------------------------------------------------------------------------
# API access (key never leaves the request header)
# --------------------------------------------------------------------------
def load_key() -> str:
    key = os.environ.get("YOUTUBE_API_KEY")
    env_file = ROOT / ".dev.vars"
    if not key and env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            if line.startswith("YOUTUBE_API_KEY="):
                key = line.split("=", 1)[1].strip().strip("\"'")
    if not key:
        sys.exit("YOUTUBE_API_KEY not found in .dev.vars or the environment")
    return key


class YouTube:
    def __init__(self, key: str):
        self._key = key
        self.searches = 0

    def get(self, endpoint: str, params: dict) -> dict:
        url = f"{API}/{endpoint}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers={"x-goog-api-key": self._key})
        for attempt in range(1, 5):
            try:
                with urllib.request.urlopen(req, timeout=30) as resp:
                    return json.loads(resp.read().decode("utf-8"))
            except urllib.error.HTTPError as e:
                body = e.read().decode("utf-8", "replace")
                if e.code == 403 and "quota" in body.lower():
                    sys.exit("YouTube API quota exhausted; try again after midnight Pacific time")
                if e.code >= 500 and attempt < 4:
                    time.sleep(2**attempt)
                    continue
                sys.exit(f"YouTube API error {e.code} on {endpoint}: {body[:200]}")  # URL (and key) never shown
            except urllib.error.URLError:
                if attempt == 4:
                    sys.exit(f"network error talking to YouTube ({endpoint})")
                time.sleep(2**attempt)
        raise RuntimeError("unreachable")

    def video_details(self, ids: list[str]) -> dict[str, dict]:
        """id -> item, only for ids YouTube still knows. Missing ids are dead."""
        found: dict[str, dict] = {}
        unique = list(dict.fromkeys(ids))
        for i in range(0, len(unique), 50):
            chunk = unique[i : i + 50]
            data = self.get("videos", {"part": "snippet,status,contentDetails,statistics", "id": ",".join(chunk)})
            for item in data.get("items", []):
                found[item["id"]] = item
        return found

    def search(self, query: str) -> list[str]:
        self.searches += 1
        data = self.get(
            "search",
            {
                "part": "snippet",
                "q": query,
                "type": "video",
                "videoEmbeddable": "true",
                "videoSyndicated": "true",
                "maxResults": 8,
                "safeSearch": "none",
            },
        )
        return [it["id"]["videoId"] for it in data.get("items", [])]


# --------------------------------------------------------------------------
# Loading artists
# --------------------------------------------------------------------------
def load_artists(args: argparse.Namespace) -> list[dict]:
    if args.from_json:
        rows = json.loads(Path(args.from_json).read_text(encoding="utf-8"))
    else:
        sql = "SELECT slug, name, videos, youtube_video_ids, signature_songs FROM artists"
        if args.artists:
            slugs = ",".join("'" + s.replace("'", "''") + "'" for s in args.artists)
            sql += f" WHERE slug IN ({slugs})"
        cmd = ["npx", "wrangler", "d1", "execute", "slowblues", "--remote", "--json", "--command", sql]
        res = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace", shell=(os.name == "nt"))
        if res.returncode != 0:
            sys.exit(f"wrangler failed (are you logged in? `npx wrangler login`):\n{res.stderr[-500:]}")
        start = res.stdout.find("[")
        rows = json.loads(res.stdout[start:])[0]["results"]

    out = []
    for r in rows:
        if args.artists and r["slug"] not in args.artists:
            continue
        for col in ("videos", "youtube_video_ids", "signature_songs"):
            if isinstance(r.get(col), str):
                try:
                    r[col] = json.loads(r[col] or "[]")
                except json.JSONDecodeError:
                    r[col] = []
            r[col] = r.get(col) or []
        out.append(r)
    return out


# --------------------------------------------------------------------------
# Checking and scoring
# --------------------------------------------------------------------------
def problem_with(item: dict | None) -> str | None:
    if item is None:
        return "deleted / not found"
    st = item.get("status", {})
    if st.get("privacyStatus") == "private":
        return "private"
    if not st.get("embeddable", False):
        return "embedding disabled"
    if st.get("uploadStatus") in ("failed", "rejected", "deleted"):
        return f"upload {st['uploadStatus']}"
    if item.get("contentDetails", {}).get("regionRestriction", {}).get("allowed") == []:
        return "blocked everywhere"
    return None


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9 ]+", " ", s.casefold())


def tokens(s: str) -> set[str]:
    return {t for t in norm(s).split() if len(t) > 2}


def score(item: dict, artist: str, wanted_title: str) -> int:
    sn, st = item["snippet"], item.get("statistics", {})
    title, channel = sn.get("title", ""), sn.get("channelTitle", "")
    pts = 0
    surname = norm(artist).split()[-1] if artist else ""
    if norm(artist) in norm(channel) or (surname and surname in norm(channel)):
        pts += 4  # the artist's own channel
    elif OFFICIAL_CHANNEL.search(channel):
        pts += 3
    if norm(artist) in norm(title):
        pts += 2
    elif surname and surname in norm(title):
        pts += 1
    want = tokens(wanted_title) - tokens(artist)
    if want:
        pts += round(3 * len(want & tokens(title)) / len(want))
    if BAD_WORDS.search(title) and not BAD_WORDS.search(wanted_title):
        pts -= 5
    pts += min(2, int(math.log10(max(1, int(st.get("viewCount", 0)))) // 3))  # 1k+ -> 1, 1M+ -> 2
    return pts


def clean_title(title: str, artist: str) -> str:
    t = re.sub(r"\(.*?\)|\[.*?\]", " ", title)
    t = re.sub(re.escape(artist), " ", t, flags=re.I)
    t = re.sub(r"[-–—:|]+", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def iso_duration(iso: str) -> str:
    m = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    if not m:
        return ""
    h, mi, s = (int(x or 0) for x in m.groups())
    return f"{h}:{mi:02d}:{s:02d}" if h else f"{mi}:{s:02d}"


# --------------------------------------------------------------------------
# SQL (guarded UPDATE, per CLAUDE.md) and reports
# --------------------------------------------------------------------------
def q(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def guarded_update(slug: str, old_videos: list, new_videos: list, old_ids: list, new_ids: list) -> str:
    dump = lambda v: json.dumps(v, ensure_ascii=False, separators=(",", ":"))  # noqa: E731
    return (
        f"UPDATE artists SET videos = {q(dump(new_videos))}, youtube_video_ids = {q(dump(new_ids))} "
        f"WHERE slug = {q(slug)} AND videos = {q(dump(old_videos))} AND youtube_video_ids = {q(dump(old_ids))};"
    )


def main() -> None:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--artists", type=lambda s: [x for x in s.split(",") if x], help="comma-separated slugs")
    p.add_argument("--all", action="store_true", help="every artist")
    p.add_argument("--from-json", help="artist export instead of querying D1")
    p.add_argument("--check-only", action="store_true", help="detect dead links, skip replacement search")
    p.add_argument("--emit-sql", action="store_true", help="write guarded UPDATEs for confident replacements")
    p.add_argument("--suggest-missing", action="store_true", help="propose candidates for artists with no videos (report only)")
    p.add_argument("--max-searches", type=int, default=40, help="cap search.list calls (100 quota units each)")
    p.add_argument("--out-dir", default=str(ROOT / "out" / "youtube"))
    args = p.parse_args()
    if not args.artists and not args.all:
        p.error("choose --artists slug1,slug2 or --all")

    yt = YouTube(load_key())
    artists = load_artists(args)
    print(f"{len(artists)} artists loaded", file=sys.stderr)

    # One batched check for every id on every selected artist.
    all_ids = [v["youtube_id"] for a in artists for v in a["videos"] if v.get("youtube_id")]
    all_ids += [i for a in artists for i in a["youtube_video_ids"]]
    details = yt.video_details(all_ids)

    report, sql_lines = [], []
    for a in artists:
        entry = {"slug": a["slug"], "name": a["name"], "videos": [], "ok": 0}
        new_videos, changed = [], False
        replaced: dict[str, str] = {}
        for v in a["videos"]:
            vid = v.get("youtube_id", "")
            bad = problem_with(details.get(vid)) if vid else "no id"
            if not bad:
                entry["ok"] += 1
                new_videos.append(v)
                continue
            rec = {"title": v.get("title"), "old_id": vid, "problem": bad, "candidate": None, "confident": False}
            if not args.check_only and yt.searches < args.max_searches:
                wanted = clean_title(v.get("title", ""), a["name"]) or (a["signature_songs"][0] if a["signature_songs"] else "")
                ids = [i for i in yt.search(f'{a["name"]} {wanted}') if i != vid]
                cands = yt.video_details(ids)
                ranked = sorted(
                    (c for c in cands.values() if not problem_with(c)),
                    key=lambda c: score(c, a["name"], wanted),
                    reverse=True,
                )
                if ranked:
                    best = ranked[0]
                    s = score(best, a["name"], wanted)
                    rec["candidate"] = {
                        "id": best["id"],
                        "title": best["snippet"]["title"],
                        "channel": best["snippet"]["channelTitle"],
                        "views": best.get("statistics", {}).get("viewCount"),
                        "score": s,
                        "url": f'https://www.youtube.com/watch?v={best["id"]}',
                    }
                    rec["confident"] = s >= CONFIDENT
                    if rec["confident"]:
                        nv = dict(v)
                        nv.update(
                            youtube_id=best["id"],
                            title=best["snippet"]["title"],
                            channel=best["snippet"]["channelTitle"],
                            duration=iso_duration(best["contentDetails"].get("duration", "")),
                        )
                        for stale in ("views", "thumbnail"):
                            nv.pop(stale, None)
                        new_videos.append(nv)
                        replaced[vid] = best["id"]
                        changed = True
                        entry["videos"].append(rec)
                        continue
            # Not replaced: keep as is so a guarded UPDATE can never delete content silently.
            new_videos.append(v)
            entry["videos"].append(rec)

        # Artists with no video at all: propose candidates for a human to pick.
        # Report only -- never goes into update.sql.
        if args.suggest_missing and not a["videos"] and yt.searches < args.max_searches:
            song = a["signature_songs"][0] if a["signature_songs"] else ""
            if isinstance(song, dict):
                song = song.get("title") or song.get("name") or ""
            wanted = str(song)
            ids = yt.search(f'{a["name"]} {wanted}'.strip() if wanted else f'{a["name"]} official live')
            cands = [c for c in yt.video_details(ids).values() if not problem_with(c)]
            cands.sort(key=lambda c: score(c, a["name"], wanted), reverse=True)
            entry["suggestions"] = [
                {
                    "id": c["id"],
                    "title": c["snippet"]["title"],
                    "channel": c["snippet"]["channelTitle"],
                    "views": c.get("statistics", {}).get("viewCount"),
                    "score": score(c, a["name"], wanted),
                    "url": f'https://www.youtube.com/watch?v={c["id"]}',
                }
                for c in cands[:3]
            ]

        if changed and args.emit_sql:
            new_ids = [replaced.get(i, i) for i in a["youtube_video_ids"]]
            sql_lines.append(guarded_update(a["slug"], a["videos"], new_videos, a["youtube_video_ids"], new_ids))
        report.append(entry)

    out = Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    (out / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    md = [f"# YouTube link check — {stamp}", "", f"Searches used: {yt.searches} (~{yt.searches * 100} quota units)", ""]
    broken = 0
    for e in report:
        md.append(f"## {e['name']} (`{e['slug']}`) — {e['ok']} ok, {len(e['videos'])} broken")
        for r in e["videos"]:
            broken += 1
            md.append(f"- ✗ **{r['title']}** `{r['old_id']}` — {r['problem']}")
            c = r["candidate"]
            if c:
                tag = "REPLACE" if r["confident"] else "REVIEW (low confidence)"
                md.append(f"  - {tag}: [{c['title']}]({c['url']}) · {c['channel']} · score {c['score']}")
            elif not args.check_only:
                md.append("  - no embeddable candidate found (or search cap reached)")
        for s in e.get("suggestions", []):
            md.append(f"- ? [{s['title']}]({s['url']}) · {s['channel']} · score {s['score']} · {s['views'] or '?'} views")
        md.append("")
    (out / "report.md").write_text("\n".join(md), encoding="utf-8")

    if args.emit_sql:
        header = "-- Generated by scripts/youtube_links.py. Review report.md first. Guarded UPDATEs: no-ops if the row changed.\n"
        (out / "update.sql").write_text(header + "\n".join(sql_lines) + "\n", encoding="utf-8")

    print(f"{len(artists)} artists, {broken} broken videos, {len(sql_lines)} artist updates ready")
    print(f"report: {out / 'report.md'}")
    if args.emit_sql:
        print(f"sql:    {out / 'update.sql'}  (not applied)")


if __name__ == "__main__":
    main()
