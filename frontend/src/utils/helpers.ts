/**
 * Utility functions for formatting and calculations
 */

import type { Recommendation, TimeFrame, PriceData } from '../types';

/**
 * Format number as currency (Indian Rupee)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format large numbers (for market cap, volume)
 */
export const formatLargeNumber = (value: number): string => {
  if (value >= 1e12) {
    return `₹${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `₹${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e7) {
    return `₹${(value / 1e7).toFixed(2)}Cr`;
  } else if (value >= 1e5) {
    return `₹${(value / 1e5).toFixed(2)}L`;
  }
  return formatCurrency(value);
};

/**
 * Format percentage
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Get color class based on value (positive/negative)
 */
export const getChangeColor = (value: number): string => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};

/**
 * Get recommendation badge color
 */
export const getRecommendationColor = (recommendation: Recommendation): string => {
  switch (recommendation) {
    case 'BUY':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'SELL':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'HOLD':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

/**
 * Filter price data by timeframe
 */
export const filterByTimeFrame = (data: PriceData[], timeFrame: TimeFrame): PriceData[] => {
  if (timeFrame === 'MAX') return data;
  
  const now = new Date();
  let cutoffDate: Date;
  
  switch (timeFrame) {
    case '1M':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case '3M':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case '6M':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case '1Y':
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      return data;
  }
  
  return data.filter(d => new Date(d.date) >= cutoffDate);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Get ticker name without exchange suffix
 */
export const getTickerName = (ticker: string): string => {
  return ticker.split('.')[0];
};

/**
 * Calculate percentage change
 */
export const calculatePercentChange = (current: number, previous: number): number => {
  return ((current - previous) / previous) * 100;
};
