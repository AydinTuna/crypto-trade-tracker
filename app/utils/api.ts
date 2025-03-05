import { MarketPrice } from '../types';

/**
 * Fetches current price data from Binance API via our proxy
 * @param symbols Array of ticker symbols to fetch prices for
 * @returns Array of market prices
 */
export async function fetchMarketPrices(symbols: string[]): Promise<MarketPrice[]> {
  try {
    // Use our proxy endpoint to avoid CORS issues
    const url = symbols.length > 0
      ? `/api/prices?symbols=${symbols.join(',')}`
      : '/api/prices';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: MarketPrice[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return [];
  }
}

/**
 * Calculate PnL for a trade
 * @param entryPrice Entry price of the trade
 * @param currentPrice Current market price
 * @param leverage Leverage used for the trade
 * @param marginSize Size of the margin in USD
 * @param isLong Whether the position is long (true) or short (false)
 * @returns Object containing PnL and PnL percentage
 */
export function calculatePnL(
  entryPrice: number,
  currentPrice: number,
  leverage: number,
  marginSize: number,
  isLong: boolean = true
): { pnl: number; pnlPercentage: number } {
  if (!entryPrice || !currentPrice) {
    return { pnl: 0, pnlPercentage: 0 };
  }

  // For simplicity, we'll assume all trades are long positions
  // In a real app, you'd handle both long and short positions
  const priceDifference = isLong 
    ? currentPrice - entryPrice 
    : entryPrice - currentPrice;
  
  const priceChangePercentage = (priceDifference / entryPrice) * 100;
  const leveragedChangePercentage = priceChangePercentage * leverage;
  const pnl = (marginSize * leveragedChangePercentage) / 100;
  
  return {
    pnl: parseFloat(pnl.toFixed(2)),
    pnlPercentage: parseFloat(leveragedChangePercentage.toFixed(2))
  };
} 