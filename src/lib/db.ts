import { supabase } from './supabase';
import type { Category, KnowledgeArticle, SessionRecord, SessionStatus, Urgency } from './types';

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
  created_at: string;
}

export async function fetchKnowledgeArticles(): Promise<KnowledgeArticle[]> {
  const { data, error } = await supabase
    .from('knowledge_articles')
    .select('id, category, title, problem, solution, steps, tags, created_at')
    .order('category', { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return (data as DbKnowledgeArticle[]).map((row) => ({
    id: row.id,
    category: row.category,
    title: row.title,
    problem: row.problem,
    solution: row.solution,
    steps: row.steps ?? undefined,
    tags: row.tags ?? [],
  }));
}

export async function fetchAttendanceRecords(): Promise<SessionRecord[]> {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('id, question, category, urgency, status, source_article_id, source_title, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return (data as DbAttendanceRecord[]).map((row) => ({
    id: row.id,
    question: row.question,
    category: row.category,
    urgency: row.urgency,
    status: row.status,
    source: row.source_article_id
      ? { articleId: row.source_article_id, title: row.source_title ?? '' }
      : null,
    createdAt: new Date(row.created_at).getTime(),
  }));
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
    .select('id, question, category, urgency, status, source_article_id, source_title, created_at')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Insert returned no data');

  const row = data as DbAttendanceRecord;
  return {
    id: row.id,
    question: row.question,
    category: row.category,
    urgency: row.urgency,
    status: row.status,
    source: row.source_article_id
      ? { articleId: row.source_article_id, title: row.source_title ?? '' }
      : null,
    createdAt: new Date(row.created_at).getTime(),
  };
}
