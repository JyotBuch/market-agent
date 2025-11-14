# Quick Start Guide

This guide will help you get Market Agent up and running locally.

## Prerequisites

- Python 3.11 or higher
- Node.js 20 or higher
- Git

## Step-by-Step Setup

### 1. Clone & Install Python Dependencies

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/market-agent.git
cd market-agent

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt
```

### 2. Fetch Market Data

```bash
# Run the data fetcher script
python scripts/fetch_data.py

# This will:
# - Fetch data for all stocks in config/stocks.json
# - Calculate metrics and generate recommendations
# - Save JSON files to data/prices/ and data/summary/
```

Expected output:
```
============================================================
🚀 Market Data Fetcher Starting...
📅 2025-11-13 10:30:00
============================================================
📊 Processing RELIANCE.NS...
✅ Saved data for RELIANCE.NS
📊 Processing TCS.NS...
✅ Saved data for TCS.NS
...
============================================================
✅ Successfully processed: 20
❌ Failed: 0
============================================================
```

### 3. Set Up Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

The application will be available at: http://localhost:5173

### 4. Explore the Dashboard

1. **Dashboard Page**: 
   - Select a stock from the dropdown
   - View price chart (adjust timeframe: 1M, 3M, 6M, 1Y, MAX)
   - See recommendation badge and rationale
   - Review detailed metrics

2. **Portfolio Page**:
   - Click "Add Holding" to add stocks
   - Enter ticker, quantity, and average buy price
   - View real-time P/L and allocation chart
   - See recommendations for your holdings

3. **About Page**:
   - Learn about the system architecture
   - Understand metrics and recommendations
   - Review technology stack

## Configuration

### Add/Remove Stocks

Edit `config/stocks.json`:

```json
{
  "tickers": [
    "RELIANCE.NS",
    "TCS.NS",
    "INFY.NS"
  ]
}
```

Then run `python scripts/fetch_data.py` to update data.

### Adjust Thresholds

Edit `config/thresholds.json` to fine-tune recommendations:

```json
{
  "recommendation": {
    "sharpe_threshold_buy": 0.5,
    "sharpe_threshold_sell": -0.3,
    "proximity_to_low_buy_threshold": 15
  }
}
```

## Troubleshooting

### Import Errors

If you see `ModuleNotFoundError`:
```bash
pip install -r requirements.txt
```

### No Data Available

If stocks show "No data available":
1. Check ticker symbol (must include .NS or .BO suffix)
2. Verify internet connection
3. Try running `python scripts/fetch_data.py` again

### Port Already in Use

If port 5173 is busy:
```bash
cd frontend
npm run dev -- --port 3000
```

## Next Steps

- **Deploy to GitHub Pages**: See main README for deployment instructions
- **Set Up Automation**: Configure GitHub Actions for automatic data updates
- **Customize**: Add your favorite stocks to config/stocks.json

## Need Help?

- Check the main [README.md](../README.md) for detailed documentation
- Open an issue on GitHub for bug reports or questions
- Review code comments for implementation details
