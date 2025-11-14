/**
 * LocalStorage service for portfolio management
 */

import type { PortfolioHolding, Portfolio } from '../types';

const PORTFOLIO_KEY = 'market-agent-portfolio';

export interface StoredHolding {
  ticker: string;
  company_name: string;
  quantity: number;
  avg_buy_price: number;
}

/**
 * Get all holdings from localStorage
 */
export const getStoredHoldings = (): StoredHolding[] => {
  try {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading portfolio from localStorage:', error);
    return [];
  }
};

/**
 * Save holdings to localStorage
 */
export const saveHoldings = (holdings: StoredHolding[]): void => {
  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(holdings));
  } catch (error) {
    console.error('Error saving portfolio to localStorage:', error);
  }
};

/**
 * Add a new holding
 */
export const addHolding = (holding: StoredHolding): void => {
  const holdings = getStoredHoldings();
  
  // Check if ticker already exists
  const existingIndex = holdings.findIndex(h => h.ticker === holding.ticker);
  
  if (existingIndex >= 0) {
    // Update existing holding (average down/up the price)
    const existing = holdings[existingIndex];
    const totalQuantity = existing.quantity + holding.quantity;
    const totalCost = (existing.quantity * existing.avg_buy_price) + 
                      (holding.quantity * holding.avg_buy_price);
    
    holdings[existingIndex] = {
      ...existing,
      quantity: totalQuantity,
      avg_buy_price: totalCost / totalQuantity,
    };
  } else {
    // Add new holding
    holdings.push(holding);
  }
  
  saveHoldings(holdings);
};

/**
 * Update an existing holding
 */
export const updateHolding = (ticker: string, updates: Partial<StoredHolding>): void => {
  const holdings = getStoredHoldings();
  const index = holdings.findIndex(h => h.ticker === ticker);
  
  if (index >= 0) {
    holdings[index] = { ...holdings[index], ...updates };
    saveHoldings(holdings);
  }
};

/**
 * Delete a holding
 */
export const deleteHolding = (ticker: string): void => {
  const holdings = getStoredHoldings();
  const filtered = holdings.filter(h => h.ticker !== ticker);
  saveHoldings(filtered);
};

/**
 * Calculate portfolio with current prices
 */
export const calculatePortfolio = (
  storedHoldings: StoredHolding[],
  currentPrices: Map<string, { price: number; recommendation?: string }>
): Portfolio => {
  const holdings: PortfolioHolding[] = storedHoldings.map(h => {
    const current = currentPrices.get(h.ticker);
    const currentPrice = current?.price || h.avg_buy_price;
    const totalCost = h.quantity * h.avg_buy_price;
    const currentValue = h.quantity * currentPrice;
    const unrealizedPl = currentValue - totalCost;
    const unrealizedPlPercent = (unrealizedPl / totalCost) * 100;
    
    return {
      ...h,
      current_price: currentPrice,
      total_cost: totalCost,
      current_value: currentValue,
      unrealized_pl: unrealizedPl,
      unrealized_pl_percent: unrealizedPlPercent,
      recommendation: current?.recommendation as any,
    };
  });
  
  const totalInvested = holdings.reduce((sum, h) => sum + h.total_cost, 0);
  const currentValue = holdings.reduce((sum, h) => sum + h.current_value, 0);
  const totalPl = currentValue - totalInvested;
  const totalPlPercent = (totalPl / totalInvested) * 100;
  
  return {
    holdings,
    total_invested: totalInvested,
    current_value: currentValue,
    total_pl: totalPl,
    total_pl_percent: totalPlPercent,
  };
};

/**
 * Clear all holdings
 */
export const clearPortfolio = (): void => {
  localStorage.removeItem(PORTFOLIO_KEY);
};
