/**
 * Stock market data types and interfaces
 */

export interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ReturnMetrics {
  last_month?: number;
  monthly_mean?: number;
  monthly_std?: number;
  last_quarter?: number;
  quarterly_mean?: number;
  quarterly_std?: number;
  ytd?: number;
  last_year?: number;
  yearly_mean?: number;
  yearly_std?: number;
  volatility?: number;
}

export interface MovingAverageMetrics {
  ma_20?: number;
  price_vs_ma_20?: number;
  ma_50?: number;
  price_vs_ma_50?: number;
  trend?: 'UP' | 'DOWN' | 'FLAT';
}

export interface ProximityMetrics {
  '52w_high'?: number;
  '52w_low'?: number;
  distance_from_high?: number;
  distance_from_low?: number;
}

export interface StockMetrics {
  returns: ReturnMetrics;
  moving_averages: MovingAverageMetrics;
  proximity: ProximityMetrics;
}

export type Recommendation = 'BUY' | 'HOLD' | 'SELL';

export interface StockSummary {
  ticker: string;
  company_name: string;
  sector?: string;
  industry?: string;
  current_price: number;
  previous_close: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap?: number;
  pe_ratio?: number;
  recommendation: Recommendation;
  rationale: string;
  confidence: number;
  metrics: StockMetrics;
  last_updated: string;
}

export interface PortfolioHolding {
  ticker: string;
  company_name: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  total_cost: number;
  current_value: number;
  unrealized_pl: number;
  unrealized_pl_percent: number;
  recommendation?: Recommendation;
}

export interface Portfolio {
  holdings: PortfolioHolding[];
  total_invested: number;
  current_value: number;
  total_pl: number;
  total_pl_percent: number;
}

export type TimeFrame = '1M' | '3M' | '6M' | '1Y' | 'MAX';

export interface ChartData {
  date: string;
  price: number;
  volume?: number;
}
