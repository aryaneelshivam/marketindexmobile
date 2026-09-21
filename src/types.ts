export interface StockSummary {
  timeframe: string;
  period: string;
  total_stocks: number;
  bullish_count: number;
  bearish_count: number;
  last_updated: number;
  is_updating: boolean;
}

export interface ScoreDetail {
  score: number;
  max: number;
  label: string;
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  cmp: number;
  change: number;
  pct_change: number;
  technical_score: number;
  technical_grade: string;
  grade_badge: string;
  score_breakdown: {
    trend: ScoreDetail;
    strength: ScoreDetail;
    momentum: ScoreDetail;
    volume: ScoreDetail;
    structure: ScoreDetail;
  };
  sma20: number;
  sma50: number;
  sma200: number;
  ema20: number;
  ema50: number;
  trend_verdict: string;
  trend_color: string;
  adx: number;
  plus_di: number;
  minus_di: number;
  adx_label: string;
  rsi: number;
  rsi_status: string;
  macd: number;
  macd_signal: number;
  macd_hist: number;
  macd_status: string;
  atr: number;
  atr_pct: number;
  volume: number;
  volume_20d_avg: number;
  vol_ratio: number;
  vol_verdict: string;
  obv: number;
  obv_trend: string;
  pivot: number;
  r1: number;
  s1: number;
  r2: number;
  s2: number;
  r3: number;
  s3: number;
  nearest_support: string;
  support_dist_pct: number;
  nearest_resistance: string;
  resistance_dist_pct: number;
  high_52w: number;
  low_52w: number;
  pct_from_52w_high: number;
  pct_from_52w_low: number;
  timeframe: string;
  period: string;
}

export interface FundamentalsData {
  symbol: string;
  name: string;
  currency: string;
  cmp: number;
  company_profile: {
    sector: string;
    industry: string;
    country: string;
    website: string;
    employees: number;
    summary: string;
  };
  valuation: {
    market_cap: number;
    market_cap_fmt: string;
    trailing_pe: number;
    forward_pe: number;
    peg_ratio: number;
    price_to_book: number;
    price_to_sales: number;
    enterprise_value: number;
    enterprise_value_fmt: string;
    ev_to_ebitda: number;
    ev_to_revenue: number;
  };
  profitability: {
    return_on_equity: number;
    return_on_equity_fmt: string;
    return_on_assets: number;
    return_on_assets_fmt: string;
    operating_margins: number;
    operating_margins_fmt: string;
    profit_margins: number;
    profit_margins_fmt: string;
    gross_margins: number;
    gross_margins_fmt: string;
    ebitda: number;
    ebitda_fmt: string;
  };
  balance_sheet: {
    total_cash: number;
    total_cash_fmt: string;
    total_debt: number;
    total_debt_fmt: string;
    net_debt: number;
    net_debt_fmt: string;
    debt_to_equity: number;
    current_ratio: number;
    quick_ratio: number;
    book_value: number;
  };
  growth_and_cashflow: {
    revenue_growth_yoy: number;
    revenue_growth_fmt: string;
    earnings_growth_yoy: number;
    earnings_growth_fmt: string;
    operating_cash_flow: number;
    operating_cash_flow_fmt: string;
    free_cash_flow: number;
    free_cash_flow_fmt: string;
    trailing_eps: number;
    forward_eps: number;
  };
  dividends: {
    dividend_yield: number;
    dividend_yield_fmt: string;
    dividend_rate: number;
    payout_ratio: number;
    payout_ratio_fmt: string;
    ex_dividend_date: string;
  };
  shareholding_and_beta: {
    beta: number;
    promoter_holding: number;
    promoter_holding_fmt: string;
    institutional_holding: number;
    institutional_holding_fmt: string;
  };
  analyst_targets: {
    recommendation: string;
    target_mean: number;
    target_high: number;
    target_low: number;
    potential_upside_pct: number;
    analyst_count: number;
  };
}

export interface ApiResponse {
  summary: StockSummary;
  data: StockData[];
}

export interface Sector {
  sector: string;
  count: number;
  stocks: string[];
}
