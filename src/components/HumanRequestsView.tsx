import { useState } from 'react';
import {
  Headphones,
  Clock,
  CheckCircle2,
  Loader,
  Inbox,
  Filter,
  Search,
} from 'lucide-react';
import type { HumanRequest, HumanRequestStatus } from '@/lib/types';
import { HUMAN_REQUEST_STATUS_LABELS, HUMAN_REQUEST_STATUS_STYLES, CATEGORY_LABELS } from '@/lib/types';
import { formatTime } from '@/lib/seed';
import { updateHumanRequestStatus } from '@/lib/db';

interface HumanRequestsViewProps {
  requests: HumanRequest[];
  onUpdate: (request: HumanRequest) => void;
}

type StatusFilter = 'todos' | HumanRequestStatus;

export function HumanRequestsView({ requests, onUpdate }: HumanRequestsViewProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = requests.filter((req) => {
    const matchesQuery = req.question.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || req.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt);

  const pending = requests.filter((r) => r.status === 'pendente').length;
  const inAttendance = requests.filter((r) => r.status === 'em_atendimento').length;
  const resolved = requests.filter((r) => r.status === 'resolvido').length;

  const handleStatusChange = async (request: HumanRequest, newStatus: HumanRequestStatus) => {
    setUpdating(request.id);
    try {
      await updateHumanRequestStatus(request.id, newStatus);
      onUpdate({
        ...request,
        status: newStatus,
        resolvedAt: newStatus === 'resolvido' ? Date.now() : null,
      });
    } catch {
      // keep current state on error
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Atendimento humano</h1>
          <p className="text-navy-400 mt-1">
            Solicitações de atendimento humano registradas pelo assistente.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-navy-500">
          <Inbox className="w-4 h-4" />
          <span>{requests.length} solicitações</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-navy-100 bg-white shadow-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-xs text-navy-400 font-medium">Pendentes</p>
          </div>
          <p className="text-2xl font-bold text-navy-900">{pending}</p>
        </div>
        <div className="rounded-xl border border-navy-100 bg-white shadow-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center">
              <Loader className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <p className="text-xs text-navy-400 font-medium">Em atendimento</p>
          </div>
          <p className="text-2xl font-bold text-navy-900">{inAttendance}</p>
        </div>
        <div className="rounded-xl border border-navy-100 bg-white shadow-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-xs text-navy-400 font-medium">Resolvidos</p>
          </div>
          <p className="text-2xl font-bold text-navy-900">{resolved}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar solicitações..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-navy-100 bg-white text-sm text-navy-800 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-navy-400" />
          {(['todos', 'pendente', 'em_atendimento', 'resolvido'] as StatusFilter[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === opt
                  ? 'bg-navy-700 text-white'
                  : 'bg-white text-navy-500 border border-navy-100 hover:border-navy-200'
              }`}
            >
              {opt === 'todos' ? 'Todos' : HUMAN_REQUEST_STATUS_LABELS[opt]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="py-16 rounded-2xl bg-white border border-navy-100 shadow-card text-center">
            <Headphones className="w-10 h-10 text-navy-200 mx-auto mb-3" />
            <p className="text-navy-500 font-medium">Nenhuma solicitação encontrada</p>
            <p className="text-sm text-navy-400 mt-1">
              Solicitações de atendimento humano aparecerão aqui automaticamente.
            </p>
          </div>
        ) : (
          sorted.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl bg-white border border-navy-100 shadow-card p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-navy-800 line-clamp-2">{req.question}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${HUMAN_REQUEST_STATUS_STYLES[req.status]}`}
                    >
                      {HUMAN_REQUEST_STATUS_LABELS[req.status]}
                    </span>
                    {req.category && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                        {CATEGORY_LABELS[req.category]}
                      </span>
                    )}
                    {req.reason && (
                      <span className="text-xs text-navy-400">
                        {req.reason === 'user_requested' ? 'Solicitado pelo usuário' : 'IA não conseguiu resolver'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-navy-400 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(req.createdAt)}
                  </p>
                  {req.resolvedAt && (
                    <p className="text-xs text-emerald-600 mt-1">
                      Resolvido em {formatTime(req.resolvedAt)}
                    </p>
                  )}
                </div>
              </div>

              {req.status !== 'resolvido' && (
                <div className="flex items-center gap-2 pt-2 border-t border-navy-50">
                  <button
                    onClick={() => handleStatusChange(req, 'em_atendimento')}
                    disabled={updating === req.id || req.status === 'em_atendimento'}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Em atendimento
                  </button>
                  <button
                    onClick={() => handleStatusChange(req, 'resolvido')}
                    disabled={updating === req.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Marcar como resolvido
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
