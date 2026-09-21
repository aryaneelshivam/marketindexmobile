import React, { useState } from 'react';
import { StockData } from '../types';
import { formatINR, formatNumber, cleanSymbol, getTradingViewUrl } from '../utils';
import { Badge } from './Badge';
import { ScoreGauge } from './ScoreGauge';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ExternalLink,
  LayoutList,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  BarChart2,
  SlidersHorizontal
} from 'lucide-react';

const stripEmojis = (str: string) => str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u{FE0F}/gu, '').trim();

const getSectorColor = (sector: string) => {
  const colors = [
    'text-blue-600 dark:text-blue-400', 
    'text-violet-600 dark:text-violet-400', 
    'text-amber-600 dark:text-amber-400', 
    'text-cyan-600 dark:text-cyan-400', 
    'text-fuchsia-600 dark:text-fuchsia-400', 
    'text-orange-600 dark:text-orange-400', 
    'text-teal-600 dark:text-teal-400'
  ];
  let hash = 0;
  for (let i = 0; i < sector.length; i++) {
    hash = sector.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getSignalStyles = (signal: string) => {
  const s = signal.toLowerCase();
  if (s.includes('bull')) return { color: 'text-emerald-600 dark:text-emerald-400', Icon: TrendingUp };
  if (s.includes('bear')) return { color: 'text-rose-600 dark:text-rose-400', Icon: TrendingDown };
  return { color: 'text-[#86868b]', Icon: Minus };
};

interface StockTableProps {
  stocks: StockData[];
  loading: boolean;
  onRowClick: (symbol: string) => void;
}

export function StockTable({ stocks, loading, onRowClick }: StockTableProps) {
  // Automatically choose Cards view on mobile (< 768px), Table view on tablet/desktop
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'cards';
    }
    return 'table';
  });

  const [expandedStock, setExpandedStock] = useState<string | null>(null);

  const toggleExpand = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStock(prev => (prev === symbol ? null : symbol));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1d1d1f] rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden apple-card-shadow p-4 space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
          <div className="h-5 w-28 bg-black/[0.06] dark:bg-white/[0.08] rounded-full animate-pulse" />
          <div className="h-6 w-32 bg-black/[0.06] dark:bg-white/[0.08] rounded-full animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-[#f5f5f7] dark:bg-[#272729] rounded-[14px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1d1d1f] rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] p-12 text-center apple-card-shadow">
        <p className="text-sm font-normal text-[#86868b]">No stocks found matching the criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* View Switcher Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
            {stocks.length} {stocks.length === 1 ? 'Equity' : 'Equities'}
          </span>
          {viewMode === 'table' && (
            <span className="text-[10px] text-[#86868b] sm:hidden flex items-center gap-1 font-normal">
              &bull; Swipe horizontally for all indicators &rarr;
            </span>
          )}
        </div>

        {/* Apple Segmented Pill Switcher */}
        <div className="inline-flex items-center p-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.04] dark:border-white/[0.06]">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm'
                : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
            title="Card View (Mobile Optimized)"
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm'
                : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
            title="Table View (Comprehensive Spreadsheet)"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* ===================== VIEW 1: MOBILE CARDS VIEW ===================== */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stocks.map((stock) => {
            const isPositive = stock.change >= 0;
            const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
            const isExpanded = expandedStock === stock.symbol;

            const trendInfo = getSignalStyles(stripEmojis(stock.trend_verdict));
            const TrendIcon = trendInfo.Icon;

            return (
              <div
                key={stock.symbol}
                onClick={() => onRowClick(stock.symbol)}
                className="bg-white dark:bg-[#1d1d1f] rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] p-4 apple-card-shadow transition-all hover:border-black/[0.12] dark:hover:border-white/[0.16] cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
              >
                {/* Card Top: Symbol, Sector, Price & % Change */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold font-display tracking-tight text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors">
                          {cleanSymbol(stock.symbol)}
                        </span>
                        <a
                          href={getTradingViewUrl(stock.symbol, stock.exchange)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`Open ${cleanSymbol(stock.symbol)} on TradingView`}
                          className="p-1 rounded-full text-[#86868b] hover:text-[#0066cc] dark:hover:text-[#2997ff] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className={`text-[10px] font-medium ${getSectorColor(stock.sector)} truncate max-w-[140px] px-1.5 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.05]`}>
                          {stock.sector}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#86868b] truncate mt-0.5">
                        {stock.name}
                      </p>
                    </div>

                    {/* Price & Change Badge */}
                    <div className="text-right shrink-0">
                      <div className="font-semibold text-sm font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {formatINR(stock.cmp)}
                      </div>
                      <div className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 ${
                        isPositive 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        <ChangeIcon className="w-3 h-3 mr-0.5" />
                        {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.pct_change).toFixed(2)}%)
                      </div>
                    </div>
                  </div>

                  {/* Primary Metrics Row (Score, Trend, RSI, Volume) - Unboxed clean layout */}
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08]">
                    {/* Score */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#86868b] font-medium block">Score</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{stock.technical_score}</span>
                        <ScoreGauge score={stock.technical_score} />
                      </div>
                      <span className="text-[10px] text-[#86868b] block truncate mt-0.5">
                        {stripEmojis(stock.technical_grade)}
                      </span>
                    </div>

                    {/* Trend */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#86868b] font-medium block">Trend</span>
                      <div className={`flex items-center gap-0.5 text-[11px] font-semibold mt-0.5 ${trendInfo.color}`}>
                        <TrendIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{stripEmojis(stock.trend_verdict)}</span>
                      </div>
                      <span className="text-[10px] text-[#86868b] block truncate mt-0.5">{stripEmojis(stock.adx_label)}</span>
                    </div>

                    {/* RSI */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#86868b] font-medium block">RSI (14)</span>
                      <span className={`text-xs font-mono font-semibold block mt-0.5 ${
                        stock.rsi >= 70 ? 'text-rose-600 dark:text-rose-400' : stock.rsi <= 30 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#1d1d1f] dark:text-[#f5f5f7]'
                      }`}>
                        {stock.rsi.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-[#86868b] block truncate mt-0.5">{stripEmojis(stock.rsi_status)}</span>
                    </div>

                    {/* Volume */}
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-[#86868b] font-medium block">Volume</span>
                      <span className={`text-xs font-semibold block mt-0.5 ${
                        stock.vol_ratio > 1.2 ? 'text-[#0066cc] dark:text-[#2997ff]' : 'text-[#1d1d1f] dark:text-[#f5f5f7]'
                      }`}>
                        {stock.vol_ratio.toFixed(2)}x
                      </span>
                      <span className="text-[10px] text-[#86868b] block truncate mt-0.5">{formatNumber(stock.volume)}</span>
                    </div>
                  </div>

                  {/* Expandable Technical Details Drawer */}
                  {isExpanded && (
                    <div 
                      className="mt-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                        {/* MACD */}
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#86868b] font-medium block">MACD Indicator</span>
                          <span className={`font-semibold flex items-center gap-1 mt-0.5 ${getSignalStyles(stripEmojis(stock.macd_status)).color}`}>
                            {stripEmojis(stock.macd_status)}
                          </span>
                          <p className="text-[10px] text-[#86868b] font-mono mt-0.5">
                            Hist: {stock.macd_hist.toFixed(2)} | L: {stock.macd.toFixed(2)}
                          </p>
                        </div>

                        {/* Support & Resistance */}
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#86868b] font-medium block">Key S/R & Pivot</span>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">S: {stock.nearest_support}</span>
                            <span className="text-rose-600 dark:text-rose-400 font-medium">R: {stock.nearest_resistance}</span>
                          </div>
                          <p className="text-[10px] text-[#86868b] font-mono mt-0.5">Pivot: {stock.pivot.toFixed(1)}</p>
                        </div>

                        {/* Moving Averages */}
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#86868b] font-medium block">Moving Averages</span>
                          <p className="text-[10px] text-[#86868b] font-mono mt-0.5">
                            SMA 20: {stock.sma20.toFixed(1)} | 50: {stock.sma50.toFixed(1)}
                          </p>
                          <p className="text-[10px] text-[#86868b] font-mono">
                            EMA 20: {stock.ema20.toFixed(1)} | 50: {stock.ema50.toFixed(1)}
                          </p>
                        </div>

                        {/* ADX & Volatility */}
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#86868b] font-medium block">Trend & Volatility</span>
                          <p className="text-[10px] text-[#86868b] font-mono mt-0.5">
                            ADX: {stock.adx.toFixed(1)} (+DI {stock.plus_di.toFixed(1)})
                          </p>
                          <p className="text-[10px] text-[#86868b] font-mono">
                            ATR: {stock.atr.toFixed(2)} ({stock.atr_pct.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-black/[0.04] dark:border-white/[0.06]">
                  <button
                    onClick={(e) => toggleExpand(stock.symbol, e)}
                    className="flex items-center gap-1 text-[11px] font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors py-1"
                  >
                    <span>{isExpanded ? 'Less Details' : 'Full Technicals'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0066cc] dark:text-[#2997ff] group-hover:underline">
                    <span>Fundamentals</span>
                    <BarChart2 className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================== VIEW 2: COMPREHENSIVE TABLE VIEW ===================== */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-[#1d1d1f] rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] apple-card-shadow relative w-full overflow-hidden flex flex-col transition-colors">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-[11px] font-sans text-left whitespace-nowrap min-w-max border-collapse">
              <thead className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold bg-[#fafafc] dark:bg-[#252527] sticky top-0 z-10 border-b border-black/[0.06] dark:border-white/[0.08]">
                <tr>
                  <th className="px-3 py-2.5 font-medium sticky left-0 z-20 bg-[#fafafc] dark:bg-[#252527] border-r border-black/[0.06] dark:border-white/[0.08]">Company</th>
                  <th className="px-3 py-2.5 font-medium text-right border-r border-black/[0.06] dark:border-white/[0.08]">Price (INR)</th>
                  
                  <th className="px-3 py-2.5 font-medium">Tech Score</th>
                  <th className="px-3 py-2.5 font-medium">Trend Verdict</th>
                  <th className="px-3 py-2.5 font-medium text-right border-r border-black/[0.06] dark:border-white/[0.08]">RSI (14)</th>

                  <th className="px-3 py-2.5 font-medium">MACD</th>
                  <th className="px-3 py-2.5 font-medium">ADX / DI</th>
                  <th className="px-3 py-2.5 font-medium text-right">ATR</th>
                  <th className="px-3 py-2.5 font-medium text-right border-r border-black/[0.06] dark:border-white/[0.08]">Volume Dynamics</th>

                  <th className="px-3 py-2.5 font-medium text-right">SMA 20/50/200</th>
                  <th className="px-3 py-2.5 font-medium text-right border-r border-black/[0.06] dark:border-white/[0.08]">EMA 20/50</th>

                  <th className="px-3 py-2.5 font-medium text-right">Nearest S/R</th>
                  <th className="px-3 py-2.5 font-medium text-right">52W High/Low</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {stocks.map((stock) => {
                  const isPositive = stock.change >= 0;
                  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
                  
                  return (
                    <tr 
                      key={stock.symbol} 
                      className="hover:bg-[#f5f5f7] dark:hover:bg-[#272729]/70 transition-colors cursor-pointer group"
                      onClick={() => onRowClick(stock.symbol)}
                    >
                      {/* Sticky Company Column */}
                      <td className="px-3 py-2 sticky left-0 z-10 bg-white dark:bg-[#1d1d1f] group-hover:bg-[#f5f5f7] dark:group-hover:bg-[#272729]/70 border-r border-black/[0.06] dark:border-white/[0.08] transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold font-display tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors">
                            {cleanSymbol(stock.symbol)}
                          </span>
                          <a
                            href={getTradingViewUrl(stock.symbol, stock.exchange)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`Open ${cleanSymbol(stock.symbol)} on TradingView`}
                            className="p-0.5 rounded-full text-[#86868b] hover:text-[#0066cc] dark:hover:text-[#2997ff] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors opacity-60 group-hover:opacity-100"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="text-[11px] font-normal text-[#86868b] truncate max-w-[180px]">{stock.name}</div>
                        <div className={`text-[10px] font-normal ${getSectorColor(stock.sector)} truncate max-w-[180px]`}>{stock.sector}</div>
                      </td>
                      
                      <td className="px-3 py-2 text-right border-r border-black/[0.04] dark:border-white/[0.06]">
                        <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] text-xs font-mono">{formatINR(stock.cmp)}</div>
                        <div className={`flex items-center justify-end text-[11px] font-medium mt-0.5 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          <ChangeIcon className="w-3 h-3 mr-0.5" />
                          {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.pct_change).toFixed(2)}%)
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] text-xs">{stock.technical_score}</span>
                            <ScoreGauge score={stock.technical_score} />
                          </div>
                          <Badge variant={stock.grade_badge}>{stripEmojis(stock.technical_grade)}</Badge>
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-0.5 text-[11px]">
                          <span className={`font-medium flex items-center gap-1 ${getSignalStyles(stripEmojis(stock.trend_verdict)).color}`}>
                            {(() => {
                              const { Icon } = getSignalStyles(stripEmojis(stock.trend_verdict));
                              return <Icon className="w-3 h-3" />;
                            })()}
                            {stripEmojis(stock.trend_verdict)}
                          </span>
                          <span className="text-[10px] text-[#86868b]">{stripEmojis(stock.adx_label)}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2 text-right font-medium border-r border-black/[0.04] dark:border-white/[0.06]">
                        <div className="flex flex-col items-end gap-0.5 text-[11px]">
                          <span className={`font-mono font-medium ${stock.rsi >= 70 ? 'text-rose-600 dark:text-rose-400' : stock.rsi <= 30 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#1d1d1f] dark:text-[#f5f5f7]'}`}>
                            {stock.rsi.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-[#86868b]">{stripEmojis(stock.rsi_status)}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-0.5 text-[11px] text-[#1d1d1f] dark:text-zinc-300">
                          <span className={`font-medium text-xs flex items-center gap-1 ${getSignalStyles(stripEmojis(stock.macd_status)).color}`}>
                            {(() => {
                              const { Icon } = getSignalStyles(stripEmojis(stock.macd_status));
                              return <Icon className="w-3 h-3" />;
                            })()}
                            {stripEmojis(stock.macd_status)}
                          </span>
                          <span className="text-[10px] text-[#86868b] font-mono">Hist: {stock.macd_hist.toFixed(2)} | L: {stock.macd.toFixed(2)}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-0.5 text-[11px] text-[#1d1d1f] dark:text-zinc-300">
                          <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] text-xs">ADX: {stock.adx.toFixed(1)}</span>
                          <span className="text-[10px] text-[#86868b] font-mono">+DI {stock.plus_di.toFixed(1)} | -DI {stock.minus_di.toFixed(1)}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2 text-right">
                        <div className="flex flex-col gap-0.5 text-[11px] items-end">
                          <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7] text-xs">{stock.atr_pct.toFixed(2)}%</span>
                          <span className="text-[10px] text-[#86868b]">ATR: {stock.atr.toFixed(2)}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2 text-right border-r border-black/[0.04] dark:border-white/[0.06]">
                        <div className="flex flex-col gap-0.5 text-[11px] items-end">
                          <span className={`font-medium ${stock.vol_ratio > 1.2 ? 'text-[#0066cc] dark:text-[#2997ff]' : 'text-[#1d1d1f] dark:text-[#f5f5f7]'}`}>
                            {stock.vol_ratio.toFixed(2)}x Ratio
                          </span>
                          <span className="text-[10px] text-[#86868b]">{formatNumber(stock.volume)} (Avg: {formatNumber(stock.volume_20d_avg)})</span>
                          <span className="text-[10px] text-[#86868b]">{stock.obv_trend}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2 text-right">
                        <div className="flex flex-col gap-0.5 text-[10px] text-[#86868b] font-mono items-end">
                          <span><span className="text-[#86868b]/70">20:</span> {stock.sma20.toFixed(1)}</span>
                          <span><span className="text-[#86868b]/70">50:</span> {stock.sma50.toFixed(1)}</span>
                          <span><span className="text-[#86868b]/70">200:</span> {stock.sma200.toFixed(1)}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2 text-right border-r border-black/[0.04] dark:border-white/[0.06]">
                        <div className="flex flex-col gap-0.5 text-[10px] text-[#86868b] font-mono items-end">
                          <span><span className="text-[#86868b]/70">20:</span> {stock.ema20.toFixed(1)}</span>
                          <span><span className="text-[#86868b]/70">50:</span> {stock.ema50.toFixed(1)}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2 text-right">
                        <div className="flex flex-col gap-0.5 text-[11px] items-end">
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">S: {stock.nearest_support}</span>
                          <span className="font-medium text-rose-600 dark:text-rose-400">R: {stock.nearest_resistance}</span>
                          <span className="text-[10px] text-[#86868b]">P: {stock.pivot.toFixed(1)}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2 text-right">
                        <div className="flex flex-col gap-0.5 text-[11px] items-end">
                          <span><span className="text-emerald-600 dark:text-emerald-400 font-medium">{stock.pct_from_52w_high.toFixed(1)}%</span> High</span>
                          <span><span className="text-rose-600 dark:text-rose-400 font-medium">+{stock.pct_from_52w_low.toFixed(1)}%</span> Low</span>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
