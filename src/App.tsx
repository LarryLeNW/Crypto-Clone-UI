"use client"

import "./index.css"
import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Trading from "./components/Trading"
import Earn from "./pages/Earn"
import Tournaments from "./pages/Tournaments"
import data from './data.json'
import Layout from "./Layout/Public"

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

export default function App() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeType>('5m')
  const [selectedCoin, setSelectedCoin] = useState<CoinType>('TON')

  const handleCoinSelect = (coin: CoinType) => {
    setSelectedCoin(coin)
  }

  const handleTimeframeSelect = (timeframe: TimeframeType) => {
    setSelectedTimeframe(timeframe)
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/" replace />} />
          <Route 
            path="/" 
            index
            element={
              <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar */}
                <div className="w-64 border-r border-gray-800 flex flex-col">
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center mb-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M16 8H8V10H16V8Z" fill="currentColor" />
                        <path d="M16 12H8V14H16V12Z" fill="currentColor" />
                        <path d="M12 16H8V18H12V16Z" fill="currentColor" />
                      </svg>
                      <span className="ml-2 text-sm font-medium">Portfolio</span>
                    </div>
                    <div className="text-xl font-bold">0 USDT</div>
                    <div className="text-sm text-gray-400">0 (0%)</div>
                  </div>

                  <div className="p-3">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full bg-[#1e2329] border border-gray-700 rounded-md pl-8 py-2 text-sm"
                        placeholder="Token name or ticker"
                      />
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-2 top-2.5 text-gray-400"
                      >
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex space-x-2 px-3 py-2 overflow-x-auto text-sm">
                    <button className="px-2 py-1 rounded-md bg-[#1e2329]">All</button>
                    <button className="px-2 py-1 rounded-md flex items-center">
                      <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                      Hot
                    </button>
                    <button className="px-2 py-1 rounded-md flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      New
                    </button>
                    <button className="px-2 py-1 rounded-md">Crypto</button>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center">
                      <span className="text-sm">Margin: All</span>
                    </div>
                    <button className="p-1 rounded hover:bg-[#1e2329]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9H21M3 15H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Crypto list */}
                  <div className="flex-1 overflow-y-auto">
                    {/* NOT/USD */}
                    <div 
                      className={`flex items-center p-3 hover:bg-[#1e2329] border-l-4 ${selectedCoin === 'NOT' ? 'border-blue-500 bg-[#1e2329]' : 'border-transparent'}`}
                      onClick={() => handleCoinSelect('NOT')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="mr-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            fill="#333"
                            stroke="#666"
                            strokeWidth="2"
                          />
                          <path
                            d="M8 12L12 8M12 8L16 12M12 8V16"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-bold">NOT</span>
                          <span className="ml-1 text-gray-400">USD</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span>{marketData.NOT.name}</span>
                          <span className="ml-2 px-1 text-xs bg-gray-700 rounded">x50</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{marketData.NOT.timeframes[selectedTimeframe]?.length > 0 ? marketData.NOT.timeframes[selectedTimeframe][marketData.NOT.timeframes[selectedTimeframe].length - 1].close.toFixed(6) : 'N/A'}</div>
                        <div className="text-red-500 text-sm">-3.03 %</div>
                      </div>
                    </div>

                    {/* TON/USD */}
                    <div 
                      className={`flex items-center p-3 hover:bg-[#1e2329] border-l-4 ${selectedCoin === 'TON' ? 'border-blue-500 bg-[#1e2329]' : 'border-transparent'}`}
                      onClick={() => handleCoinSelect('TON')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="mr-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" fill="#0088CC" />
                          <path
                            d="M8 12L12 8M12 8L16 12M12 8V16"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-bold">TON</span>
                          <span className="ml-1 text-gray-400">USD</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span>{marketData.TON.name}</span>
                          <span className="ml-2 px-1 text-xs bg-gray-700 rounded">x75</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{marketData.TON.timeframes[selectedTimeframe]?.length > 0 ? marketData.TON.timeframes[selectedTimeframe][marketData.TON.timeframes[selectedTimeframe].length - 1].close.toFixed(5) : 'N/A'}</div>
                        <div className="text-red-500 text-sm">-2.89 %</div>
                      </div>
                    </div>

                    {/* BTC/USD */}
                    <div 
                      className={`flex items-center p-3 hover:bg-[#1e2329] border-l-4 ${selectedCoin === 'BTC' ? 'border-blue-500 bg-[#1e2329]' : 'border-transparent'}`}
                      onClick={() => handleCoinSelect('BTC')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="mr-3">
                        <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center text-white font-bold">₿</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-bold">BTC</span>
                          <span className="ml-1 text-gray-400">USD</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span>{marketData.BTC.name}</span>
                          <span className="ml-2 px-1 text-xs bg-gray-700 rounded">x100</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{marketData.BTC.timeframes[selectedTimeframe]?.length > 0 ? marketData.BTC.timeframes[selectedTimeframe][marketData.BTC.timeframes[selectedTimeframe].length - 1].close.toFixed(1) : 'N/A'}</div>
                        <div className="text-green-500 text-sm">+1.45 %</div>
                      </div>
                    </div>

                    {/* ETH/USD */}
                    <div 
                      className={`flex items-center p-3 hover:bg-[#1e2329] border-l-4 ${selectedCoin === 'ETH' ? 'border-blue-500 bg-[#1e2329]' : 'border-transparent'}`}
                      onClick={() => handleCoinSelect('ETH')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="mr-3">
                        <div className="w-6 h-6 rounded-full bg-[#627EEA] flex items-center justify-center text-white">Ξ</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-bold">ETH</span>
                          <span className="ml-1 text-gray-400">USD</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span>{marketData.ETH.name}</span>
                          <span className="ml-2 px-1 text-xs bg-gray-700 rounded">x50</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{marketData.ETH.timeframes[selectedTimeframe]?.length > 0 ? marketData.ETH.timeframes[selectedTimeframe][marketData.ETH.timeframes[selectedTimeframe].length - 1].close.toFixed(1) : 'N/A'}</div>
                        <div className="text-green-500 text-sm">+2.15 %</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trading component */}
                <Trading 
                  selectedCoin={selectedCoin}
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeSelect={handleTimeframeSelect}
                />
              </div>
            } 
          />
          <Route path="/earn" element={<Earn />} />
          <Route path="/tournaments" element={<Tournaments />} />
        </Routes>
      </Layout>
    </Router>
  )
}

