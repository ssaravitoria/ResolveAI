import { useState } from 'react';
import { Search, Inbox, Filter, CheckCircle2, Forward, ShieldAlert, BookOpen, Clock } from 'lucide-react';
import type { SessionRecord } from '@/lib/types';
import { CATEGORY_LABELS, URGENCY_LABELS, URGENCY_STYLES, STATUS_LABELS } from '@/lib/types';
import { formatTime } from '@/lib/seed';

interface HistoryViewProps {
  history: SessionRecord[];
  onNavigate: (view: 'base') => void;
}

type StatusFilter = 'todos' | 'resolvido' | 'encaminhado' | 'encaminhado_humano';

export function HistoryView({ history, onNavigate }: HistoryViewProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');

  const filtered = history.filter((rec) => {
    const matchesQuery = rec.question.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || rec.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Atendimentos</h1>
          <p className="text-navy-400 mt-1">Histórico de solicitações processadas nesta sessão.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-navy-500">
          <Inbox className="w-4 h-4" />
          <span>{history.length} registros</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por palavra-chave..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-navy-100 bg-white text-sm text-navy-800 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-navy-400" />
          {(['todos', 'resolvido', 'encaminhado'] as StatusFilter[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                statusFilter === opt
                  ? 'bg-navy-700 text-white'
                  : 'bg-white text-navy-500 border border-navy-100 hover:border-navy-200'
              }`}
            >
              {opt === 'todos' ? 'Todos' : opt === 'resolvido' ? 'Resolvidos' : 'Encaminhados'}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-navy-100 shadow-card overflow-hidden">
        {sorted.length === 0 ? (
          <div className="py-16 text-center">
            <Inbox className="w-10 h-10 text-navy-200 mx-auto mb-3" />
            <p className="text-navy-500 font-medium">Nenhum atendimento encontrado</p>
            <p className="text-sm text-navy-400 mt-1">Ajuste a busca ou use o chat para iniciar um novo atendimento.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 border-b border-navy-100 text-xs font-semibold text-navy-400 uppercase tracking-wide">
              <div className="col-span-5">Solicitação</div>
              <div className="col-span-2">Categoria</div>
              <div className="col-span-2">Urgência</div>
              <div className="col-span-2">Fonte</div>
              <div className="col-span-1 text-right">Status</div>
            </div>
            <div className="divide-y divide-navy-50">
              {sorted.map((rec) => (
                <div
                  key={rec.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="md:col-span-5">
                    <p className="text-sm text-navy-800 font-medium line-clamp-2">{rec.question}</p>
                    <p className="text-xs text-navy-400 mt-1 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(rec.createdAt)}
                    </p>
                  </div>
                  <div className="md:col-span-2 flex md:items-center">
                    {rec.category ? (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                        rec.category === 'seguranca'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-sky-50 text-sky-700 border-sky-100'
                      }`}>
                        {CATEGORY_LABELS[rec.category]}
                      </span>
                    ) : (
                      <span className="text-xs text-navy-300">Não classificado</span>
                    )}
                  </div>
                  <div className="md:col-span-2 flex md:items-center">
                    {rec.urgency ? (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${URGENCY_STYLES[rec.urgency]}`}>
                        {URGENCY_LABELS[rec.urgency]}
                      </span>
                    ) : (
                      <span className="text-xs text-navy-300">—</span>
                    )}
                  </div>
                  <div className="md:col-span-2 flex md:items-center">
                    {rec.source ? (
                      <button
                        onClick={() => onNavigate('base')}
                        className="inline-flex items-center gap-1 text-xs text-navy-500 hover:text-sky-700 transition-colors text-left"
                      >
                        <BookOpen className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{rec.source.title}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-navy-300 inline-flex items-center gap-1">
                        <Forward className="w-3 h-3" /> Sem fonte
                      </span>
                    )}
                  </div>
                  <div className="md:col-span-1 flex md:items-center md:justify-end">
                    {rec.status === 'resolvido' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {STATUS_LABELS[rec.status]}
                      </span>
                    ) : rec.status === 'encaminhado_humano' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
                        <ShieldAlert className="w-3.5 h-3.5" /> {STATUS_LABELS[rec.status]}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                        <Forward className="w-3.5 h-3.5" /> {STATUS_LABELS[rec.status]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
