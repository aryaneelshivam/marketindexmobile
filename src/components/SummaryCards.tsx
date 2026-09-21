import { StockSummary } from '../types';
import { Activity, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface SummaryCardsProps {
  summary: StockSummary | null;
  loading: boolean;
}

export function SummaryCards({ summary, loading }: SummaryCardsProps) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'TOTAL EQUITIES',
      value: summary.total_stocks,
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      title: 'BULLISH TRENDS',
      value: summary.bullish_count,
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    {
      title: 'BEARISH TRENDS',
      value: summary.bearish_count,
      icon: TrendingDown,
      color: 'text-rose-500'
    },
    {
      title: 'LAST UPDATED',
      value: new Date(summary.last_updated * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: Clock,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {cards.map((card, i) => (
        <div key={i} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm p-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mb-0.5 tracking-wider">{card.title}</p>
            <h3 className="text-sm font-display font-bold text-zinc-900 dark:text-zinc-100 leading-none">{card.value}</h3>
          </div>
          <card.icon className={`w-4 h-4 ${card.color}`} />
        </div>
      ))}
    </div>
  );
}
