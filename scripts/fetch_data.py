#!/usr/bin/env python3
"""
Market Data Fetcher for Indian Stocks
Fetches historical price data, calculates metrics, and generates recommendations.
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import yfinance as yf
import pandas as pd
import numpy as np


class MarketDataFetcher:
    """Fetches and processes market data for Indian stocks."""
    
    def __init__(self, config_dir: str = "config", data_dir: str = "data"):
        self.config_dir = config_dir
        self.data_dir = data_dir
        self.load_config()
    
    def load_config(self):
        """Load configuration files."""
        with open(f"{self.config_dir}/stocks.json", "r") as f:
            self.stocks_config = json.load(f)
        
        with open(f"{self.config_dir}/thresholds.json", "r") as f:
            self.thresholds = json.load(f)
        
        self.tickers = self.stocks_config["tickers"]
        self.rec_config = self.thresholds["recommendation"]
        self.metrics_config = self.thresholds["metrics"]
    
    def fetch_historical_data(self, ticker: str, period: str = "5y") -> Optional[pd.DataFrame]:
        """
        Fetch historical OHLCV data for a ticker.
        
        Args:
            ticker: Stock ticker symbol (e.g., "RELIANCE.NS")
            period: Historical period (default: "5y")
        
        Returns:
            DataFrame with historical data or None if fetch fails
        """
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period=period)
            
            if hist.empty:
                print(f"⚠️  No data available for {ticker}")
                return None
            
            return hist
        except Exception as e:
            print(f"❌ Error fetching {ticker}: {str(e)}")
            return None
    
    def get_stock_info(self, ticker: str) -> Dict:
        """
        Fetch fundamental information for a ticker.
        
        Args:
            ticker: Stock ticker symbol
        
        Returns:
            Dictionary with fundamental data
        """
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            return {
                "market_cap": info.get("marketCap"),
                "pe_ratio": info.get("trailingPE"),
                "eps": info.get("trailingEps"),
                "dividend_yield": info.get("dividendYield"),
                "beta": info.get("beta"),
                "52_week_high": info.get("fiftyTwoWeekHigh"),
                "52_week_low": info.get("fiftyTwoWeekLow"),
                "company_name": info.get("longName", info.get("shortName")),
                "sector": info.get("sector"),
                "industry": info.get("industry")
            }
        except Exception as e:
            print(f"⚠️  Could not fetch info for {ticker}: {str(e)}")
            return {}
    
    def calculate_returns(self, prices: pd.Series) -> Dict:
        """
        Calculate various return metrics.
        
        Args:
            prices: Series of closing prices
        
        Returns:
            Dictionary with return metrics
        """
        returns = {}
        
        try:
            # Daily returns
            daily_returns = prices.pct_change().dropna()
            
            # Monthly returns (last month)
            if len(prices) >= 21:
                last_month_return = (prices.iloc[-1] / prices.iloc[-21] - 1) * 100
                returns["last_month"] = round(last_month_return, 2)
            
            # Monthly returns statistics (last 12 months)
            if len(prices) >= 252:
                monthly_returns = []
                for i in range(12):
                    start_idx = -(i+1) * 21
                    end_idx = -i * 21 if i > 0 else None
                    if abs(start_idx) <= len(prices):
                        month_ret = (prices.iloc[end_idx] / prices.iloc[start_idx] - 1) * 100
                        monthly_returns.append(month_ret)
                
                if monthly_returns:
                    returns["monthly_mean"] = round(np.mean(monthly_returns), 2)
                    returns["monthly_std"] = round(np.std(monthly_returns), 2)
            
            # Quarterly returns (last quarter)
            if len(prices) >= 63:
                last_quarter_return = (prices.iloc[-1] / prices.iloc[-63] - 1) * 100
                returns["last_quarter"] = round(last_quarter_return, 2)
            
            # Quarterly returns statistics (last 4 quarters)
            if len(prices) >= 252:
                quarterly_returns = []
                for i in range(4):
                    start_idx = -(i+1) * 63
                    end_idx = -i * 63 if i > 0 else None
                    if abs(start_idx) <= len(prices):
                        quarter_ret = (prices.iloc[end_idx] / prices.iloc[start_idx] - 1) * 100
                        quarterly_returns.append(quarter_ret)
                
                if quarterly_returns:
                    returns["quarterly_mean"] = round(np.mean(quarterly_returns), 2)
                    returns["quarterly_std"] = round(np.std(quarterly_returns), 2)
            
            # Year-to-date return
            current_year_start = prices.index[-1].replace(month=1, day=1)
            ytd_prices = prices[prices.index >= current_year_start]
            if len(ytd_prices) > 1:
                ytd_return = (ytd_prices.iloc[-1] / ytd_prices.iloc[0] - 1) * 100
                returns["ytd"] = round(ytd_return, 2)
            
            # Last full year return
            if len(prices) >= 252:
                last_year_return = (prices.iloc[-1] / prices.iloc[-252] - 1) * 100
                returns["last_year"] = round(last_year_return, 2)
            
            # Yearly returns statistics (last 3 years)
            if len(prices) >= 756:
                yearly_returns = []
                for i in range(3):
                    start_idx = -(i+1) * 252
                    end_idx = -i * 252 if i > 0 else None
                    if abs(start_idx) <= len(prices):
                        year_ret = (prices.iloc[end_idx] / prices.iloc[start_idx] - 1) * 100
                        yearly_returns.append(year_ret)
                
                if yearly_returns:
                    returns["yearly_mean"] = round(np.mean(yearly_returns), 2)
                    returns["yearly_std"] = round(np.std(yearly_returns), 2)
            
            # Volatility (annualized)
            if len(daily_returns) > 0:
                volatility = daily_returns.std() * np.sqrt(252)
                returns["volatility"] = round(volatility, 4)
        
        except Exception as e:
            print(f"⚠️  Error calculating returns: {str(e)}")
        
        return returns
    
    def calculate_moving_averages(self, prices: pd.Series) -> Dict:
        """
        Calculate moving averages and determine trend.
        
        Args:
            prices: Series of closing prices
        
        Returns:
            Dictionary with MA metrics and trend
        """
        ma_data = {}
        
        try:
            ma_short = self.metrics_config["ma_short_days"]
            ma_long = self.metrics_config["ma_long_days"]
            
            current_price = prices.iloc[-1]
            
            # Short-term MA (20-day)
            if len(prices) >= ma_short:
                ma_20 = prices.iloc[-ma_short:].mean()
                ma_data["ma_20"] = round(ma_20, 2)
                ma_data["price_vs_ma_20"] = round((current_price / ma_20 - 1) * 100, 2)
            
            # Long-term MA (50-day)
            if len(prices) >= ma_long:
                ma_50 = prices.iloc[-ma_long:].mean()
                ma_data["ma_50"] = round(ma_50, 2)
                ma_data["price_vs_ma_50"] = round((current_price / ma_50 - 1) * 100, 2)
            
            # Determine trend
            if "ma_20" in ma_data and "ma_50" in ma_data:
                if ma_data["ma_20"] > ma_data["ma_50"] and current_price > ma_data["ma_20"]:
                    ma_data["trend"] = "UP"
                elif ma_data["ma_20"] < ma_data["ma_50"] and current_price < ma_data["ma_20"]:
                    ma_data["trend"] = "DOWN"
                else:
                    ma_data["trend"] = "FLAT"
            
        except Exception as e:
            print(f"⚠️  Error calculating MAs: {str(e)}")
        
        return ma_data
    
    def calculate_proximity_metrics(self, prices: pd.Series, week_52_high: Optional[float], 
                                    week_52_low: Optional[float]) -> Dict:
        """
        Calculate proximity to 52-week high and low.
        
        Args:
            prices: Series of closing prices
            week_52_high: 52-week high from info (fallback)
            week_52_low: 52-week low from info (fallback)
        
        Returns:
            Dictionary with proximity metrics
        """
        proximity = {}
        
        try:
            current_price = prices.iloc[-1]
            
            # Calculate from actual data if available
            if len(prices) >= 252:
                high_52w = prices.iloc[-252:].max()
                low_52w = prices.iloc[-252:].min()
            else:
                high_52w = week_52_high or prices.max()
                low_52w = week_52_low or prices.min()
            
            proximity["52w_high"] = round(high_52w, 2)
            proximity["52w_low"] = round(low_52w, 2)
            proximity["distance_from_high"] = round((current_price / high_52w - 1) * 100, 2)
            proximity["distance_from_low"] = round((current_price / low_52w - 1) * 100, 2)
        
        except Exception as e:
            print(f"⚠️  Error calculating proximity: {str(e)}")
        
        return proximity
    
    def generate_recommendation(self, metrics: Dict) -> Tuple[str, str, float]:
        """
        Generate Buy/Hold/Sell recommendation based on metrics.
        
        Args:
            metrics: Dictionary with all calculated metrics
        
        Returns:
            Tuple of (recommendation, rationale, confidence_score)
        """
        try:
            returns = metrics.get("returns", {})
            ma_data = metrics.get("moving_averages", {})
            proximity = metrics.get("proximity", {})
            
            # Check for insufficient data
            if not returns or not ma_data or not proximity:
                return "HOLD", "Insufficient data for recommendation", 0.0
            
            score = 0
            rationale_parts = []
            
            # 1. Sharpe-like metric (return / volatility)
            if "last_month" in returns and "volatility" in returns:
                volatility = returns["volatility"]
                if volatility > 0:
                    sharpe = returns["last_month"] / (volatility * 100)
                    
                    if sharpe > self.rec_config["sharpe_threshold_buy"]:
                        score += 2
                        rationale_parts.append("Strong risk-adjusted returns")
                    elif sharpe < self.rec_config["sharpe_threshold_sell"]:
                        score -= 2
                        rationale_parts.append("Weak risk-adjusted returns")
            
            # 2. Trend analysis
            trend = ma_data.get("trend")
            if trend == "UP":
                score += 1.5
                rationale_parts.append("Uptrend")
            elif trend == "DOWN":
                score -= 1.5
                rationale_parts.append("Downtrend")
            
            # 3. Recent performance
            if "last_month" in returns:
                if returns["last_month"] > 5:
                    score += 1
                    rationale_parts.append(f"Strong monthly return ({returns['last_month']}%)")
                elif returns["last_month"] < -5:
                    score -= 1
                    rationale_parts.append(f"Weak monthly return ({returns['last_month']}%)")
            
            # 4. Proximity to 52-week levels
            if "distance_from_low" in proximity:
                dist_from_low = proximity["distance_from_low"]
                if dist_from_low < self.rec_config["proximity_to_low_buy_threshold"]:
                    score += 1
                    rationale_parts.append("Near 52-week low")
            
            if "distance_from_high" in proximity:
                dist_from_high = abs(proximity["distance_from_high"])
                if dist_from_high < self.rec_config["proximity_to_high_sell_threshold"]:
                    score -= 1
                    rationale_parts.append("Near 52-week high")
            
            # 5. Volatility check
            if "volatility" in returns:
                if returns["volatility"] > self.rec_config["volatility_high_threshold"]:
                    score -= 0.5
                    rationale_parts.append("High volatility")
            
            # Generate recommendation
            confidence = min(abs(score) / 5.0, 1.0)  # Normalize to 0-1
            
            if score >= 2:
                recommendation = "BUY"
            elif score <= -2:
                recommendation = "SELL"
            else:
                recommendation = "HOLD"
            
            rationale = " | ".join(rationale_parts) if rationale_parts else "Mixed signals"
            
            return recommendation, rationale, round(confidence, 2)
        
        except Exception as e:
            print(f"⚠️  Error generating recommendation: {str(e)}")
            return "HOLD", "Error in analysis", 0.0
    
    def process_ticker(self, ticker: str) -> Optional[Dict]:
        """
        Process a single ticker: fetch data, calculate metrics, generate recommendation.
        
        Args:
            ticker: Stock ticker symbol
        
        Returns:
            Dictionary with all processed data or None if processing fails
        """
        print(f"📊 Processing {ticker}...")
        
        # Fetch historical data
        hist_data = self.fetch_historical_data(ticker)
        if hist_data is None or len(hist_data) < self.metrics_config["min_data_points"]:
            print(f"⚠️  Insufficient data for {ticker}")
            return None
        
        # Fetch fundamental info
        info = self.get_stock_info(ticker)
        
        # Extract prices
        prices = hist_data["Close"]
        current_price = prices.iloc[-1]
        previous_close = prices.iloc[-2] if len(prices) >= 2 else current_price
        volume = hist_data["Volume"].iloc[-1]
        
        # Calculate metrics
        returns = self.calculate_returns(prices)
        ma_data = self.calculate_moving_averages(prices)
        proximity = self.calculate_proximity_metrics(
            prices, 
            info.get("52_week_high"), 
            info.get("52_week_low")
        )
        
        # Combine all metrics
        metrics = {
            "returns": returns,
            "moving_averages": ma_data,
            "proximity": proximity
        }
        
        # Generate recommendation
        recommendation, rationale, confidence = self.generate_recommendation(metrics)
        
        # Prepare summary data
        summary = {
            "ticker": ticker,
            "company_name": info.get("company_name", ticker.split(".")[0]),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "current_price": round(current_price, 2),
            "previous_close": round(previous_close, 2),
            "change": round(current_price - previous_close, 2),
            "change_percent": round((current_price / previous_close - 1) * 100, 2),
            "volume": int(volume),
            "market_cap": info.get("market_cap"),
            "pe_ratio": info.get("pe_ratio"),
            "recommendation": recommendation,
            "rationale": rationale,
            "confidence": confidence,
            "metrics": metrics,
            "last_updated": datetime.now().isoformat()
        }
        
        # Prepare price history for frontend
        price_history = []
        for date, row in hist_data.iterrows():
            price_history.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": round(row["Open"], 2),
                "high": round(row["High"], 2),
                "low": round(row["Low"], 2),
                "close": round(row["Close"], 2),
                "volume": int(row["Volume"])
            })
        
        return {
            "summary": summary,
            "price_history": price_history
        }
    
    def save_data(self, ticker: str, data: Dict):
        """
        Save processed data to JSON files.
        
        Args:
            ticker: Stock ticker symbol
            data: Processed data dictionary
        """
        ticker_name = ticker.split(".")[0]
        
        # Save summary
        summary_path = f"{self.data_dir}/summary/{ticker_name}.json"
        with open(summary_path, "w") as f:
            json.dump(data["summary"], f, indent=2)
        
        # Save price history
        prices_path = f"{self.data_dir}/prices/{ticker_name}.json"
        with open(prices_path, "w") as f:
            json.dump(data["price_history"], f, indent=2)
        
        print(f"✅ Saved data for {ticker}")
    
    def run(self):
        """Main execution method."""
        print("=" * 60)
        print("🚀 Market Data Fetcher Starting...")
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        success_count = 0
        fail_count = 0
        
        for ticker in self.tickers:
            try:
                data = self.process_ticker(ticker)
                if data:
                    self.save_data(ticker, data)
                    success_count += 1
                else:
                    fail_count += 1
            except Exception as e:
                print(f"❌ Failed to process {ticker}: {str(e)}")
                fail_count += 1
        
        print("=" * 60)
        print(f"✅ Successfully processed: {success_count}")
        print(f"❌ Failed: {fail_count}")
        print("=" * 60)


if __name__ == "__main__":
    fetcher = MarketDataFetcher()
    fetcher.run()
