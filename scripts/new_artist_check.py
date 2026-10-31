#!/usr/bin/env python3
"""Vet candidate artists before they get a profile: duplicates + real YouTube videos.

    python scripts/new_artist_check.py "Johnny Winter" "Bonnie Raitt"
    python scripts/new_artist_check.py --file candidates.txt        # one name per line, # comments

For each name it reports (read-only, nothing is written to D1):
  DUPLICATE CHECK  exact/near match against slug, name, alt_name and birth_name of
                   every artist in D1 (spelling variants included), plus profiles
                   that merely MENTION the name (bio, collaborators) -- CLAUDE.md
                   asks for the member-of-another-profile check too.
  YOUTUBE          embeddable videos found through the Data API, best three with
                   channel and view count. Needs >= 3 plausible hits to count as OK.
                   Video ids come only from the API, never guessed.

Output: a table on screen and out/new-artists/check.json.
"""
from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
import unicodedata
from pathlib import Path

from _d1 import ROOT, query
from youtube_links import YouTube, load_key, problem_with, score


def norm(s: str | None) -> str:
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().casefold()
    s = re.sub(r"\b(the|and|band|his|her|&)\b", " ", s)
    return re.sub(r"[^a-z0-9]+", "", s)


def lit(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"


def duplicates(name: str, existing: list[dict]) -> list[str]:
    n, hits = norm(name), []
    for a in existing:
        for field in ("name", "alt_name", "birth_name", "slug"):
            v = norm(a.get(field))
            if not v:
                continue
            if v == n or (len(n) > 5 and (n in v or v in n)) or difflib.SequenceMatcher(None, n, v).ratio() >= 0.86:
                hits.append(f"{a['name']} ({a['slug']}) via {field}")
                break
    return hits


def mentions(name: str) -> list[str]:
    pat = lit(f"%{name}%")
    rows = query(
        "SELECT slug FROM artists WHERE biography_en LIKE " + pat + " OR collaborators LIKE " + pat +
        " OR bio LIKE " + pat + " OR influences LIKE " + pat + " LIMIT 8"
    )
    return [r["slug"] for r in rows]


def youtube(yt: YouTube, name: str) -> dict:
    ids = yt.search(f"{name} official")
    ids += [i for i in yt.search(f"{name} live") if i not in ids]
    items = [v for v in yt.video_details(ids).values() if not problem_with(v)]
    ranked = sorted(items, key=lambda v: score(v, name, ""), reverse=True)
    good = [v for v in ranked if score(v, name, "") >= 4]
    return {
        "ok": len(good) >= 3,
        "plausible": len(good),
        "top": [
            {"id": v["id"], "title": v["snippet"]["title"], "channel": v["snippet"]["channelTitle"],
             "views": v.get("statistics", {}).get("viewCount")}
            for v in good[:5]
        ],
    }


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("names", nargs="*")
    ap.add_argument("--file")
    ap.add_argument("--no-youtube", action="store_true", help="duplicate check only (no quota)")
    args = ap.parse_args()

    names = list(args.names)
    if args.file:
        names += [l.strip() for l in Path(args.file).read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")]
    if not names:
        ap.error("give names or --file")

    existing = query("SELECT slug, name, alt_name, birth_name FROM artists")
    yt = None if args.no_youtube else YouTube(load_key())

    results = []
    for name in names:
        dup = duplicates(name, existing)
        ment = mentions(name.split(" & ")[0])
        try:
            yres = youtube(yt, name) if yt else None
        except SystemExit as e:  # quota exhausted: keep what we have and stop cleanly
            print(f"STOPPED at {name}: {e}")
            break
        results.append({"name": name, "duplicates": dup, "mentioned_in": ment, "youtube": yres})
        verdict = "DUPLICATE" if dup else ("ok" if (yres is None or yres["ok"]) else "NO VIDEOS")
        print(f"{verdict:10} {name}" + (f"  | matches: {'; '.join(dup)}" if dup else "")
              + (f"  | mentioned in: {', '.join(ment)}" if ment else "")
              + (f"  | yt: {yres['plausible']} plausible" if yres else ""))
        for v in (yres or {}).get("top", []):
            print(f"             - {v['title']} · {v['channel']} · {v['views']} views")

    out = ROOT / "out" / "new-artists"
    out.mkdir(parents=True, exist_ok=True)
    (out / "check.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    # accumulate every vetting run (keyed by name) so video ids found once are never lost
    allf = out / "check_all.json"
    acc = json.loads(allf.read_text(encoding="utf-8")) if allf.exists() else {}
    for r in results:
        if r["youtube"] or r["name"] not in acc:
            acc[r["name"]] = r
    allf.write_text(json.dumps(acc, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nwrote {out / 'check.json'}  (searches used: {yt.searches if yt else 0})")


if __name__ == "__main__":
    main()
