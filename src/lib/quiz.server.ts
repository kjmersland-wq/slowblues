// Read-side quiz data access. Writes (generation/validation/publishing)
// happen exclusively in sync-worker/src/quizPublish.ts, the same
// write-there-read-here split already used for artist sync data — this
// file is READ ONLY.

import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";

export type QuizLang = "en" | "no" | "sv" | "de" | "pl";
export type QuizDifficulty = "easy" | "medium" | "hard";

export interface QuizQuestionSnapshot {
  id: string;
  type: "multiple-choice" | "audio-guess";
  difficulty: QuizDifficulty;
  question: Record<QuizLang, string>;
  options: Record<QuizLang, string[]>;
  correctIndex: number;
  explanation: Record<QuizLang, string>;
  artistSlug: string | null;
  youtubeVideoId: string | null;
  audioStart: number | null;
  audioEnd: number | null;
  audioHint: Record<QuizLang, string> | null;
}

export interface CycleMeta {
  cycleNumber: number;
  cycleKey: string;
  periodStart: string;
  periodEnd: string;
  featuredArtistSlug: string | null;
  status: "published" | "pending";
}

// ----- Cycle math (mirrors sync-worker/src/quizPublish.ts exactly) -----
const CYCLE_LENGTH_DAYS = 10;
const CYCLE_EPOCH_UTC = Date.UTC(2026, 0, 5);
const MS_PER_DAY = 86_400_000;

export function getCycleNumber(date: Date = new Date()): number {
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const diff = Math.floor((today - CYCLE_EPOCH_UTC) / MS_PER_DAY);
  return Math.max(1, Math.floor(diff / CYCLE_LENGTH_DAYS) + 1);
}
export function getCycleKey(cycleNumber: number = getCycleNumber()): string {
  return `C-${String(cycleNumber).padStart(3, "0")}`;
}
/** Same slug->display-name derivation the old static-file system used
 * (title-casing the slug) — not a real artists-table lookup, kept
 * identical on purpose so featured-artist display doesn't change. */
export function displayNameFromSlug(slug: string): string {
  return slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export function formatCycleRange(cycleNumber: number, locale: string = "en"): string {
  const startMs = CYCLE_EPOCH_UTC + (cycleNumber - 1) * CYCLE_LENGTH_DAYS * MS_PER_DAY;
  const endMs = startMs + (CYCLE_LENGTH_DAYS - 1) * MS_PER_DAY;
  const fmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
  const year = new Date(endMs).getUTCFullYear();
  return `${fmt.format(new Date(startMs))} – ${fmt.format(new Date(endMs))}, ${year}`;
}

type CycleQuestionsRow = { snapshot_json: string; difficulty: QuizDifficulty; position: number };

async function loadCycleQuestions(db: D1Database, cycleNumber: number): Promise<Record<QuizDifficulty, QuizQuestionSnapshot[]> | null> {
  const { results } = await db
    .prepare(`SELECT snapshot_json, difficulty, position FROM quiz_cycle_questions WHERE cycle_number = ? ORDER BY difficulty ASC, position ASC`)
    .bind(cycleNumber)
    .all<CycleQuestionsRow>();
  if (!results || results.length === 0) return null;
  const out: Record<QuizDifficulty, QuizQuestionSnapshot[]> = { easy: [], medium: [], hard: [] };
  for (const row of results) {
    out[row.difficulty].push(JSON.parse(row.snapshot_json) as QuizQuestionSnapshot);
  }
  return out;
}

export const getPublishedCycle = createServerFn({ method: "GET" })
  .inputValidator((d: { cycleNumber?: number }) => d)
  .handler(async ({ data }): Promise<{
    meta: CycleMeta | null;
    questions: Record<QuizDifficulty, QuizQuestionSnapshot[]> | null;
  }> => {
    const db = getDB();
    const cycleNumber = data.cycleNumber ?? getCycleNumber();
    const meta = await db
      .prepare(`SELECT cycle_number, cycle_key, period_start, period_end, featured_artist_slug, status FROM quiz_cycles WHERE cycle_number = ? AND status = 'published'`)
      .bind(cycleNumber)
      .first<{ cycle_number: number; cycle_key: string; period_start: string; period_end: string; featured_artist_slug: string | null; status: string }>();

    if (!meta) return { meta: null, questions: null };

    const questions = await loadCycleQuestions(db, cycleNumber);
    return {
      meta: {
        cycleNumber: meta.cycle_number,
        cycleKey: meta.cycle_key,
        periodStart: meta.period_start,
        periodEnd: meta.period_end,
        featuredArtistSlug: meta.featured_artist_slug,
        status: meta.status as "published",
      },
      questions,
    };
  });

export const listPublishedCycles = createServerFn({ method: "GET" })
  .inputValidator((d: { limit?: number }) => d)
  .handler(async ({ data }): Promise<CycleMeta[]> => {
    const db = getDB();
    const { results } = await db
      .prepare(`SELECT cycle_number, cycle_key, period_start, period_end, featured_artist_slug, status FROM quiz_cycles WHERE status = 'published' ORDER BY cycle_number DESC LIMIT ?`)
      .bind(data.limit ?? 24)
      .all<{ cycle_number: number; cycle_key: string; period_start: string; period_end: string; featured_artist_slug: string | null; status: string }>();
    return (results ?? []).map((r) => ({
      cycleNumber: r.cycle_number,
      cycleKey: r.cycle_key,
      periodStart: r.period_start,
      periodEnd: r.period_end,
      featuredArtistSlug: r.featured_artist_slug,
      status: r.status as "published",
    }));
  });
