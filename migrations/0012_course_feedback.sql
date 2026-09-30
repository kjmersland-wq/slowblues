-- Course feedback for /learn/play — entirely separate from guestbook_entries
-- and blues_reviews. Never joined against or written to by either of those;
-- never read by the Guestbook page. A learner rates/comments on a specific
-- lesson (or the course as a whole, lesson_id NULL), optionally consenting
-- to have it shown publicly.
--
-- Spam/consent/deletion mechanics here (honeypot check in the server
-- function, minimum-time-on-page check, self-service delete_token,
-- report-count auto-hide threshold) are NOT copied from an existing
-- SlowBlues feature -- guestbook_entries and contact_messages have no
-- equivalent protections in this codebase (checked before writing this).
-- Designed fresh for this feature; see docs/course-feedback-notes.md.
CREATE TABLE course_feedback (
  id                 TEXT PRIMARY KEY,
  instrument         TEXT NOT NULL CHECK (instrument IN ('shared', 'guitar', 'harmonica')),
  lesson_id          TEXT,        -- NULL = feedback on the course as a whole, not one lesson
  rating             INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  worked             INTEGER,     -- 1 = "this worked for me", 0 = "it didn't", NULL = not answered
  adjust_chips       TEXT NOT NULL DEFAULT '[]', -- JSON string array, e.g. ["too fast","video didn't load"]
  comment            TEXT,
  display_name       TEXT,
  country             TEXT,
  email              TEXT,        -- never shown publicly; only used to email the delete link back, if given
  private_to_editor  INTEGER NOT NULL DEFAULT 0,  -- 1 = never show publicly, editor-eyes-only
  consent_public     INTEGER NOT NULL DEFAULT 0,  -- 1 = learner agreed this may be shown publicly
  locale             TEXT NOT NULL DEFAULT 'en',
  status             TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden', 'deleted')),
  report_count       INTEGER NOT NULL DEFAULT 0,
  delete_token       TEXT NOT NULL,  -- shown once at submission time for self-service deletion (GDPR erasure)
  created_at         TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_feedback_lesson ON course_feedback(instrument, lesson_id);
CREATE INDEX idx_course_feedback_status ON course_feedback(status);
CREATE UNIQUE INDEX idx_course_feedback_delete_token ON course_feedback(delete_token);
