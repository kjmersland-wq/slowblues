-- Quiz system: extends the EXISTING slowblues D1 database with new tables.
-- This is not a second/parallel quiz system -- it replaces the static
-- src/data/quizQuestions.ts pool as the source of truth for the SAME
-- cycle-rotation model (10-day cycles, C-0XX keys, easy/medium/hard,
-- audio-guess questions) that already exists. See migrations/0004 plan.

CREATE TABLE quiz_questions (
  id               TEXT PRIMARY KEY,
  type             TEXT NOT NULL DEFAULT 'multiple-choice' CHECK (type IN ('multiple-choice', 'audio-guess')),
  difficulty       TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_en      TEXT NOT NULL,
  question_no      TEXT NOT NULL,
  question_sv      TEXT NOT NULL,
  question_de      TEXT NOT NULL,
  question_pl      TEXT NOT NULL,
  options_en       TEXT NOT NULL DEFAULT '[]',
  options_no       TEXT NOT NULL DEFAULT '[]',
  options_sv       TEXT NOT NULL DEFAULT '[]',
  options_de       TEXT NOT NULL DEFAULT '[]',
  options_pl       TEXT NOT NULL DEFAULT '[]',
  correct_index    INTEGER NOT NULL,
  explanation_en   TEXT NOT NULL,
  explanation_no   TEXT NOT NULL,
  explanation_sv   TEXT NOT NULL,
  explanation_de   TEXT NOT NULL,
  explanation_pl   TEXT NOT NULL,
  artist_slug      TEXT,
  source_field     TEXT,
  source_excerpt   TEXT,
  youtube_video_id TEXT,
  audio_start      INTEGER,
  audio_end        INTEGER,
  audio_hint_en    TEXT,
  audio_hint_no    TEXT,
  audio_hint_sv    TEXT,
  audio_hint_de    TEXT,
  audio_hint_pl    TEXT,
  status           TEXT NOT NULL DEFAULT 'validated' CHECK (status IN ('draft', 'validated', 'rejected')),
  validation_notes TEXT,
  created_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_questions_difficulty ON quiz_questions(difficulty);
CREATE INDEX idx_quiz_questions_type ON quiz_questions(type);
CREATE INDEX idx_quiz_questions_artist_slug ON quiz_questions(artist_slug);
CREATE INDEX idx_quiz_questions_status ON quiz_questions(status);

CREATE TRIGGER trg_quiz_questions_updated_at
  AFTER UPDATE ON quiz_questions
  FOR EACH ROW
  BEGIN
    UPDATE quiz_questions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TABLE quiz_cycles (
  cycle_number        INTEGER PRIMARY KEY,
  cycle_key           TEXT NOT NULL UNIQUE,
  period_start        TEXT NOT NULL,
  period_end          TEXT NOT NULL,
  featured_artist_slug TEXT,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('published', 'pending')),
  published_at        TEXT,
  created_at          TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_cycles_status ON quiz_cycles(status);

-- The actual immutable historical record. snapshot_json is a full,
-- self-contained copy of the question (all 5 languages, options, correct
-- answer, explanation) exactly as shown -- editing quiz_questions later
-- can never change what an already-published cycle displays.
CREATE TABLE quiz_cycle_questions (
  id            TEXT PRIMARY KEY,
  cycle_number  INTEGER NOT NULL REFERENCES quiz_cycles(cycle_number),
  difficulty    TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  position      INTEGER NOT NULL,
  question_id   TEXT, -- traceability only, never used to render the archive
  snapshot_json TEXT NOT NULL
);

CREATE INDEX idx_quiz_cycle_questions_cycle ON quiz_cycle_questions(cycle_number, difficulty, position);

-- Audit trail for the pre-publish gate (source validation, duplicate
-- checks, audio checks, count checks) -- same role as artist_edit_log.
CREATE TABLE quiz_generation_log (
  id           TEXT PRIMARY KEY,
  cycle_number INTEGER,
  check_type   TEXT NOT NULL CHECK (check_type IN ('duplicate', 'source_conflict', 'link_check', 'audio_check', 'count_check', 'source_validation')),
  result       TEXT NOT NULL CHECK (result IN ('pass', 'fail', 'warn')),
  detail       TEXT,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_generation_log_cycle ON quiz_generation_log(cycle_number);
