/**
 * Format a number as currency
 * @param value Number to format
 * @param currency Currency symbol
 * @param decimals Number of decimal places
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string = '$',
  decimals: number = 2
): string {
  return `${currency}${value.toFixed(decimals)}`;
}

/**
 * Format a number as percentage
 * @param value Number to format
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a timestamp as a date string
 * @param timestamp Timestamp in milliseconds
 * @param options Date formatting options
 * @returns Formatted date string
 */
export function formatDate(
  timestamp: number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
): string {
  return new Date(timestamp).toLocaleString(undefined, options);
}

/**
 * Format a crypto price with appropriate decimal places
 * @param price Price to format
 * @param currency Currency symbol
 * @returns Formatted price string
 */
export function formatCryptoPrice(
  price: number,
  currency: string = '$'
): string {
  // Use 8 decimal places for small values, fewer for larger values
  let decimals = 8;
  
  if (price >= 1000) {
    decimals = 2;
  } else if (price >= 100) {
    decimals = 3;
  } else if (price >= 10) {
    decimals = 4;
  } else if (price >= 1) {
    decimals = 5;
  } else if (price >= 0.1) {
    decimals = 6;
  } else if (price >= 0.01) {
    decimals = 7;
  }
  
  return formatCurrency(price, currency, decimals);
} 