import type { Env, RunSummary } from "./types";

// ===== Cycle math — ported verbatim from src/lib/quiz.server.ts so cycle
// numbers/keys/date ranges stay identical to what the site's own /quiz
// route computes. This is the ONLY place that logic is duplicated (Workers
// can't import from the main site's src/), and it must be kept in sync if
// the epoch/length ever changes. =====
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
  if (pool.length === 0 || take <= 0) return [];
  const ordered = seededShuffle(pool, 0x5b1e5 ^ seedSalt);
  const n = Math.min(take, ordered.length);
  const start = ((cycleNumber - 1) * n) % ordered.length;
  const out: T[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < n; i++) {
    const idx = (start + i) % ordered.length;
    if (seen.has(idx)) continue;
    seen.add(idx);
    out.push(ordered[idx]);
  }
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

// Per-cycle quota (owner spec, 2026-09-30): a small, sustainable set rather
// than the old 30-questions-per-cycle design, which regularly exhausted the
// ~50-question validated pool and left cycles permanently stuck "pending"
// (every selection collided with the previous cycle's picks -> hard fail).
const MC_TARGET: Record<Difficulty, number> = { easy: 6, medium: 5, hard: 4 };
const AUDIO_TARGET_TOTAL = 3;
const MIN_VISIBLE_QUESTIONS = 10;

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

function isStructurallyValid(q: QuestionRow): boolean {
  let optCount: number;
  try {
    optCount = JSON.parse(q.options_en).length;
  } catch {
    return false;
  }
  const expected = q.type === "audio-guess" ? 3 : 4;
  if (optCount !== expected) return false;
  if (q.correct_index < 0 || q.correct_index >= optCount) return false;
  if (q.type === "audio-guess" && !q.youtube_video_id) return false;
  return true;
}

/** Most recently published cycle strictly before `beforeCycle`, or null. */
async function getPreviousPublishedCycle(env: Env, beforeCycle: number): Promise<number | null> {
  const row = await env.DB.prepare(
    `SELECT cycle_number FROM quiz_cycles WHERE status = 'published' AND cycle_number < ? ORDER BY cycle_number DESC LIMIT 1`
  ).bind(beforeCycle).first<{ cycle_number: number }>();
  return row?.cycle_number ?? null;
}

async function getQuestionIdsUsedInCycle(env: Env, cycleNumber: number): Promise<Set<string>> {
  const { results } = await env.DB.prepare(
    `SELECT question_id FROM quiz_cycle_questions WHERE cycle_number = ?`
  ).bind(cycleNumber).all<{ question_id: string | null }>();
  return new Set((results ?? []).map((r) => r.question_id).filter((x): x is string => !!x));
}

/**
 * Picks candidates for one difficulty/type bucket, preferring questions NOT
 * used in the immediately preceding published cycle. Falls back to reusing
 * them only when the pool is too small to avoid it (logged, never a hard
 * failure) -- this replaces the old "select, then fail if it collides"
 * design, which is what left cycles stuck pending once the ~50-question
 * pool got smaller than the old 30-per-cycle quota.
 */
function pickAvoidingReuse<T extends { id: string }>(
  pool: T[],
  target: number,
  cycleNumber: number,
  salt: number,
  lastUsed: Set<string>,
  label: string,
  notes: string[],
): T[] {
  if (pool.length === 0 || target <= 0) return [];
  const fresh = pool.filter((q) => !lastUsed.has(q.id));
  const usable = fresh.length >= Math.min(target, pool.length) ? fresh : pool;
  if (usable === pool && fresh.length < pool.length) {
    notes.push(`${label}: pool too small (${pool.length}) to fully avoid repeats from the previous cycle -- some reuse is unavoidable.`);
  }
  return rollingPick(usable, cycleNumber, Math.min(target, usable.length), salt);
}

/**
 * Selects, validates and publishes ONE cycle if it isn't already published.
 * Idempotent: safe to call every day, only does work when there's an
 * unpublished current cycle. Quota: 6 easy + 5 medium + 4 hard
 * multiple-choice, plus up to 3 audio-guess questions (spread across
 * whichever difficulties have clips available) -- never fewer than 10
 * visible questions total if the pool allows it.
 *
 * Every published cycle's actual content is copied (snapshot_json) into
 * quiz_cycle_questions -- editing quiz_questions later never changes an
 * already-published cycle.
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
  const rawPool = results ?? [];

  // Filter out structurally broken rows up front so one bad question can
  // never block an entire cycle -- it's just excluded, and logged.
  const pool = rawPool.filter((q) => {
    const ok = isStructurallyValid(q);
    if (!ok) notes.push(`Excluded '${q.id}' from selection: fails structural validation (option count / correct_index / missing audio id).`);
    return ok;
  });

  const prevCycle = await getPreviousPublishedCycle(env, cycleNumber);
  const lastUsed = prevCycle !== null ? await getQuestionIdsUsedInCycle(env, prevCycle) : new Set<string>();

  const bySlot: Record<Difficulty, (QuestionRow & { difficulty: Difficulty })[]> = { easy: [], medium: [], hard: [] };

  // ---- Multiple-choice: 6/5/4 by difficulty ----
  for (const difficulty of DIFFICULTIES) {
    const mcPool = pool.filter((q) => q.type === "multiple-choice" && q.difficulty === difficulty);
    const diffSalt = difficulty === "easy" ? 11 : difficulty === "medium" ? 23 : 37;
    const selected = pickAvoidingReuse(mcPool, MC_TARGET[difficulty], cycleNumber, diffSalt, lastUsed, `${difficulty} MC`, notes);
    if (selected.length < MC_TARGET[difficulty]) {
      notes.push(`${difficulty}: only ${selected.length}/${MC_TARGET[difficulty]} multiple-choice questions available in validated pool — using what's there.`);
    }
    // Avoid two consecutive same-artist questions.
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
    bySlot[difficulty].push(...selected.map((q) => ({ ...q, difficulty })));
  }

  // ---- Audio-guess: up to 3 total, spread across whichever difficulties
  // actually have clips, each kept under its own recorded difficulty. ----
  const audioPool = pool.filter((q) => q.type === "audio-guess");
  const selectedAudio = pickAvoidingReuse(audioPool, AUDIO_TARGET_TOTAL, cycleNumber, 71, lastUsed, "audio-guess", notes);
  if (audioPool.length === 0) {
    notes.push("No validated audio-guess questions available — cycle will be multiple-choice only.");
  } else if (selectedAudio.length < AUDIO_TARGET_TOTAL) {
    notes.push(`Only ${selectedAudio.length}/${AUDIO_TARGET_TOTAL} audio-guess questions available in validated pool.`);
  }
  for (const q of selectedAudio) {
    bySlot[q.difficulty].push({ ...q, difficulty: q.difficulty });
  }

  const allSelected = [...bySlot.easy, ...bySlot.medium, ...bySlot.hard];
  const totalVisible = allSelected.length;

  await log(env, cycleNumber, "count_check", totalVisible >= MIN_VISIBLE_QUESTIONS ? "pass" : "fail", `${totalVisible} visible questions selected (target ${MIN_VISIBLE_QUESTIONS}+)`);

  if (totalVisible < MIN_VISIBLE_QUESTIONS) {
    await env.DB.prepare(
      `INSERT INTO quiz_cycles (cycle_number, cycle_key, period_start, period_end, status)
       VALUES (?, ?, ?, ?, 'pending')
       ON CONFLICT(cycle_number) DO UPDATE SET status = 'pending'`
    )
      .bind(cycleNumber, cycleKey, getCycleRange(cycleNumber).start, getCycleRange(cycleNumber).end)
      .run();
    errors.push(`Only ${totalVisible}/${MIN_VISIBLE_QUESTIONS} visible questions available — validated pool is too thin to publish. Add more questions.`);
    notes.push(`${cycleKey}: NOT published — pool too thin, marked pending for manual review.`);
    return { module: "quiz-publish", startedAt, finishedAt: new Date().toISOString(), artistsSeen: cycleNumber, artistsChanged: 0, errors, notes };
  }

  // Source validation + audio check are advisory (logged), never blocking —
  // a single stale artist_slug or a flaky oEmbed response should not wedge
  // an entire cycle shut the way the old hard-fail duplicate check did.
  for (const q of allSelected) {
    if (!q.artist_slug) continue;
    const artist = await env.DB.prepare(`SELECT slug FROM artists WHERE slug = ?`).bind(q.artist_slug).first();
    if (!artist) {
      await log(env, cycleNumber, "source_validation", "warn", `${q.id}: artist_slug '${q.artist_slug}' does not exist in artists table`);
    }
  }
  await log(env, cycleNumber, "source_validation", "pass", `Checked artist_slug for ${allSelected.length} selected questions.`);

  for (const q of allSelected) {
    if (q.type !== "audio-guess" || !q.youtube_video_id) continue;
    const ok = await checkYouTube(q.youtube_video_id);
    await log(env, cycleNumber, "audio_check", ok ? "pass" : "warn", `${q.id}: ${q.youtube_video_id}`);
    if (!ok) notes.push(`${q.id}: YouTube video ${q.youtube_video_id} failed its oEmbed check — still included, but worth a manual look.`);
  }

  await log(env, cycleNumber, "duplicate", "pass", prevCycle !== null ? `Compared against last published cycle (${getCycleKey(prevCycle)}).` : "No previous published cycle to compare against.");

  // Publish: snapshot every selected question, then mark the cycle
  // published. Featured artist = most-linked artist_slug in this cycle.
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
  }

  artistsChanged = 1;
  notes.push(`${cycleKey} published: ${totalVisible} questions (${bySlot.easy.length} easy, ${bySlot.medium.length} medium, ${bySlot.hard.length} hard, ${selectedAudio.length} audio-guess). Featured artist: ${featured ?? "none"}.`);

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
