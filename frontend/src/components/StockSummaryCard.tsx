/**
 * Stock summary card component
 */

import React from 'react';
import type { StockSummary } from '../types';
import {
  formatCurrency,
  formatPercent,
  formatLargeNumber,
  getChangeColor,
  getRecommendationColor,
} from '../utils/helpers';

interface StockSummaryCardProps {
  summary: StockSummary;
}

const StockSummaryCard: React.FC<StockSummaryCardProps> = ({ summary }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{summary.company_name}</h1>
          <p className="text-gray-600 mt-1">
            {summary.ticker} • {summary.sector}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(summary.current_price)}
          </div>
          <div className={`text-lg font-semibold ${getChangeColor(summary.change_percent)}`}>
            {formatCurrency(summary.change)} ({formatPercent(summary.change_percent)})
          </div>
        </div>
      </div>

      {/* Recommendation Badge */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getRecommendationColor(
              summary.recommendation
            )}`}
          >
            {summary.recommendation}
          </span>
          <span className="text-sm text-gray-600">
            Confidence: {(summary.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{summary.rationale}</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Market Cap</p>
          <p className="text-lg font-semibold text-gray-900">
            {summary.market_cap ? formatLargeNumber(summary.market_cap) : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">P/E Ratio</p>
          <p className="text-lg font-semibold text-gray-900">
            {summary.pe_ratio ? summary.pe_ratio.toFixed(2) : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Volume</p>
          <p className="text-lg font-semibold text-gray-900">
            {summary.volume.toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">52W Range</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(summary.metrics.proximity['52w_low'] || 0)} -{' '}
            {formatCurrency(summary.metrics.proximity['52w_high'] || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockSummaryCard;
