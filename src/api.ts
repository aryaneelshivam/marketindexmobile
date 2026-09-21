import { ApiResponse, Sector } from './types';

const BASE_URL = 'https://marketindex-new.vercel.app';

export async function getSectors(): Promise<Sector[]> {
  const res = await fetch(`${BASE_URL}/api/sectors`);
  if (!res.ok) throw new Error('Failed to fetch sectors');
  return res.json();
}

export async function getStocks(
  sector = 'All',
  timeframe = '1d',
  period = '1y'
): Promise<ApiResponse> {
  const res = await fetch(
    `${BASE_URL}/api/stocks?sector=${encodeURIComponent(sector)}&timeframe=${timeframe}&period=${period}`
  );
  if (!res.ok) throw new Error('Failed to fetch stocks');
  return res.json();
}

export async function getFundamentals(symbol: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/stock/${symbol}/fundamentals`);
  if (!res.ok) throw new Error('Failed to fetch fundamentals');
  return res.json();
}

export async function getStockDeepDive(symbol: string, timeframe: string, period: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/stock/${symbol}?timeframe=${timeframe}&period=${period}`);
  if (!res.ok) throw new Error('Failed to fetch stock chart data');
  return res.json();
}
