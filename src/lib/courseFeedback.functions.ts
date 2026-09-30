// Course Feedback — entirely separate feature from Guestbook/Reviews.
// Never reads from or writes to guestbook_entries, contact_messages, or
// blues_reviews; never touched by the Guestbook page or its admin view.
//
// Spam/consent/deletion design note: this codebase's existing forms
// (guestbook, contact) have NO honeypot, rate-limit, report, or
// self-service-deletion mechanism to copy — checked src/lib/guestbook.
// functions.ts and src/lib/contact.functions.ts before writing this.
// What's below (honeypot field, minimum-time-on-page check, one-time
// delete token, report-count auto-hide) is a fresh, reasonable design for
// this feature specifically, not lifted from an "earlier rules" spec this
// session doesn't have visibility into. Flagged in the delivery notes so
// it can be corrected if it doesn't match something specified elsewhere.
import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";

export type CourseFeedbackInstrument = "shared" | "guitar" | "harmonica";
export type CourseFeedbackStatus = "visible" | "hidden" | "deleted";

export type CourseFeedbackRow = {
  id: string;
  instrument: CourseFeedbackInstrument;
  lesson_id: string | null;
  rating: number;
  worked: number | null;
  adjust_chips: string; // JSON array
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

const MIN_MS_ON_PAGE = 3000; // faster than this and a human almost certainly didn't read the form
const AUTO_HIDE_AFTER_REPORTS = 3;

function badRequest(msg: string): never {
  throw new Error(msg);
}

export const submitCourseFeedback = createServerFn({ method: "POST" })
  .inputValidator((d: {
    instrument: CourseFeedbackInstrument;
    lessonId: string | null;
    rating: number;
    worked: boolean | null;
    adjustChips: string[];
    comment: string;
    displayName: string;
    country: string | null;
    email: string;
    privateToEditor: boolean;
    consentPublic: boolean;
    locale: string;
    // Anti-spam signals, never stored:
    website: string; // honeypot — real users never see or fill this field
    elapsedMs: number; // time between form render and submit
  }) => d)
  .handler(async ({ data }) => {
    // Silent-accept bots: return success without writing a row, so a bot
    // gets no useful signal that it tripped a check.
    if (data.website.trim() !== "" || data.elapsedMs < MIN_MS_ON_PAGE) {
      return { ok: true as const, deleteToken: crypto.randomUUID() };
    }

    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) badRequest("Rating must be 1-5.");
    if (!["shared", "guitar", "harmonica"].includes(data.instrument)) badRequest("Invalid instrument.");

    const comment = data.comment.trim().slice(0, 1000);
    const displayName = data.displayName.trim().slice(0, 60) || null;
    const country = data.country?.trim().slice(0, 80) || null;
    const email = data.email.trim().slice(0, 255) || null;
    const adjustChips = JSON.stringify(data.adjustChips.slice(0, 8).map((c) => c.slice(0, 40)));
    const deleteToken = crypto.randomUUID();

    const db = getDB();
    await db
      .prepare(
        `INSERT INTO course_feedback
          (id, instrument, lesson_id, rating, worked, adjust_chips, comment, display_name, country, email, private_to_editor, consent_public, locale, delete_token)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        crypto.randomUUID(),
        data.instrument,
        data.lessonId,
        data.rating,
        data.worked === null ? null : data.worked ? 1 : 0,
        adjustChips,
        comment || null,
        displayName,
        country,
        email,
        data.privateToEditor ? 1 : 0,
        data.consentPublic ? 1 : 0,
        data.locale.slice(0, 5) || "en",
        deleteToken
      )
      .run();

    // Best-effort email of the delete link — never blocks the submission.
    if (email) {
      try {
        const { sendCourseFeedbackDeleteLink } = await import("@/lib/email.server");
        await sendCourseFeedbackDeleteLink(email, deleteToken);
      } catch (e) {
        console.error("course feedback delete-link email failed:", e);
      }
    }

    return { ok: true as const, deleteToken };
  });

export const deleteCourseFeedbackByToken = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const row = await db.prepare(`SELECT id FROM course_feedback WHERE delete_token = ? AND status != 'deleted'`).bind(data.token).first();
    if (!row) return { ok: false as const, reason: "not_found" as const };
    await db.prepare(`UPDATE course_feedback SET status = 'deleted' WHERE delete_token = ?`).bind(data.token).run();
    return { ok: true as const };
  });

export const reportCourseFeedback = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    await db.prepare(`UPDATE course_feedback SET report_count = report_count + 1 WHERE id = ?`).bind(data.id).run();
    const row = await db.prepare(`SELECT report_count, status FROM course_feedback WHERE id = ?`).bind(data.id).first<{ report_count: number; status: string }>();
    if (row && row.report_count >= AUTO_HIDE_AFTER_REPORTS && row.status === "visible") {
      await db.prepare(`UPDATE course_feedback SET status = 'hidden' WHERE id = ?`).bind(data.id).run();
    }
    return { ok: true as const };
  });

// Public: visible, consented, not editor-private entries for one lesson
// (or the whole course if lessonId is null and courseWide=true).
export const fetchPublicCourseFeedback = createServerFn({ method: "GET" })
  .inputValidator((d: { instrument: CourseFeedbackInstrument; lessonId: string | null; limit?: number }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const { results } = await db
      .prepare(
        `SELECT id, rating, comment, display_name, country, created_at, adjust_chips
         FROM course_feedback
         WHERE instrument = ? AND lesson_id IS ? AND status = 'visible' AND consent_public = 1 AND private_to_editor = 0
         ORDER BY created_at DESC LIMIT ?`
      )
      .bind(data.instrument, data.lessonId, data.limit ?? 20)
      .all<{ id: string; rating: number; comment: string | null; display_name: string | null; country: string | null; created_at: string; adjust_chips: string }>();

    const { results: allRatings } = await db
      .prepare(`SELECT rating FROM course_feedback WHERE instrument = ? AND lesson_id IS ? AND status = 'visible'`)
      .bind(data.instrument, data.lessonId)
      .all<{ rating: number }>();
    const ratings = (allRatings ?? []).map((r) => r.rating);
    // Never show an average from fewer than 5 ratings — a single 1-star
    // entry would otherwise look like "1.0 average" and mislead.
    const average = ratings.length >= 5 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

    return {
      entries: (results ?? []).map((r) => ({ ...r, adjust_chips: JSON.parse(r.adjust_chips || "[]") as string[] })),
      average,
      count: ratings.length,
    };
  });
