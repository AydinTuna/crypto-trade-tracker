import { useState, useEffect } from 'react';
import { Trade, SortConfig, FilterConfig } from '../types';
import { calculatePnL } from '../utils/api';
import { formatNumber, formatNumberWithCommas } from '../utils/formatters';

interface TradeTableProps {
    trades: Trade[];
    onDeleteTrade: (id: string) => void;
    marketPrices: Record<string, number>;
}

export default function TradeTable({ trades, onDeleteTrade, marketPrices }: TradeTableProps) {
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'timestamp', direction: 'descending' });
    const [filterConfig, setFilterConfig] = useState<FilterConfig>({});
    const [filterInput, setFilterInput] = useState('');
    const [displayTrades, setDisplayTrades] = useState<Trade[]>([]);

    // Update trades with current prices and PnL calculations
    useEffect(() => {
        const updatedTrades = trades.map(trade => {
            const currentPrice = marketPrices[trade.ticker];

            if (currentPrice) {
                const { pnl, pnlPercentage } = calculatePnL(
                    trade.entryPrice,
                    currentPrice,
                    trade.leverage,
                    trade.marginSize,
                    trade.isLong
                );

                return {
                    ...trade,
                    currentPrice,
                    pnl,
                    pnlPercentage
                };
            }

            return trade;
        });

        // Apply filtering
        let filteredTrades = updatedTrades;
        if (filterConfig.ticker) {
            filteredTrades = filteredTrades.filter(trade =>
                trade.ticker.toLowerCase().includes(filterConfig.ticker?.toLowerCase() || '')
            );
        }

        // Apply sorting
        filteredTrades.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === undefined || bValue === undefined) {
                return 0;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setDisplayTrades(filteredTrades);
    }, [trades, marketPrices, sortConfig, filterConfig]);

    const handleSort = (key: keyof Trade) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'ascending'
                ? 'descending'
                : 'ascending'
        }));
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        setFilterConfig({ ticker: filterInput });
    };

    const clearFilter = () => {
        setFilterInput('');
        setFilterConfig({});
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Your Trades
                </h2>

                <form onSubmit={handleFilter} className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={filterInput}
                            onChange={(e) => setFilterInput(e.target.value)}
                            placeholder="Filter by ticker..."
                            className="input-styled w-full sm:w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter
                    </button>
                    {filterConfig.ticker && (
                        <button
                            type="button"
                            onClick={clearFilter}
                            className="btn-secondary flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear
                        </button>
                    )}
                </form>
            </div>

            {displayTrades.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-300 text-lg">
                        No trades found. Add your first trade to get started!
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
                    <table className="table-styled">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                    onClick={() => handleSort('ticker')}
                                >
                                    <div className="flex items-center">
                                        Ticker
                                        {sortConfig.key === 'ticker' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                    onClick={() => handleSort('isLong')}
                                >
                                    <div className="flex items-center">
                                        Position
                                        {sortConfig.key === 'isLong' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                    onClick={() => handleSort('entryPrice')}
                                >
                                    <div className="flex items-center">
                                        Entry Price
                                        {sortConfig.key === 'entryPrice' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                    onClick={() => handleSort('currentPrice')}
                                >
                                    <div className="flex items-center">
                                        Current Price
                                        {sortConfig.key === 'currentPrice' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                    onClick={() => handleSort('leverage')}
                                >
                                    <div className="flex items-center">
                                        Leverage
                                        {sortConfig.key === 'leverage' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                    onClick={() => handleSort('marginSize')}
                                >
                                    <div className="flex items-center">
                                        Margin Size
                                        {sortConfig.key === 'marginSize' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                    onClick={() => handleSort('pnl')}
                                >
                                    <div className="flex items-center">
                                        PnL
                                        {sortConfig.key === 'pnl' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                    onClick={() => handleSort('pnlPercentage')}
                                >
                                    <div className="flex items-center">
                                        PnL %
                                        {sortConfig.key === 'pnlPercentage' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                    onClick={() => handleSort('timestamp')}
                                >
                                    <div className="flex items-center">
                                        Date
                                        {sortConfig.key === 'timestamp' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {displayTrades.map((trade) => (
                                <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {trade.ticker}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full ${trade.isLong
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {trade.isLong ? 'Long' : 'Short'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        ${formatNumber(trade.entryPrice, 8)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {trade.currentPrice
                                            ? (
                                                <div className="flex items-center">
                                                    <span>${formatNumber(trade.currentPrice, 8)}</span>
                                                    {trade.currentPrice > trade.entryPrice ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                        </svg>
                                                    ) : trade.currentPrice < trade.entryPrice ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                        </svg>
                                                    ) : null}
                                                </div>
                                            )
                                            : (
                                                <div className="flex items-center">
                                                    <div className="animate-pulse h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                </div>
                                            )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                            {trade.leverage}x
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="font-medium">${formatNumberWithCommas(trade.marginSize)}</span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.pnl && trade.pnl > 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : trade.pnl && trade.pnl < 0
                                            ? 'text-red-600 dark:text-red-400'
                                            : ''
                                        }`}>
                                        {trade.pnl !== undefined
                                            ? (
                                                <div className="flex items-center">
                                                    <span>${formatNumberWithCommas(Math.abs(trade.pnl))}</span>
                                                    {trade.pnl > 0 ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    ) : trade.pnl < 0 ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    ) : null}
                                                </div>
                                            )
                                            : '-'}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.pnlPercentage && trade.pnlPercentage > 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : trade.pnlPercentage && trade.pnlPercentage < 0
                                            ? 'text-red-600 dark:text-red-400'
                                            : ''
                                        }`}>
                                        {trade.pnlPercentage !== undefined
                                            ? (
                                                <div className="flex items-center">
                                                    <span>{trade.pnlPercentage > 0 ? '+' : ''}{trade.pnlPercentage.toFixed(2)}%</span>
                                                </div>
                                            )
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(trade.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <button
                                            onClick={() => onDeleteTrade(trade.id)}
                                            className="btn-danger flex items-center text-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 