import { useState } from 'react';
import { Trade } from '../types';

interface TradeFormProps {
    onAddTrade: (trade: Trade) => void;
}

export default function TradeForm({ onAddTrade }: TradeFormProps) {
    const [ticker, setTicker] = useState('');
    const [entryPrice, setEntryPrice] = useState('');
    const [leverage, setLeverage] = useState('1');
    const [marginSize, setMarginSize] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate inputs
        if (!ticker || !entryPrice || !leverage || !marginSize) {
            setError('All fields are required');
            return;
        }

        // Create new trade
        const newTrade: Trade = {
            id: crypto.randomUUID(),
            ticker: ticker.toUpperCase(),
            entryPrice: parseFloat(entryPrice),
            leverage: parseFloat(leverage),
            marginSize: parseFloat(marginSize),
            timestamp: Date.now(),
        };

        // Add trade
        onAddTrade(newTrade);

        // Reset form
        setTicker('');
        setEntryPrice('');
        setLeverage('1');
        setMarginSize('');
        setError('');
    };

    return (
        <div className="card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Trade
            </h2>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow">
                    <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="ticker" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Ticker (e.g., BTCUSDT)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="ticker"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value)}
                            className="input-styled w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="BTCUSDT"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="entryPrice" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Entry Price (USD)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500">$</span>
                        </div>
                        <input
                            type="number"
                            id="entryPrice"
                            value={entryPrice}
                            onChange={(e) => setEntryPrice(e.target.value)}
                            step="0.00000001"
                            min="0"
                            className="input-styled w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            style={{ paddingLeft: '2rem' }}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="leverage" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Leverage
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <input
                            type="number"
                            id="leverage"
                            value={leverage}
                            onChange={(e) => setLeverage(e.target.value)}
                            min="1"
                            max="125"
                            className="input-styled w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            style={{ paddingLeft: '2.5rem', paddingRight: '1.5rem' }}
                            placeholder="1"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-500">x</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="marginSize" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Margin Size (USD)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500">$</span>
                        </div>
                        <input
                            type="number"
                            id="marginSize"
                            value={marginSize}
                            onChange={(e) => setMarginSize(e.target.value)}
                            min="0"
                            step="0.01"
                            className="input-styled w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            style={{ paddingLeft: '2rem' }}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full gradient-primary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200"
                >
                    Add Trade
                </button>
            </form>
        </div>
    );
} 