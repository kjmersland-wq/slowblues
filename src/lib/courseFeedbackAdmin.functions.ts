import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/adminAuth.server";
import { getDB } from "@/integrations/d1/client";
import type { CourseFeedbackInstrument, CourseFeedbackStatus } from "@/lib/courseFeedback.functions";

export type CourseFeedbackAdminRow = {
  id: string;
  instrument: CourseFeedbackInstrument;
  lesson_id: string | null;
  rating: number;
  worked: number | null;
  adjust_chips: string[];
  comment: string | null;
  display_name: string | null;
  country: string | null;
  email: string | null;
  private_to_editor: number;
  consent_public: number;
  locale: string;
  status: CourseFeedbackStatus;
  report_count: number;
  created_at: string;
};

export const listCourseFeedbackAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((d: { instrument?: CourseFeedbackInstrument; lessonId?: string; rating?: number; status?: CourseFeedbackStatus }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const clauses: string[] = [];
    const params: unknown[] = [];
    if (data.instrument) { clauses.push("instrument = ?"); params.push(data.instrument); }
    if (data.lessonId) { clauses.push("lesson_id = ?"); params.push(data.lessonId); }
    if (data.rating) { clauses.push("rating = ?"); params.push(data.rating); }
    if (data.status) { clauses.push("status = ?"); params.push(data.status); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const { results } = await db
      .prepare(`SELECT * FROM course_feedback ${where} ORDER BY created_at DESC LIMIT 500`)
      .bind(...params)
      .all<Omit<CourseFeedbackAdminRow, "adjust_chips"> & { adjust_chips: string }>();
    return (results ?? []).map((r) => ({ ...r, adjust_chips: JSON.parse(r.adjust_chips || "[]") as string[] }));
  });

export const setCourseFeedbackStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string; status: CourseFeedbackStatus }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    await db.prepare(`UPDATE course_feedback SET status = ? WHERE id = ?`).bind(data.status, data.id).run();
    return { ok: true as const };
  });

export type LessonSummary = { instrument: string; lesson_id: string | null; count: number; average: number; topChips: { chip: string; count: number }[] };

export const summarizeCourseFeedback = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const db = getDB();
    const { results } = await db
      .prepare(`SELECT instrument, lesson_id, rating, adjust_chips FROM course_feedback WHERE status != 'deleted'`)
      .all<{ instrument: string; lesson_id: string | null; rating: number; adjust_chips: string }>();

    const groups = new Map<string, { instrument: string; lesson_id: string | null; ratings: number[]; chipCounts: Map<string, number> }>();
    for (const r of results ?? []) {
      const key = `${r.instrument}::${r.lesson_id ?? ""}`;
      if (!groups.has(key)) groups.set(key, { instrument: r.instrument, lesson_id: r.lesson_id, ratings: [], chipCounts: new Map() });
      const g = groups.get(key)!;
      g.ratings.push(r.rating);
      let chips: string[] = [];
      try { chips = JSON.parse(r.adjust_chips || "[]"); } catch { /* ignore malformed row */ }
      for (const c of chips) g.chipCounts.set(c, (g.chipCounts.get(c) ?? 0) + 1);
    }

    const summaries: LessonSummary[] = [...groups.values()].map((g) => ({
      instrument: g.instrument,
      lesson_id: g.lesson_id,
      count: g.ratings.length,
      average: g.ratings.reduce((a, b) => a + b, 0) / g.ratings.length,
      topChips: [...g.chipCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([chip, count]) => ({ chip, count })),
    }));
    summaries.sort((a, b) => b.count - a.count);
    return summaries;
  });

export const exportCourseFeedbackCsv = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const db = getDB();
    const { results } = await db
      .prepare(`SELECT id, instrument, lesson_id, rating, worked, adjust_chips, comment, display_name, country, email, private_to_editor, consent_public, locale, status, report_count, created_at FROM course_feedback ORDER BY created_at DESC`)
      .all<CourseFeedbackAdminRow & { adjust_chips: string }>();

    const rows = results ?? [];
    const cols = ["id", "instrument", "lesson_id", "rating", "worked", "adjust_chips", "comment", "display_name", "country", "email", "private_to_editor", "consent_public", "locale", "status", "report_count", "created_at"] as const;
    const esc = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [cols.join(","), ...rows.map((r) => cols.map((c) => esc((r as any)[c])).join(","))];
    return { csv: lines.join("\n") };
  });
