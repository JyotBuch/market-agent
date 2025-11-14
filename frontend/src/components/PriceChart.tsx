/**
 * Price chart component using Recharts
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { PriceData, TimeFrame } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';

interface PriceChartProps {
  data: PriceData[];
  timeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

const timeFrames: TimeFrame[] = ['1M', '3M', '6M', '1Y', 'MAX'];

const PriceChart: React.FC<PriceChartProps> = ({ data, timeFrame, onTimeFrameChange }) => {
  // Transform data for chart
  const chartData = data.map(d => ({
    date: d.date,
    price: d.close,
    volume: d.volume,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Price Chart</h2>
        <div className="flex gap-2">
          {timeFrames.map(tf => (
            <button
              key={tf}
              onClick={() => onTimeFrameChange(tf)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeFrame === tf
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              const d = new Date(date);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            tickFormatter={(value) => `₹${value.toFixed(0)}`}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'price') return [formatCurrency(value), 'Price'];
              if (name === 'volume') return [value.toLocaleString('en-IN'), 'Volume'];
              return [value, name];
            }}
            labelFormatter={(label) => formatDate(label)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            name="Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
