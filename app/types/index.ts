export interface Trade {
  id: string;
  ticker: string;
  entryPrice: number;
  leverage: number;
  marginSize: number;
  currentPrice?: number;
  pnl?: number;
  pnlPercentage?: number;
  timestamp: number;
}

export interface Balance {
  amount: number;
  lastUpdated: number;
  baseBalance?: number;
  pnl?: number;
}

export interface MarketPrice {
  symbol: string;
  price: string;
}

export interface SortConfig {
  key: keyof Trade;
  direction: 'ascending' | 'descending';
}

export interface FilterConfig {
  ticker?: string;
} 