#!/usr/bin/env python3
"""Count the real number of artists and keep hardcoded copy in sync.

The homepage badge already counts live from D1 (src/lib/artists.ts). This
script covers the places that are hardcoded text (currently "360+ artist
profiles" in src/i18n/dict.ts and src/routes/support.tsx) and writes
public/data/stats.json for anything static.

    python scripts/site_stats.py              # dry-run: show the count and the text changes
    python scripts/site_stats.py --write      # apply the text changes + write stats.json

Run it before deploy, then commit.
"""
from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime, timezone

from _d1 import ROOT, query, write_json

TARGETS = ["src/i18n/dict.ts", "src/routes/support.tsx"]
# "360+ artist profiles", "360+ Künstlerprofile", "360+ profili artystów", ...
PATTERN = re.compile(r"\b\d{2,4}\+(?= (?:artist|Künstler|profili|artyst))", re.I)


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--write", action="store_true", help="apply changes (default is dry-run)")
    args = ap.parse_args()

    row = query("SELECT COUNT(*) AS artists, COUNT(DISTINCT country) AS countries FROM artists")[0]
    count = row["artists"]
    print(f"{count} artists in {row['countries']} countries")

    for rel in TARGETS:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        hits = PATTERN.findall(text)
        new = PATTERN.sub(f"{count}+", text)
        print(f"{rel}: {len(hits)} hardcoded counts ({', '.join(sorted(set(hits))) or 'none'}) -> {count}+")
        if args.write and new != text:
            path.write_text(new, encoding="utf-8", newline="")

    if args.write:
        write_json(ROOT / "public" / "data" / "stats.json", {
            "artist_count": count,
            "country_count": row["countries"],
            "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        })
        print("wrote public/data/stats.json")
    else:
        print("dry-run only; add --write to apply")


if __name__ == "__main__":
    main()
