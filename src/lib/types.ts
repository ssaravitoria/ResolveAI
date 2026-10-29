export type Category =
  | 'entrega'
  | 'pagamento'
  | 'cancelamento'
  | 'reembolso'
  | 'conta'
  | 'tecnico'
  | 'seguranca';

export type Urgency = 'baixa' | 'media' | 'alta' | 'critica';

export type View = 'dashboard' | 'atendimentos' | 'base';

export type SessionStatus = 'resolvido' | 'encaminhado' | 'encaminhado_humano';

export interface KnowledgeArticle {
  id: string;
  category: Category;
  title: string;
  problem: string;
  solution: string;
  steps?: string[];
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  category?: Category;
  urgency?: Urgency;
  source?: { articleId: string; title: string } | null;
  forwarded?: boolean;
  critical?: boolean;
  createdAt: number;
}

export interface SessionRecord {
  id: string;
  question: string;
  category: Category | null;
  urgency: Urgency | null;
  status: SessionStatus;
  source: { articleId: string; title: string } | null;
  createdAt: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  entrega: 'Entrega',
  pagamento: 'Pagamento',
  cancelamento: 'Cancelamento',
  reembolso: 'Reembolso',
  conta: 'Acesso à conta',
  tecnico: 'Problemas técnicos',
  seguranca: 'Segurança/Fraude',
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  entrega: '#1590e0',
  pagamento: '#0a72c2',
  cancelamento: '#1b3174',
  reembolso: '#3355b0',
  conta: '#4f73c6',
  tecnico: '#243f8f',
  seguranca: '#dc2626',
};

export const URGENCY_STYLES: Record<Urgency, string> = {
  baixa: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  media: 'bg-amber-100 text-amber-700 border-amber-200',
  alta: 'bg-rose-100 text-rose-700 border-rose-200',
  critica: 'bg-red-100 text-red-700 border-red-300',
};

export const STATUS_LABELS: Record<SessionStatus, string> = {
  resolvido: 'Resolvido',
  encaminhado: 'Encaminhado',
  encaminhado_humano: 'Encaminhado a humano',
};
