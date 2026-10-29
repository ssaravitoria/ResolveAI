import { supabase } from './supabase';
import type {
  Category,
  Feedback,
  HumanRequest,
  HumanRequestStatus,
  KnowledgeArticle,
  SessionRecord,
  SessionStatus,
  Urgency,
} from './types';

export interface DbKnowledgeArticle {
  id: string;
  category: Category;
  title: string;
  problem: string;
  solution: string;
  steps: string[] | null;
  tags: string[] | null;
  created_at: string;
}

export interface DbAttendanceRecord {
  id: string;
  question: string;
  category: Category | null;
  urgency: Urgency | null;
  status: SessionStatus;
  source_article_id: string | null;
  source_title: string | null;
  feedback: Feedback | null;
  created_at: string;
}

export interface DbHumanRequest {
  id: string;
  question: string;
  category: Category | null;
  reason: string | null;
  status: HumanRequestStatus;
  attendance_record_id: string | null;
  created_at: string;
  resolved_at: string | null;
}

function mapArticle(row: DbKnowledgeArticle): KnowledgeArticle {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    problem: row.problem,
    solution: row.solution,
    steps: row.steps ?? undefined,
    tags: row.tags ?? [],
  };
}

function mapAttendance(row: DbAttendanceRecord): SessionRecord {
  return {
    id: row.id,
    question: row.question,
    category: row.category,
    urgency: row.urgency,
    status: row.status,
    source: row.source_article_id
      ? { articleId: row.source_article_id, title: row.source_title ?? '' }
      : null,
    feedback: row.feedback,
    createdAt: new Date(row.created_at).getTime(),
  };
}

function mapHumanRequest(row: DbHumanRequest): HumanRequest {
  return {
    id: row.id,
    question: row.question,
    category: row.category,
    reason: row.reason,
    status: row.status,
    attendanceRecordId: row.attendance_record_id,
    createdAt: new Date(row.created_at).getTime(),
    resolvedAt: row.resolved_at ? new Date(row.resolved_at).getTime() : null,
  };
}

export async function fetchKnowledgeArticles(): Promise<KnowledgeArticle[]> {
  const { data, error } = await supabase
    .from('knowledge_articles')
    .select('id, category, title, problem, solution, steps, tags, created_at')
    .order('category', { ascending: true });

  if (error) throw error;
  if (!data) return [];
  return (data as DbKnowledgeArticle[]).map(mapArticle);
}

export async function fetchAttendanceRecords(): Promise<SessionRecord[]> {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('id, question, category, urgency, status, source_article_id, source_title, feedback, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];
  return (data as DbAttendanceRecord[]).map(mapAttendance);
}

export async function insertAttendanceRecord(
  record: SessionRecord,
): Promise<SessionRecord> {
  const insert = {
    id: record.id,
    question: record.question,
    category: record.category,
    urgency: record.urgency,
    status: record.status,
    source_article_id: record.source?.articleId ?? null,
    source_title: record.source?.title ?? null,
  };

  const { data, error } = await supabase
    .from('attendance_records')
    .insert(insert)
    .select('id, question, category, urgency, status, source_article_id, source_title, feedback, created_at')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Insert returned no data');
  return mapAttendance(data as DbAttendanceRecord);
}

export async function updateAttendanceFeedback(
  recordId: string,
  feedback: Feedback,
): Promise<void> {
  const { error } = await supabase
    .from('attendance_records')
    .update({ feedback })
    .eq('id', recordId);

  if (error) throw error;
}

export async function insertKnowledgeArticle(
  article: KnowledgeArticle,
): Promise<KnowledgeArticle> {
  const insert = {
    id: article.id,
    category: article.category,
    title: article.title,
    problem: article.problem,
    solution: article.solution,
    steps: article.steps ?? null,
    tags: article.tags,
  };

  const { data, error } = await supabase
    .from('knowledge_articles')
    .insert(insert)
    .select('id, category, title, problem, solution, steps, tags, created_at')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Insert returned no data');
  return mapArticle(data as DbKnowledgeArticle);
}

export async function updateKnowledgeArticle(
  article: KnowledgeArticle,
): Promise<KnowledgeArticle> {
  const update = {
    category: article.category,
    title: article.title,
    problem: article.problem,
    solution: article.solution,
    steps: article.steps ?? null,
    tags: article.tags,
  };

  const { data, error } = await supabase
    .from('knowledge_articles')
    .update(update)
    .eq('id', article.id)
    .select('id, category, title, problem, solution, steps, tags, created_at')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Update returned no data');
  return mapArticle(data as DbKnowledgeArticle);
}

export async function deleteKnowledgeArticle(articleId: string): Promise<void> {
  const { error } = await supabase
    .from('knowledge_articles')
    .delete()
    .eq('id', articleId);

  if (error) throw error;
}

export async function fetchHumanRequests(): Promise<HumanRequest[]> {
  const { data, error } = await supabase
    .from('human_requests')
    .select('id, question, category, reason, status, attendance_record_id, created_at, resolved_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];
  return (data as DbHumanRequest[]).map(mapHumanRequest);
}

export async function insertHumanRequest(
  request: Omit<HumanRequest, 'createdAt' | 'resolvedAt'>,
): Promise<HumanRequest> {
  const insert = {
    id: request.id,
    question: request.question,
    category: request.category,
    reason: request.reason,
    status: request.status,
    attendance_record_id: request.attendanceRecordId,
  };

  const { data, error } = await supabase
    .from('human_requests')
    .insert(insert)
    .select('id, question, category, reason, status, attendance_record_id, created_at, resolved_at')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Insert returned no data');
  return mapHumanRequest(data as DbHumanRequest);
}

export async function updateHumanRequestStatus(
  requestId: string,
  status: HumanRequestStatus,
): Promise<void> {
  const resolvedAt = status === 'resolvido' ? new Date().toISOString() : null;
  const { error } = await supabase
    .from('human_requests')
    .update({ status, resolved_at: resolvedAt })
    .eq('id', requestId);

  if (error) throw error;
}
