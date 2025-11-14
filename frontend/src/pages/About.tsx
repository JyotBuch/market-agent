/**
 * About Page - System architecture and information
 */

import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Market Agent</h1>

        <div className="space-y-6">
          {/* Overview */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              Market Agent is a comprehensive Indian stock market analysis dashboard that provides
              data-driven insights, technical analysis, and actionable Buy/Hold/Sell recommendations
              for stocks listed on NSE (National Stock Exchange) and BSE (Bombay Stock Exchange).
            </p>
          </section>

          {/* Architecture */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">System Architecture</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Data Pipeline</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    <strong>Data Source:</strong> Yahoo Finance API via yfinance library (free)
                  </li>
                  <li>
                    <strong>Automation:</strong> GitHub Actions workflow runs every 6 hours
                  </li>
                  <li>
                    <strong>Storage:</strong> Static JSON files stored in the repository
                  </li>
                  <li>
                    <strong>Processing:</strong> Python script calculates metrics and generates recommendations
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Frontend</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    <strong>Framework:</strong> React with TypeScript for type safety
                  </li>
                  <li>
                    <strong>Styling:</strong> Tailwind CSS for responsive design
                  </li>
                  <li>
                    <strong>Charts:</strong> Recharts library for data visualization
                  </li>
                  <li>
                    <strong>Routing:</strong> React Router for navigation
                  </li>
                  <li>
                    <strong>Hosting:</strong> GitHub Pages (static hosting, zero cost)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Portfolio Management</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    <strong>Storage:</strong> Browser LocalStorage (no backend required)
                  </li>
                  <li>
                    <strong>Privacy:</strong> All data stays on your device
                  </li>
                  <li>
                    <strong>Features:</strong> Add/edit/delete holdings, real-time P/L calculation
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Metrics & Recommendations */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Metrics & Recommendation Logic
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Calculated Metrics</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    <strong>Returns:</strong> Monthly, quarterly, YTD, and yearly returns with
                    statistical measures (mean, std deviation)
                  </li>
                  <li>
                    <strong>Moving Averages:</strong> 20-day and 50-day MAs with trend detection
                    (UP/DOWN/FLAT)
                  </li>
                  <li>
                    <strong>Volatility:</strong> Annualized volatility based on daily returns
                  </li>
                  <li>
                    <strong>Proximity Analysis:</strong> Distance from 52-week high and low
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Recommendation Engine</h3>
                <p className="text-gray-700 mb-2">
                  Our rule-based recommendation system analyzes multiple factors:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    <strong>Risk-Adjusted Returns:</strong> Sharpe-like ratio (return/volatility)
                  </li>
                  <li>
                    <strong>Trend Analysis:</strong> Based on moving averages and price momentum
                  </li>
                  <li>
                    <strong>Recent Performance:</strong> Last month return weighting
                  </li>
                  <li>
                    <strong>Value Opportunities:</strong> Proximity to 52-week lows
                  </li>
                  <li>
                    <strong>Risk Flags:</strong> High volatility and proximity to 52-week highs
                  </li>
                </ul>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Recommendations are generated using configurable
                    thresholds and statistical analysis. They should be used as one input in
                    your investment decision-making process, not as financial advice.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sources</h2>
            <p className="text-gray-700 mb-3">
              All market data is sourced from publicly available information via Yahoo Finance:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Historical OHLCV (Open, High, Low, Close, Volume) prices</li>
              <li>Fundamental data (P/E ratio, market cap, etc.)</li>
              <li>52-week high/low values</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Data is updated automatically every 6 hours during market days.
            </p>
          </section>

          {/* Future Scope */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Future Enhancements</h2>
            <p className="text-gray-700 mb-3">
              The system is architected to support these planned features:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>
                <strong>News Integration:</strong> Fetch and display relevant news articles for each stock
              </li>
              <li>
                <strong>Sentiment Analysis:</strong> Analyze news sentiment using NLP techniques
              </li>
              <li>
                <strong>LLM Summarization:</strong> Generate AI-powered summaries of company performance
              </li>
              <li>
                <strong>Machine Learning Models:</strong> Replace rule-based recommendations with ML predictions
              </li>
              <li>
                <strong>Alerts & Notifications:</strong> Price alerts and recommendation changes
              </li>
              <li>
                <strong>Backtesting:</strong> Test recommendation accuracy against historical data
              </li>
              <li>
                <strong>Advanced Charts:</strong> Candlestick charts, technical indicators
              </li>
            </ul>
          </section>

          {/* Technology Stack */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Backend/Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Python 3.11+</li>
                  <li>yfinance</li>
                  <li>pandas & numpy</li>
                  <li>GitHub Actions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Frontend</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>React 18</li>
                  <li>TypeScript</li>
                  <li>Vite</li>
                  <li>Tailwind CSS</li>
                  <li>Recharts</li>
                  <li>React Router</li>
                  <li>Axios</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-yellow-900 mb-4">⚠️ Disclaimer</h2>
            <p className="text-yellow-900 leading-relaxed">
              This application is for educational and informational purposes only. It does not
              constitute financial advice, investment advice, trading advice, or any other sort
              of advice. All information is provided "as is" without warranty of any kind. You
              should do your own research and consult with qualified financial advisors before
              making any investment decisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
