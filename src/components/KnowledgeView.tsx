import { useState } from 'react';
import { Search, BookOpen, ListChecks, FileText, ArrowRight, Plus, Pencil, Trash2, X, AlertTriangle, CheckCircle2, Loader } from 'lucide-react';
import type { Category, KnowledgeArticle } from '@/lib/types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/types';
import {
  insertKnowledgeArticle,
  updateKnowledgeArticle,
  deleteKnowledgeArticle,
} from '@/lib/db';
import { generateId } from '@/lib/seed';

const CATEGORIES: Category[] = ['entrega', 'pagamento', 'cancelamento', 'reembolso', 'conta', 'tecnico', 'seguranca'];

interface KnowledgeViewProps {
  articles: KnowledgeArticle[];
  onArticlesChange: () => void;
}

interface EditState {
  mode: 'create' | 'edit';
  article: KnowledgeArticle;
}

const EMPTY_ARTICLE: KnowledgeArticle = {
  id: '',
  category: 'entrega',
  title: '',
  problem: '',
  solution: '',
  steps: [],
  tags: [],
};

export function KnowledgeView({ articles, onArticlesChange }: KnowledgeViewProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'todas'>('todas');
  const [selected, setSelected] = useState<KnowledgeArticle | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeArticle | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const filtered = articles.filter((article) => {
    const matchesCategory = activeCategory === 'todas' || article.category === activeCategory;
    const normalizedQuery = query.toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.problem.toLowerCase().includes(normalizedQuery) ||
      article.tags.some((t) => t.toLowerCase().includes(normalizedQuery));
    return matchesCategory && matchesQuery;
  });

  const handleSave = async () => {
    if (!editState) return;
    const a = editState.article;
    if (!a.title.trim() || !a.problem.trim() || !a.solution.trim()) {
      setSaveError('Preencha título, problema e solução.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      if (editState.mode === 'create') {
        await insertKnowledgeArticle({
          ...a,
          id: generateId('art'),
        });
        setSaveSuccess('Artigo criado com sucesso.');
      } else {
        await updateKnowledgeArticle(a);
        setSaveSuccess('Artigo atualizado com sucesso.');
      }
      setEditState(null);
      onArticlesChange();
    } catch {
      setSaveError('Erro ao salvar artigo. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    setSaveError(null);
    try {
      await deleteKnowledgeArticle(deleteTarget.id);
      if (selected?.id === deleteTarget.id) setSelected(null);
      setDeleteTarget(null);
      onArticlesChange();
      setSaveSuccess('Artigo excluído com sucesso.');
    } catch {
      setSaveError('Erro ao excluir artigo. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof KnowledgeArticle>(key: K, value: KnowledgeArticle[K]) => {
    if (!editState) return;
    setEditState({ ...editState, article: { ...editState.article, [key]: value } });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Base de conhecimento</h1>
          <p className="text-navy-400 mt-1">
            Artigos consultados pelo assistente para responder aos atendimentos.
          </p>
        </div>
        <button
          onClick={() => {
            setEditState({ mode: 'create', article: { ...EMPTY_ARTICLE } });
            setSaveError(null);
            setSaveSuccess(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Novo artigo
        </button>
      </div>

      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {saveSuccess}
          <button onClick={() => setSaveSuccess(null)} className="ml-auto text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {saveError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {saveError}
          <button onClick={() => setSaveError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artigos por título, problema ou palavra-chave..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-navy-100 bg-white text-sm text-navy-800 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('todas')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === 'todas'
              ? 'bg-navy-700 text-white'
              : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-200'
          }`}
        >
          Todas
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              activeCategory === cat
                ? 'bg-navy-700 text-white'
                : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1 space-y-3 max-h-[640px] overflow-y-auto scrollbar-thin pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-8 h-8 text-navy-200 mx-auto mb-2" />
              <p className="text-sm text-navy-400">Nenhum artigo encontrado.</p>
            </div>
          ) : (
            filtered.map((article) => (
              <div
                key={article.id}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === article.id
                    ? 'border-sky-300 bg-sky-50 shadow-sm'
                    : 'border-navy-100 bg-white hover:border-navy-200 hover:shadow-card'
                }`}
              >
                <button onClick={() => setSelected(article)} className="w-full text-left">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[article.category] }}
                    />
                    <span className="text-xs font-medium text-navy-400">{CATEGORY_LABELS[article.category]}</span>
                  </div>
                  <p className="text-sm font-semibold text-navy-800 leading-snug">{article.title}</p>
                  <p className="text-xs text-navy-400 mt-1.5 line-clamp-2">{article.solution}</p>
                </button>
                <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-navy-50">
                  <button
                    onClick={() => {
                      setEditState({ mode: 'edit', article: { ...article } });
                      setSaveError(null);
                      setSaveSuccess(null);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-navy-500 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Editar
                  </button>
                  <button
                    onClick={() => setDeleteTarget(article)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-navy-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="md:col-span-2">
          {selected ? (
            <div className="rounded-2xl bg-white border border-navy-100 shadow-card p-6 animate-fadeIn">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[selected.category] }}
                >
                  {CATEGORY_LABELS[selected.category]}
                </span>
                <span className="text-xs text-navy-400">Artigo #{selected.id}</span>
              </div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">{selected.title}</h2>
              <div className="mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">Problema</h3>
                <p className="text-sm text-navy-700 leading-relaxed">{selected.problem}</p>
              </div>
              <div className="mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">Solução</h3>
                <p className="text-sm text-navy-700 leading-relaxed">{selected.solution}</p>
              </div>
              {selected.steps && selected.steps.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-2 inline-flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5" /> Passo a passo
                  </h3>
                  <ol className="space-y-2">
                    {selected.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-navy-700">
                        <span className="w-5 h-5 shrink-0 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-2">Palavras-chave</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-navy-500 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full rounded-2xl bg-white border border-navy-100 shadow-card p-10 flex flex-col items-center justify-center text-center min-h-[320px]">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center mb-3">
                <BookOpen className="w-7 h-7 text-sky-700" />
              </div>
              <p className="text-navy-700 font-medium">Selecione um artigo</p>
              <p className="text-sm text-navy-400 mt-1 max-w-xs">
                Clique em um dos itens ao lado para visualizar a solução completa e as palavras-chave usadas pelo assistente.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-sky-700">
                <ArrowRight className="w-4 h-4" /> Escolha um artigo à esquerda
              </div>
            </div>
          )}
        </div>
      </div>

      {editState && (
        <ArticleEditor
          editState={editState}
          saving={saving}
          error={saveError}
          onClose={() => setEditState(null)}
          onSave={handleSave}
          updateField={updateField}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          article={deleteTarget}
          saving={saving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function ArticleEditor({
  editState,
  saving,
  error,
  onClose,
  onSave,
  updateField,
}: {
  editState: EditState;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: () => void;
  updateField: <K extends keyof KnowledgeArticle>(key: K, value: KnowledgeArticle[K]) => void;
}) {
  const a = editState.article;
  const stepsText = (a.steps ?? []).join('\n');
  const tagsText = a.tags.join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin rounded-2xl bg-white shadow-xl border border-navy-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
          <h2 className="text-lg font-bold text-navy-900">
            {editState.mode === 'create' ? 'Novo artigo' : 'Editar artigo'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-navy-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">Título</label>
            <input
              value={a.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Título do artigo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-100 bg-slate-50 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">Categoria</label>
            <select
              value={a.category}
              onChange={(e) => updateField('category', e.target.value as Category)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-100 bg-slate-50 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">Problema (palavras-chave para busca)</label>
            <textarea
              value={a.problem}
              onChange={(e) => updateField('problem', e.target.value)}
              placeholder="Descreva o problema que este artigo resolve"
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-100 bg-slate-50 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">Solução</label>
            <textarea
              value={a.solution}
              onChange={(e) => updateField('solution', e.target.value)}
              placeholder="Descreva a solução apresentada ao usuário"
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-100 bg-slate-50 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">Passos (um por linha)</label>
            <textarea
              value={stepsText}
              onChange={(e) => updateField('steps', e.target.value.split('\n').filter((s) => s.trim()))}
              placeholder={'Passo 1\nPasso 2\nPasso 3'}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-100 bg-slate-50 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">Palavras-chave (separadas por vírgula)</label>
            <input
              value={tagsText}
              onChange={(e) => updateField('tags', e.target.value.split(',').map((t) => t.trim()).filter((t) => t))}
              placeholder="rastreio, pedido, transportadora"
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-100 bg-slate-50 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-navy-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-navy-500 border border-navy-100 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({
  article,
  saving,
  onCancel,
  onConfirm,
}: {
  article: KnowledgeArticle;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-navy-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-900">Excluir artigo</h2>
            <p className="text-sm text-navy-400">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        <p className="text-sm text-navy-700 mb-5">
          Tem certeza que deseja excluir o artigo <strong>"{article.title}"</strong>?
          Ele será removido permanentemente da base de conhecimento.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-medium text-navy-500 border border-navy-100 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {saving ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
