import { Trade } from '../types';
import { formatNumber, formatNumberWithCommas } from './formatters';

/**
 * Convert trade data to CSV format
 * @param trades Array of trade objects to convert
 * @returns CSV string
 */
export const tradesToCSV = (trades: Trade[]): string => {
  // Define CSV headers - match the exact table column order
  const headers = [
    'Ticker',
    'Position',
    'Entry Price',
    'Exit Price',
    'Current Price',
    'Leverage',
    'Margin Size',
    'PnL',
    'PnL Percentage',
    'Date',
  ];

  // Generate CSV rows - match the exact table column order and formatting
  const rows = trades.map(trade => {
    // Format the date the same way as displayed in the table
    const formattedDate = new Date(trade.timestamp).toLocaleString();
    
    return [
      trade.ticker,
      trade.isLong ? 'Long' : 'Short',
      formatNumber(trade.entryPrice, 8),
      trade.exitPrice ? formatNumber(trade.exitPrice, 8) : '',
      trade.currentPrice && !trade.isClosed ? formatNumber(trade.currentPrice, 8) : (trade.isClosed ? 'Closed' : ''),
      `${trade.leverage}x`,
      formatNumberWithCommas(trade.marginSize),
      trade.pnl !== undefined ? formatNumberWithCommas(Math.abs(trade.pnl)) : '',
      trade.pnlPercentage !== undefined ? `${trade.pnlPercentage > 0 ? '+' : ''}${trade.pnlPercentage.toFixed(2)}%` : '',
      formattedDate
    ];
  });

  // Add proper CSV escaping for fields that might contain commas
  const escapeCsvField = (field: string) => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      // Replace double quotes with two double quotes and wrap in quotes
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  // Combine headers and rows with proper CSV escaping
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => escapeCsvField(String(field))).join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Download data as a CSV file
 * @param csvContent CSV content as string
 * @param filename Name of the file to download
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  // Create a blob with the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add the link to the DOM
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 