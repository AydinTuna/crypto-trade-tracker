import { MarketPrice } from '../types';

// Fallback data in case the API is unavailable
const FALLBACK_PRICES: Record<string, number> = {
  'BTCUSDT': 65000,
  'ETHUSDT': 3500,
  'BNBUSDT': 600,
  'ADAUSDT': 0.5,
  'DOGEUSDT': 0.15,
  'XRPUSDT': 0.6,
  'SOLUSDT': 140,
  'DOTUSDT': 7.5,
  'LTCUSDT': 80,
  'LINKUSDT': 18
};

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
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 30 } // Cache for 30 seconds
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: MarketPrice[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching market prices:', error);
    
    // Use fallback data if API call fails
    console.log('Using fallback price data');
    return symbols.map(symbol => {
      const price = FALLBACK_PRICES[symbol] || 0;
      return {
        symbol,
        price: price.toString()
      };
    });
  }
}

/**
 * Calculate PnL for a trade
 * @param entryPrice Entry price of the trade
 * @param currentPrice Current market price or exit price for closed positions
 * @param leverage Leverage used for the trade
 * @param marginSize Size of the margin in USD
 * @param isLong Whether the position is long (true) or short (false)
 * @param isClosed Whether the position is closed
 * @param exitPrice Exit price for closed positions
 * @returns Object containing PnL and PnL percentage
 */
export function calculatePnL(
  entryPrice: number,
  currentPrice: number,
  leverage: number,
  marginSize: number,
  isLong: boolean = true,
  isClosed: boolean = false,
  exitPrice?: number
): { pnl: number; pnlPercentage: number } {
  if (!entryPrice || (!currentPrice && !exitPrice)) {
    return { pnl: 0, pnlPercentage: 0 };
  }

  // Use exitPrice instead of currentPrice for closed positions
  const priceToCompare = isClosed && exitPrice ? exitPrice : currentPrice;

  // For simplicity, we'll assume all trades are long positions
  // In a real app, you'd handle both long and short positions
  const priceDifference = isLong 
    ? priceToCompare - entryPrice 
    : entryPrice - priceToCompare;
  
  const priceChangePercentage = (priceDifference / entryPrice) * 100;
  const leveragedChangePercentage = priceChangePercentage * leverage;
  
  // Refactored PNL calculation
  // Convert percentage to decimal for calculation
  const pnlPercentageDecimal = leveragedChangePercentage / 100;
  
  // Using the formula: PNL = (PNL% + 1) * (Margin_Size / Leverage)
  const positionSize = marginSize / leverage;
  const pnl = (pnlPercentageDecimal + 1) * positionSize - positionSize;
  
  return {
    pnl: parseFloat(pnl.toFixed(2)),
    pnlPercentage: parseFloat(leveragedChangePercentage.toFixed(2))
  };
} 