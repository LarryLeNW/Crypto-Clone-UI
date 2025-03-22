import { useState, useEffect, useRef } from "react"
import {
  ChevronDown,
  Star,
  ChevronRight,
  BarChart2,
  Settings,
  Maximize,
  Camera,
  RefreshCw,
  ArrowLeft,
  Info,
  Lock,
  Minus,
  Plus,
} from "lucide-react"
import { createChart, Time } from 'lightweight-charts'
import data from '../data.json'

type CoinType = 'TON' | 'BTC' | 'ETH' | 'NOT'
type TimeframeType = '1m' | '5m' | '15m' | '1h' | '1d'

interface CandleData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

interface TimeframeData {
  '1m': CandleData[]
  '5m': CandleData[]
  '15m': CandleData[]
  '1h': CandleData[]
  '1d': CandleData[]
}

interface CoinData {
  name: string
  symbol: string
  timeframes: TimeframeData
}

type MarketData = Record<CoinType, CoinData>

const marketData = data as MarketData

const formatTimeToUTC = (timeStr: string): Time => {
  if (timeStr.includes('-')) {
    if (timeStr.includes(' ')) {
      const date = new Date(timeStr.replace(' ', 'T'));
      return Math.floor(date.getTime() / 1000) as Time;
    } else {
      return timeStr as Time;
    }
  }
  return timeStr as Time;
};

interface TradingProps {
  selectedCoin: CoinType;
  selectedTimeframe: TimeframeType;
  onTimeframeSelect: (timeframe: TimeframeType) => void;
}

export default function Trading({ selectedCoin, selectedTimeframe, onTimeframeSelect }: TradingProps) {
  const [amount, setAmount] = useState("0")
  const [leverage, setLeverage] = useState(10)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const candleSeriesRef = useRef<any>(null)

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: '#1e2329' },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        crosshair: {
          mode: 1,
          vertLine: {
            width: 1,
            color: '#2B2B43',
            style: 0,
          },
          horzLine: {
            width: 1,
            color: '#2B2B43',
            style: 0,
          },
        },
        timeScale: {
          borderColor: '#2B2B43',
        },
        rightPriceScale: {
          borderColor: '#2B2B43',
        },
      })

      chartRef.current = chart

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        borderVisible: false,
        priceFormat: {
          type: 'price',
          precision: 6,
          minMove: 0.000001,
        },
      })

      candleSeriesRef.current = candlestickSeries

      const formattedData = marketData[selectedCoin].timeframes[selectedTimeframe].map(candle => ({
        ...candle,
        time: formatTimeToUTC(candle.time)
      }));

      candlestickSeries.setData(formattedData)

      const initialVisibleLogicalRange = {
        from: Math.max(0, formattedData.length - 100),
        to: formattedData.length
      };
      chart.timeScale().setVisibleLogicalRange(initialVisibleLogicalRange);

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          })
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        chart.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (candleSeriesRef.current && chartRef.current) {
      const timeframeData = marketData[selectedCoin]?.timeframes[selectedTimeframe];
      if (!timeframeData) {
        console.warn(`Không có dữ liệu cho ${selectedCoin} ở timeframe ${selectedTimeframe}`);
        return;
      }

      const formattedData = timeframeData.map(candle => ({
        ...candle,
        time: formatTimeToUTC(candle.time)
      }));

      candleSeriesRef.current.setData(formattedData);
      
      const visibleLogicalRange = {
        from: Math.max(0, formattedData.length - 100),
        to: formattedData.length
      };
      chartRef.current.timeScale().setVisibleLogicalRange(visibleLogicalRange);
    }
  }, [selectedCoin, selectedTimeframe])

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main trading area */}
      <div className="flex-1 flex flex-col">
        {/* Chart header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#0088CC] flex items-center justify-center mr-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 12L12 8M12 8L16 12M12 8V16"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-bold text-lg">{selectedCoin}</span>
                  <Star className="w-4 h-4 ml-2 text-gray-400" />
                </div>
                <div className="text-sm text-gray-400">Toncoin</div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">3.63370</span>
              <span className="text-sm text-red-500">-0.10650 (-2.89%)</span>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">24h High</div>
                <div>3.77000</div>
              </div>
              <div>
                <div className="text-gray-400">24h Low</div>
                <div>3.61200</div>
              </div>
              <div>
                <div className="text-gray-400">24h Volume(TON)</div>
                <div>1.77M</div>
              </div>
              <div>
                <div className="text-gray-400">24h Volume(USD)</div>
                <div>6.43M</div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-[#1e2329] rounded-md">
              <BarChart2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[#1e2329] rounded-md">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[#1e2329] rounded-md">
              <Maximize className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[#1e2329] rounded-md">
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chart area */}
        <div className="flex-1 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex rounded-md overflow-hidden">
              <button 
                className={`px-3 py-1 ${selectedTimeframe === "1m" ? "bg-blue-500" : "bg-[#1e2329]"}`} 
                onClick={() => onTimeframeSelect("1m")}
              >
                1m
              </button>
              <button 
                className={`px-3 py-1 ${selectedTimeframe === "5m" ? "bg-blue-500" : "bg-[#1e2329]"}`} 
                onClick={() => onTimeframeSelect("5m")}
              >
                5m
              </button>
              <button 
                className={`px-3 py-1 ${selectedTimeframe === "15m" ? "bg-blue-500" : "bg-[#1e2329]"}`} 
                onClick={() => onTimeframeSelect("15m")}
              >
                15m
              </button>
              <button 
                className={`px-3 py-1 ${selectedTimeframe === "1h" ? "bg-blue-500" : "bg-[#1e2329]"}`} 
                onClick={() => onTimeframeSelect("1h")}
              >
                1h
              </button>
              <button 
                className={`px-3 py-1 ${selectedTimeframe === "1d" ? "bg-blue-500" : "bg-[#1e2329]"}`} 
                onClick={() => onTimeframeSelect("1d")}
              >
                1d
              </button>
            </div>
            <button className="p-2 hover:bg-[#1e2329] rounded-md">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div ref={chartContainerRef} className="bg-[#1e2329] rounded-lg h-[calc(100%-2rem)]"></div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-80 border-l border-gray-800">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button className="flex-1 py-2 bg-green-500 text-white rounded-l-md">Long</button>
            <button className="flex-1 py-2 bg-[#1e2329] text-white rounded-r-md">Short</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-sm mb-2">
                <span>Amount (USDT)</span>
                <span className="text-gray-400">Available: 0 USDT</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#1e2329] border border-gray-700 rounded-md px-3 py-2 pr-16"
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                  <button className="px-1 py-0.5 text-xs bg-[#2b3139] rounded">Max</button>
                </div>
              </div>
            </div>
            <div>
              <label className="flex items-center justify-between text-sm mb-2">
                <span>Leverage</span>
                <span>{leverage}x</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1x</span>
                <span>100x</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-between bg-[#1e2329] p-2 rounded-md">
                <span className="text-gray-400">Entry Price</span>
                <span>3.63370</span>
              </div>
              <div className="flex items-center justify-between bg-[#1e2329] p-2 rounded-md">
                <span className="text-gray-400">Margin</span>
                <span>0 USDT</span>
              </div>
            </div>
            <button className="w-full py-3 bg-gray-700 text-gray-400 rounded-md" disabled>
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 