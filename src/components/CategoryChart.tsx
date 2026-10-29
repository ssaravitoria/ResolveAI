import { CATEGORY_COLORS, CATEGORY_LABELS, type Category } from '@/lib/types';

interface CategoryChartProps {
  data: Record<string, number>;
}

const CATEGORIES: Category[] = ['entrega', 'pagamento', 'cancelamento', 'reembolso', 'conta', 'tecnico', 'seguranca'];

export function CategoryChart({ data }: CategoryChartProps) {
  const total = CATEGORIES.reduce((sum, c) => sum + (data[c] ?? 0), 0);
  const max = Math.max(1, ...CATEGORIES.map((c) => data[c] ?? 0));

  return (
    <div className="rounded-2xl bg-white border border-navy-100 shadow-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-navy-900">Atendimentos por categoria</h3>
          <p className="text-sm text-navy-400 mt-0.5">Distribuição das solicitações resolvidas</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
          {total} total
        </span>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map((category) => {
          const value = data[category] ?? 0;
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          const widthPct = Math.round((value / max) * 100);
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[category] }}
                  />
                  <span className="text-sm font-medium text-navy-700">{CATEGORY_LABELS[category]}</span>
                </div>
                <span className="text-xs text-navy-400 font-medium">
                  {value} · {pct}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${widthPct}%`, backgroundColor: CATEGORY_COLORS[category] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
