import { StockData } from '../types';
import { formatINR, formatNumber, cleanSymbol, getTradingViewUrl } from '../utils';
import { Badge } from './Badge';
import { Speedometer } from './Speedometer';
import { 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Lock,
  ChevronRight,
  Gauge,
  ExternalLink
} from 'lucide-react';

interface FeaturedStockCardProps {
  stock: StockData | null;
  loading: boolean;
  onSelect: (symbol: string) => void;
  isLocked?: boolean;
  onUnlock?: () => void;
}

const stripEmojis = (str?: string) => 
  str ? str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u{FE0F}/gu, '').trim() : '';

const getSectorColor = (sector: string) => {
  const colors = [
    'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60',
    'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/60',
    'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
    'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60',
    'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
    'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/60',
    'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/60'
  ];
  let hash = 0;
  for (let i = 0; i < sector.length; i++) {
    hash = sector.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export function FeaturedStockCard({ stock, loading, onSelect, isLocked, onUnlock }: FeaturedStockCardProps) {
  if (loading || !stock) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-[#1d1d1f] border border-black/[0.06] dark:border-white/[0.08] rounded-[18px] p-4 sm:p-5 apple-card-shadow animate-pulse">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="h-5 w-36 sm:w-48 bg-black/[0.06] dark:bg-white/[0.08] rounded-full" />
          <div className="h-6 w-20 bg-black/[0.06] dark:bg-white/[0.08] rounded-full" />
        </div>
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4">
          <div className="space-y-3 sm:col-span-1 lg:col-span-4">
            <div className="flex justify-between items-center">
              <div className="h-7 w-28 sm:w-36 bg-black/[0.06] dark:bg-white/[0.08] rounded-[10px]" />
              <div className="h-7 w-24 bg-black/[0.06] dark:bg-white/[0.08] rounded-[10px]" />
            </div>
            <div className="h-4 w-44 bg-black/[0.06] dark:bg-white/[0.08] rounded-full" />
            <div className="h-4 w-full bg-black/[0.04] dark:bg-white/[0.06] rounded-full mt-2" />
          </div>
          <div className="space-y-3 sm:col-span-1 lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-16 bg-black/[0.06] dark:bg-white/[0.08] rounded-[12px]" />
              <div className="space-y-1.5 flex-1">
                <div className="h-6 w-16 bg-black/[0.06] dark:bg-white/[0.08] rounded-full" />
                <div className="h-4 w-28 bg-black/[0.06] dark:bg-white/[0.08] rounded-full" />
              </div>
            </div>
            <div className="h-6 w-full bg-black/[0.04] dark:bg-white/[0.06] rounded-full" />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-x-4 gap-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-black/[0.04] dark:bg-white/[0.06] rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const breakdown = stock.score_breakdown;

  const handleCardAction = () => {
    if (isLocked && onUnlock) {
      onUnlock();
    } else {
      onSelect(stock.symbol);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-[#1d1d1f] border border-black/[0.06] dark:border-white/[0.08] rounded-[18px] p-3 sm:p-4 md:p-5 apple-card-shadow transition-all group">
      {/* Top Banner Row (Apple Product Header) */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] text-[11px] font-medium tracking-tight shrink-0">
            <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Top Rated Ticker</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#86868b] truncate font-normal">
            <span className="font-semibold text-[#1d1d1f] dark:text-zinc-300">#1</span>
            <span className="opacity-40">•</span>
            <span className="truncate">Technical Score: <strong className="font-semibold text-[#0066cc] dark:text-[#2997ff]">{stock.technical_score}</strong>/100</span>
          </div>
        </div>

        {/* Action Button - Apple Pill CTA */}
        <button
          onClick={handleCardAction}
          className="flex items-center gap-1.5 text-xs font-normal px-4 py-1.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white transition-all active:scale-[0.97] shrink-0"
        >
          {isLocked ? (
            <>
              <Lock className="w-3 h-3" />
              <span>Unlock</span>
            </>
          ) : (
            <>
              <span>Deep Dive</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Main Content Grid: Mobile (1 col) -> Tablet (2 cols) -> Desktop (12 cols) */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4 items-stretch">
        
        {/* Section 1: Ticker Info & Price (Mobile full width / sm:col-span-1 / lg:col-span-4) */}
        <div className="flex flex-col justify-between space-y-3 pb-3 sm:pb-0 border-b sm:border-b-0 sm:border-r border-black/[0.06] dark:border-white/[0.08] sm:pr-3 lg:pr-4 sm:col-span-1 lg:col-span-4 min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 min-w-0">
              {/* Ticker & Badges */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-semibold font-display tracking-apple-tight text-[#1d1d1f] dark:text-white leading-tight">
                    {cleanSymbol(stock.symbol)}
                  </h2>
                  <a
                    href={getTradingViewUrl(stock.symbol, stock.exchange)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title={`Open ${cleanSymbol(stock.symbol)} on TradingView`}
                    className="p-1 rounded-full text-[#86868b] hover:text-[#0066cc] dark:hover:text-[#2997ff] hover:bg-[#f5f5f7] dark:hover:bg-[#272729] transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-zinc-300 border border-black/[0.04] dark:border-white/[0.06] leading-normal">
                    {stock.sector}
                  </span>
                  <span className="text-[10px] text-[#86868b] uppercase tracking-wider font-mono">
                    {stock.exchange || 'NSE'}
                  </span>
                </div>
                {/* Full-width truncated company name */}
                <p className="text-[13px] text-[#86868b] font-normal mt-0.5 truncate w-full" title={stock.name}>
                  {stock.name}
                </p>
              </div>

              {/* Price & 24h Change */}
              <div className="text-right shrink-0">
                <div className="text-xl sm:text-2xl font-semibold font-display text-[#1d1d1f] dark:text-white tracking-tight leading-tight">
                  {formatINR(stock.cmp)}
                </div>
                <div className={`inline-flex items-center justify-end text-xs font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  <ChangeIcon className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                  <span className="whitespace-nowrap">
                    {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.pct_change.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 52W Range Indicator (Unboxed) */}
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-black/[0.04] dark:border-white/[0.06] font-normal">
            <div className="truncate min-w-0">
              <span className="text-[#86868b]">52W Low: </span>
              <span className="font-medium text-[#1d1d1f] dark:text-zinc-300">{formatNumber(stock.low_52w)}</span>
            </div>
            <div className="text-[10px] text-[#86868b] shrink-0 text-center px-1">
              {stock.pct_from_52w_high === 0 
                ? <span className="text-[#0066cc] dark:text-[#2997ff] font-semibold whitespace-nowrap">At 52W High</span> 
                : <span className="whitespace-nowrap">{stock.pct_from_52w_high.toFixed(1)}% from High</span>}
            </div>
            <div className="truncate min-w-0 text-right">
              <span className="text-[#86868b]">52W High: </span>
              <span className="font-medium text-[#1d1d1f] dark:text-zinc-300">{formatNumber(stock.high_52w)}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Composite Score Speedometer & Factor Health (Mobile full width / sm:col-span-1 / lg:col-span-4) */}
        <div className="flex flex-col justify-between space-y-3 pb-3 sm:pb-0 border-b sm:border-b-0 lg:border-r border-black/[0.06] dark:border-white/[0.08] lg:pr-4 sm:col-span-1 lg:col-span-4 min-w-0">
          <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0">
            {/* Speedometer Gauge */}
            <div className="shrink-0 flex flex-col items-center">
              <Speedometer
                value={stock.technical_score}
                min={0}
                max={100}
                size="md"
                zones="score"
              />
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#86868b] font-medium -mt-1">
                <Gauge className="w-2.5 h-2.5 text-[#0066cc]" />
                <span>Score Gauge</span>
              </div>
            </div>

            {/* Numeric Score & Trend */}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-display tracking-apple-tight text-[#1d1d1f] dark:text-white leading-none">
                  {stock.technical_score}
                </span>
                <span className="text-xs font-normal text-[#86868b]">
                  / 100
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <Badge variant={stock.grade_badge} className="text-[10px] px-2 py-0.5 shrink-0">
                  {stripEmojis(stock.technical_grade)}
                </Badge>
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 min-w-0 truncate">
                  <TrendingUp className="w-3 h-3 shrink-0" />
                  <span className="truncate">{stripEmojis(stock.trend_verdict)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Score Breakdown (Unboxed clean layout) */}
          {breakdown && (
            <div className="space-y-1 min-w-0 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
              <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-[#86868b] mb-1">
                <span>Score Breakdown</span>
                <span className="text-[#0066cc] dark:text-[#2997ff] font-normal text-[10px]">Factor Health</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-center">
                {Object.entries(breakdown).map(([key, item]) => {
                  const pct = Math.round((item.score / item.max) * 100);
                  const statusCls = pct >= 80 
                    ? 'text-[#0066cc] dark:text-[#2997ff]' 
                    : pct >= 50 
                      ? 'text-[#1d1d1f] dark:text-zinc-200' 
                      : 'text-amber-600 dark:text-amber-400';
                  return (
                    <div key={key} className="flex flex-col items-center justify-center min-w-0">
                      <span className="text-[9px] font-medium uppercase tracking-wider text-[#86868b] truncate w-full">
                        {key.slice(0, 4)}
                      </span>
                      <span className={`text-[11px] font-semibold leading-tight truncate w-full mt-0.5 ${statusCls}`}>
                        {item.score}/{item.max}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Telemetry Key Signals (RSI, MACD, ADX, Vol Surge) - Unboxed clean layout */}
        <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-x-4 gap-y-3 min-w-0 content-center">
          {/* RSI */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Activity className="w-3.5 h-3.5 text-[#0066cc] shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#86868b] leading-none truncate">RSI (14)</div>
                <div className="text-[11px] font-normal text-[#1d1d1f] dark:text-zinc-300 truncate mt-1 leading-none" title={stripEmojis(stock.rsi_status)}>
                  {stripEmojis(stock.rsi_status)}
                </div>
              </div>
            </div>
            <div className={`text-sm font-semibold shrink-0 text-right font-mono ${stock.rsi >= 70 ? 'text-rose-600 dark:text-rose-400' : stock.rsi <= 30 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#1d1d1f] dark:text-zinc-100'}`}>
              {stock.rsi.toFixed(1)}
            </div>
          </div>

          {/* MACD */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#86868b] leading-none truncate">MACD Hist</div>
                <div className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 truncate mt-1 leading-none" title={stripEmojis(stock.macd_status)}>
                  {stripEmojis(stock.macd_status)}
                </div>
              </div>
            </div>
            <div className={`text-sm font-semibold shrink-0 text-right font-mono ${stock.macd_hist >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {stock.macd_hist > 0 ? '+' : ''}{stock.macd_hist.toFixed(2)}
            </div>
          </div>

          {/* ADX */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <BarChart3 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#86868b] leading-none truncate">ADX Trend</div>
                <div className="text-[11px] font-normal text-[#1d1d1f] dark:text-zinc-300 truncate mt-1 leading-none" title={stripEmojis(stock.adx_label)}>
                  {stripEmojis(stock.adx_label)}
                </div>
              </div>
            </div>
            <div className="text-sm font-semibold text-[#1d1d1f] dark:text-zinc-100 shrink-0 text-right font-mono">
              {stock.adx.toFixed(1)}
            </div>
          </div>

          {/* Volume Surge */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#86868b] leading-none truncate">Vol Ratio</div>
                <div className="text-[11px] font-normal text-[#1d1d1f] dark:text-zinc-300 truncate mt-1 leading-none" title={stripEmojis(stock.vol_verdict)}>
                  {stripEmojis(stock.vol_verdict)}
                </div>
              </div>
            </div>
            <div className={`text-sm font-semibold shrink-0 text-right ${stock.vol_ratio >= 1.2 ? 'text-[#0066cc] dark:text-[#2997ff]' : 'text-[#1d1d1f] dark:text-zinc-100'}`}>
              {stock.vol_ratio.toFixed(2)}x
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
