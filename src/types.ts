export type CoinType = 'NOT' | 'TON' | 'BTC' | 'ETH'
export type TimeframeType = '1m' | '5m' | '15m' | '1h' | '1d'

export interface CandleData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface TimeframeData {
  '1m': CandleData[]
  '5m': CandleData[]
  '15m': CandleData[]
  '1h': CandleData[]
  '1d': CandleData[]
}

export interface CoinData {
  name: string
  timeframes: TimeframeData
}

export interface MarketData {
  [key: string]: CoinData
} 