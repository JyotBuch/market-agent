/**
 * Service for fetching stock market data
 */

import axios from 'axios';
import type { StockSummary, PriceData } from '../types';

// Base URL for data - empty for dev (served from public), set for production
const BASE_URL = import.meta.env.VITE_DATA_URL || '';

/**
 * Fetch summary data for a specific ticker
 */
export const fetchStockSummary = async (ticker: string): Promise<StockSummary> => {
  try {
    // Remove .NS suffix for file lookup (ticker should already be clean from getTickerName)
    const fileTicker = ticker.replace('.NS', '').replace('.BO', '');
    const url = `${BASE_URL}/data/summary/${fileTicker}.json`;
    console.log('Fetching summary from:', url);
    const response = await axios.get(url);
    console.log('Successfully fetched:', fileTicker);
    return response.data;
  } catch (error) {
    console.error(`Error fetching summary for ${ticker}:`, error);
    console.error('Attempted URL:', `${BASE_URL}/data/summary/${ticker}.json`);
    throw new Error(`Failed to fetch data for ${ticker}`);
  }
};

/**
 * Fetch price history for a specific ticker
 */
export const fetchPriceHistory = async (ticker: string): Promise<PriceData[]> => {
  try {
    // Remove .NS suffix for file lookup
    const fileTicker = ticker.replace('.NS', '');
    const response = await axios.get(`${BASE_URL}/data/prices/${fileTicker}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching prices for ${ticker}:`, error);
    throw new Error(`Failed to fetch price data for ${ticker}`);
  }
};

/**
 * Fetch list of available tickers
 */
export const fetchAvailableTickers = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/config/stocks.json`);
    return response.data.tickers;
  } catch (error) {
    console.error('Error fetching tickers:', error);
    // Return default list if config can't be fetched
    return [
      'RELIANCE.NS',
      'TCS.NS',
      'INFY.NS',
      'HDFCBANK.NS',
      'ICICIBANK.NS',
      'SBIN.NS',
      'BHARTIARTL.NS',
      'ITC.NS',
      'HINDUNILVR.NS',
      'LT.NS',
    ];
  }
};

/**
 * Search tickers by name or symbol
 */
export const searchTickers = async (query: string): Promise<string[]> => {
  const tickers = await fetchAvailableTickers();
  const lowerQuery = query.toLowerCase();
  
  return tickers.filter(ticker => 
    ticker.toLowerCase().includes(lowerQuery)
  );
};
