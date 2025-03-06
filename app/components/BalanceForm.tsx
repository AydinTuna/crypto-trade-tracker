import { useState } from 'react';
import { Balance } from '../types';
import { formatNumberWithCommas } from '../utils/formatters';

interface BalanceFormProps {
    balance: Balance;
    onUpdateBalance: (newBalance: Balance) => void;
}

export default function BalanceForm({ balance, onUpdateBalance }: BalanceFormProps) {
    const [amount, setAmount] = useState(balance.baseBalance?.toString() || balance.amount.toString());
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount < 0) {
            setError('Please enter a valid positive number');
            return;
        }

        onUpdateBalance({
            amount: parsedAmount,
            lastUpdated: Date.now()
        });

        setIsEditing(false);
        setError('');
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    // Determine PnL color based on value
    const getPnlColor = (pnl: number | undefined) => {
        if (!pnl) return 'text-gray-500';
        return pnl >= 0 ? 'text-green-500' : 'text-red-500';
    };

    return (
        <div className="card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Account Balance
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

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="balance" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Base Balance (USD)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-gray-500">$</span>
                            </div>
                            <input
                                type="number"
                                id="balance"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0"
                                step="0.01"
                                className="input-styled w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                style={{ paddingLeft: '2rem' }}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="btn-primary flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setAmount(balance.baseBalance?.toString() || balance.amount.toString());
                                setError('');
                            }}
                            className="btn-secondary flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
                            <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
                                ${formatNumberWithCommas(balance.amount)}
                            </p>

                            {/* Display base balance and PnL if available */}
                            {balance.baseBalance !== undefined && (
                                <div className="mt-2 space-y-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                        <span className="w-24">Base Balance:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            ${formatNumberWithCommas(balance.baseBalance)}
                                        </span>
                                    </p>
                                    <p className="text-xs flex items-center">
                                        <span className="w-24 text-gray-500 dark:text-gray-400">Current PnL:</span>
                                        <span className={`font-medium ${getPnlColor(balance.pnl)}`}>
                                            {balance.pnl !== undefined && (balance.pnl >= 0 ? '+' : '')}${balance.pnl !== undefined ? formatNumberWithCommas(Math.abs(balance.pnl)) : '0.00'}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-primary flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Update
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Last updated: {formatDate(balance.lastUpdated)}
                    </p>
                </div>
            )}
        </div>
    );
} 