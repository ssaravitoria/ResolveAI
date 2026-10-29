/*
# Add human requests, feedback, and article CRUD support

## Purpose
Adds a table to track human-attendance requests, adds a feedback column to
attendance records so users can rate AI responses, and enables CRUD grants
on knowledge_articles so the admin UI can create, edit, and delete articles.

## 1. New Tables

### human_requests
Tracks requests for human support created when the AI cannot resolve
a case or the user explicitly asks for a human agent.
- `id` (text, primary key) — client-generated unique id.
- `question` (text, not null) — the original user question that triggered the request.
- `category` (text, nullable) — classified category at time of request.
- `reason` (text, nullable) — why the request was created (e.g. "ai_cannot_resolve", "user_requested").
- `status` (text, not null, default 'pendente') — one of: pendente, em_atendimento, resolvido.
- `attendance_record_id` (text, nullable) — FK to attendance_records(id).
- `created_at` (timestamptz, default now()).
- `resolved_at` (timestamptz, nullable) — when the request was marked as resolved.

## 2. Modified Tables

### attendance_records
- Adds `feedback` (text, nullable) — user rating of the AI response: 'sim' (helpful) or 'nao' (not helpful). NULL means not rated.

### knowledge_articles
- Grants UPDATE and DELETE to anon, authenticated (previously only SELECT).
- Adds RLS policies for INSERT, UPDATE, DELETE (SELECT already existed).

## 3. Indexes
- `human_requests_created_at_idx` — sorted request views.
- `human_requests_status_idx` — dashboard counts by status.
- `attendance_records_feedback_idx` — dashboard feedback counts.

## 4. Security
- RLS ENABLED on human_requests.
- Grants: anon + authenticated get CRUD on human_requests and knowledge_articles.
- attendance_records gets UPDATE grant (for feedback).
- All policies use TO anon, authenticated with USING(true)/WITH CHECK(true) — this is
  a single-tenant app with no sign-in, so data is intentionally shared (no per-user isolation).
*/

-- 1. New table: human_requests
CREATE TABLE IF NOT EXISTS human_requests (
  id text PRIMARY KEY,
  question text NOT NULL,
  category text,
  reason text,
  status text NOT NULL DEFAULT 'pendente',
  attendance_record_id text REFERENCES attendance_records(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE human_requests ENABLE ROW LEVEL SECURITY;

-- 2. Add feedback column to attendance_records
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS feedback text;

-- 3. Indexes
CREATE INDEX IF NOT EXISTS human_requests_created_at_idx
  ON human_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS human_requests_status_idx
  ON human_requests (status);

CREATE INDEX IF NOT EXISTS attendance_records_feedback_idx
  ON attendance_records (feedback);

-- 4. Grants

-- human_requests: full CRUD for anon + authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON human_requests TO anon, authenticated;

-- knowledge_articles: add INSERT, UPDATE, DELETE (SELECT already granted)
GRANT INSERT, UPDATE, DELETE ON knowledge_articles TO anon, authenticated;

-- attendance_records: add UPDATE for feedback
GRANT UPDATE ON attendance_records TO anon, authenticated;

-- 5. RLS policies for human_requests (all shared data, no auth)
DROP POLICY IF EXISTS "anon_select_human_requests" ON human_requests;
CREATE POLICY "anon_select_human_requests"
  ON human_requests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_human_requests" ON human_requests;
CREATE POLICY "anon_insert_human_requests"
  ON human_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_human_requests" ON human_requests;
CREATE POLICY "anon_update_human_requests"
  ON human_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_human_requests" ON human_requests;
CREATE POLICY "anon_delete_human_requests"
  ON human_requests FOR DELETE
  TO anon, authenticated USING (true);

-- 6. RLS policies for knowledge_articles (add INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "anon_insert_articles" ON knowledge_articles;
CREATE POLICY "anon_insert_articles"
  ON knowledge_articles FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_articles" ON knowledge_articles;
CREATE POLICY "anon_update_articles"
  ON knowledge_articles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_articles" ON knowledge_articles;
CREATE POLICY "anon_delete_articles"
  ON knowledge_articles FOR DELETE
  TO anon, authenticated USING (true);
