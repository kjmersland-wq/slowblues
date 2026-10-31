#!/usr/bin/env python3
"""Compare ANY list of artist names with the site: already on D1 / already drafted / missing.

    python scripts/list_missing.py names.txt            # one name per line

Use it for external "best of" lists (e.g. musicthisday.com's 100 Legendary Blues Artists).
That page is a JavaScript app: open it in a browser, scroll it fully, and save the artist
names to a text file first (only names are taken, no text is copied). Then run this script,
vet the shortlist with `new_artist_check.py` (needs YouTube quota) and write drafts in
content/new-artists/ (validated by `artist_sql.py`). Credit the source list in each profile.
"""
import glob
import json
import os
import sys

from _d1 import ROOT, query
from new_artist_check import duplicates, norm

if len(sys.argv) < 2:
    sys.exit(__doc__)
sys.stdout.reconfigure(encoding="utf-8")
names = [l.strip() for l in open(sys.argv[1], encoding="utf-8") if l.strip() and not l.startswith("#")]
existing = query("SELECT slug, name, alt_name, birth_name FROM artists")
drafts = {norm(json.load(open(f, encoding="utf-8"))["name"]): os.path.basename(f)[:-5]
          for f in glob.glob(str(ROOT / "content" / "new-artists" / "*.json"))}
on, dr, miss = [], [], []
for n in names:
    hits = duplicates(n, existing)
    if hits:
        on.append((n, hits[0]))
    elif norm(n) in drafts:
        dr.append(n)
    else:
        miss.append(n)
print(f"ON SITE ({len(on)}):")
for n, h in on:
    print(f"  {n}  =>  {h}")
print(f"\nDRAFTED, not yet published ({len(dr)}): {', '.join(dr)}")
print(f"\nMISSING ({len(miss)}): {', '.join(miss)}")
