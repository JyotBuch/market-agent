/**
 * Portfolio allocation pie chart component
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { PortfolioHolding } from '../types';
import { formatCurrency } from '../utils/helpers';

interface AllocationChartProps {
  holdings: PortfolioHolding[];
}

const COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#ca8a04',
  '#65a30d', '#059669', '#0891b2', '#6366f1', '#a855f7',
];

const AllocationChart: React.FC<AllocationChartProps> = ({ holdings }) => {
  const chartData = holdings.map((h, index) => ({
    name: h.ticker,
    value: h.current_value,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Allocation</h2>
      
      {chartData.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No holdings to display
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AllocationChart;
