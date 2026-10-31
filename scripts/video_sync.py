#!/usr/bin/env python3
"""One command to find, verify and attach YouTube VIDEOS and SONGS for EVERY artist, with minimal API quota.

  videos  -> artists.videos          official videos / good live performances (shown as video cards)
  songs   -> artists.key_recordings  single tracks, mostly from the artist's "- Topic" channel
                                     (shown as a playable song list on the artist page)

    python scripts/video_sync.py                  # everything (verify, discover, attach)
    python scripts/video_sync.py --check-only     # only verify what is attached (0 API quota)
    python scripts/video_sync.py --artists gary-moore,howlin-wolf
    python scripts/video_sync.py --no-api         # cache + oEmbed + Wikidata only, never touch the API
    python scripts/video_sync.py --budget 2000    # cap API units this run (default 3000 of the 10,000/day)
    python scripts/video_sync.py --apply          # run the generated SQL through wrangler (asks first)

What it does, cheapest method first
  1. VERIFY with YouTube oEmbed (no API key, no quota): public + embeddable videos return 200;
     deleted -> 404; private / embedding disabled -> 401. Result is cached forever (data/youtube-cache.json).
  2. REUSE spares: every verified-but-unused video found earlier is kept per artist, so replacing a
     dead embed costs nothing.
  3. DISCOVER channels for free: the channel behind an already attached video (oEmbed gives the channel
     URL), a YouTube link already on the profile, or Wikidata's "YouTube channel ID" (P2397).
  4. LIST a channel's uploads with playlistItems (1 quota unit for 50 videos; a "- Topic" channel is
     a clean list of official songs) and verify the picks with oEmbed again.
  5. SEARCH (100 units each) only when nothing else produced a video; capped by --max-search, and an
     artist is never searched twice within 180 days.
  Quota use is tracked in the cache. When the API says "quota exceeded" the run keeps going with
  everything that needs no quota; nothing breaks, and the next run continues where this one stopped.

Output (never writes to D1 by itself)
  * published artists -> out/video-sync/update.sql  (guarded UPDATE ... WHERE videos = <old value>)
  * unpublished drafts -> videos written into content/new-artists/<slug>.json
  * out/video-sync/report.md  (what changed, what is still missing, quota used)
Apply the SQL after you have read the report:
    npx wrangler d1 execute slowblues --remote --file out/video-sync/update.sql
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

from _d1 import ROOT, query
from youtube_links import load_key

CACHE_FILE = ROOT / "data" / "youtube-cache.json"
OUT = ROOT / "out" / "video-sync"
DRAFTS = ROOT / "content" / "new-artists"
UA = {"User-Agent": "Mozilla/5.0 (compatible; SlowBluesVideoSync/1.0; +https://www.slow-blues.com)"}
API = "https://www.googleapis.com/youtube/v3"
TARGET = 3  # videos wanted per artist
TARGET_SONGS = 5  # songs wanted per artist
OK_TTL_DAYS = 60  # re-verify a good video (free oEmbed) after this long
DEAD_TTL_DAYS = 30
SEARCH_COOLDOWN_DAYS = 180
COST = {"videos": 1, "playlistItems": 1, "channels": 1, "search": 100}
BAD = re.compile(r"(full album|compilation|greatest hits|best of|playlist|karaoke|\bcover\b|lesson|tutorial|reaction|\d+\s*hours?|documentary|interview|trailer)", re.I)
SOCIAL = re.compile(r"(#|\bshorts?\b|teaser|trailer|out now|available now|pre-?order|drop a comment|covered by|sampled by|featured in|goes to space|announce|tour dates|giveaway|subscribe|behind the scenes|\bposter\b|\bepisode\b|covering|brought her|brought his|fan favou?rite|from generation|[\U0001F300-\U0001FAFF\u2600-\u27BF])", re.I)
BLUESY = re.compile(r"musician|singer|band|guitar|pianist|harmonica|songwriter|blues|vocalist|group|duo|trio|composer|drummer|bassist", re.I)


def today() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def quota_day() -> str:
    """YouTube's daily quota resets at midnight Pacific time; UTC-8 is close enough."""
    return (datetime.now(timezone.utc) - timedelta(hours=8)).date().isoformat()


def age_days(iso: str | None) -> float:
    if not iso:
        return 1e9
    return (datetime.now(timezone.utc).date() - datetime.fromisoformat(iso).date()).days


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", (s or "").casefold())


# --------------------------------------------------------------------------
# cache
# --------------------------------------------------------------------------
class Cache:
    def __init__(self) -> None:
        self.data = {"version": 1, "videos": {}, "artists": {}, "quota": {}}
        if CACHE_FILE.exists():
            self.data.update(json.loads(CACHE_FILE.read_text(encoding="utf-8")))
        q = self.data.setdefault("quota", {})
        if q.get("day") != quota_day():
            q.update(day=quota_day(), used=0, search_blocked=False, all_blocked=False)

    def save(self) -> None:
        CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
        tmp = CACHE_FILE.with_suffix(".tmp")
        tmp.write_text(json.dumps(self.data, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
        tmp.replace(CACHE_FILE)

    @property
    def videos(self) -> dict:
        return self.data["videos"]

    def artist(self, slug: str) -> dict:
        return self.data["artists"].setdefault(slug, {})

    @property
    def quota(self) -> dict:
        return self.data["quota"]


class QuotaOut(Exception):
    pass


class YT:
    """Thin YouTube Data API wrapper with a budget and quota bookkeeping. Key is sent as a header only."""

    def __init__(self, cache: Cache, budget: int, use_api: bool) -> None:
        self.c, self.budget, self.use_api = cache, budget, use_api
        self.key = load_key() if use_api else None
        self.units = 0

    def call(self, endpoint: str, params: dict) -> dict:
        q, cost = self.c.quota, COST[endpoint]
        if not self.use_api:
            raise QuotaOut("API disabled (--no-api)")
        if q.get("all_blocked"):
            raise QuotaOut("API quota used up for today")
        if endpoint == "search" and q.get("search_blocked"):
            raise QuotaOut("search quota used up for today")
        if self.units + cost > self.budget:
            raise QuotaOut(f"run budget of {self.budget} units reached")
        url = f"{API}/{endpoint}?{urllib.parse.urlencode(params)}"
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"x-goog-api-key": self.key}), timeout=30) as r:
                data = json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")
            if e.code in (403, 429) and "quota" in body.lower():
                if "Search Queries" in body:
                    q["search_blocked"] = True
                    raise QuotaOut("daily search quota used up (other endpoints still work)")
                q["all_blocked"] = True
                raise QuotaOut("daily API quota used up")
            raise RuntimeError(f"YouTube API {e.code} on {endpoint}: {body[:160]}")  # URL (and key) never shown
        self.units += cost
        q["used"] = q.get("used", 0) + cost
        return data


# --------------------------------------------------------------------------
# free verification: oEmbed
# --------------------------------------------------------------------------
def oembed(vid: str) -> dict | None:
    url = "https://www.youtube.com/oembed?" + urllib.parse.urlencode({"url": f"https://www.youtube.com/watch?v={vid}", "format": "json"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
                d = json.loads(r.read().decode("utf-8"))
            return {"status": "ok", "title": d.get("title", ""), "channel": d.get("author_name", ""), "channel_url": d.get("author_url", "")}
        except urllib.error.HTTPError as e:
            if e.code == 404 or e.code == 400:
                return {"status": "dead"}
            if e.code in (401, 403):
                return {"status": "blocked"}  # private or embedding disabled
            if e.code == 429:
                time.sleep(3 * (attempt + 1))
                continue
            return None
        except Exception:
            time.sleep(1)
    return None  # unknown (network trouble): do not cache


def verify(cache: Cache, vid: str, force: bool = False) -> dict:
    """Cached status for a video id; asks oEmbed (free) when unknown or stale."""
    rec = cache.videos.get(vid)
    ttl = OK_TTL_DAYS if rec and rec.get("status") == "ok" else DEAD_TTL_DAYS
    if rec and not force and age_days(rec.get("checked")) < ttl:
        return rec
    fresh = oembed(vid)
    if fresh is None:
        return rec or {"status": "unknown"}
    fresh["checked"] = today()
    cache.videos[vid] = fresh
    return fresh


def verify_many(cache: Cache, ids: list[str]) -> None:
    todo = [i for i in dict.fromkeys(ids) if not (cache.videos.get(i) and age_days(cache.videos[i].get("checked")) < (OK_TTL_DAYS if cache.videos[i].get("status") == "ok" else DEAD_TTL_DAYS))]
    if not todo:
        return
    print(f"  verifying {len(todo)} video(s) via oEmbed (no quota) ...", file=sys.stderr)
    with cf.ThreadPoolExecutor(6) as ex:
        for vid, res in zip(todo, ex.map(lambda v: (time.sleep(0.05), oembed(v))[1], todo)):
            if res is not None:
                res["checked"] = today()
                cache.videos[vid] = res


# --------------------------------------------------------------------------
# free channel discovery
# --------------------------------------------------------------------------
CHANNEL_RE = re.compile(r"/channel/(UC[\w-]{22})")


def is_official(name: str, channel: str) -> bool:
    ch = norm(channel)
    return norm(name) in ch or ch.endswith(("topic", "official", "records", "vevo")) or "official" in ch


def get_json(url: str) -> dict:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def wikidata_channels(name: str) -> list[str]:
    try:
        s = get_json("https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode({"action": "wbsearchentities", "search": name, "language": "en", "type": "item", "limit": 5, "format": "json"}))
        for e in s.get("search", []):
            if e.get("label", "").casefold() == name.casefold() and BLUESY.search(e.get("description") or ""):
                c = get_json("https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode({"action": "wbgetclaims", "entity": e["id"], "property": "P2397", "format": "json"}))
                ids = [x["mainsnak"]["datavalue"]["value"] for x in c.get("claims", {}).get("P2397", []) if x["mainsnak"].get("datavalue")]
                return [i for i in ids if i.startswith("UC")]
    except Exception:
        pass
    return []


def channels_for(artist: dict, cache: Cache, yt: YT, healthy: list[dict]) -> list[str]:
    rec = cache.artist(artist["slug"])
    chans: list[dict] = rec.setdefault("channels", [])
    have = {c["id"] for c in chans}

    def add(cid: str, source: str) -> None:
        if cid not in have:
            chans.append({"id": cid, "source": source})
            have.add(cid)

    for v in healthy:  # the channel behind a video we already trust
        info = cache.videos.get(v["youtube_id"], {})
        if is_official(artist["name"], info.get("channel", "")):
            m = CHANNEL_RE.search(info.get("channel_url", ""))
            if m:
                add(m.group(1), "attached video")
    for link in artist.get("external_links") or []:  # a YouTube link already on the profile
        m = CHANNEL_RE.search(link.get("url", "")) if isinstance(link, dict) else None
        if m:
            add(m.group(1), "profile link")
    if not chans and age_days(rec.get("wikidata_checked")) > 180:
        rec["wikidata_checked"] = today()
        for cid in wikidata_channels(artist["name"]):
            add(cid, "wikidata")
    return [c["id"] for c in chans]


# --------------------------------------------------------------------------
# candidate discovery
# --------------------------------------------------------------------------
def song_key(title: str) -> str:
    """Title without (live)/(remastered)/brackets, to avoid the same song twice."""
    t = re.sub(r"[\(\[][^\)\]]*[\)\]]", "", title)
    return norm(re.sub(r"\s*[-–]\s*(live|remaster\w*|single version|mono|stereo).*$", "", t, flags=re.I))


def rank(cands: list[dict], artist: dict, mode: str = "video") -> list[dict]:
    """Best first. mode 'song' favours single tracks from Topic channels; 'video' favours official videos / live."""
    songs = [norm(s) for s in (artist.get("signature_songs") or []) if isinstance(s, str)]

    def score(c: dict) -> float:
        t, ch = norm(c["title"]), c.get("channel", "")
        pts = 0.0
        if any(s and s in t for s in songs):
            pts += 3
        if is_official(artist["name"], ch):
            pts += 2
        topic = ch.lower().endswith("topic")
        if mode == "song":
            pts += 2 if topic else 0
            if re.search(r"live|concert|festival", c["title"], re.I):
                pts -= 1
        else:
            pts += 1 if re.search(r"official video|live|concert|festival|session", c["title"], re.I) else 0
            pts -= 2 if topic else 0
        if BAD.search(c["title"]):
            pts -= 5
        return -pts

    return sorted(cands, key=score)


def uploads(cache: Cache, yt: YT, cid: str) -> list[dict]:
    """Up to 50 videos of a channel for 1 quota unit (cached per channel)."""
    store = cache.data.setdefault("channels", {})
    ent = store.get(cid)
    if ent and age_days(ent.get("fetched")) < 90:
        return ent["items"]
    try:
        d = yt.call("playlistItems", {"part": "snippet", "playlistId": "UU" + cid[2:], "maxResults": 50})
    except RuntimeError:  # e.g. 404: channel has no public uploads playlist -> remember, never ask again
        store[cid] = {"fetched": today(), "items": [], "error": "no uploads playlist"}
        return []
    items =[{"id": i["snippet"]["resourceId"]["videoId"], "title": i["snippet"]["title"], "channel": i["snippet"].get("videoOwnerChannelTitle", "")} for i in d.get("items", [])]
    store[cid] = {"fetched": today(), "items": items}
    return items


def search_candidates(cache: Cache, yt: YT, artist: dict) -> list[dict]:
    songs = [s for s in (artist.get("signature_songs") or []) if isinstance(s, str)]
    q = f'{artist["name"]} {songs[0]}' if songs else f'{artist["name"]} official'
    d = yt.call("search", {"part": "snippet", "q": q, "type": "video", "videoEmbeddable": "true", "videoSyndicated": "true", "maxResults": 10})
    return [{"id": i["id"]["videoId"], "title": i["snippet"]["title"], "channel": i["snippet"]["channelTitle"]} for i in d.get("items", [])]


def trusted_channel(name: str, channel: str) -> bool:
    """The artist's own channel, their Topic channel, VEVO or label-style official channel (not just any name match)."""
    ch, n = norm(channel), norm(name)
    if not n:
        return False
    return ch in {n, n + "topic", n + "vevo", n + "official", "official" + n, n + "band", n + "music", n + "tv", n + "officialchannel"} or ch.endswith(n + "topic")


def pick_new(cache: Cache, artist: dict, cands: list[dict], need: int, exclude: set[str], mode: str = "video") -> list[dict]:
    """First `need` candidates (best ranked) that are verified playable AND trustworthy. Uses oEmbed; no quota.

    Rules: official/Topic/VEVO channel of the artist only; no promo posts or shorts; a song must match one of the
    artist's signature songs or come from a "- Topic" channel (which only carries single tracks); a video must match
    a signature song or look like a real performance (live / official video / concert / session)."""
    picked: list[dict] = []
    seen_songs: set[str] = set()
    name = artist["name"]
    songs = [norm(x) for x in (artist.get("signature_songs") or []) if isinstance(x, str)]
    for c in rank(cands, artist, mode):
        if len(picked) >= need:
            break
        if c["id"] in exclude or BAD.search(c["title"]) or SOCIAL.search(c["title"]) or len(c["title"]) > 95:
            continue
        if mode == "song" and (song_key(c["title"]) in seen_songs or not song_key(c["title"])):
            continue
        info = verify(cache, c["id"])
        if info.get("status") != "ok":
            continue
        chan, title = info.get("channel", ""), info.get("title", "")
        if not trusted_channel(name, chan) or SOCIAL.search(title):
            continue
        has_song = any(x and x in norm(title) for x in songs)
        topic = chan.lower().endswith("topic")
        if mode == "song" and not (has_song or topic):
            continue
        if mode == "video" and not (has_song or (norm(name) in norm(title) and re.search(r"live|official video|concert|session", title, re.I))):
            continue
        picked.append({"id": c["id"], "title": title, "channel": chan})
        exclude.add(c["id"])
        seen_songs.add(song_key(title))
        m = CHANNEL_RE.search(info.get("channel_url", ""))  # remember the channel: next time a 1-unit playlist call finds more
        chans = cache.artist(artist["slug"]).setdefault("channels", [])
        if m and m.group(1) not in {x["id"] for x in chans}:
            chans.append({"id": m.group(1), "source": "attached video"})
    return picked


# --------------------------------------------------------------------------
# main
# --------------------------------------------------------------------------
def sql_q(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"


JSON_COLS = ("videos", "key_recordings", "youtube_video_ids", "signature_songs", "external_links")


def load_artists(slugs: list[str] | None, drafts_only: bool) -> list[dict]:
    arts: list[dict] = []
    if not drafts_only:
        rows = query("SELECT slug, name, videos, key_recordings, youtube_video_ids, signature_songs, external_links FROM artists" + (
            " WHERE slug IN (" + ",".join(sql_q(s) for s in slugs) + ")" if slugs else ""))
        for r in rows:
            r["raw"] = {"videos": r["videos"] or "[]", "key_recordings": r["key_recordings"] or "[]"}
            for col in JSON_COLS:
                try:
                    r[col] = json.loads(r[col] or "[]")
                except json.JSONDecodeError:
                    r[col] = []
            r["published"] = True
            arts.append(r)
    have = {a["slug"] for a in arts}
    for f in sorted(DRAFTS.glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        if d["slug"] in have or (slugs and d["slug"] not in slugs):
            continue
        arts.append({"slug": d["slug"], "name": d["name"], "videos": d.get("videos", []), "key_recordings": d.get("key_recordings", []), "youtube_video_ids": [],
                     "signature_songs": d.get("signature_songs", []), "external_links": d.get("external_links", []), "published": False, "file": f, "draft": d})
    return arts


def state(cache: Cache, items: list[dict]) -> tuple[list[dict], list[dict]]:
    """(healthy, dead) split of attached entries using cached oEmbed status."""
    ok, bad = [], []
    for v in items:
        st = cache.videos.get(v.get("youtube_id", ""), {}).get("status")
        (bad if st in ("dead", "blocked") else ok).append(v)
    return ok, bad


def song_entry(c: dict) -> dict:
    return {"title": c["title"], "youtube_id": c["id"], "channel": c["channel"]}


def video_entry(c: dict) -> dict:
    return {"kind": "more", "title": c["title"], "youtube_id": c["id"], "channel": c["channel"]}


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--artists", type=lambda s: [x for x in s.split(",") if x])
    ap.add_argument("--check-only", action="store_true", help="verify attached videos/songs only; no discovery, no API")
    ap.add_argument("--no-api", action="store_true", help="never call the YouTube Data API")
    ap.add_argument("--drafts-only", action="store_true", help="only the unpublished drafts in content/new-artists")
    ap.add_argument("--budget", type=int, default=3000, help="max API units this run (default 3000)")
    ap.add_argument("--max-search", type=int, default=15, help="max search.list calls this run (100 units each)")
    ap.add_argument("--apply", action="store_true", help="run the generated SQL via wrangler after confirmation")
    args = ap.parse_args()

    cache = Cache()
    use_api = not (args.no_api or args.check_only)
    yt = YT(cache, args.budget, use_api)
    arts = load_artists(args.artists, args.drafts_only)
    print(f"{len(arts)} artists ({sum(a['published'] for a in arts)} published, {sum(not a['published'] for a in arts)} drafts)", file=sys.stderr)

    changed: dict[str, dict] = {}  # slug -> {"artist", "videos"?, "key_recordings"?}
    no_videos: list[str] = []
    no_songs: list[str] = []
    notes: list[str] = []
    searches = 0
    try:
        # 1. verify everything attached (free)
        verify_many(cache, [v["youtube_id"] for a in arts for k in ("videos", "key_recordings") for v in a[k] if v.get("youtube_id")] + [i for a in arts for i in a["youtube_video_ids"]])
        dead_extra = [(a["slug"], i) for a in arts for i in a["youtube_video_ids"] if cache.videos.get(i, {}).get("status") in ("dead", "blocked")]
        if dead_extra:
            notes.append("`youtube_video_ids` entries that no longer play (not auto-replaced): " + ", ".join(f"{s}:{i}" for s, i in dead_extra))

        order = sorted(arts, key=lambda a: (len(a["videos"]) + len(a["key_recordings"]), a["slug"]))  # emptiest first
        for a in order:
            vids, songs = [v for v in a["videos"] if v.get("youtube_id")], [v for v in a["key_recordings"] if v.get("youtube_id")]
            hv, dv = state(cache, vids)
            hs, ds = state(cache, songs)
            if dv:  # drop embeds that no longer play
                changed.setdefault(a["slug"], {"artist": a})["videos"] = list(hv)
            if ds:
                changed.setdefault(a["slug"], {"artist": a})["key_recordings"] = list(hs)
            if args.check_only:
                continue
            need_v = TARGET - len(hv)
            need_s = TARGET_SONGS - len(hs)
            has_official = any(is_official(a["name"], cache.videos.get(v["youtube_id"], {}).get("channel", "") or v.get("channel", "")) for v in hv)
            if need_v <= 0 and need_s <= 0 and has_official:
                continue

            rec = cache.artist(a["slug"])
            used = {v["youtube_id"] for v in vids + songs}
            cands: list[dict] = list(rec.get("spares", []))
            # 2. channel uploads: 1 unit per channel, then cached
            try:
                for cid in channels_for(a, cache, yt, hv + hs):
                    cands += uploads(cache, yt, cid)
            except QuotaOut as e:
                notes.append(f"{a['slug']}: {e}")
            # 3. search (100 units): last resort, emptiest artists first, at most --max-search per run, never twice within 180 days
            if not cands and (need_s > 0 or need_v > 0) and use_api and searches < args.max_search and age_days(rec.get("searched")) > SEARCH_COOLDOWN_DAYS:
                try:
                    cands = search_candidates(cache, yt, a)
                    searches += 1
                    rec["searched"] = today()
                except QuotaOut as e:
                    notes.append(f"{a['slug']}: {e}")
            if cands:
                rec["spares"] = cands[:60]
            new_songs = pick_new(cache, a, cands, need_s, set(used), "song") if need_s > 0 else []
            used |= {c["id"] for c in new_songs}
            new_vids = pick_new(cache, a, cands, max(need_v, 1), set(used), "video") if (need_v > 0 or not has_official) else []
            if new_vids:
                changed.setdefault(a["slug"], {"artist": a})["videos"] = changed.get(a["slug"], {}).get("videos", hv) + [video_entry(c) for c in new_vids]
            if new_songs:
                changed.setdefault(a["slug"], {"artist": a})["key_recordings"] = changed.get(a["slug"], {}).get("key_recordings", hs) + [song_entry(c) for c in new_songs]
        for a in arts:
            nv = len(changed.get(a["slug"], {}).get("videos", a["videos"]))
            ns = len(changed.get(a["slug"], {}).get("key_recordings", a["key_recordings"]))
            if nv == 0:
                no_videos.append(a["slug"])
            if ns == 0:
                no_songs.append(a["slug"])
    finally:
        cache.save()

    # outputs ---------------------------------------------------------
    OUT.mkdir(parents=True, exist_ok=True)
    sql: list[str] = []
    lines = [f"# Video & song sync — {today()}", "", f"API units used this run: **{yt.units}** (searches: {searches}); total today (this tool): {cache.quota.get('used', 0)}", ""]
    for slug, ch in changed.items():
        a = ch["artist"]
        if ch.get("videos"):  # exactly one featured video, preferably an official non-Topic one
            lst = ch["videos"]
            for v in lst:
                v["kind"] = "more"

            def chan(v: dict) -> str:
                return cache.videos.get(v["youtube_id"], {}).get("channel", "") or v.get("channel", "")

            best = next((v for v in lst if is_official(a["name"], chan(v)) and not chan(v).lower().endswith("topic")), next((v for v in lst if is_official(a["name"], chan(v))), lst[0]))
            best["kind"] = "featured"
            lst.sort(key=lambda v: v is not best)
        parts = []
        for col in ("videos", "key_recordings"):
            if col in ch:
                before = {v["youtube_id"] for v in a[col] if v.get("youtube_id")}
                after = {v["youtube_id"] for v in ch[col]}
                parts.append(f"{col}: +{len(after - before)} / -{len(before - after)} -> {len(after)}")
        lines.append(f"- **{slug}** ({'live' if a['published'] else 'draft'}): " + "; ".join(parts))
        if a["published"]:
            sets = ", ".join(f"{col} = {sql_q(json.dumps(ch[col], ensure_ascii=False, separators=(',', ':')))}" for col in ("videos", "key_recordings") if col in ch)
            guards = " AND ".join(f"{col} = {sql_q(a['raw'][col])}" for col in ("videos", "key_recordings") if col in ch)
            sql.append(f"UPDATE artists SET {sets} WHERE slug = {sql_q(slug)} AND {guards};")
        else:
            d = a["draft"]
            for col in ("videos", "key_recordings"):
                if col in ch:
                    d[col] = ch[col]
            if d.get("videos"):
                d["_todo"] = [t for t in d.get("_todo", []) if "no videos" not in t.lower()]
            a["file"].write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")
    lines += ["", f"## Still without a verified video ({len(no_videos)})", ", ".join(no_videos) or "none", "",
              f"## Still without songs ({len(no_songs)})", (", ".join(no_songs[:120]) + (" ..." if len(no_songs) > 120 else "")) if no_songs else "none"]
    if notes:
        lines += ["", "## Notes"] + [f"- {n}" for n in notes[:40]]
    (OUT / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    if sql:
        (OUT / "update.sql").write_text("-- Guarded UPDATEs from scripts/video_sync.py; each is a no-op if the row changed since it was read.\n" + "\n".join(sql) + "\n", encoding="utf-8")

    ok = sum(1 for v in cache.videos.values() if v.get("status") == "ok")
    bad = sum(1 for v in cache.videos.values() if v.get("status") in ("dead", "blocked"))
    print(f"\ncache: {ok} playable, {bad} dead/blocked | API units this run: {yt.units} | artists changed: {len(changed)} ({len(sql)} live SQL updates, {len(changed) - len(sql)} drafts)")
    print(f"without a video: {len(no_videos)} | without songs: {len(no_songs)}")
    for n in notes[:5]:
        print("note:", n)
    print(f"report: {OUT / 'report.md'}" + (f"\nsql:    {OUT / 'update.sql'}  (not applied)" if sql else ""))

    if args.apply and sql:
        if input(f"Apply {len(sql)} UPDATEs to the live D1 now? [y/N] ").strip().lower() == "y":
            subprocess.run(["npx", "wrangler", "d1", "execute", "slowblues", "--remote", "--file", str(OUT / "update.sql")], cwd=ROOT, shell=(sys.platform == "win32"))


if __name__ == "__main__":
    main()
