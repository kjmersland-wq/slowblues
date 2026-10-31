#!/usr/bin/env python3
"""Fetch album musician credits from MusicBrainz for the discography table.

Usage:
    python scripts/mb_musicians.py "Gary Moore"
    python scripts/mb_musicians.py "Gary Moore" "Peter Green" --out-dir out/mb
    python scripts/mb_musicians.py --file artists.txt --format json
    python scripts/mb_musicians.py "Gary Moore" --mbid 189e9e1f-... --limit 5

Output (default, one line per album):
    Year | Title | Name (Instrument), Name (Instrument)

Notes
- stdlib only, no pip install needed.
- MusicBrainz allows ~1 request/second for anonymous clients and requires a
  meaningful User-Agent. Requests are throttled to MIN_INTERVAL, and 429/503
  responses are retried with backoff (honouring Retry-After).
- Responses are cached under .mb-cache/ so re-runs and crashes are cheap.
  Use --no-cache to force fresh data.
- Read-only: this script never touches D1. Credits from MusicBrainz are a
  starting point; check them (and the sources) before they go into a profile.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://musicbrainz.org/ws/2"
USER_AGENT = "SlowBluesDiscographyTool/1.0 ( https://www.slow-blues.com )"
MIN_INTERVAL = 1.1  # seconds between requests (MB limit is 1/s)
MAX_RETRIES = 5
CACHE_DIR = Path(__file__).resolve().parent.parent / ".mb-cache"

# Relation types that count as "playing on the record".
PERFORMER_TYPES = {"instrument", "vocal", "performer"}
# Attributes that carry no instrument information.
NOISE_ATTRS = {"additional", "assistant", "associate", "co", "guest", "solo", "task", "uncredited"}

_last_request = 0.0


# --------------------------------------------------------------------------
# HTTP with throttling, retry and caching
# --------------------------------------------------------------------------
def mb_get(path: str, params: dict, use_cache: bool = True) -> dict:
    global _last_request
    params = {**params, "fmt": "json"}
    url = f"{API}/{path}?{urllib.parse.urlencode(params)}"

    cache_file = CACHE_DIR / (hashlib.sha1(url.encode()).hexdigest() + ".json")
    if use_cache and cache_file.exists():
        return json.loads(cache_file.read_text(encoding="utf-8"))

    for attempt in range(1, MAX_RETRIES + 1):
        wait = MIN_INTERVAL - (time.monotonic() - _last_request)
        if wait > 0:
            time.sleep(wait)
        _last_request = time.monotonic()
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            if use_cache:
                CACHE_DIR.mkdir(exist_ok=True)
                cache_file.write_text(json.dumps(data), encoding="utf-8")
            return data
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < MAX_RETRIES:
                retry_after = e.headers.get("Retry-After")
                delay = max(2.0, float(retry_after)) if retry_after and retry_after.isdigit() else 2.0 ** attempt
                log(f"  rate limited ({e.code}), waiting {delay:.0f}s (attempt {attempt}/{MAX_RETRIES})")
                time.sleep(delay)
                continue
            if e.code == 404:
                return {}
            raise
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt == MAX_RETRIES:
                raise
            delay = 2 ** attempt
            log(f"  network error ({e}), retrying in {delay}s")
            time.sleep(delay)
    raise RuntimeError(f"gave up on {url}")


def log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)


# --------------------------------------------------------------------------
# MusicBrainz lookups
# --------------------------------------------------------------------------
def find_artist(name: str, mbid: str | None, use_cache: bool) -> dict:
    if mbid:
        return mb_get(f"artist/{mbid}", {}, use_cache)
    data = mb_get("artist", {"query": f'artist:"{name}"', "limit": 5}, use_cache)
    artists = data.get("artists", [])
    if not artists:
        raise SystemExit(f"No MusicBrainz artist found for {name!r}")
    # Prefer an exact (case-insensitive) name match with the highest score.
    exact = [a for a in artists if a["name"].casefold() == name.casefold()]
    best = (exact or artists)[0]
    if len(exact) > 1 or (not exact and len(artists) > 1):
        log("  candidates (pass --mbid to choose another):")
        for a in artists:
            log(f"    {a['id']}  {a['name']}  {a.get('disambiguation', '')}  score={a.get('score')}")
    return best


def list_release_groups(artist_id: str, include_live: bool, include_compilations: bool, use_cache: bool) -> list[dict]:
    groups: list[dict] = []
    offset = 0
    while True:
        data = mb_get("release-group", {"artist": artist_id, "type": "album", "limit": 100, "offset": offset}, use_cache)
        batch = data.get("release-groups", [])
        groups.extend(batch)
        offset += len(batch)
        if not batch or offset >= data.get("release-group-count", 0):
            break

    def keep(rg: dict) -> bool:
        secondary = {s.casefold() for s in rg.get("secondary-types", [])}
        if not include_live and "live" in secondary:
            return False
        if not include_compilations and "compilation" in secondary:
            return False
        # Never useful for a credits table.
        return not secondary & {"dj-mix", "mixtape/street", "demo", "interview", "audiobook", "spokenword"}

    groups = [g for g in groups if keep(g) and g.get("first-release-date")]
    groups.sort(key=lambda g: g["first-release-date"])
    return groups


def pick_releases(rg_id: str, use_cache: bool) -> list[str]:
    """Official releases in the group, earliest first, preferring more tracks."""
    data = mb_get("release", {"release-group": rg_id, "status": "official", "limit": 100}, use_cache)
    releases = data.get("releases", [])
    if not releases:
        data = mb_get("release", {"release-group": rg_id, "limit": 100}, use_cache)
        releases = data.get("releases", [])
    releases.sort(key=lambda r: (r.get("date") or "9999", -sum(m.get("track-count", 0) for m in r.get("media", []))))
    return [r["id"] for r in releases]


def collect_credits(release_id: str, use_cache: bool) -> dict[str, list[str]]:
    """Return {performer name: [instrument/vocal, ...]} for one release."""
    rel = mb_get(
        f"release/{release_id}",
        {"inc": "recordings+artist-rels+recording-level-rels"},
        use_cache,
    )
    credits: dict[str, dict[str, None]] = {}  # name -> ordered set of roles

    def add(relations: list[dict]) -> None:
        for r in relations:
            if r.get("type") not in PERFORMER_TYPES or "artist" not in r:
                continue
            who = r["artist"]["name"]
            roles = [a for a in r.get("attributes", []) if a.casefold() not in NOISE_ATTRS]
            if r["type"] == "vocal" and not roles:
                roles = ["vocals"]
            elif r["type"] == "vocal":
                roles = [x if "vocal" in x.casefold() else f"{x} vocals" for x in roles]
            slot = credits.setdefault(who, {})
            for role in roles or [""]:
                if role:
                    slot[role] = None

    add(rel.get("relations", []))
    for medium in rel.get("media", []):
        for track in medium.get("tracks", []):
            add(track.get("recording", {}).get("relations", []))

    return {who: tidy_roles(list(roles)) for who, roles in credits.items()}


def tidy_roles(roles: list[str]) -> list[str]:
    """Drop MusicBrainz qualifiers and overlapping entries (vocals vs lead vocals)."""
    roles = list(dict.fromkeys(re.sub(r"\s*\(.*?\)", "", r).strip() for r in roles))
    if any(r.endswith(" vocals") for r in roles):
        roles = [r for r in roles if r != "vocals"]
    if "bass guitar" in roles:
        roles = [r for r in roles if r != "bass"]
    return roles


def format_musicians(credits: dict[str, list[str]]) -> str:
    parts = []
    for who, roles in sorted(credits.items(), key=lambda kv: kv[0].casefold()):
        parts.append(f"{who} ({', '.join(roles)})" if roles else who)
    return ", ".join(parts)


# --------------------------------------------------------------------------
# Per-artist driver and output
# --------------------------------------------------------------------------
def build_rows(name: str, args: argparse.Namespace) -> tuple[dict, list[dict]]:
    use_cache = not args.no_cache
    log(f"== {name}")
    artist = find_artist(name, args.mbid, use_cache)
    log(f"  using {artist['name']} ({artist['id']}) {artist.get('disambiguation', '')}".rstrip())

    groups = list_release_groups(artist["id"], args.include_live, args.include_compilations, use_cache)
    if args.limit:
        groups = groups[: args.limit]
    log(f"  {len(groups)} albums")

    rows = []
    for i, rg in enumerate(groups, 1):
        year = rg["first-release-date"][:4]
        log(f"  [{i}/{len(groups)}] {year} {rg['title']}")
        credits: dict[str, list[str]] = {}
        release_id = None
        # Some pressings carry no credits; try a couple of others before giving up.
        for release_id in pick_releases(rg["id"], use_cache)[: args.tries]:
            credits = collect_credits(release_id, use_cache)
            if credits:
                break
        if args.skip_main:
            credits.pop(artist["name"], None)
        rows.append(
            {
                "year": year,
                "title": rg["title"],
                "musicians": format_musicians(credits),
                "credits": credits,
                "release_group": rg["id"],
                "release": release_id,
            }
        )
    return artist, rows


def render(rows: list[dict], fmt: str, artist: dict) -> str:
    if fmt == "json":
        return json.dumps({"artist": artist["name"], "mbid": artist["id"], "albums": rows}, ensure_ascii=False, indent=2)
    sep = "\t" if fmt == "tsv" else " | "
    lines = [sep.join([r["year"], r["title"], r["musicians"] or "(no credits on MusicBrainz)"]) for r in rows]
    return "\n".join(lines)


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.casefold()).strip("-")


def main() -> None:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")  # Windows consoles default to cp1252

    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("artists", nargs="*", help="artist names (quote names with spaces)")
    p.add_argument("--file", help="text file with one artist name per line (# comments allowed)")
    p.add_argument("--mbid", help="MusicBrainz artist id; only valid with a single artist")
    p.add_argument("--format", choices=["pipe", "tsv", "json"], default="pipe")
    p.add_argument("--out-dir", help="write one file per artist here instead of printing")
    p.add_argument("--limit", type=int, help="only the first N albums (handy for testing)")
    p.add_argument("--include-live", action="store_true", help="include live albums")
    p.add_argument("--include-compilations", action="store_true", help="include compilations")
    p.add_argument("--skip-main", action="store_true", help="leave the artist themself out of the musician list")
    p.add_argument("--tries", type=int, default=2, help="releases to try per album when one has no credits")
    p.add_argument("--no-cache", action="store_true", help="ignore the .mb-cache/ response cache")
    args = p.parse_args()

    names = list(args.artists)
    if args.file:
        for line in Path(args.file).read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#"):
                names.append(line)
    if not names:
        p.error("give at least one artist name or --file")
    if args.mbid and len(names) != 1:
        p.error("--mbid only works with exactly one artist")

    out_dir = Path(args.out_dir) if args.out_dir else None
    if out_dir:
        out_dir.mkdir(parents=True, exist_ok=True)

    for name in names:
        try:
            artist, rows = build_rows(name, args)
        except SystemExit as e:  # artist not found: report and move on
            log(str(e))
            continue
        text = render(rows, args.format, artist)
        if out_dir:
            ext = {"pipe": "txt", "tsv": "tsv", "json": "json"}[args.format]
            target = out_dir / f"{slugify(name)}.{ext}"
            target.write_text(text + "\n", encoding="utf-8")
            log(f"  wrote {target}")
        else:
            print(text)


if __name__ == "__main__":
    main()
