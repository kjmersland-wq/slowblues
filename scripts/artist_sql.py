#!/usr/bin/env python3
"""Validate new-artist drafts in content/new-artists/*.json, preview them, and build the INSERT SQL.

    python scripts/artist_sql.py                      # dry-run preview of every draft (all 5 languages) + checks
    python scripts/artist_sql.py gary-clark-jr        # one draft
    python scripts/artist_sql.py --sql                # also write out/new-artists/insert.sql (NOT applied)

A draft is a JSON object whose keys are `artists` table columns; JSON columns are written as
real JSON (lists/objects), the script serializes them. Checks (CLAUDE.md):
  * biography/influence in all five languages (no/en/sv/de/pl), signature songs for all five
  * slug/name not already in D1 (also alt_name, birth_name), no near-duplicate names
  * dead artist => no booking_info; image has a credit; at least one source link
  * death claims list two independent sources in `_sources`
The INSERT is guarded (`WHERE NOT EXISTS slug`) so running it twice does nothing.
Nothing is written to D1 by this script; apply with:
    npx wrangler d1 execute slowblues --remote --file out/new-artists/insert.sql
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from _d1 import ROOT, query
from new_artist_check import duplicates

LANGS = ["no", "en", "sv", "de", "pl"]
JSON_COLS = {
    "gallery_images", "youtube_video_ids", "bio", "signature_songs", "signature_songs_i18n", "influences",
    "influences_i18n", "labels", "instruments_simple", "styles", "categories", "search_terms", "family",
    "family_i18n", "formative", "formative_i18n", "instruments", "instruments_i18n", "anecdotes",
    "anecdotes_i18n", "collaborators", "collaborators_i18n", "videos", "discography", "discography_i18n",
    "key_recordings", "awards", "awards_i18n", "press_quotes", "press_quotes_i18n", "social_links",
    "external_links", "article_references", "link_check", "related_slugs", "booking_info", "sync_ids", "sync_data",
}
I18N_REQUIRED = ["biography", "influence"]


def lit(v) -> str:
    if v is None:
        return "NULL"
    if isinstance(v, (dict, list)):
        v = json.dumps(v, ensure_ascii=False, separators=(",", ":"))
    return "'" + str(v).replace("'", "''") + "'"


def check(d: dict, existing: list[dict]) -> list[str]:
    problems = []
    for base in I18N_REQUIRED:
        for lang in LANGS:
            if not (d.get(f"{base}_{lang}") or "").strip():
                problems.append(f"missing {base}_{lang}")
    sig = d.get("signature_songs_i18n") or {}
    for lang in LANGS:
        if not sig.get(lang):
            problems.append(f"missing signature_songs_i18n.{lang}")
    for col in ("anecdotes_i18n", "collaborators_i18n", "formative_i18n"):
        have = [l for l in LANGS if (d.get(col) or {}).get(l)]
        if have and len(have) != 5:
            problems.append(f"{col} only in {have}")
    if d["slug"] in {a["slug"] for a in existing}:
        problems.append("slug already exists in D1")
    for hit in duplicates(d["name"], existing):
        problems.append(f"possible duplicate: {hit}")
    # CLAUDE.md: dead artists and disbanded/inactive bands carry NO booking info at all.
    if (d.get("died") or d.get("_inactive")) and "booking_info" in d:
        problems.append("deceased/inactive artist or band must not have a booking_info key")
    if not d.get("died") and not d.get("_inactive") and d.get("born") is None and "booking_info" not in d:
        problems.append("living artist: add booking_info (empty {} = not yet researched) or mark _inactive")
    if d.get("img") and not d.get("image_credit"):
        problems.append("image without credit")
    known = {a["slug"] for a in existing}
    for r in d.get("related_slugs", []):
        if r not in known:
            problems.append(f"related_slugs: unknown slug {r}")
    if not d.get("article_references"):
        problems.append("no sources (article_references)")
    if d.get("died") and len(d.get("_sources", {}).get("death", [])) < 2:
        problems.append("death needs two independent sources in _sources.death")
    if not d.get("videos"):
        problems.append("no videos: run new_artist_check.py (needs YouTube quota) and add API-verified ids")
    for v in d.get("videos", []):
        if not v.get("youtube_id"):
            problems.append(f"video without id: {v.get('title')}")
    return problems


def preview(d: dict) -> str:
    out = [f"# {d['name']}  (`{d['slug']}`)  — {d.get('tag')} · {d.get('era')} · {d.get('country')}",
           f"born: {d.get('born')} | died: {d.get('died')} | image: {d.get('image_credit')}", ""]
    out.append(f"short: {d.get('short')}\n")
    for lang in LANGS:
        out.append(f"## {lang.upper()}\n{d.get(f'biography_{lang}')}\n\n*Influence:* {d.get(f'influence_{lang}')}\n")
        out.append(f"*Songs:* {', '.join((d.get('signature_songs_i18n') or {}).get(lang, []))}")
        for col in ("formative_i18n", "anecdotes_i18n"):
            items = (d.get(col) or {}).get(lang) or []
            if items:
                out.append(f"*{col.split('_')[0]}:* " + " | ".join(items))
        collab = (d.get("collaborators_i18n") or {}).get(lang) or []
        if collab:
            out.append("*collaborators:* " + " | ".join(f"{c['name']} — {c['note']}" for c in collab))
        disc = (d.get("discography_i18n") or {}).get(lang) or []
        if disc:
            out.append("*discography:* " + " | ".join(f"{e['year']} {e['title']} ({e.get('label', '?')}): {e.get('notes', '')}" for e in disc))
        out.append("")
    out.append("videos: " + "; ".join(f"{v['kind']}: {v['title']} [{v['youtube_id']}] · {v.get('channel')}" for v in d.get("videos", [])))
    out.append("sources: " + "; ".join(f"{s['title']} <{s['url']}>" for s in d.get("article_references", [])))
    if d.get("_todo"):
        out.append("TODO before publishing: " + "; ".join(d["_todo"]))
    return "\n".join(out)


def insert_sql(d: dict) -> str:
    cols = {k: v for k, v in d.items() if not k.startswith("_")}
    names = ["id"] + list(cols) + ["sort_order"]
    vals = ["lower(hex(randomblob(16)))"] + [lit(cols[k]) for k in cols] + ["(SELECT COALESCE(MAX(sort_order),0)+1 FROM artists)"]
    return (f"INSERT INTO artists ({', '.join(names)}) SELECT {', '.join(vals)} "
            f"WHERE NOT EXISTS (SELECT 1 FROM artists WHERE slug = {lit(d['slug'])});")


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slugs", nargs="*")
    ap.add_argument("--sql", action="store_true", help="write out/new-artists/insert.sql for drafts without problems")
    args = ap.parse_args()

    files = sorted((ROOT / "content" / "new-artists").glob("*.json"))
    if args.slugs:
        files = [f for f in files if f.stem in args.slugs]
    existing = query("SELECT slug, name, alt_name, birth_name FROM artists")

    statements, report = [], []
    for f in files:
        d = json.loads(f.read_text(encoding="utf-8"))
        problems = check(d, existing)
        report.append(preview(d) + "\n\nCHECKS: " + ("OK" if not problems else "; ".join(problems)) + "\n" + "=" * 60 + "\n")
        if not problems:
            statements.append(insert_sql(d))

    text = "\n".join(report)
    out = ROOT / "out" / "new-artists"
    out.mkdir(parents=True, exist_ok=True)
    (out / "dry-run.md").write_text(text, encoding="utf-8")
    print(text)
    if args.sql:
        (out / "insert.sql").write_text("-- Review dry-run.md first, then: npx wrangler d1 execute slowblues --remote --file out/new-artists/insert.sql\n" + "\n".join(statements) + "\n", encoding="utf-8")
        print(f"wrote {out / 'insert.sql'} with {len(statements)} INSERTs (NOT applied)")


if __name__ == "__main__":
    main()
