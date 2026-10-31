#!/usr/bin/env python3
"""Generate a 14-day quiz set from artist data already on the site.

    python scripts/quiz_data.py                 # writes public/data/quiz.json
    python scripts/quiz_data.py --if-due        # skip unless 14 days have passed
    python scripts/quiz_data.py --count 18 --artists gary-moore,howlin-wolf,joe-bonamassa

Questions are English drafts built only from D1 fields (birth year/place,
signature songs, labels, instruments), 50/50 easy and medium, and
deterministic per 14-day cycle (same cycle => same questions). Each carries
its source field so it can be fact-checked.

CLAUDE.md: all five languages (NO/EN/SV/DE/PL) must be written before anything
goes to D1, so this file is a draft pool ("status": "draft"), not a publish.
The live quiz is the D1 cycle system (sync-worker/src/quizPublish.ts).
"""
from __future__ import annotations

import argparse
import json
import random
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from _d1 import ROOT, load_artists, parse_date, write_json

EPOCH = date(2026, 1, 5)  # a Monday; cycle 0 starts here
CYCLE_DAYS = 14


def cycle_for(day: date) -> tuple[int, date, date]:
    n = (day - EPOCH).days // CYCLE_DAYS
    start = EPOCH + timedelta(days=n * CYCLE_DAYS)
    return n, start, start + timedelta(days=CYCLE_DAYS - 1)


def mc(rng, qid, difficulty, text, correct, pool, slug, source, k=4):
    wrong = [p for p in dict.fromkeys(pool) if p != correct]
    if len(wrong) < k - 1:
        return None
    opts = rng.sample(wrong, k - 1) + [correct]
    rng.shuffle(opts)
    return {"id": qid, "difficulty": difficulty, "question": text, "options": opts,
            "correct_index": opts.index(correct), "artist_slug": slug, "source_field": source, "status": "draft"}


def build(artists: list[dict], count: int, rng: random.Random) -> list[dict]:
    songs = {a["slug"]: a["signature_songs"] for a in artists if a["signature_songs"]}
    all_songs = [s for v in songs.values() for s in v if isinstance(s, str)]
    all_places = [a["country"] for a in artists if a.get("country")]
    all_labels = [l for a in artists for l in a["labels"] if isinstance(l, str)]
    all_instr = [i for a in artists for i in a["instruments_simple"] if isinstance(i, str)]
    makers = []

    for a in artists:
        n, s = a["name"], a["slug"]
        by = parse_date(a.get("born"))
        if a.get("country"):
            makers.append(("easy", lambda r, i, a=a: mc(r, i, "easy", f"Which country is {a['name']} from?", a["country"], all_places, a["slug"], "country")))
        if songs.get(s) and isinstance(songs[s][0], str):
            own = set(songs[s])
            makers.append(("easy", lambda r, i, a=a: mc(r, i, "easy", f"Which of these is a signature song of {a['name']}?",
                                                         r.choice(songs[a["slug"]]), [x for x in all_songs if x not in own], a["slug"], "signature_songs")))
        if by:
            y = by[0]
            makers.append(("medium", lambda r, i, a=a, y=y: mc(r, i, "medium", f"In what year was {a['name']} born?", str(y),
                                                               [str(y + d) for d in (-7, -4, -2, 3, 5, 9)], a["slug"], "born")))
        if a["labels"] and isinstance(a["labels"][0], str):
            own = set(a["labels"])
            makers.append(("medium", lambda r, i, a=a, own=own: mc(r, i, "medium", f"Which label is {a['name']} associated with?",
                                                                    r.choice(a["labels"]), [x for x in all_labels if x not in own], a["slug"], "labels")))
        if a["instruments_simple"] and isinstance(a["instruments_simple"][0], str):
            own = set(a["instruments_simple"])
            makers.append(("easy", lambda r, i, a=a, own=own: mc(r, i, "easy", f"Which instrument is {a['name']} known for?",
                                                                  r.choice(a["instruments_simple"]), [x for x in all_instr if x not in own], a["slug"], "instruments_simple")))

    rng.shuffle(makers)
    questions, used, per = [], {}, {"easy": 0, "medium": 0}
    for diff, make in makers:
        if len(questions) >= count:
            break
        if per[diff] >= count // 2 + count % 2:
            continue
        q = make(rng, f"q{len(questions) + 1:02d}")
        if q and used.get((q["artist_slug"], q["source_field"])) is None and sum(1 for x in questions if x["artist_slug"] == q["artist_slug"]) < 2:
            used[(q["artist_slug"], q["source_field"])] = True
            questions.append(q)
            per[diff] += 1
    rng.shuffle(questions)
    for i, q in enumerate(questions, 1):
        q["id"] = f"q{i:02d}"
    return questions


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--count", type=int, default=18, help="15-20")
    ap.add_argument("--artists", type=lambda s: s.split(","))
    ap.add_argument("--date", help="YYYY-MM-DD, default today")
    ap.add_argument("--if-due", action="store_true", help="do nothing unless the 14-day cycle has changed")
    ap.add_argument("--out", default=str(ROOT / "public" / "data" / "quiz.json"))
    ap.add_argument("--from-json")
    args = ap.parse_args()

    today = date.fromisoformat(args.date) if args.date else date.today()
    n, start, end = cycle_for(today)
    out = Path(args.out)
    if args.if_due and out.exists():
        try:
            if json.loads(out.read_text(encoding="utf-8")).get("cycle") == n:
                print(f"cycle {n} already generated; nothing to do")
                return
        except json.JSONDecodeError:
            pass

    qs = build(load_artists(args.artists, args.from_json), max(1, args.count), random.Random(f"slowblues-quiz-{n}"))
    write_json(out, {
        "cycle": n, "valid_from": start.isoformat(), "valid_to": end.isoformat(),
        "last_updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "next_update_due": (end + timedelta(days=1)).isoformat(),
        "language": "en", "status": "draft", "questions": qs,
    })
    easy = sum(q["difficulty"] == "easy" for q in qs)
    print(f"cycle {n} ({start}..{end}): {len(qs)} questions ({easy} easy, {len(qs) - easy} medium) -> {out}")
    for q in qs[:4]:
        print(f"  {q['question']}  -> {q['options'][q['correct_index']]}")


if __name__ == "__main__":
    main()
