import {
  ArrowUpRight,
  Headphones,
  CheckCircle2,
  Forward,
  ShieldAlert,
  Clock,
  MessageSquareText,
  ThumbsUp,
  ThumbsDown,
  Bot,
} from 'lucide-react';
import type { HumanRequest, SessionRecord } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/types';
import { CategoryChart } from '@/components/CategoryChart';

interface DashboardProps {
  history: SessionRecord[];
  humanRequests: HumanRequest[];
  categoryData: Record<string, number>;
  onNavigate: (view: 'atendimentos' | 'base' | 'solicitacoes') => void;
}

export function Dashboard({ history, humanRequests, categoryData, onNavigate }: DashboardProps) {
  const total = history.length;
  const resolvidos = history.filter((r) => r.status === 'resolvido').length;
  const encaminhados = history.filter((r) => r.status === 'encaminhado').length;
  const criticos = history.filter((r) => r.status === 'encaminhado_humano').length;
  const taxaResolucao = total > 0 ? Math.round((resolvidos / total) * 100) : 0;

  const pendingRequests = humanRequests.filter((r) => r.status === 'pendente').length;
  const resolvedRequests = humanRequests.filter((r) => r.status === 'resolvido').length;

  const positiveFeedback = history.filter((r) => r.feedback === 'sim').length;
  const negativeFeedback = history.filter((r) => r.feedback === 'nao').length;
  const totalFeedback = positiveFeedback + negativeFeedback;
  const satisfactionRate = totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 0;

  const recentes = [...history].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  const cards = [
    {
      label: 'Total de atendimentos',
      value: total,
      icon: Headphones,
      tone: 'navy' as const,
      hint: 'Todas as solicitações registradas',
    },
    {
      label: 'Resolvidos pela IA',
      value: resolvidos,
      icon: CheckCircle2,
      tone: 'emerald' as const,
      hint: `${taxaResolucao}% de taxa de resolução`,
    },
    {
      label: 'Atendimento humano pendente',
      value: pendingRequests,
      icon: Forward,
      tone: 'amber' as const,
      hint: `${resolvedRequests} solicitações resolvidas`,
    },
    {
      label: 'Incidentes críticos',
      value: criticos,
      icon: ShieldAlert,
      tone: 'red' as const,
      hint: 'Segurança/fraude encaminhados com prioridade',
    },
  ];

  const toneClasses = {
    navy: 'from-navy-600 to-navy-800 text-white',
    emerald: 'from-emerald-500 to-emerald-700 text-white',
    amber: 'from-amber-500 to-amber-600 text-white',
    red: 'from-red-500 to-rose-700 text-white',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
        <p className="text-navy-400 mt-1">Visão geral dos atendimentos inteligentes da plataforma.</p>
      </div>

      {total === 0 && humanRequests.length === 0 ? (
        <div className="py-16 rounded-2xl bg-white border border-navy-100 shadow-card text-center">
          <Bot className="w-10 h-10 text-navy-200 mx-auto mb-3" />
          <p className="text-navy-500 font-medium">Nenhum dado disponível ainda</p>
          <p className="text-sm text-navy-400 mt-1">
            Inicie uma conversa no chat para gerar dados reais para o dashboard.
          </p>
          <button
            onClick={() => onNavigate('atendimentos')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
          >
            <MessageSquareText className="w-4 h-4" /> Iniciar atendimento
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="relative overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card p-5 hover:shadow-cardHover transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-navy-400 font-medium">{card.label}</p>
                      <p className="text-3xl font-bold text-navy-900 mt-2">{card.value}</p>
                      <p className="text-xs text-navy-400 mt-1.5">{card.hint}</p>
                    </div>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${toneClasses[card.tone]} flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CategoryChart data={categoryData} />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white border border-navy-100 shadow-card p-5">
                <h3 className="text-base font-semibold text-navy-900 mb-3">Avaliação das respostas</h3>
                {totalFeedback === 0 ? (
                  <p className="text-sm text-navy-400">Nenhuma avaliação recebida ainda.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm text-navy-600">
                        <ThumbsUp className="w-4 h-4 text-emerald-600" /> Úteis
                      </span>
                      <span className="text-sm font-semibold text-navy-900">{positiveFeedback}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm text-navy-600">
                        <ThumbsDown className="w-4 h-4 text-rose-500" /> Não úteis
                      </span>
                      <span className="text-sm font-semibold text-navy-900">{negativeFeedback}</span>
                    </div>
                    <div className="pt-2 border-t border-navy-50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-navy-400">Taxa de satisfação</span>
                        <span className="text-sm font-bold text-emerald-600">{satisfactionRate}%</span>
                      </div>
                      <p className="text-xs text-navy-300 mt-0.5">
                        {totalFeedback} de {total} respostas avaliadas
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white border border-navy-100 shadow-card p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-navy-900">Atendimentos recentes</h3>
                  <button
                    onClick={() => onNavigate('atendimentos')}
                    className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-600 transition-colors"
                  >
                    Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-3 flex-1">
                  {recentes.length === 0 ? (
                    <p className="text-sm text-navy-400">Nenhum atendimento ainda.</p>
                  ) : (
                    recentes.map((rec) => (
                      <div key={rec.id} className="flex gap-3 items-start">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
                          <MessageSquareText className="w-4 h-4 text-navy-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-navy-700 line-clamp-2">{rec.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-navy-400 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(rec.createdAt).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span
                              className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                                rec.status === 'resolvido'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : rec.status === 'encaminhado_humano'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {STATUS_LABELS[rec.status]}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
