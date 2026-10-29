import { useState } from 'react';
import { Search, BookOpen, ListChecks, FileText, ArrowRight } from 'lucide-react';
import type { Category, KnowledgeArticle } from '@/lib/types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/types';
const CATEGORIES: Category[] = ['entrega', 'pagamento', 'cancelamento', 'reembolso', 'conta', 'tecnico', 'seguranca'];

interface KnowledgeViewProps {
  articles: KnowledgeArticle[];
}

export function KnowledgeView({ articles }: KnowledgeViewProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'todas'>('todas');
  const [selected, setSelected] = useState<KnowledgeArticle | null>(null);

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

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Base de conhecimento</h1>
        <p className="text-navy-400 mt-1">
          Artigos consultados pelo assistente para responder aos atendimentos.
        </p>
      </div>

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
              <button
                key={article.id}
                onClick={() => setSelected(article)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === article.id
                    ? 'border-sky-300 bg-sky-50 shadow-sm'
                    : 'border-navy-100 bg-white hover:border-navy-200 hover:shadow-card'
                }`}
              >
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
    </div>
  );
}
