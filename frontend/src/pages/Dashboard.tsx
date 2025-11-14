/**
 * Dashboard/Search Page
 */

import React, { useState, useEffect } from 'react';
import { fetchStockSummary, fetchPriceHistory, fetchAvailableTickers } from '../services/marketData';
import type { StockSummary, PriceData, TimeFrame } from '../types';
import { filterByTimeFrame, getTickerName } from '../utils/helpers';
import StockSummaryCard from '../components/StockSummaryCard';
import PriceChart from '../components/PriceChart';
import MetricsTable from '../components/MetricsTable';

const Dashboard: React.FC = () => {
  const [availableTickers, setAvailableTickers] = useState<string[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('6M');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load available tickers on mount
  useEffect(() => {
    const loadTickers = async () => {
      try {
        const tickers = await fetchAvailableTickers();
        setAvailableTickers(tickers);
        // Set default ticker
        if (tickers.length > 0 && !selectedTicker) {
          setSelectedTicker(tickers[0]);
        }
      } catch (err) {
        console.error('Failed to load tickers:', err);
      }
    };
    loadTickers();
  }, []);

  // Load stock data when ticker is selected
  useEffect(() => {
    if (!selectedTicker) return;

    const loadStockData = async () => {
      setLoading(true);
      setError(null);

      try {
        const tickerName = getTickerName(selectedTicker);
        const [summaryData, pricesData] = await Promise.all([
          fetchStockSummary(tickerName),
          fetchPriceHistory(tickerName),
        ]);

        setSummary(summaryData);
        setPriceData(pricesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stock data');
        setSummary(null);
        setPriceData([]);
      } finally {
        setLoading(false);
      }
    };

    loadStockData();
  }, [selectedTicker]);

  // Filter tickers based on search
  const filteredTickers = availableTickers.filter(ticker =>
    ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter price data by timeframe
  const chartData = filterByTimeFrame(priceData, timeFrame);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedTicker}
              onChange={(e) => setSelectedTicker(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a stock</option>
              {filteredTickers.map(ticker => (
                <option key={ticker} value={ticker}>
                  {getTickerName(ticker)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stock Data */}
        {!loading && !error && summary && (
          <>
            <StockSummaryCard summary={summary} />
            
            <div className="mb-6">
              <PriceChart
                data={chartData}
                timeFrame={timeFrame}
                onTimeFrameChange={setTimeFrame}
              />
            </div>

            <MetricsTable metrics={summary.metrics} />
          </>
        )}

        {/* Empty State */}
        {!loading && !error && !summary && selectedTicker && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">
              No data available for {selectedTicker}
            </p>
          </div>
        )}

        {!selectedTicker && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to Market Agent
            </h2>
            <p className="text-gray-600 text-lg">
              Select a stock from the dropdown to view analysis and recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
