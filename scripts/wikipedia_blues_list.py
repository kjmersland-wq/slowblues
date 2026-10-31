#!/usr/bin/env python3
"""Scan Wikipedia's "List of blues musicians", compare with D1, rank what is missing.

    python scripts/wikipedia_blues_list.py                 # writes out/wikipedia/missing.md + .json
    python scripts/wikipedia_blues_list.py --top 60        # longer shortlist
    python scripts/wikipedia_blues_list.py --refresh       # ignore the cached page

Steps (read-only; nothing is written to D1):
  1. Download the list (MediaWiki API) and take the first article link of each bullet.
  2. Compare each name with every artist in D1 (name, alt_name, birth_name, slug, near-matches)
     and report who is already on the site.
  3. Rank the missing names by Wikipedia page views (last 60 days) as a rough importance
     signal -- a heuristic, not a verdict; you decide.
  4. The shortlist still has to pass `new_artist_check.py` (YouTube videos, duplicates) and then
     `artist_sql.py` before anything goes to D1.

Credit: names come from https://en.wikipedia.org/wiki/List_of_blues_musicians (CC BY-SA).
Keep that credit in every profile's article_references.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

from _d1 import ROOT, query
from new_artist_check import duplicates, norm

PAGE = "List of blues musicians"
UA = {"User-Agent": "SlowBluesTool/1.0 (https://www.slow-blues.com)"}
OUT = ROOT / "out" / "wikipedia"


def api(**params) -> dict:
    url = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode({**params, "format": "json", "formatversion": 2})
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_list(refresh: bool) -> list[dict]:
    cache = OUT / "list.json"
    if cache.exists() and not refresh:
        return json.loads(cache.read_text(encoding="utf-8"))
    d = api(action="query", prop="revisions", rvslots="main", rvprop="content", titles=PAGE, redirects=1)
    text = d["query"]["pages"][0]["revisions"][0]["slots"]["main"]["content"]
    section, items, row = "", [], None
    name_re = re.compile(r'^!\s*scope="row"\s*\|\s*(?:\{\{anchor\|[^}]*\}\}\s*)?(?:\{\{sort\|[^|]*\|)?\s*\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]')

    def clean(c: str) -> str:
        c = re.sub(r"\{\{sfn[^}]*\}\}|<ref.*?</ref>|\{\{[^}]*\}\}", "", c)
        c = re.sub(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]", r"", c)
        return re.sub(r'^\s*(?:align="center"\s*\|)?\s*', "", c).strip()

    for line in text.splitlines():
        h = re.match(r"^=+\s*(?:<span[^>]*></span>)?(.*?)\s*=+\s*$", line)
        if h:
            section, row = h.group(1), None
            continue
        m = name_re.match(line)
        if m and ":" not in m.group(1):
            row = {"title": m.group(1).strip(), "name": (m.group(2) or m.group(1)).strip(), "section": section, "cells": []}
            items.append(row)
        elif row is not None and line.startswith("|-"):
            row = None
        elif row is not None and line.startswith("|"):
            row["cells"].append(clean(line[1:]))
    for it in items:  # table columns: born, died, origin, genre, ref
        c = it.pop("cells")
        it.update(born=c[0] if len(c) > 0 else "", died=c[1] if len(c) > 1 else "", origin=c[2] if len(c) > 2 else "", genre=c[3] if len(c) > 3 else "")
    OUT.mkdir(parents=True, exist_ok=True)
    cache.write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding="utf-8")
    return items


def pageviews(titles: list[str]) -> dict[str, int]:
    views: dict[str, int] = {}
    for i in range(0, len(titles), 50):
        chunk = titles[i : i + 50]
        totals: dict[str, int] = {}
        cont: dict = {}
        while True:
            d = api(action="query", prop="pageviews", pvipdays=60, titles="|".join(chunk), redirects=1, **cont)
            for p in d["query"]["pages"]:
                totals[p["title"]] = totals.get(p["title"], 0) + sum(v or 0 for v in p.get("pageviews", {}).values())
            redirects = {r["from"]: r["to"] for r in d["query"].get("redirects", [])}
            if "continue" not in d:
                break
            cont = d["continue"]
        for t in chunk:
            views[t] = totals.get(redirects.get(t, t), 0)
    return views


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--top", type=int, default=40)
    ap.add_argument("--refresh", action="store_true")
    args = ap.parse_args()

    items = fetch_list(args.refresh)
    # de-duplicate by title
    seen, uniq = set(), []
    for it in items:
        if it["title"] not in seen:
            seen.add(it["title"])
            uniq.append(it)
    existing = query("SELECT slug, name, alt_name, birth_name FROM artists")
    blob = norm(" ".join(" ".join(filter(None, [a["name"], a.get("alt_name"), a.get("birth_name")])) for a in existing))

    present, missing = [], []
    for it in uniq:
        hits = duplicates(re.sub(r"\s*\(.*?\)", "", it["name"]), existing)
        (present if hits else missing).append({**it, "matches": hits})
    # also catch names mentioned inside another artist's alias/name field (e.g. "Peter Green" in the Fleetwood Mac profile)
    missing = [m for m in missing if len(norm(m["name"])) < 6 or norm(re.sub(r"\s*\(.*?\)", "", m["name"])) not in blob]

    # names that already have a drafted (unpublished) profile in content/new-artists/
    drafted = {}
    for f in (ROOT / "content" / "new-artists").glob("*.json"):
        dr = json.loads(f.read_text(encoding="utf-8"))
        drafted[norm(dr["name"])] = f.stem
    for m in missing:
        m["drafted"] = drafted.get(norm(re.sub(r"\s*\(.*?\)", "", m["name"])))
    missing = [m for m in missing if not m["drafted"]]

    views = pageviews([m["title"] for m in missing])
    for m in missing:
        m["views_60d"] = views.get(m["title"], 0)
    missing.sort(key=lambda m: -m["views_60d"])

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "missing.json").write_text(json.dumps(missing, ensure_ascii=False, indent=1), encoding="utf-8")
    lines = [f"# Missing from slow-blues.com — {len(missing)} of {len(uniq)} names on the Wikipedia list",
             f"Already on the site: {len(present)}. Source: https://en.wikipedia.org/wiki/List_of_blues_musicians", "",
             "| # | Name | Born–Died | Origin | Genre | Views (60 d) |", "|---|---|---|---|---|---|"]
    for i, m in enumerate(missing[: args.top], 1):
        lines.append(f"| {i} | [{m['name']}](https://en.wikipedia.org/wiki/{urllib.parse.quote(m['title'].replace(' ', '_'))}) | {m['born']}–{m['died']} | {m['origin']} | {m['genre']} | {m['views_60d']} |")
    (OUT / "missing.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
