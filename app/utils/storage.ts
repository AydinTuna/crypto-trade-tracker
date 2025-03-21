import { Trade, Balance } from '../types';

const TRADES_KEY = 'crypto-trades';
const BALANCE_KEY = 'crypto-balance';

/**
 * Save trades to local storage
 */
export function saveTrades(trades: Trade[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  }
}

/**
 * Load trades from local storage
 */
export function loadTrades(): Trade[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedTrades = localStorage.getItem(TRADES_KEY);
    if (!storedTrades) {
      return [];
    }

    const parsedTrades = JSON.parse(storedTrades);
    
    // Ensure all trades have the isLong property (for backward compatibility)
    return parsedTrades.map((trade: Trade) => ({
      ...trade,
      isLong: trade.isLong !== undefined ? trade.isLong : true // Default to long if not specified
    }));
  } catch (error) {
    console.error('Error loading trades:', error);
    return [];
  }
}

/**
 * Save balance to local storage
 */
export function saveBalance(balance: Balance): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BALANCE_KEY, JSON.stringify(balance));
  }
}

/**
 * Load balance from local storage
 */
export function loadBalance(): Balance {
  if (typeof window !== 'undefined') {
    const storedBalance = localStorage.getItem(BALANCE_KEY);
    if (storedBalance) {
      return JSON.parse(storedBalance);
    }
  }
  return { amount: 0, lastUpdated: Date.now() };
} 