"""Shared helpers for the SlowBlues Python scripts: read-only D1 access + date parsing."""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MONTHS = {m: i for i, m in enumerate(
    ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"], 1)}
JSON_COLS = ("signature_songs", "labels", "instruments_simple", "discography_i18n")


def query(sql: str) -> list[dict]:
    """Read-only SELECT against the live D1 via wrangler (needs `npx wrangler login`)."""
    res = subprocess.run(
        ["npx", "wrangler", "d1", "execute", "slowblues", "--remote", "--json", "--command", sql],
        cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace", shell=(os.name == "nt"),
    )
    if res.returncode != 0:
        sys.exit(f"wrangler failed (try `npx wrangler login`): {res.stderr[-400:]}")
    return json.loads(res.stdout[res.stdout.find("["):])[0]["results"]


def load_artists(slugs: list[str] | None = None, from_json: str | None = None) -> list[dict]:
    if from_json:
        rows = json.loads(Path(from_json).read_text(encoding="utf-8"))
    else:
        sql = "SELECT slug, name, born, died, birth_place, country, signature_songs, labels, instruments_simple, discography_i18n FROM artists"
        if slugs:
            sql += " WHERE slug IN (" + ",".join("'" + s.replace("'", "''") + "'" for s in slugs) + ")"
        rows = query(sql)
    for r in rows:
        for c in JSON_COLS:
            if isinstance(r.get(c), str):
                try:
                    r[c] = json.loads(r[c] or ("{}" if c.endswith("i18n") else "[]"))
                except json.JSONDecodeError:
                    r[c] = {} if c.endswith("i18n") else []
    return rows


def parse_date(text: str | None) -> tuple[int, int | None, int | None] | None:
    """(year, month, day) from '4 April 1952' / 'June 10, 1910, White Station' / '1943'. month/day may be None."""
    if not text:
        return None
    t = text.casefold()
    m = re.search(r"(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)\s+(\d{4})", t)
    if m and m.group(2) in MONTHS:
        return int(m.group(3)), MONTHS[m.group(2)], int(m.group(1))
    m = re.search(r"([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})", t)
    if m and m.group(1) in MONTHS:
        return int(m.group(3)), MONTHS[m.group(1)], int(m.group(2))
    m = re.search(r"\b(1[6-9]\d\d|20\d\d)\b", t)
    return (int(m.group(1)), None, None) if m else None


def discography(artist: dict) -> list[dict]:
    """Album entries from whichever language the artist has (English preferred)."""
    d = artist.get("discography_i18n") or {}
    for lang in ("en", "no", "sv", "de", "pl"):
        if d.get(lang):
            return d[lang]
    return []


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
