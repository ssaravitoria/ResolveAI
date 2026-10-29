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
- Adds 4 RLS policies (one per CRUD verb) to replace the single SELECT policy.

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
