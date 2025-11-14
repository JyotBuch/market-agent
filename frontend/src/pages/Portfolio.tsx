/**
 * Portfolio Page
 */

import React, { useState, useEffect } from 'react';
import {
  getStoredHoldings,
  addHolding,
  deleteHolding,
  calculatePortfolio,
  type StoredHolding,
} from '../services/portfolio';
import { fetchStockSummary } from '../services/marketData';
import type { Portfolio } from '../types';
import {
  formatCurrency,
  formatPercent,
  getChangeColor,
  getRecommendationColor,
  getTickerName,
} from '../utils/helpers';
import AllocationChart from '../components/AllocationChart';

const PortfolioPage: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newHolding, setNewHolding] = useState({
    ticker: '',
    company_name: '',
    quantity: '',
    avg_buy_price: '',
  });

  // Load portfolio
  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const storedHoldings = getStoredHoldings();
      
      // Fetch current prices for all holdings
      const pricePromises = storedHoldings.map(async (h) => {
        try {
          const summary = await fetchStockSummary(getTickerName(h.ticker));
          return {
            ticker: h.ticker,
            price: summary.current_price,
            recommendation: summary.recommendation,
          };
        } catch {
          return { ticker: h.ticker, price: h.avg_buy_price };
        }
      });

      const prices = await Promise.all(pricePromises);
      const priceMap = new Map(prices.map(p => [p.ticker, p]));
      
      const calculatedPortfolio = calculatePortfolio(storedHoldings, priceMap);
      setPortfolio(calculatedPortfolio);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleAddHolding = async () => {
    if (!newHolding.ticker || !newHolding.quantity || !newHolding.avg_buy_price) {
      alert('Please fill in all required fields');
      return;
    }

    const holding: StoredHolding = {
      ticker: newHolding.ticker.toUpperCase() + (newHolding.ticker.includes('.') ? '' : '.NS'),
      company_name: newHolding.company_name || newHolding.ticker.toUpperCase(),
      quantity: parseFloat(newHolding.quantity),
      avg_buy_price: parseFloat(newHolding.avg_buy_price),
    };

    addHolding(holding);
    setShowAddModal(false);
    setNewHolding({ ticker: '', company_name: '', quantity: '', avg_buy_price: '' });
    loadPortfolio();
  };

  const handleDeleteHolding = (ticker: string) => {
    if (confirm(`Remove ${ticker} from portfolio?`)) {
      deleteHolding(ticker);
      loadPortfolio();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add Holding
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : portfolio ? (
          <>
            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(portfolio.total_invested)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Current Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(portfolio.current_value)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Total P/L</p>
                <p className={`text-2xl font-bold ${getChangeColor(portfolio.total_pl)}`}>
                  {formatCurrency(portfolio.total_pl)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Total Return</p>
                <p className={`text-2xl font-bold ${getChangeColor(portfolio.total_pl_percent)}`}>
                  {formatPercent(portfolio.total_pl_percent)}
                </p>
              </div>
            </div>

            {/* Holdings Table and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Qty
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Avg Price
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Current
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            P/L
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Rec.
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {portfolio.holdings.map((holding) => (
                          <tr key={holding.ticker} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {getTickerName(holding.ticker)}
                              </div>
                              <div className="text-sm text-gray-500">{holding.company_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                              {holding.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                              {formatCurrency(holding.avg_buy_price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                              {formatCurrency(holding.current_price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className={`text-sm font-medium ${getChangeColor(holding.unrealized_pl)}`}>
                                {formatCurrency(holding.unrealized_pl)}
                              </div>
                              <div className={`text-xs ${getChangeColor(holding.unrealized_pl_percent)}`}>
                                {formatPercent(holding.unrealized_pl_percent)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {holding.recommendation && (
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getRecommendationColor(
                                    holding.recommendation
                                  )}`}
                                >
                                  {holding.recommendation}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => handleDeleteHolding(holding.ticker)}
                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <AllocationChart holdings={portfolio.holdings} />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No Holdings Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start building your portfolio by adding your first holding
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Add First Holding
            </button>
          </div>
        )}

        {/* Add Holding Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Holding</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ticker Symbol *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., RELIANCE or RELIANCE.NS"
                    value={newHolding.ticker}
                    onChange={(e) => setNewHolding({ ...newHolding, ticker: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Reliance Industries"
                    value={newHolding.company_name}
                    onChange={(e) => setNewHolding({ ...newHolding, company_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 10"
                    value={newHolding.quantity}
                    onChange={(e) => setNewHolding({ ...newHolding, quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Buy Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 2450.50"
                    value={newHolding.avg_buy_price}
                    onChange={(e) => setNewHolding({ ...newHolding, avg_buy_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddHolding}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewHolding({ ticker: '', company_name: '', quantity: '', avg_buy_price: '' });
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
