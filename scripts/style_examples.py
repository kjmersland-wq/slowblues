#!/usr/bin/env python3
"""Build real listening examples for every blues style on /compare.

    python scripts/style_examples.py            # report: what was found per style
    python scripts/style_examples.py --write    # also writes src/data/styleExamples.ts

For each style in src/data/blues.ts (STYLES) the script takes its key artists, looks them up
on the site (live D1, plus the unpublished drafts in content/new-artists), collects the YouTube
videos already attached to those profiles (real recordings by the artist, nothing generated),
re-checks every id with the YouTube Data API (public, embeddable) and keeps up to MAX_PER_STYLE
examples from different artists. Output feeds the hover popup: song title + artist + player.

Videos that are clearly not a single song (live-concert uploads, documentaries, interviews) are
skipped unless nothing else exists. Song names are cleaned from the video title; check the report
and fix odd ones in OVERRIDES. Needs no search quota (videos.list = 1 unit per 50 ids).
"""
from __future__ import annotations

import argparse
import json
import re
import sys

from _d1 import ROOT, query
from youtube_links import YouTube, load_key, problem_with

MAX_PER_STYLE = 4
SKIP = re.compile(r"\b(documentary|interview|full concert|full show|lesson|tutorial|how to|reaction|biography|trailer)\b", re.I)
# slug-name aliases used in STYLES -> D1 artist name fragment
ALIASES = {"John Mayall": "John Mayall & the Bluesbreakers", "Z.Z. Hill": "Z.Z. Hill", "B.B. King": "B.B. King"}
# manual fixes: youtube_id -> (song, artist) when the cleaned title is wrong
OVERRIDES: dict[str, tuple[str, str]] = {
    "mLOhPKf8IsU": ("Hellhound on My Trail", "Robert Johnson"),
    "NdgrQoZHnNY": ("Death Letter Blues", "Son House"),
    "_xWqtiFJKfs": ("Pony Blues", "Charley Patton"),
    "8njn9UbQwZs": ("Devil Got My Woman", "Skip James"),
    "TIxFr2HMx6Y": ("Hoochie Coochie Man (1954)", "Muddy Waters"),
    "RZS5OoKFdME": ("Smokestack Lightning", "Howlin' Wolf"),
    "kWLQSplVP3Y": ("Juke (1952)", "Little Walter"),
    "i2ahsO6jlpQ": ("Damn Right, I've Got the Blues (Glastonbury 2008)", "Buddy Guy"),
    "HvgJgsacoQ8": ("Call It Stormy Monday (1947)", "T-Bone Walker"),
    "-6JOEx44ZvI": ("Hide Away", "Freddie King"),
    "evjMjpd4PNM": ("Texas Flood (live, Austin)", "Stevie Ray Vaughan & Double Trouble"),
    "MF5fQXVZGug": ("Crossroads (live, Winterland 1968)", "Eric Clapton with Cream"),
    "VvYxJQRogKs": ("Albatross (live, Amsterdam 1969)", "Peter Green (Fleetwood Mac)"),
    "t8nq21t3FKo": ("Live at the Marquee, 1969", "John Mayall & the Bluesbreakers"),
    "HJHXt_upF1c": ("You Got to Walk That Lonesome Valley", "Mississippi John Hurt"),
    "oica5jG7FpU": ("The Thrill Is Gone (1969)", "B.B. King"),
    "5CCeVwbyB5E": ("I'd Rather Go Blind (Montreux 1977)", "Etta James"),
    "adRGd54rUGs": ("Sloe Gin (Royal Albert Hall)", "Joe Bonamassa"),
    "CFjMeOnqAPI": ("Bright Lights", "Gary Clark Jr."),
    "Wy0RGsd2-JA": ("Bleach Blonde Bottle Blues", "Larkin Poe"),
    "UKXxImxkJjE": ("Broken (feat. Beth Hart)", "Walter Trout"),
}


def styles_from_ts() -> list[dict]:
    t = (ROOT / "src" / "data" / "blues.ts").read_text(encoding="utf-8")
    block = t[t.index("export const STYLES") : t.index("type Festival")]
    out = []
    for m in re.finditer(r'slug: "([a-z-]+)", name: "([^"]+)".*?artists: \[([^\]]*)\]', block):
        out.append({"slug": m.group(1), "name": m.group(2), "artists": re.findall(r'"([^"]+)"', m.group(3))})
    return out


def clean_song(title: str, artist: str) -> str:
    t = re.sub(r"\s*[\(\[][^\)\]]*(official|audio|video|live|remaster|hd|lyric|topic|\d{4})[^\)\]]*[\)\]]", "", title, flags=re.I)
    t = re.sub(re.escape(artist), "", t, flags=re.I)
    t = re.sub(r"[\"“”‘’']", "", t) if t.count('"') >= 2 else t
    t = re.sub(r"^[\s\-–—:|]+|[\s\-–—:|]+$", "", t)
    t = re.sub(r"\s+[-–—|]\s+.*$", "", t) if len(t.split()) > 6 else t
    return t.strip() or title


def load_site_artists() -> list[dict]:
    rows = query("SELECT slug, name, videos FROM artists")
    for r in rows:
        r["videos"] = json.loads(r["videos"] or "[]")
        r["published"] = True
    for f in (ROOT / "content" / "new-artists").glob("*.json"):
        d = json.loads(f.read_text(encoding="utf-8"))
        if d["slug"] not in {r["slug"] for r in rows} and d.get("videos"):
            rows.append({"slug": d["slug"], "name": d["name"], "videos": d["videos"], "published": False})
    return rows


def find(artists: list[dict], name: str) -> dict | None:
    key = re.sub(r"[^a-z0-9]", "", ALIASES.get(name, name).casefold())
    for a in artists:
        if re.sub(r"[^a-z0-9]", "", a["name"].casefold()).startswith(key):
            return a
    return None


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    styles = styles_from_ts()
    artists = load_site_artists()
    cands: dict[str, list[dict]] = {}
    ids: list[str] = []
    for s in styles:
        cands[s["slug"]] = []
        for name in s["artists"]:
            a = find(artists, name)
            if not a:
                continue
            for v in a["videos"]:
                vid = v.get("youtube_id")
                if vid:
                    cands[s["slug"]].append({"artist": a["name"], "slug": a["slug"], "id": vid, "title": v.get("title", ""), "kind": v.get("kind"), "published": a["published"]})
                    ids.append(vid)
    details = YouTube(load_key()).video_details(ids)

    result: dict[str, list[dict]] = {}
    for s in styles:
        picked, used = [], set()
        pool = [c for c in cands[s["slug"]] if c["id"] in details and not problem_with(details[c["id"]])]
        pool.sort(key=lambda c: (bool(SKIP.search(c["title"])), c["kind"] != "featured"))
        for c in pool:
            if c["artist"] in used or SKIP.search(c["title"]) and len(pool) > len(picked) + 1:
                continue
            song, artist = OVERRIDES.get(c["id"], (clean_song(c["title"], c["artist"]), c["artist"]))
            picked.append({"artist": artist, "song": song, "id": c["id"]})
            used.add(c["artist"])
            if len(picked) == MAX_PER_STYLE:
                break
        result[s["slug"]] = picked
        flag = "" if len(picked) >= 3 else "   <-- few examples"
        print(f"\n{s['name']} ({len(picked)}){flag}")
        for p in picked:
            print(f"   {p['artist']} — {p['song']}   [{p['id']}]")
        missing = [n for n in s["artists"] if not find(artists, n)]
        if missing:
            print(f"   not on the site yet: {', '.join(missing)}")

    if args.write:
        out = ROOT / "src" / "data" / "styleExamples.ts"
        body = json.dumps(result, ensure_ascii=False, indent=2)
        out.write_text(
            "// GENERATED by scripts/style_examples.py -- real recordings already attached to the artists' profiles,\n"
            "// verified embeddable via the YouTube Data API. Do not edit by hand; re-run the script.\n\n"
            "export type StyleExample = { artist: string; song: string; id: string };\n\n"
            f"export const STYLE_EXAMPLES: Record<string, StyleExample[]> = {body};\n",
            encoding="utf-8",
        )
        print(f"\nwrote {out}")


if __name__ == "__main__":
    main()
