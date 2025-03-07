'use client';

import { useState, useEffect, useMemo } from 'react';
import { Trade, Balance, MarketPrice } from './types';
import { fetchMarketPrices, calculatePnL } from './utils/api';
import { loadTrades, saveTrades, loadBalance, saveBalance } from './utils/storage';
import TradeForm from './components/TradeForm';
import TradeTable from './components/TradeTable';
import BalanceForm from './components/BalanceForm';

export default function Home() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [balance, setBalance] = useState<Balance>({ amount: 0, lastUpdated: Date.now() });
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [totalPnL, setTotalPnL] = useState(0);

  // Load trades and balance from local storage on initial render
  useEffect(() => {
    const storedTrades = loadTrades();
    const storedBalance = loadBalance();

    setTrades(storedTrades);
    setBalance(storedBalance);
    setIsLoading(false);
  }, []);

  // Fetch market prices at regular intervals
  useEffect(() => {
    const fetchPrices = async () => {
      // Get unique tickers from open trades only
      const tickers = [...new Set(trades.filter(trade => !trade.isClosed).map(trade => trade.ticker))];

      if (tickers.length === 0) {
        return;
      }

      try {
        const prices = await fetchMarketPrices(tickers);

        // Convert to a more usable format
        const priceMap: Record<string, number> = {};
        prices.forEach((item: MarketPrice) => {
          priceMap[item.symbol] = parseFloat(item.price);
        });

        setMarketPrices(priceMap);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    // Fetch immediately on component mount or when trades change
    fetchPrices();

    // Set up interval for regular updates (every 30 seconds)
    const intervalId = setInterval(fetchPrices, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [trades]);

  // Calculate total PnL whenever trades or market prices change
  useEffect(() => {
    let pnlSum = 0;

    trades.forEach(trade => {
      if (trade.isClosed && trade.exitPrice) {
        // For closed positions, use the exit price for PnL calculation
        const { pnl } = calculatePnL(
          trade.entryPrice,
          0, // Not used for closed positions
          trade.leverage,
          trade.marginSize,
          trade.isLong,
          true,
          trade.exitPrice
        );
        pnlSum += pnl;
      } else {
        const currentPrice = marketPrices[trade.ticker];
        if (currentPrice) {
          const { pnl } = calculatePnL(
            trade.entryPrice,
            currentPrice,
            trade.leverage,
            trade.marginSize,
            trade.isLong
          );
          pnlSum += pnl;
        }
      }
    });

    // Round to 2 decimal places
    setTotalPnL(parseFloat(pnlSum.toFixed(2)));
  }, [trades, marketPrices]);

  // Calculate effective balance (base balance + PnL)
  const effectiveBalance = useMemo(() => {
    return {
      amount: parseFloat((balance.amount + totalPnL).toFixed(2)),
      lastUpdated: balance.lastUpdated,
      baseBalance: balance.amount,
      pnl: totalPnL
    };
  }, [balance, totalPnL]);

  // Add a new trade
  const handleAddTrade = (trade: Trade) => {
    const updatedTrades = [...trades, trade];
    setTrades(updatedTrades);
    saveTrades(updatedTrades);
  };

  // Delete a trade
  const handleDeleteTrade = (id: string) => {
    const updatedTrades = trades.filter(trade => trade.id !== id);
    setTrades(updatedTrades);
    saveTrades(updatedTrades);
  };

  // Close a trade
  const handleCloseTrade = (id: string, exitPrice: number) => {
    const updatedTrades = trades.map(trade => {
      if (trade.id === id) {
        return {
          ...trade,
          exitPrice,
          isClosed: true
        };
      }
      return trade;
    });
    setTrades(updatedTrades);
    saveTrades(updatedTrades);
  };

  // Update balance
  const handleUpdateBalance = (newBalance: Balance) => {
    setBalance(newBalance);
    saveBalance(newBalance);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 p-6 rounded-xl gradient-header text-white shadow-lg">
          <h1 className="text-3xl font-bold">
            Crypto Trade Tracker
          </h1>
          <p className="mt-2 text-gray-100 opacity-90">
            Track your cryptocurrency trades and monitor performance in real-time
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <BalanceForm
              balance={effectiveBalance}
              onUpdateBalance={handleUpdateBalance}
            />
            <TradeForm onAddTrade={handleAddTrade} />
          </div>

          <div className="lg:col-span-2">
            <TradeTable
              trades={trades}
              onDeleteTrade={handleDeleteTrade}
              onCloseTrade={handleCloseTrade}
              marketPrices={marketPrices}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
