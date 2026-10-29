/*
# Create ResolveAI database schema

## Purpose
Creates the two core tables for ResolveAI, a single-tenant (no auth) intelligent
support platform: a knowledge base of support articles and a record of every
attendance handled by the assistant.

## 1. New Tables

### knowledge_articles
Stores the local knowledge base the assistant consults to answer user questions.
- `id` (text, primary key) — short slug like "ent-001", stable across seeds.
- `category` (text, not null) — one of: entrega, pagamento, cancelamento, reembolso, conta, tecnico, seguranca.
- `title` (text, not null) — human-readable article title.
- `problem` (text, not null) — keywords/phrase describing the problem the article solves.
- `solution` (text, not null) — the solution text shown to the user.
- `steps` (jsonb) — ordered list of step strings (may be null).
- `tags` (jsonb) — array of keyword strings used for matching (may be null).
- `created_at` (timestamptz, default now()).

### attendance_records
Stores every attendance/request processed in the session (the "histórico").
- `id` (text, primary key) — client-generated unique id.
- `question` (text, not null) — the user's original question.
- `category` (text, nullable) — classified category, null when unclassified.
- `urgency` (text, nullable) — one of: baixa, media, alta, critica.
- `status` (text, not null) — one of: resolvido, encaminhado, encaminhado_humano.
- `source_article_id` (text, nullable) — FK to knowledge_articles.id (the source used).
- `source_title` (text, nullable) — denormalized article title at time of answer.
- `created_at` (timestamptz, default now()).

## 2. Indexes
- `attendance_records_created_at_idx` — sorted history views.
- `attendance_records_status_idx` — dashboard counts by status.
- `attendance_records_category_idx` — dashboard counts by category.
- `knowledge_articles_category_idx` — category filtering in the knowledge view.

## 3. Security
This is a single-tenant app with NO sign-in, so the anon-key frontend must read
and write its own data. Per the database guidance:
- RLS is ENABLED on both tables.
- Policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because the data is intentionally shared (no per-user isolation needed).
- Grants give anon + authenticated the verbs used (SELECT on articles,
  SELECT/INSERT on attendance records; the frontend never updates or deletes).

## 4. Notes
- `knowledge_articles` is effectively read-only from the app: only SELECT is granted.
- `attendance_records` supports SELECT (history/dashboard) and INSERT (new chat answers).
- No user_id columns, no auth.uid() usage — no sign-in in this version.
*/

CREATE TABLE IF NOT EXISTS knowledge_articles (
  id text PRIMARY KEY,
  category text NOT NULL,
  title text NOT NULL,
  problem text NOT NULL,
  solution text NOT NULL,
  steps jsonb,
  tags jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id text PRIMARY KEY,
  question text NOT NULL,
  category text,
  urgency text,
  status text NOT NULL,
  source_article_id text REFERENCES knowledge_articles(id) ON DELETE SET NULL,
  source_title text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS attendance_records_created_at_idx
  ON attendance_records (created_at DESC);

CREATE INDEX IF NOT EXISTS attendance_records_status_idx
  ON attendance_records (status);

CREATE INDEX IF NOT EXISTS attendance_records_category_idx
  ON attendance_records (category);

CREATE INDEX IF NOT EXISTS knowledge_articles_category_idx
  ON knowledge_articles (category);

-- RLS
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT ON knowledge_articles TO anon, authenticated;
GRANT SELECT, INSERT ON attendance_records TO anon, authenticated;

-- Policies: knowledge_articles (read-only, intentionally shared)
DROP POLICY IF EXISTS "anon_select_articles" ON knowledge_articles;
CREATE POLICY "anon_select_articles"
  ON knowledge_articles FOR SELECT
  TO anon, authenticated USING (true);

-- Policies: attendance_records (shared history, no per-user isolation)
DROP POLICY IF EXISTS "anon_select_attendance" ON attendance_records;
CREATE POLICY "anon_select_attendance"
  ON attendance_records FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_attendance" ON attendance_records;
CREATE POLICY "anon_insert_attendance"
  ON attendance_records FOR INSERT
  TO anon, authenticated WITH CHECK (true);