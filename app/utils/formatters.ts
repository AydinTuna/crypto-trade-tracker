/**
 * Utility functions for formatting values
 */

/**
 * Format a number with thousand separators
 * @param {number} value - The number to format
 * @param {number} [decimals=2] - Number of decimal places (default: 2)
 * @returns {string} Formatted number with commas as thousand separators
 */
export const formatNumberWithCommas = (value: number, decimals = 2): string => {
  // For financial values, always show exactly the specified number of decimal places
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a number with thousand separators, but only show decimals if they exist
 * @param {number} value - The number to format
 * @param {number} [maxDecimals=2] - Maximum number of decimal places (default: 2)
 * @returns {string} Formatted number with commas as thousand separators
 */
export const formatNumber = (value: number, maxDecimals = 2): string => {
  // Check if the value has no decimal part or all decimal digits are zero
  if (value === Math.floor(value)) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  }).format(value);
}; 