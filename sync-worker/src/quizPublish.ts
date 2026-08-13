import type { Env, RunSummary } from "./types";

// ===== Cycle math — ported verbatim from src/data/quizQuestions.ts so cycle
// numbers/keys/date ranges stay identical to what the existing UI already
// computes. This is the ONLY place that logic is duplicated (Workers can't
// import from the main site's src/), and it must be kept in sync if the
// epoch/length ever changes. =====
const CYCLE_LENGTH_DAYS = 10;
const CYCLE_EPOCH_UTC = Date.UTC(2026, 0, 5);
const MS_PER_DAY = 86_400_000;

function getCycleNumber(date: Date = new Date()): number {
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const diff = Math.floor((today - CYCLE_EPOCH_UTC) / MS_PER_DAY);
  return Math.max(1, Math.floor(diff / CYCLE_LENGTH_DAYS) + 1);
}
function getCycleKey(n: number): string {
  return `C-${String(n).padStart(3, "0")}`;
}
function getCycleRange(n: number): { start: string; end: string } {
  const startMs = CYCLE_EPOCH_UTC + (n - 1) * CYCLE_LENGTH_DAYS * MS_PER_DAY;
  const endMs = startMs + (CYCLE_LENGTH_DAYS - 1) * MS_PER_DAY;
  return { start: new Date(startMs).toISOString().slice(0, 10), end: new Date(endMs).toISOString().slice(0, 10) };
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let m = shuffled.length;
  let s = seed || 1;
  while (m) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const i = s % m--;
    [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
  }
  return shuffled;
}

function rollingPick<T>(pool: T[], cycleNumber: number, take: number, seedSalt: number): T[] {
  if (pool.length === 0) return [];
  const ordered = seededShuffle(pool, 0x5b1e5 ^ seedSalt);
  const start = ((cycleNumber - 1) * take) % ordered.length;
  const out: T[] = [];
  for (let i = 0; i < take; i++) out.push(ordered[(start + i) % ordered.length]);
  return out;
}

type QuestionRow = {
  id: string;
  type: "multiple-choice" | "audio-guess";
  difficulty: "easy" | "medium" | "hard";
  question_en: string; question_no: string; question_sv: string; question_de: string; question_pl: string;
  options_en: string; options_no: string; options_sv: string; options_de: string; options_pl: string;
  correct_index: number;
  explanation_en: string; explanation_no: string; explanation_sv: string; explanation_de: string; explanation_pl: string;
  artist_slug: string | null;
  youtube_video_id: string | null;
  audio_start: number | null;
  audio_end: number | null;
  audio_hint_en: string | null; audio_hint_no: string | null; audio_hint_sv: string | null; audio_hint_de: string | null; audio_hint_pl: string | null;
  status: string;
};

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

async function log(env: Env, cycleNumber: number, checkType: string, result: "pass" | "fail" | "warn", detail: string) {
  await env.DB.prepare(
    `INSERT INTO quiz_generation_log (id, cycle_number, check_type, result, detail) VALUES (?, ?, ?, ?, ?)`
  )
    .bind(crypto.randomUUID(), cycleNumber, checkType, result, detail)
    .run();
}

async function checkYouTube(videoId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
      headers: { "User-Agent": "SlowBlues-SyncEngine/1.0 (+https://www.slow-blues.com; quiz audio check)" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Selects, validates and publishes ONE cycle (all 3 difficulties = 30
 * questions) if it isn't already published. Idempotent: safe to call every
 * day, only does work when there's an unpublished current cycle.
 *
 * Selection reuses the exact rollingPick/seededShuffle algorithm the old
 * static-file system used (same no-repeat-until-pool-exhausted guarantee),
 * now reading from quiz_questions (status='validated' only) instead of a
 * hardcoded array. Every published cycle's actual content is copied
 * (snapshot_json) into quiz_cycle_questions — editing quiz_questions later
 * never changes an already-published cycle.
 */
export async function runQuizPublish(env: Env): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  const notes: string[] = [];
  let artistsChanged = 0; // repurposed as "cycles published"

  const cycleNumber = getCycleNumber();
  const cycleKey = getCycleKey(cycleNumber);

  const existing = await env.DB.prepare(`SELECT status FROM quiz_cycles WHERE cycle_number = ?`).bind(cycleNumber).first<{ status: string }>();
  if (existing?.status === "published") {
    notes.push(`${cycleKey} already published — nothing to do.`);
    return { module: "quiz-publish", startedAt, finishedAt: new Date().toISOString(), artistsSeen: cycleNumber, artistsChanged: 0, errors, notes };
  }

  const { results } = await env.DB.prepare(
    `SELECT id, type, difficulty, question_en, question_no, question_sv, question_de, question_pl,
            options_en, options_no, options_sv, options_de, options_pl, correct_index,
            explanation_en, explanation_no, explanation_sv, explanation_de, explanation_pl,
            artist_slug, youtube_video_id, audio_start, audio_end,
            audio_hint_en, audio_hint_no, audio_hint_sv, audio_hint_de, audio_hint_pl, status
     FROM quiz_questions WHERE status = 'validated'`
  ).all<QuestionRow>();
  const pool = results ?? [];

  const failures: string[] = [];
  const allSelected: Array<QuestionRow & { difficulty: Difficulty }> = [];

  for (const difficulty of DIFFICULTIES) {
    const standardByDiff = pool.filter((q) => q.type === "multiple-choice" && q.difficulty === difficulty);
    const audioByDiff = pool.filter((q) => q.type === "audio-guess" && q.difficulty === difficulty);
    const standardPool = standardByDiff.length >= 8 ? standardByDiff : [...standardByDiff, ...pool.filter((q) => q.type === "multiple-choice" && q.difficulty === "medium")];
    const audioPool = audioByDiff.length >= 2 ? audioByDiff : [...audioByDiff, ...pool.filter((q) => q.type === "audio-guess")];

    const audioCount = Math.min(2, audioPool.length);
    const standardCount = 10 - audioCount;
    const diffSalt = difficulty === "easy" ? 11 : difficulty === "medium" ? 23 : 37;

    const selected = rollingPick(standardPool, cycleNumber, standardCount, diffSalt);
    const selectedAudio = rollingPick(audioPool, cycleNumber, audioCount, diffSalt + 100);

    // Avoid two consecutive same-artist questions (same rule as before).
    for (let i = 1; i < selected.length; i++) {
      if (selected[i].artist_slug && selected[i].artist_slug === selected[i - 1].artist_slug) {
        for (let j = i + 1; j < selected.length; j++) {
          if (selected[j].artist_slug !== selected[i - 1].artist_slug) {
            [selected[i], selected[j]] = [selected[j], selected[i]];
            break;
          }
        }
      }
    }

    const positions = [3, 7];
    selectedAudio.forEach((aq, i) => {
      const pos = Math.min(positions[i] ?? selected.length, selected.length);
      selected.splice(pos, 0, aq);
    });

    const final = selected.slice(0, 10);

    // ---- Validation gate (req #8) ----
    if (final.length !== 10) {
      failures.push(`${difficulty}: only ${final.length}/10 questions available in validated pool`);
      await log(env, cycleNumber, "count_check", "fail", `${difficulty}: ${final.length}/10`);
      continue;
    }
    await log(env, cycleNumber, "count_check", "pass", `${difficulty}: 10/10`);

    for (const q of final) {
      const optCount = JSON.parse(q.options_en).length;
      const expectedCount = q.type === "audio-guess" ? 3 : 4;
      if (optCount !== expectedCount) {
        failures.push(`${q.id}: expected ${expectedCount} options, got ${optCount}`);
      }
      if (q.correct_index < 0 || q.correct_index >= optCount) {
        failures.push(`${q.id}: correct_index ${q.correct_index} out of range`);
      }
    }

    // Source validation: artist_slug (when set) must exist in artists.
    for (const q of final) {
      if (!q.artist_slug) continue;
      const artist = await env.DB.prepare(`SELECT slug FROM artists WHERE slug = ?`).bind(q.artist_slug).first();
      if (!artist) {
        failures.push(`${q.id}: artist_slug '${q.artist_slug}' does not exist in artists table`);
      }
    }
    await log(env, cycleNumber, "source_validation", failures.length === 0 ? "pass" : "warn", `${difficulty}: checked artist_slug against artists table`);

    // Duplicate check: this exact question_id used in the last full pool
    // rotation window for the same difficulty+type.
    const lookback = Math.max(standardPool.length / 8, audioPool.length / 2, 1);
    for (const q of final) {
      const dupe = await env.DB.prepare(
        `SELECT cq.cycle_number FROM quiz_cycle_questions cq
         JOIN quiz_cycles c ON c.cycle_number = cq.cycle_number
         WHERE cq.question_id = ? AND cq.difficulty = ? AND c.status = 'published'
         AND cq.cycle_number > ?
         ORDER BY cq.cycle_number DESC LIMIT 1`
      ).bind(q.id, difficulty, cycleNumber - lookback).first();
      if (dupe) {
        failures.push(`${q.id}: reused within lookback window (last seen cycle ${(dupe as any).cycle_number})`);
      }
    }
    await log(env, cycleNumber, "duplicate", failures.length === 0 ? "pass" : "warn", `${difficulty}: checked against last ${Math.round(lookback)} published cycle(s)`);

    // Audio check: verify each audio-guess question's YouTube video still works.
    for (const q of final) {
      if (q.type !== "audio-guess" || !q.youtube_video_id) continue;
      const ok = await checkYouTube(q.youtube_video_id);
      if (!ok) failures.push(`${q.id}: YouTube video ${q.youtube_video_id} failed oEmbed check`);
      await log(env, cycleNumber, "audio_check", ok ? "pass" : "fail", `${q.id}: ${q.youtube_video_id}`);
    }

    for (const q of final) allSelected.push({ ...q, difficulty });
  }

  if (failures.length > 0) {
    // Mark for manual review rather than publishing something unvalidated.
    await env.DB.prepare(
      `INSERT INTO quiz_cycles (cycle_number, cycle_key, period_start, period_end, status)
       VALUES (?, ?, ?, ?, 'pending')
       ON CONFLICT(cycle_number) DO UPDATE SET status = 'pending'`
    )
      .bind(cycleNumber, cycleKey, getCycleRange(cycleNumber).start, getCycleRange(cycleNumber).end)
      .run();
    for (const f of failures) await log(env, cycleNumber, "count_check", "fail", f);
    errors.push(...failures);
    notes.push(`${cycleKey}: NOT published — ${failures.length} check(s) failed, marked pending for manual review.`);
    return { module: "quiz-publish", startedAt, finishedAt: new Date().toISOString(), artistsSeen: cycleNumber, artistsChanged: 0, errors, notes };
  }

  // All checks passed — publish: snapshot every selected question, then
  // mark the cycle published. Featured artist = most-linked artist_slug.
  const tally = new Map<string, number>();
  for (const q of allSelected) if (q.artist_slug) tally.set(q.artist_slug, (tally.get(q.artist_slug) ?? 0) + 1);
  const featured = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const { start, end } = getCycleRange(cycleNumber);
  await env.DB.prepare(
    `INSERT INTO quiz_cycles (cycle_number, cycle_key, period_start, period_end, featured_artist_slug, status, published_at)
     VALUES (?, ?, ?, ?, ?, 'published', CURRENT_TIMESTAMP)
     ON CONFLICT(cycle_number) DO UPDATE SET status = 'published', featured_artist_slug = excluded.featured_artist_slug, published_at = CURRENT_TIMESTAMP`
  )
    .bind(cycleNumber, cycleKey, start, end, featured)
    .run();

  let position = 0;
  const positionByDifficulty: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
  for (const q of allSelected) {
    const snapshot = {
      id: q.id, type: q.type, difficulty: q.difficulty,
      question: { en: q.question_en, no: q.question_no, sv: q.question_sv, de: q.question_de, pl: q.question_pl },
      options: { en: JSON.parse(q.options_en), no: JSON.parse(q.options_no), sv: JSON.parse(q.options_sv), de: JSON.parse(q.options_de), pl: JSON.parse(q.options_pl) },
      correctIndex: q.correct_index,
      explanation: { en: q.explanation_en, no: q.explanation_no, sv: q.explanation_sv, de: q.explanation_de, pl: q.explanation_pl },
      artistSlug: q.artist_slug,
      youtubeVideoId: q.youtube_video_id, audioStart: q.audio_start, audioEnd: q.audio_end,
      audioHint: q.audio_hint_en ? { en: q.audio_hint_en, no: q.audio_hint_no, sv: q.audio_hint_sv, de: q.audio_hint_de, pl: q.audio_hint_pl } : null,
    };
    await env.DB.prepare(
      `INSERT INTO quiz_cycle_questions (id, cycle_number, difficulty, position, question_id, snapshot_json) VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(crypto.randomUUID(), cycleNumber, q.difficulty, positionByDifficulty[q.difficulty]++, q.id, JSON.stringify(snapshot))
      .run();
    position++;
  }

  artistsChanged = 1;
  notes.push(`${cycleKey} published: ${position} question snapshots across ${DIFFICULTIES.length} difficulties. Featured artist: ${featured ?? "none"}.`);

  return {
    module: "quiz-publish",
    startedAt,
    finishedAt: new Date().toISOString(),
    artistsSeen: cycleNumber,
    artistsChanged,
    errors,
    notes,
  };
}
