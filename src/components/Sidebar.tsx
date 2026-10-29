import { Bot, LayoutDashboard, MessageSquareText, BookOpen, X, Sparkles } from 'lucide-react';
import type { View } from '@/lib/types';

interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NAV: { id: View; label: string; icon: typeof LayoutDashboard; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Indicadores e gráficos' },
  { id: 'atendimentos', label: 'Atendimentos', icon: MessageSquareText, description: 'Chat e histórico' },
  { id: 'base', label: 'Base de conhecimento', icon: BookOpen, description: 'Artigos de suporte' },
];

export function Sidebar({ view, setView, mobileOpen, setMobileOpen }: SidebarProps) {
  const handleSelect = (v: View) => {
    setView(v);
    setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-navy-900 text-white flex flex-col transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">ResolveAI</h1>
              <p className="text-xs text-navy-200">Atendimento inteligente</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group ${
                  active
                    ? 'bg-sky-500/15 text-white border border-sky-400/30'
                    : 'text-navy-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    active ? 'bg-sky-500 text-white' : 'bg-white/5 text-navy-100 group-hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{item.label}</p>
                  <p className="text-xs text-navy-200 mt-0.5 truncate">{item.description}</p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-sky-300" />
              <p className="text-sm font-semibold text-white">Versão de demonstração</p>
            </div>
            <p className="text-xs text-navy-100 leading-relaxed">
              Respostas baseadas em uma central de conhecimento local. Pronta para integração com uma API de IA.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
