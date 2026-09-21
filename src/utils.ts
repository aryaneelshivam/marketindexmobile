import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);

/**
 * Removes ticker extension suffixes like .NS, .BO, etc.
 * e.g., 'RELIANCE.NS' -> 'RELIANCE'
 */
export const cleanSymbol = (symbol: string) => {
  if (!symbol) return '';
  return symbol.replace(/\.(NS|BO|ns|bo)$/i, '');
};

/**
 * Constructs a direct TradingView chart/symbol overview link.
 * Indian NSE tickers are formatted as NSE:{CLEAN_SYMBOL}
 */
export const getTradingViewUrl = (symbol: string, exchange: string = 'NSE') => {
  const cleaned = cleanSymbol(symbol);
  const exch = (exchange || 'NSE').toUpperCase();
  return `https://www.tradingview.com/symbols/${exch}-${cleaned}/`;
};
