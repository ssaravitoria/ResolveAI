import { useEffect, useMemo, useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { ChatPanel } from '@/components/ChatPanel';
import { HistoryView } from '@/components/HistoryView';
import { KnowledgeView } from '@/components/KnowledgeView';
import { HumanRequestsView } from '@/components/HumanRequestsView';
import type { Category, ChatMessage, Feedback, HumanRequest, KnowledgeArticle, SessionRecord, View } from '@/lib/types';
import { knowledgeBase, setActiveKnowledgeBase } from '@/lib/knowledge';
import {
  fetchKnowledgeArticles,
  fetchAttendanceRecords,
  fetchHumanRequests,
  insertAttendanceRecord,
  updateAttendanceFeedback,
  insertHumanRequest,
} from '@/lib/db';
import { generateId } from '@/lib/seed';

const INITIAL_MESSAGES: ChatMessage[] = [];

const CATEGORIES: Category[] = ['entrega', 'pagamento', 'cancelamento', 'reembolso', 'conta', 'tecnico', 'seguranca'];

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>(knowledgeBase);
  const [humanRequests, setHumanRequests] = useState<HumanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setDbError(null);
      try {
        const [dbArticles, dbRecords, dbRequests] = await Promise.all([
          fetchKnowledgeArticles(),
          fetchAttendanceRecords(),
          fetchHumanRequests(),
        ]);
        if (cancelled) return;
        setActiveKnowledgeBase(dbArticles);
        setArticles(dbArticles);
        setHistory(dbRecords);
        setHumanRequests(dbRequests);
      } catch (err) {
        if (cancelled) return;
        setDbError(err instanceof Error ? err.message : 'Erro ao carregar dados do banco.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addRecord = async (record: SessionRecord) => {
    const recordWithId: SessionRecord = { ...record, id: record.id };
    setHistory((prev) => [recordWithId, ...prev]);

    try {
      const saved = await insertAttendanceRecord(recordWithId);
      setHistory((prev) =>
        prev.map((r) => (r.id === recordWithId.id ? saved : r)),
      );
    } catch (err) {
      console.error('Falha ao salvar atendimento no banco:', err);
    }
  };

  const handleFeedback = async (recordId: string, feedback: Feedback) => {
    setHistory((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, feedback } : r)),
    );
    try {
      await updateAttendanceFeedback(recordId, feedback);
    } catch (err) {
      console.error('Falha ao salvar avaliação:', err);
    }
  };

  const handleHumanRequest = async (
    question: string,
    category: string | null,
    reason: string,
    attendanceRecordId: string | null,
  ) => {
    const newRequest: Omit<HumanRequest, 'createdAt' | 'resolvedAt'> = {
      id: generateId('hr'),
      question,
      category: category as Category | null,
      reason,
      status: 'pendente',
      attendanceRecordId,
    };

    try {
      const saved = await insertHumanRequest(newRequest);
      setHumanRequests((prev) => [saved, ...prev]);
    } catch (err) {
      console.error('Falha ao registrar solicitação humana:', err);
    }
  };

  const refreshArticles = async () => {
    try {
      const dbArticles = await fetchKnowledgeArticles();
      setActiveKnowledgeBase(dbArticles);
      setArticles(dbArticles);
    } catch (err) {
      console.error('Falha ao recarregar artigos:', err);
    }
  };

  const refreshHumanRequests = async () => {
    try {
      const dbRequests = await fetchHumanRequests();
      setHumanRequests(dbRequests);
    } catch (err) {
      console.error('Falha ao recarregar solicitações:', err);
    }
  };

  const pendingCount = humanRequests.filter((r) => r.status === 'pendente').length;

  const categoryData = useMemo(() => {
    const data = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
    for (const rec of history) {
      if (rec.category) {
        data[rec.category] = (data[rec.category] ?? 0) + 1;
      }
    }
    return data;
  }, [history]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar view={view} setView={setView} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} pendingCount={pendingCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-navy-100">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-lg border border-navy-100 flex items-center justify-center text-navy-600 hover:bg-slate-50"
            aria-label="Abrir menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="font-bold text-navy-900">ResolveAI</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full border-4 border-navy-100 border-t-sky-500 animate-spin" />
                <p className="text-navy-400 text-sm">Carregando dados do banco...</p>
              </div>
            </div>
          ) : (
            <>
              {dbError && (
                <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                  Não foi possível conectar ao banco de dados. Verifique sua conexão. ({dbError})
                </div>
              )}

              {view === 'dashboard' && (
                <Dashboard
                  history={history}
                  humanRequests={humanRequests}
                  categoryData={categoryData}
                  onNavigate={(v) => setView(v)}
                />
              )}

              {view === 'atendimentos' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h1 className="text-2xl font-bold text-navy-900">Atendimentos</h1>
                    <p className="text-navy-400 mt-1">
                      Converse com o assistente e acompanhe o histórico das solicitações da sessão.
                    </p>
                  </div>

                  <div className="h-[520px] lg:h-[600px]">
                    <ChatPanel
                      messages={messages}
                      setMessages={setMessages}
                      onResolved={addRecord}
                      onFeedback={handleFeedback}
                      onHumanRequest={handleHumanRequest}
                      onNavigate={(v) => setView(v)}
                    />
                  </div>

                  <HistoryView history={history} onNavigate={(v) => setView(v)} />
                </div>
              )}

              {view === 'solicitacoes' && (
                <HumanRequestsView
                  requests={humanRequests}
                  onUpdate={(updated) => {
                    setHumanRequests((prev) =>
                      prev.map((r) => (r.id === updated.id ? updated : r)),
                    );
                    refreshHumanRequests();
                  }}
                />
              )}

              {view === 'base' && (
                <KnowledgeView articles={articles} onArticlesChange={refreshArticles} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
