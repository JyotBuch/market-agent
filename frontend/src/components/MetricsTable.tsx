/**
 * Metrics table component
 */

import React from 'react';
import type { StockMetrics } from '../types';
import { formatPercent } from '../utils/helpers';

interface MetricsTableProps {
  metrics: StockMetrics;
}

const MetricsTable: React.FC<MetricsTableProps> = ({ metrics }) => {
  const { returns, moving_averages, proximity } = metrics;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h2>

      <div className="space-y-6">
        {/* Returns Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Returns</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {returns.last_month !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">Last Month</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatPercent(returns.last_month)}
                </p>
              </div>
            )}
            {returns.last_quarter !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">Last Quarter</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatPercent(returns.last_quarter)}
                </p>
              </div>
            )}
            {returns.ytd !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">YTD</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatPercent(returns.ytd)}
                </p>
              </div>
            )}
            {returns.last_year !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">Last Year</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatPercent(returns.last_year)}
                </p>
              </div>
            )}
            {returns.yearly_mean !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">3Y Avg</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatPercent(returns.yearly_mean)}
                </p>
              </div>
            )}
            {returns.volatility !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">Volatility</p>
                <p className="text-xl font-semibold text-gray-900">
                  {(returns.volatility * 100).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Moving Averages Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Moving Averages</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {moving_averages.ma_20 !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">20-Day MA</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{moving_averages.ma_20.toFixed(2)}
                </p>
                {moving_averages.price_vs_ma_20 !== undefined && (
                  <p className="text-sm text-gray-600">
                    {formatPercent(moving_averages.price_vs_ma_20)}
                  </p>
                )}
              </div>
            )}
            {moving_averages.ma_50 !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">50-Day MA</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{moving_averages.ma_50.toFixed(2)}
                </p>
                {moving_averages.price_vs_ma_50 !== undefined && (
                  <p className="text-sm text-gray-600">
                    {formatPercent(moving_averages.price_vs_ma_50)}
                  </p>
                )}
              </div>
            )}
            {moving_averages.trend && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">Trend</p>
                <p
                  className={`text-xl font-semibold ${
                    moving_averages.trend === 'UP'
                      ? 'text-green-600'
                      : moving_averages.trend === 'DOWN'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {moving_averages.trend}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Proximity Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">52-Week Range</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {proximity['52w_high'] !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">52W High</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{proximity['52w_high'].toFixed(2)}
                </p>
              </div>
            )}
            {proximity['52w_low'] !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">52W Low</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{proximity['52w_low'].toFixed(2)}
                </p>
              </div>
            )}
            {proximity.distance_from_high !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">From High</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatPercent(proximity.distance_from_high)}
                </p>
              </div>
            )}
            {proximity.distance_from_low !== undefined && (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">From Low</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatPercent(proximity.distance_from_low)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsTable;
