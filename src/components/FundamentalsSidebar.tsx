import { useEffect, useState, type ReactNode } from 'react';
import { getFundamentals, getStockDeepDive } from '../api';
import { FundamentalsData } from '../types';
const stripEmojis = (str: string) => str ? str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u{FE0F}/gu, '').trim() : '';
import { X, ExternalLink, Activity, Building2, Landmark, TrendingUp, Wallet, Users, Target, LineChart as LineChartIcon } from 'lucide-react';
import { formatINR, cleanSymbol, getTradingViewUrl } from '../utils';
import { ComposedChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface FundamentalsSidebarProps {
  symbol: string | null;
  timeframe: string;
  period: string;
  onClose: () => void;
}

export function FundamentalsSidebar({ symbol, timeframe, period, onClose }: FundamentalsSidebarProps) {
  const [data, setData] = useState<FundamentalsData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setData(null);
      setChartData([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    Promise.all([
      getFundamentals(symbol),
      getStockDeepDive(symbol, timeframe, period)
    ]).then(([fundData, deepData]) => {
      setData(fundData);
      if (deepData?.candles && deepData?.chart_data) {
        const merged = deepData.candles.map((c: any, i: number) => ({
          ...c,
          dateStr: new Date(c.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          ema20: deepData.chart_data.ema20[i],
          sma50: deepData.chart_data.sma50[i],
          rsi: deepData.chart_data.rsi[i],
          openClose: [c.open, c.close],
        }));
        setChartData(merged);
      }
    })
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
  }, [symbol, timeframe, period]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!symbol) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-3xl bg-[#fbfbfd]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl z-50 flex flex-col border-l border-black/[0.08] dark:border-white/[0.08] shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0">
        <header className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-white/70 dark:bg-[#1d1d1f]/70 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold font-display tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
                <span>{cleanSymbol(symbol)}</span>
                <a
                  href={getTradingViewUrl(symbol)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${cleanSymbol(symbol)} on TradingView`}
                  className="p-1 rounded-full text-[#86868b] hover:text-[#0066cc] dark:hover:text-[#2997ff] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </h2>
              {data && (
                <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider bg-black/[0.04] dark:bg-white/[0.08] px-2 py-0.5 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
                  {data.currency}
                </span>
              )}
            </div>
            <p className="text-xs text-[#86868b] mt-0.5 truncate max-w-[320px]">
              {loading ? 'Loading fundamentals...' : data?.name || 'Company Details'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 space-y-3 text-[#86868b]">
              <Activity className="w-7 h-7 animate-spin text-[#0066cc] dark:text-[#2997ff]" />
              <p className="text-xs font-medium">Fetching institutional data for {cleanSymbol(symbol)}...</p>
            </div>
          )}

          {error && (
            <div className="bg-rose-500/10 text-rose-700 dark:text-rose-400 p-4 rounded-[14px] border border-rose-500/20 text-xs">
              Failed to load fundamentals: {error}
            </div>
          )}

          {data && !loading && (
            <>
              {chartData.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <LineChartIcon className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">Technical Chart</h3>
                  </div>
                  
                  {/* Price & MA Chart */}
                  <div className="bg-white dark:bg-[#252527] border border-black/[0.06] dark:border-white/[0.08] rounded-[16px] p-3.5 apple-card-shadow h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
                        <XAxis dataKey="dateStr" tick={{ fontSize: 10, fill: '#86868b' }} minTickGap={30} />
                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 10, fill: '#86868b' }} orientation="right" tickFormatter={(val) => val.toFixed(0)} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        
                        <Line type="monotone" dataKey="high" stroke="none" dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="low" stroke="none" dot={false} isAnimationActive={false} />
                        
                        <Bar dataKey="openClose" shape={<CandlestickShape />} isAnimationActive={false} />
                        
                        <Line type="monotone" dataKey="ema20" stroke="#0066cc" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="sma50" stroke="#f97316" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  {/* RSI Chart */}
                  <div className="bg-white dark:bg-[#252527] border border-black/[0.06] dark:border-white/[0.08] rounded-[16px] p-3.5 apple-card-shadow h-[140px]">
                    <h4 className="text-[11px] font-medium text-[#86868b] mb-2">Relative Strength Index (14)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
                        <XAxis dataKey="dateStr" hide />
                        <YAxis domain={[0, 100]} ticks={[30, 50, 70]} tick={{ fontSize: 10, fill: '#86868b' }} orientation="right" />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} 
                          labelStyle={{ color: '#1d1d1f', fontWeight: 'bold', marginBottom: '4px' }}
                          itemStyle={{ color: '#8b5cf6', fontWeight: '500' }} 
                        />
                        <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="3 3" opacity={0.6} />
                        <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" opacity={0.6} />
                        <Line type="monotone" dataKey="rsi" name="RSI" stroke="#8b5cf6" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              )}

              {/* Profile */}
              <section className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">Company Profile</h3>
                </div>
                <div className="bg-white dark:bg-[#252527] rounded-[16px] p-4 border border-black/[0.06] dark:border-white/[0.08] apple-card-shadow text-xs">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-[#86868b] mb-0.5">Sector / Industry</p>
                      <p className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{data.company_profile?.sector || 'N/A'} &bull; {data.company_profile?.industry || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[#86868b] mb-0.5">Employees</p>
                      <p className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{data.company_profile?.employees?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
                  <p className="text-[#86868b] leading-relaxed text-[11px]">
                    {data.company_profile?.summary || 'No company summary available.'}
                  </p>
                  {data.company_profile?.website && (
                    <a href={data.company_profile.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#0066cc] dark:text-[#2997ff] hover:underline mt-3 font-medium transition-colors">
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </section>

              {/* Grid 1: Valuation & Profitability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">Valuation</h3>
                  </div>
                  <div className="bg-white dark:bg-[#252527] rounded-[16px] p-3.5 border border-black/[0.06] dark:border-white/[0.08] apple-card-shadow space-y-1 text-xs">
                    <MetricRow label="Market Cap" value={data.valuation?.market_cap_fmt} />
                    <MetricRow label="Enterprise Value" value={data.valuation?.enterprise_value_fmt} />
                    <MetricRow label="Trailing P/E" value={data.valuation?.trailing_pe} />
                    <MetricRow label="Forward P/E" value={data.valuation?.forward_pe} />
                    <MetricRow label="PEG Ratio" value={data.valuation?.peg_ratio} />
                    <MetricRow label="P/B Ratio" value={data.valuation?.price_to_book} />
                    <MetricRow label="EV / EBITDA" value={data.valuation?.ev_to_ebitda} />
                  </div>
                </section>

                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">Profitability</h3>
                  </div>
                  <div className="bg-white dark:bg-[#252527] rounded-[16px] p-3.5 border border-black/[0.06] dark:border-white/[0.08] apple-card-shadow space-y-1 text-xs">
                    <MetricRow label="Return on Equity" value={data.profitability?.return_on_equity_fmt} />
                    <MetricRow label="Return on Assets" value={data.profitability?.return_on_assets_fmt} />
                    <MetricRow label="Gross Margin" value={data.profitability?.gross_margins_fmt} />
                    <MetricRow label="Operating Margin" value={data.profitability?.operating_margins_fmt} />
                    <MetricRow label="Net Profit Margin" value={data.profitability?.profit_margins_fmt} />
                    <MetricRow label="EBITDA" value={data.profitability?.ebitda_fmt} />
                  </div>
                </section>
              </div>

              {/* Grid 2: Balance Sheet & Cashflow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">Balance Sheet</h3>
                  </div>
                  <div className="bg-white dark:bg-[#252527] rounded-[16px] p-3.5 border border-black/[0.06] dark:border-white/[0.08] apple-card-shadow space-y-1 text-xs">
                    <MetricRow label="Total Cash" value={data.balance_sheet?.total_cash_fmt} />
                    <MetricRow label="Total Debt" value={data.balance_sheet?.total_debt_fmt} />
                    <MetricRow label="Net Debt" value={data.balance_sheet?.net_debt_fmt} highlight={data.balance_sheet?.net_debt < 0 ? 'green' : 'red'} />
                    <MetricRow label="Debt to Equity" value={data.balance_sheet?.debt_to_equity} />
                    <MetricRow label="Current Ratio" value={data.balance_sheet?.current_ratio} />
                    <MetricRow label="Quick Ratio" value={data.balance_sheet?.quick_ratio} />
                  </div>
                </section>

                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">Growth & Cash Flow</h3>
                  </div>
                  <div className="bg-white dark:bg-[#252527] rounded-[16px] p-3.5 border border-black/[0.06] dark:border-white/[0.08] apple-card-shadow space-y-1 text-xs">
                    <MetricRow label="Revenue Growth (YoY)" value={data.growth_and_cashflow?.revenue_growth_fmt} highlight={data.growth_and_cashflow?.revenue_growth_yoy > 0 ? 'green' : 'red'} />
                    <MetricRow label="Earnings Growth (YoY)" value={data.growth_and_cashflow?.earnings_growth_fmt} highlight={data.growth_and_cashflow?.earnings_growth_yoy > 0 ? 'green' : 'red'} />
                    <MetricRow label="Operating Cash Flow" value={data.growth_and_cashflow?.operating_cash_flow_fmt} />
                    <MetricRow label="Free Cash Flow" value={data.growth_and_cashflow?.free_cash_flow_fmt} />
                    <MetricRow label="Trailing EPS" value={data.growth_and_cashflow?.trailing_eps !== undefined ? formatINR(data.growth_and_cashflow.trailing_eps) : '-'} />
                    <MetricRow label="Forward EPS" value={data.growth_and_cashflow?.forward_eps !== undefined ? formatINR(data.growth_and_cashflow.forward_eps) : '-'} />
                  </div>
                </section>
              </div>

              {/* Grid 3: Ownership & Analyst Targets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-pink-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">Shareholding & Yield</h3>
                  </div>
                  <div className="bg-white dark:bg-[#252527] rounded-[16px] p-3.5 border border-black/[0.06] dark:border-white/[0.08] apple-card-shadow space-y-1 text-xs">
                    <MetricRow label="Promoter Holding" value={data.shareholding_and_beta?.promoter_holding_fmt} />
                    <MetricRow label="Institutional Holding" value={data.shareholding_and_beta?.institutional_holding_fmt} />
                    <MetricRow label="Stock Beta" value={data.shareholding_and_beta?.beta} />
                    <MetricRow label="Dividend Yield" value={data.dividends?.dividend_yield_fmt} />
                    <MetricRow label="Payout Ratio" value={data.dividends?.payout_ratio_fmt} />
                    <MetricRow label="Dividend Rate" value={data.dividends?.dividend_rate !== undefined ? formatINR(data.dividends.dividend_rate) : '-'} />
                  </div>
                </section>

                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-rose-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">Analyst Consensus</h3>
                  </div>
                  <div className="bg-white dark:bg-[#252527] border border-black/[0.06] dark:border-white/[0.08] rounded-[16px] p-4 text-xs text-center apple-card-shadow">
                    <p className="text-[#86868b] mb-1">Recommendation</p>
                    <p className={`text-xl font-bold tracking-tight ${data.analyst_targets?.recommendation === 'BUY' || data.analyst_targets?.recommendation === 'STRONG BUY' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#1d1d1f] dark:text-[#f5f5f7]'}`}>
                      {data.analyst_targets?.recommendation ? stripEmojis(data.analyst_targets.recommendation) : 'N/A'}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-left border-t border-black/[0.06] dark:border-white/[0.08] pt-3">
                      <div>
                        <p className="text-[#86868b] text-[11px]">Target Mean</p>
                        <p className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] font-mono">{data.analyst_targets?.target_mean !== undefined ? formatINR(data.analyst_targets.target_mean) : '-'}</p>
                      </div>
                      <div>
                        <p className="text-[#86868b] text-[11px]">Upside</p>
                        <p className={`font-semibold font-mono ${(data.analyst_targets?.potential_upside_pct || 0) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {(data.analyst_targets?.potential_upside_pct || 0) > 0 ? '+' : ''}{data.analyst_targets?.potential_upside_pct?.toFixed(2) || '0.00'}%
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
}

function MetricRow({ label, value, highlight }: { label: string, value: ReactNode, highlight?: 'green' | 'red' }) {
  let valueClass = "font-medium text-[#1d1d1f] dark:text-[#f5f5f7] text-right font-mono";
  if (highlight === 'green') valueClass = "font-medium text-emerald-600 dark:text-emerald-400 text-right font-mono";
  if (highlight === 'red') valueClass = "font-medium text-rose-600 dark:text-rose-400 text-right font-mono";

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-black/[0.04] dark:border-white/[0.05] last:border-0">
      <span className="text-[#86868b]">{label}</span>
      <span className={valueClass}>{value !== null && value !== undefined && value !== '' ? value : '-'}</span>
    </div>
  );
}

const CandlestickShape = (props: any) => {
  const { x, y, width, height, payload, yAxis } = props;
  const { open, close, high, low } = payload;
  const isGrowing = close >= open;
  const color = isGrowing ? '#10b981' : '#f43f5e';
  
  if (!yAxis || !yAxis.scale) return null;
  
  const yHigh = yAxis.scale(high);
  const yLow = yAxis.scale(low);
  const yOpen = yAxis.scale(open);
  const yClose = yAxis.scale(close);
  
  const xCenter = x + width / 2;
  const bodyTop = Math.min(yOpen, yClose);
  const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1);
  
  return (
    <g>
      <line x1={xCenter} y1={yHigh} x2={xCenter} y2={yLow} stroke={color} strokeWidth={1.5} />
      <rect x={x} y={bodyTop} width={width} height={bodyHeight} fill={color} stroke={color} rx={1} />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.1] p-3 rounded-[12px] text-xs font-mono min-w-[140px] shadow-lg">
        <p className="font-semibold font-display text-[#1d1d1f] dark:text-[#f5f5f7] mb-2 border-b border-black/[0.06] dark:border-white/[0.08] pb-1">{data.dateStr}</p>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between gap-4"><span className="text-[#86868b]">O:</span><span className="text-[#1d1d1f] dark:text-[#f5f5f7]">{data.open.toFixed(2)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#86868b]">H:</span><span className="text-emerald-600 dark:text-emerald-400">{data.high.toFixed(2)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#86868b]">L:</span><span className="text-rose-600 dark:text-rose-400">{data.low.toFixed(2)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#86868b]">C:</span><span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{data.close.toFixed(2)}</span></div>
          
          <div className="mt-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col gap-1">
            <div className="flex justify-between gap-4"><span className="text-[#0066cc] dark:text-[#2997ff]">EMA(20):</span><span>{data.ema20?.toFixed(2)}</span></div>
            <div className="flex justify-between gap-4"><span className="text-orange-500">SMA(50):</span><span>{data.sma50?.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
