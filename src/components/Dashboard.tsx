import { useEffect, useState, useMemo } from 'react';
import { getSectors, getStocks } from '../api';
import { Sector, StockData, StockSummary } from '../types';
import { FeaturedStockCard } from './FeaturedStockCard';
import { StockTable } from './StockTable';
import { FundamentalsSidebar } from './FundamentalsSidebar';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineIndicator } from './OfflineIndicator';
import { RefreshCw, Filter, Lock, LogIn, LogOut, Sun, Moon, Clock, Search, X, ChevronDown, ChevronUp, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { cleanSymbol } from '../utils';

const TIMEFRAMES = [
  { id: '15m', label: '15 Min' },
  { id: '1h', label: '1 Hour' },
  { id: '1d', label: 'Daily' },
  { id: '1wk', label: 'Weekly' },
  { id: '1mo', label: 'Monthly' },
];

const PERIODS = [
  { id: '1mo', label: '1 Month' },
  { id: '3mo', label: '3 Months' },
  { id: '6mo', label: '6 Months' },
  { id: '1y', label: '1 Year' },
  { id: '2y', label: '2 Years' },
  { id: '5y', label: '5 Years' },
];

const QUICK_FILTERS = [
  { id: 'bullish', label: 'Bullish Grade (≥65)', match: (s: StockData) => s.technical_score >= 65 },
  { id: 'bearish', label: 'Bearish Grade (<45)', match: (s: StockData) => s.technical_score < 45 },
  { id: 'oversold', label: 'Oversold (RSI <35)', match: (s: StockData) => s.rsi < 35 },
  { id: 'overbought', label: 'Overbought (RSI >65)', match: (s: StockData) => s.rsi > 65 },
  { id: 'vol_surge', label: 'Volume Surge (>1.5x)', match: (s: StockData) => s.vol_ratio >= 1.5 },
  { id: 'above_200_sma', label: 'Above 200 SMA', match: (s: StockData) => s.cmp > s.sma200 },
  { id: 'macd_bullish', label: 'MACD Bullish', match: (s: StockData) => s.macd_hist > 0 && s.macd > s.macd_signal },
  { id: 'near_52w_high', label: 'Near 52W High', match: (s: StockData) => s.pct_from_52w_high >= -5 },
];

export function Dashboard() {
  const { user, signInWithGoogle, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [summary, setSummary] = useState<StockSummary | null>(null);
  
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [selectedPeriod, setSelectedPeriod] = useState('1y');
  const [loading, setLoading] = useState(true);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Sidebar state
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  
  // Mobile Nav Drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    getSectors()
      .then(setSectors)
      .catch((err) => console.error('Failed to load sectors', err));
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getStocks(selectedSector, selectedTimeframe, selectedPeriod);
      setStocks(data.data);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSector, selectedTimeframe, selectedPeriod]);

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredStocks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return stocks.filter(stock => {
      // Search query filter (matches clean symbol or company name or sector)
      if (query) {
        const cleanSym = cleanSymbol(stock.symbol).toLowerCase();
        const rawSym = (stock.symbol || '').toLowerCase();
        const name = (stock.name || '').toLowerCase();
        const sector = (stock.sector || '').toLowerCase();
        const matchesQuery = cleanSym.includes(query) || rawSym.includes(query) || name.includes(query) || sector.includes(query);
        if (!matchesQuery) return false;
      }

      // Quick criteria filters
      return activeFilters.every(filterId => {
        const filterDef = QUICK_FILTERS.find(f => f.id === filterId);
        return filterDef ? filterDef.match(stock) : true;
      });
    });
  }, [stocks, activeFilters, searchQuery]);

  const topStock = useMemo(() => {
    if (!stocks || stocks.length === 0) return null;
    return [...stocks].sort((a, b) => b.technical_score - a.technical_score)[0];
  }, [stocks]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#161617] font-sans text-[#1d1d1f] dark:text-[#f5f5f7] pb-8 transition-colors">
      {/* Apple Persistent Frosted Global Nav Bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#000000]/80 frosted-glass border-b border-black/[0.08] dark:border-white/[0.12] transition-colors">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[15px] font-semibold tracking-tight font-display text-[#1d1d1f] dark:text-white">
              Market Index
            </span>
            
            {/* Subtle Apple-style Compact Last Updated Counter */}
            {summary && (
              <div 
                className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-normal text-[#86868b] pl-3 ml-1 border-l border-black/[0.08] dark:border-white/[0.12]"
                title={`Last data synchronization: ${new Date(summary.last_updated * 1000).toLocaleString()}`}
              >
                <Clock className="w-3 h-3 text-[#86868b]" />
                <span>
                  Updated {new Date(summary.last_updated * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>
          
          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center gap-2 py-1">
            {/* Apple Pill Selectors */}
            <select 
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              disabled={!user}
              className="text-xs bg-white/80 dark:bg-[#1d1d1f]/80 text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.08] dark:border-white/[0.12] rounded-full h-7 px-3 outline-none hover:border-black/[0.2] dark:hover:border-white/[0.25] focus:ring-2 focus:ring-[#0071e3]/30 transition-all font-normal appearance-none pr-6 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2386868b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.35rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.1em 1.1em` }}
            >
              <option value="All">All Sectors</option>
              {sectors.map((s) => (
                <option key={s.sector} value={s.sector}>{s.sector}</option>
              ))}
            </select>

            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              disabled={!user}
              className="text-xs bg-white/80 dark:bg-[#1d1d1f]/80 text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.08] dark:border-white/[0.12] rounded-full h-7 px-3 outline-none hover:border-black/[0.2] dark:hover:border-white/[0.25] focus:ring-2 focus:ring-[#0071e3]/30 transition-all font-normal appearance-none pr-6 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2386868b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.35rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.1em 1.1em` }}
            >
              {TIMEFRAMES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>

            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              disabled={!user}
              className="text-xs bg-white/80 dark:bg-[#1d1d1f]/80 text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.08] dark:border-white/[0.12] rounded-full h-7 px-3 outline-none hover:border-black/[0.2] dark:hover:border-white/[0.25] focus:ring-2 focus:ring-[#0071e3]/30 transition-all font-normal appearance-none pr-6 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2386868b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.35rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.1em 1.1em` }}
            >
              {PERIODS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>

            {user ? (
              <button 
                onClick={logout}
                className="flex items-center gap-1 text-[11px] font-normal text-[#1d1d1f] dark:text-zinc-200 bg-white dark:bg-[#1d1d1f] hover:bg-[#fafafc] dark:hover:bg-[#272729] px-3 h-7 rounded-full transition-all border border-black/[0.08] dark:border-white/[0.12] shrink-0 active:scale-[0.97]"
              >
                <LogOut className="w-3 h-3 text-[#86868b]" />
                Sign Out
              </button>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 text-xs font-normal bg-[#0066cc] hover:bg-[#0071e3] text-white px-3.5 h-7 rounded-full transition-all active:scale-[0.97] shrink-0"
              >
                <LogIn className="w-3 h-3" />
                Sign In
              </button>
            )}

            <PWAInstallButton variant="navbar" />
            
            <button
              onClick={toggleTheme}
              title="Toggle Appearance"
              className="w-7 h-7 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-white/80 dark:bg-[#1d1d1f]/80 rounded-full border border-black/[0.08] dark:border-white/[0.12] transition-all active:scale-95 shrink-0"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            
            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              title="Sync Data"
              className="w-7 h-7 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-white/80 dark:bg-[#1d1d1f]/80 rounded-full border border-black/[0.08] dark:border-white/[0.12] transition-all active:scale-95 disabled:opacity-40 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Mobile Right Controls: Sync, Theme & Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-1.5 py-1">
            <button
              onClick={toggleTheme}
              title="Toggle Appearance"
              className="w-7 h-7 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-white/80 dark:bg-[#1d1d1f]/80 rounded-full border border-black/[0.08] dark:border-white/[0.12] transition-all active:scale-95 shrink-0"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              title="Sync Data"
              className="w-7 h-7 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-white/80 dark:bg-[#1d1d1f]/80 rounded-full border border-black/[0.08] dark:border-white/[0.12] transition-all active:scale-95 disabled:opacity-40 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Open Navigation Menu"
              className="w-8 h-8 flex items-center justify-center text-[#1d1d1f] dark:text-white bg-black/[0.04] dark:bg-white/[0.08] rounded-full border border-black/[0.06] dark:border-white/[0.1] transition-all active:scale-95 ml-0.5"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Sheet */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-black/[0.06] dark:border-white/[0.08] bg-white/95 dark:bg-[#161617]/95 backdrop-blur-xl px-4 py-3.5 space-y-3.5 animate-in slide-in-from-top-2 duration-200">
            {/* Last updated on mobile */}
            {summary && (
              <div className="flex items-center justify-between text-xs text-[#86868b] pb-2 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last Data Synchronization</span>
                </div>
                <span className="font-mono text-[11px]">
                  {new Date(summary.last_updated * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}

            {/* Selectors Grid on Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold tracking-wider text-[#86868b] block">Sector</label>
                <select 
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  disabled={!user}
                  className="w-full text-xs bg-[#f5f5f7] dark:bg-[#252527] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.08] dark:border-white/[0.12] rounded-xl h-9 px-3 outline-none font-normal disabled:opacity-40"
                >
                  <option value="All">All Sectors</option>
                  {sectors.map((s) => (
                    <option key={s.sector} value={s.sector}>{s.sector}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold tracking-wider text-[#86868b] block">Timeframe</label>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  disabled={!user}
                  className="w-full text-xs bg-[#f5f5f7] dark:bg-[#252527] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.08] dark:border-white/[0.12] rounded-xl h-9 px-3 outline-none font-normal disabled:opacity-40"
                >
                  {TIMEFRAMES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold tracking-wider text-[#86868b] block">Lookback Period</label>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  disabled={!user}
                  className="w-full text-xs bg-[#f5f5f7] dark:bg-[#252527] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.08] dark:border-white/[0.12] rounded-xl h-9 px-3 outline-none font-normal disabled:opacity-40"
                >
                  {PERIODS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* PWA Install Option in Mobile Drawer */}
            <div className="pt-1">
              <PWAInstallButton variant="menu-item" />
            </div>

            {/* Auth Button on Mobile */}
            <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-[#86868b]">
                {user ? `Signed in as ${user.displayName || user.email}` : 'Sign in to configure market filters'}
              </span>

              {user ? (
                <button 
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3.5 h-8 rounded-full transition-all active:scale-[0.97]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              ) : (
                <button 
                  onClick={signInWithGoogle}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-[#0066cc] text-white px-4 h-8 rounded-full transition-all active:scale-[0.97]"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 mt-4 space-y-3">
        <FeaturedStockCard 
          stock={topStock}
          loading={loading}
          onSelect={(symbol) => user ? setSelectedSymbol(symbol) : null}
          isLocked={!user}
          onUnlock={signInWithGoogle}
        />
        
        {/* Search & Expandable Filters Header (Apple-styled) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Apple Pill Search Input Bar */}
            <div className="relative flex-1 w-full sm:w-auto sm:max-w-sm min-w-[160px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol, company, or sector..."
                className="w-full bg-white dark:bg-[#1d1d1f] border border-black/[0.08] dark:border-white/[0.12] rounded-full pl-9 pr-7 py-1.5 text-xs text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/20 transition-all shadow-none font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Expandable Filters Apple Pill Toggle */}
            <button
              onClick={() => setIsFiltersExpanded(prev => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-normal transition-all border shrink-0 active:scale-[0.97] ${
                isFiltersExpanded || activeFilters.length > 0
                  ? 'bg-[#0066cc] text-white border-[#0066cc]'
                  : 'bg-white dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] border-black/[0.08] dark:border-white/[0.12] hover:border-black/[0.2] dark:hover:border-white/[0.25]'
              }`}
            >
              <Filter className={`w-3.5 h-3.5 ${isFiltersExpanded || activeFilters.length > 0 ? 'text-white' : 'text-[#86868b]'}`} />
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <span className={`text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none ${
                  isFiltersExpanded || activeFilters.length > 0 ? 'bg-white text-[#0066cc]' : 'bg-[#0066cc] text-white'
                }`}>
                  {activeFilters.length}
                </span>
              )}
              {isFiltersExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 opacity-80" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              )}
            </button>

            {/* Active Filters count summary if collapsed & active */}
            {!isFiltersExpanded && activeFilters.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#86868b] text-[12px]">
                  {activeFilters.length} applied
                </span>
                <button
                  onClick={() => setActiveFilters([])}
                  className="text-[12px] font-normal text-[#0066cc] hover:underline"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Total Results Match Counter */}
            <div className="ml-auto text-[12px] font-normal text-[#86868b] hidden sm:block">
              {filteredStocks.length} {filteredStocks.length === 1 ? 'ticker' : 'tickers'}
            </div>
          </div>

          {/* Expandable Filter Drawer (Apple store utility card) */}
          {isFiltersExpanded && (
            <div className="bg-white dark:bg-[#1d1d1f] border border-black/[0.08] dark:border-white/[0.12] rounded-[18px] p-3 flex flex-wrap items-center gap-2 apple-card-shadow transition-all">
              <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mr-1 shrink-0">
                <span>Criteria:</span>
              </div>
              {QUICK_FILTERS.map(f => {
                const isActive = activeFilters.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFilter(f.id)}
                    disabled={!user}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all border active:scale-[0.97] ${
                      !user
                        ? 'bg-[#f5f5f7] dark:bg-[#272729] text-[#86868b] border-transparent cursor-not-allowed opacity-60'
                        : isActive 
                          ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] dark:border-[#f5f5f7] font-medium' 
                          : 'bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] border-transparent hover:border-black/[0.12] dark:hover:border-white/[0.16]'
                    }`}
                  >
                    {!user && <Lock className="w-3 h-3" />}
                    {f.label}
                  </button>
                )
              })}
              {activeFilters.length > 0 && (
                <button 
                  onClick={() => setActiveFilters([])} 
                  className="px-3 py-1 rounded-full text-xs font-normal text-[#0066cc] hover:bg-[#0066cc]/10 transition-colors ml-auto"
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <StockTable 
            stocks={!user ? filteredStocks.slice(0, 20) : filteredStocks} 
            loading={loading} 
            onRowClick={(symbol) => user ? setSelectedSymbol(symbol) : null}
          />
          {!user && !loading && filteredStocks.length > 20 && (
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#f5f5f7] dark:from-[#161617] via-[#f5f5f7]/90 dark:via-[#161617]/90 to-transparent flex flex-col items-center justify-end pb-8">
              <div className="bg-white/95 dark:bg-[#1d1d1f]/95 border border-black/[0.08] dark:border-white/[0.12] rounded-[18px] p-6 apple-product-shadow text-center max-w-md mx-4 frosted-glass">
                <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold tracking-tight text-[#1d1d1f] dark:text-white mb-1.5 font-display">
                  Unlock Full Intelligence
                </h3>
                <p className="text-[13px] text-[#86868b] mb-4 leading-relaxed">
                  Sign in with Google to view all {filteredStocks.length} equities, activate proprietary technical indicators, and explore company fundamental deep dives.
                </p>
                <button 
                  onClick={signInWithGoogle}
                  className="w-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-xs font-medium py-2.5 rounded-full transition-all active:scale-[0.97]"
                >
                  Continue with Google
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <FundamentalsSidebar 
        symbol={selectedSymbol} 
        timeframe={selectedTimeframe}
        period={selectedPeriod}
        onClose={() => setSelectedSymbol(null)} 
      />

      <OfflineIndicator />
    </div>
  );
}
