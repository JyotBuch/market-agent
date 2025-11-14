# 📊 Market Agent

A comprehensive Indian stock market analysis dashboard with data-driven insights, technical analysis, and actionable Buy/Hold/Sell recommendations. Built with React, TypeScript, and deployed on GitHub Pages with zero backend costs.

![Market Agent Dashboard](https://img.shields.io/badge/status-active-success.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

### Data & Analytics
- **Automated Data Pipeline**: GitHub Actions fetches market data every 6 hours
- **Comprehensive Metrics**: Returns (monthly/quarterly/yearly), moving averages, volatility
- **Technical Analysis**: 20-day & 50-day MAs, trend detection, 52-week range analysis
- **Smart Recommendations**: Rule-based Buy/Hold/Sell signals with confidence scores

### User Interface
- **Dashboard**: Search stocks, view price charts with timeframe selection (1M/3M/6M/1Y/MAX)
- **Portfolio Management**: Add holdings, track P/L, view allocation with interactive pie charts
- **Responsive Design**: Mobile-friendly, clean UI with Tailwind CSS
- **LocalStorage**: Portfolio data stays on your device, no login required

### Architecture
- **Static Hosting**: GitHub Pages (free, fast, reliable)
- **Zero Backend**: Data stored as JSON files in repository
- **Modular Design**: Easy to extend with news, sentiment, ML models

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Setup Instructions](#-setup-instructions)
- [Deployment](#-deployment)
- [Metrics & Recommendations](#-metrics--recommendations)
- [Technology Stack](#-technology-stack)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/market-agent.git
   cd market-agent
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Fetch initial market data**
   ```bash
   python scripts/fetch_data.py
   ```

4. **Set up frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Python Scripts  │         │   Static Data    │          │
│  │  fetch_data.py   │────────>│   /data/*.json   │          │
│  └──────────────────┘         └──────────────────┘          │
│         │                              │                     │
│         │ (GitHub Actions              │                     │
│         │  every 6 hours)              │                     │
│         ▼                              ▼                     │
│  ┌──────────────────────────────────────────────┐           │
│  │         React Frontend (Vite)                │           │
│  │  - Dashboard    - Portfolio    - Charts      │           │
│  │  - LocalStorage - React Router - Tailwind    │           │
│  └──────────────────────────────────────────────┘           │
│         │                                                     │
│         ▼                                                     │
│  ┌──────────────────┐                                        │
│  │  GitHub Pages    │                                        │
│  │  (Static Host)   │                                        │
│  └──────────────────┘                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘

       ▲                                      ▲
       │                                      │
   yfinance API                         User Browser
   (Yahoo Finance)                      (LocalStorage)
```

### Data Flow

1. **Data Ingestion** (Python)
   - `scripts/fetch_data.py` fetches data from Yahoo Finance using yfinance
   - Calculates metrics: returns, MAs, volatility, proximity
   - Generates Buy/Hold/Sell recommendations
   - Saves to `/data/summary/{TICKER}.json` and `/data/prices/{TICKER}.json`

2. **Automation** (GitHub Actions)
   - `.github/workflows/fetch_market_data.yml` runs every 6 hours
   - Commits updated JSON files to repository
   - Triggers frontend deployment on data changes

3. **Frontend** (React + TypeScript)
   - Fetches JSON files via HTTP
   - Displays charts, metrics, recommendations
   - Manages portfolio in browser LocalStorage
   - Deploys to GitHub Pages

## 🛠️ Setup Instructions

### 1. Configure Stock Tickers

Edit `config/stocks.json` to add/remove stocks:

```json
{
  "tickers": [
    "RELIANCE.NS",
    "TCS.NS",
    "INFY.NS"
  ]
}
```

Use `.NS` suffix for NSE stocks, `.BO` for BSE stocks.

### 2. Adjust Recommendation Thresholds

Edit `config/thresholds.json` to fine-tune the recommendation engine:

```json
{
  "recommendation": {
    "sharpe_threshold_buy": 0.5,
    "sharpe_threshold_sell": -0.3,
    "proximity_to_low_buy_threshold": 15,
    "proximity_to_high_sell_threshold": 10
  }
}
```

### 3. Set Up GitHub Actions

1. Go to your repository Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Enable "Allow GitHub Actions to create and approve pull requests"
4. The workflow will run automatically every 6 hours

### 4. Configure GitHub Pages

1. Go to Settings → Pages
2. Source: GitHub Actions
3. Save

The site will be available at `https://YOUR_USERNAME.github.io/market-agent/`

## 🚀 Deployment

### Automatic Deployment

Every push to `master` branch triggers:
1. Market data fetch (if needed)
2. Frontend build
3. GitHub Pages deployment

### Manual Deployment

```bash
# Fetch latest data
python scripts/fetch_data.py

# Build frontend
cd frontend
npm run build

# The dist/ folder is ready for deployment
```

### Environment Variables

For local development, create `frontend/.env`:

```env
VITE_DATA_URL=http://localhost:5173
```

For production (GitHub Pages), data is served from the same origin.

## 📊 Metrics & Recommendations

### Calculated Metrics

#### Returns Analysis
- **Monthly Returns**: Last month + mean & std dev over 12 months
- **Quarterly Returns**: Last quarter + mean & std dev over 4 quarters  
- **Yearly Returns**: YTD, last year, mean & std dev over 3 years
- **Volatility**: Annualized volatility (σ × √252)

#### Technical Analysis
- **Moving Averages**: 20-day and 50-day MAs
- **Trend Detection**: UP (price & MA20 > MA50), DOWN (opposite), FLAT (mixed)
- **Price vs MA**: Percentage difference from each MA

#### Value Analysis
- **52-Week Range**: High, low, distance from each
- **Proximity Metrics**: Buying opportunity near lows, risk near highs

### Recommendation Engine

The system generates Buy/Hold/Sell recommendations using a scoring model:

#### Factors (with weights)

1. **Risk-Adjusted Returns** (Sharpe-like ratio)
   - Buy signal: Sharpe > 0.5
   - Sell signal: Sharpe < -0.3

2. **Trend Analysis** (30% weight)
   - +1.5 for uptrend, -1.5 for downtrend

3. **Recent Performance** (40% weight)
   - +1 if last month > 5%, -1 if < -5%

4. **Proximity to 52W Levels** (30% weight)
   - +1 if within 15% of low
   - -1 if within 10% of high

5. **Volatility Check**
   - -0.5 penalty for high volatility (>40%)

#### Scoring
- **Score ≥ 2**: **BUY** recommendation
- **-2 < Score < 2**: **HOLD** recommendation  
- **Score ≤ -2**: **SELL** recommendation

Each recommendation includes:
- Confidence score (0-1)
- Rationale explaining key factors

### Example

```json
{
  "ticker": "RELIANCE.NS",
  "current_price": 2456.75,
  "recommendation": "BUY",
  "confidence": 0.85,
  "rationale": "Uptrend | Strong monthly return (4.2%) | Strong risk-adjusted returns"
}
```

## 🔧 Technology Stack

### Backend / Data Pipeline
- **Python 3.11+**: Core data processing
- **yfinance**: Yahoo Finance API client
- **pandas**: Data manipulation
- **numpy**: Numerical computations
- **GitHub Actions**: Automation & scheduling

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool & dev server
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Chart library
- **React Router**: Client-side routing
- **Axios**: HTTP client

### Deployment
- **GitHub Pages**: Static hosting
- **GitHub Actions**: CI/CD pipeline

## 🎨 Project Structure

```
market-agent/
├── .github/
│   └── workflows/
│       ├── fetch_market_data.yml    # Data fetching automation
│       └── deploy.yml               # Frontend deployment
├── config/
│   ├── stocks.json                  # List of tickers to track
│   └── thresholds.json              # Recommendation parameters
├── data/
│   ├── prices/                      # Historical price data
│   │   ├── RELIANCE.json
│   │   └── TCS.json
│   └── summary/                     # Stock summaries with metrics
│       ├── RELIANCE.json
│       └── TCS.json
├── scripts/
│   └── fetch_data.py                # Data ingestion script
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API & data services
│   │   ├── types/                   # TypeScript interfaces
│   │   ├── utils/                   # Helper functions
│   │   ├── App.tsx                  # Main app with routing
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   └── vite.config.ts               # Vite configuration
├── requirements.txt                 # Python dependencies
├── .gitignore
└── README.md
```

## 🔮 Future Enhancements

The architecture supports these planned features:

### 1. News Integration
- Fetch news articles from Google News, NewsAPI
- Display relevant news for each stock
- Link to full articles

### 2. Sentiment Analysis
- NLP-based sentiment scoring of news articles
- Aggregate sentiment trends
- Incorporate into recommendation engine

### 3. LLM Summarization
- GPT-4 / Claude summaries of company performance
- Natural language explanations of recommendations
- Q&A chatbot for stock queries

### 4. Machine Learning
- Replace rule-based recommendations with ML models
- Train on historical data + outcomes
- Feature engineering from technical indicators

### 5. Advanced Features
- Price alerts & notifications (via email/push)
- Backtesting framework for recommendations
- Candlestick charts & technical indicators
- Sector analysis & market heatmaps
- Export portfolio reports (PDF)

### 6. Data Enhancements
- Real-time data (via WebSocket if available)
- Options data & Greeks
- Insider trading activity
- Analyst ratings aggregation

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add TypeScript types for new functions
- Update README if adding features
- Test locally before submitting PR

## ⚠️ Disclaimer

**This application is for educational and informational purposes only.**

- Not financial advice, investment advice, or trading advice
- All data provided "as is" without warranty
- Past performance does not guarantee future results
- Do your own research before making investment decisions
- Consult qualified financial advisors for personalized advice

The developers are not responsible for any financial losses incurred from using this application.

## 📄 License

This project is licensed under the MIT License - see below for details.

```
MIT License

Copyright (c) 2025 Market Agent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- Data from [Yahoo Finance](https://finance.yahoo.com/)
- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- Charts by [Recharts](https://recharts.org/)
- Hosted on [GitHub Pages](https://pages.github.com/)

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation thoroughly

---

**Happy Investing! 📈**

*Remember: This is a tool to assist your research, not a substitute for professional financial advice.*
