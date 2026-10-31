#!/usr/bin/env python3
"""Generate ticker messages from artist birth/death dates and discographies.

    python scripts/ticker_data.py                    # this week, writes public/data/ticker.json
    python scripts/ticker_data.py --date 2026-04-04  # pretend today is this date (testing)
    python scripts/ticker_data.py --artists gary-moore,howlin-wolf,joe-bonamassa

Categories: BORN THIS WEEK, DIED THIS WEEK, ANNIVERSARY, NEW RELEASE.
Ticker text is English only (CLAUDE.md); hrefs use the {locale} placeholder so
the page can fill in the visitor's own locale.

NEW RELEASE items only come from a discography year equal to this year and are
marked "verified": false -- a "new record" claim needs two independent sources
(CLAUDE.md), so they stay out of the file unless --include-unverified is given.

The live site's ticker is built from D1 by sync-worker/src/tickerBatch.ts and is
not changed by this script; this JSON is for review/commit and static use.
"""
from __future__ import annotations

import argparse
import sys
from datetime import date, datetime, timedelta, timezone

from _d1 import ROOT, discography, load_artists, parse_date, write_json

ICONS = {"BORN THIS WEEK": "cake", "DIED THIS WEEK": "candle", "ANNIVERSARY": "calendar", "NEW RELEASE": "disc"}
ROUND = (5, 10)  # anniversaries worth a mention: every 5th year


def in_week(month: int, day: int, start: date, end: date) -> date | None:
    for y in {start.year, end.year}:
        try:
            d = date(y, month, day)
        except ValueError:  # 29 Feb
            continue
        if start <= d <= end:
            return d
    return None


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--date", help="YYYY-MM-DD, default today")
    ap.add_argument("--artists", type=lambda s: s.split(","), help="comma-separated slugs, default all")
    ap.add_argument("--include-unverified", action="store_true")
    ap.add_argument("--out", default=str(ROOT / "public" / "data" / "ticker.json"))
    ap.add_argument("--from-json", help="artist export instead of D1")
    args = ap.parse_args()

    today = date.fromisoformat(args.date) if args.date else date.today()
    start, end = today, today + timedelta(days=6)
    items: list[dict] = []

    def add(cat: str, slug: str, text: str, when: date | None, **extra) -> None:
        items.append({"category": cat, "icon": ICONS[cat], "text": text, "href": f"/{{locale}}/artists/{slug}",
                      "date": when.isoformat() if when else None, "slug": slug, **extra})

    for a in load_artists(args.artists, args.from_json):
        name, slug = a["name"], a["slug"]
        born, died = parse_date(a.get("born")), parse_date(a.get("died"))
        for kind, parsed in (("born", born), ("died", died)):
            if not parsed or parsed[1] is None:
                continue
            y, m, d = parsed
            when = in_week(m, d, start, end)
            if not when:
                continue
            age = when.year - y
            if kind == "born":
                if died:
                    add("BORN THIS WEEK", slug, f"{name} was born on this day in {y} ({when:%B} {when.day}).", when)
                else:
                    add("BORN THIS WEEK", slug, f"{name} was born on {when:%B} {when.day}, {y}.", when)
            else:
                add("DIED THIS WEEK", slug, f"{name} died on {when:%B} {when.day}, {y}.", when)
            if age > 0 and (age % 10 == 0 or (age >= 25 and age % 25 == 0)):
                verb = "birth" if kind == "born" else "death"
                add("ANNIVERSARY", slug, f"{age} years since the {verb} of {name} ({y}).", when)

        for e in discography(a):
            y = e.get("year")
            title = (e.get("title") or "").strip().strip('"“”')
            if not isinstance(y, int) or not title:
                continue
            if y == today.year and args.include_unverified:
                add("NEW RELEASE", slug, f"{name}: \"{title}\" ({y}).", None, verified=False)
            elif y < today.year and (today.year - y) in (25, 30, 40, 50, 60, 75):  # album year only, no exact date
                add("ANNIVERSARY", slug, f"\"{title}\" by {name} turns {today.year - y} this year ({y}).", None, scope="year")

    order = list(ICONS)
    items.sort(key=lambda i: (order.index(i["category"]), i["date"] or "9999", i["slug"]))
    write_json(__import__("pathlib").Path(args.out), {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "week": {"from": start.isoformat(), "to": end.isoformat()},
        "language": "en",
        "items": items,
    })
    print(f"{len(items)} ticker items for {start} .. {end} -> {args.out}")
    for i in items[:25]:
        print(f"  [{i['category']}] {i['text']}")


if __name__ == "__main__":
    main()
