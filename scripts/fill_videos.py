#!/usr/bin/env python3
"""Fill `videos` in content/new-artists/*.json with API-verified YouTube ids.

    python scripts/fill_videos.py                 # every draft that has no videos yet
    python scripts/fill_videos.py earl-king cream # only these slugs
    python scripts/fill_videos.py --max-searches 20

For each draft: search the YouTube Data API (embeddable, syndicated), keep plausible hits
(artist in title/channel, no covers/lessons), and make sure the FEATURED video comes from the
artist's own channel, a label or a "- Topic" channel (CLAUDE.md: no fan re-upload as the only
source). Ids come from the API only, never guessed. Stops cleanly when the daily quota is gone;
re-run later and it continues with the drafts that are still empty.
"""
from __future__ import annotations

import argparse
import json
import sys

from _d1 import ROOT
from new_artist_check import norm
from youtube_links import YouTube, load_key, problem_with, score

DRAFTS = ROOT / "content" / "new-artists"


def is_official(name: str, channel: str) -> bool:
    ch = norm(channel)
    return norm(name) in ch or ch.endswith(("topic", "official", "records", "vevo")) or "official" in ch


def pick(yt: YouTube, name: str) -> list[dict]:
    found: dict[str, dict] = {}
    for q in (name, f"{name} official"):
        ids = yt.search(q)
        for v in yt.video_details(ids).values():
            if not problem_with(v) and score(v, name, "") >= 4:
                found[v["id"]] = v
        if any(is_official(name, v["snippet"]["channelTitle"]) for v in found.values()) and len(found) >= 3:
            break
    ranked = sorted(found.values(), key=lambda v: score(v, name, ""), reverse=True)
    official = [v for v in ranked if is_official(name, v["snippet"]["channelTitle"])]
    rest = [v for v in ranked if v not in official]
    return (official[:2] + rest)[:3] if official else []


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slugs", nargs="*")
    ap.add_argument("--max-searches", type=int, default=60)
    args = ap.parse_args()

    yt = YouTube(load_key())
    done, missing = [], []
    for f in sorted(DRAFTS.glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        if args.slugs and f.stem not in args.slugs:
            continue
        if d.get("videos") and not args.slugs:
            continue
        if yt.searches >= args.max_searches:
            print("search cap reached; re-run to continue")
            break
        try:
            vids = pick(yt, d["name"])
        except SystemExit as e:
            print(f"STOPPED at {d['name']}: {e}")
            break
        if not vids:
            missing.append(d["name"])
            print(f"no official-channel video found for {d['name']}")
            continue
        d["videos"] = [
            {"kind": "featured" if i == 0 else "more", "title": v["snippet"]["title"], "youtube_id": v["id"],
             "channel": v["snippet"]["channelTitle"],
             **({} if is_official(d["name"], v["snippet"]["channelTitle"]) else {"note": "Third-party upload; replace with an official source if one turns up."})}
            for i, v in enumerate(vids)
        ]
        d["_todo"] = [t for t in d.get("_todo", []) if "Videos:" not in t]
        f.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")
        done.append(d["name"])
        print(f"{d['name']}: {len(vids)} videos (featured: {vids[0]['snippet']['channelTitle']})")
    print(f"\nfilled {len(done)}; without a usable video: {missing or 'none'}; searches used: {yt.searches}")


if __name__ == "__main__":
    main()
