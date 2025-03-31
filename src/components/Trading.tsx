import { createChart } from 'lightweight-charts';
import {
  ArrowDownWideNarrow,
  BarChart2,
  Camera,
  CandlestickChart,
  CircleDot,
  LineChart,
  Maximize,
  RefreshCw,
  Settings,
  Star,
  TrendingDown,
  TrendingUp,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import data from '../data.json';

type MarketData = Record<string, any>;
const marketData = data as MarketData;

export default function Trading() {
  const [selectedCoin, setSelectedCoin] = useState<string>('TON');
  const [selectedTimeframe, setSelectedCoinTimeframe] = useState<string>('5m');
  const [amount, setAmount] = useState("0");
  const [leverage, setLeverage] = useState(10);
  const [selectedChartType, setSelectedChartType] = useState<string>('Candles');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');
  const [showChartMenu, setShowChartMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const ma7SeriesRef = useRef<any>(null);
  const ma25SeriesRef = useRef<any>(null);
  const ma99SeriesRef = useRef<any>(null);
  const [candleData, setCandleData] = useState<any>([]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const container = chartContainerRef.current;
      if (container) {
        container.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const calculateMA = (data: any[], period: number) => {
    const maData = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0);
      maData.push({
        time: data[i].time,
        value: sum / period,
      });
    }
    return maData;
  };

  const fetchData = async () => {
    try {
      const response = await fetch('https://api3.minicorgi.xyz/chart/klines?limit=10000&type=1');
      const result = await response.json();
      const formattedData = result.data.map((candle: any) => ({
        time: Math.floor(Number(candle[0]) / 1000),
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
      }));
      setCandleData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createChartSeries = (chart: any, type: string) => {
    try {
      if (seriesRef.current && chart.series && chart.series.includes(seriesRef.current)) {
        chart.removeSeries(seriesRef.current);
      }

      let series;
      switch (type) {
        case 'Candles':
          series = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            borderVisible: false,
          });
          break;
        case 'Hollow candles':
          series = chart.addCandlestickSeries({
            upColor: 'rgba(38, 166, 154, 0)',
            downColor: 'rgba(239, 83, 80, 0)',
            wickUpColor: '#26a69a',
            wickDownColor: '#ff3b3b',
            borderVisible: true,
            borderUpColor: '#26a69a',
            borderDownColor: '#ff3b3b',
          });
          break;
        case 'Line':
          series = chart.addLineSeries({
            color: '#2962FF',
            lineWidth: 2,
          });
          break;
        case 'Step line':
          series = chart.addLineSeries({
            color: '#2962FF',
            lineWidth: 2,
            lineStyle: 1,
          });
          break;
        case 'Area':
          series = chart.addAreaSeries({
            topColor: 'rgba(41, 98, 255, 0.3)',
            bottomColor: 'rgba(41, 98, 255, 0)',
            lineColor: '#2962FF',
            lineWidth: 2,
          });
          break;
        case 'Baseline':
          series = chart.addBaselineSeries({
            baseValue: { type: 'price', price: 0 },
            topFillColor1: 'rgba(38, 166, 154, 0.28)',
            topFillColor2: 'rgba(38, 166, 154, 0.05)',
            topLineColor: 'rgba(38, 166, 154, 1)',
            bottomFillColor1: 'rgba(239, 83, 80, 0.28)',
            bottomFillColor2: 'rgba(239, 83, 80, 0.05)',
            bottomLineColor: 'rgba(239, 83, 80, 1)',
          });
          break;
        case 'Columns':
          series = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
              type: 'price',
              precision: 2,
              minMove: 0.01,
            },
            base: 0,
            priceScaleId: 'right',
            priceLineVisible: false,
            lastValueVisible: true,
            columnWidth: 0.8,
          });
          break;
        default:
          series = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            borderVisible: false,
          });
      }

      seriesRef.current = series;
      return series;
    } catch (error) {
      console.error('Error creating chart series:', error);
      const defaultSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        borderVisible: false,
      });
      seriesRef.current = defaultSeries;
      return defaultSeries;
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current || !candleData.length) return;

    if (chartRef.current) {
      chartRef.current.remove();
    }

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
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
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
      },
    });

    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width,
          height,
        });
        chartRef.current.timeScale().fitContent();
      }
    });

    resizeObserver.observe(container);

    try {
      const series = createChartSeries(chart, selectedChartType);

      const formattedData = candleData.map((d: any) => {
        if (selectedChartType === 'Line' || selectedChartType === 'Step line') {
          return {
            time: d.time,
            value: d.close,
          };
        } else if (selectedChartType === 'Area' || selectedChartType === 'Baseline') {
          return {
            time: d.time,
            value: d.close,
          };
        } else if (selectedChartType === 'Columns') {
          return {
            time: d.time,
            value: d.close,
            color: d.close >= d.open ? '#26a69a' : '#ff3b3b',
          };
        }
        return d;
      });

      series.setData(formattedData);

      if (selectedChartType === 'Candles') {
        const volumeSeries = chart.addHistogramSeries({
          color: '#26a69a',
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: '',
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        });

        const volumeData = candleData.map((d: any) => ({
          time: d.time,
          value: d.volume,
          color: d.close >= d.open ? '#26a69a' : '#ef5350',
        }));
        volumeSeries.setData(volumeData);
      }

      if (selectedChartType === 'Candles') {
        const ma7Series = chart.addLineSeries({
          color: '#F7CA4D',
          lineWidth: 2,
          title: 'MA7',
        });

        const ma25Series = chart.addLineSeries({
          color: '#E065BC',
          lineWidth: 2,
          title: 'MA25',
        });

        const ma99Series = chart.addLineSeries({
          color: '#8E5BE8',
          lineWidth: 2,
          title: 'MA99',
        });

        ma7SeriesRef.current = ma7Series;
        ma25SeriesRef.current = ma25Series;
        ma99SeriesRef.current = ma99Series;

        const ma7Data = calculateMA(candleData, 7);
        const ma25Data = calculateMA(candleData, 25);
        const ma99Data = calculateMA(candleData, 99);

        ma7Series.setData(ma7Data);
        ma25Series.setData(ma25Data);
        ma99Series.setData(ma99Data);
      }

      const visibleLogicalRange = {
        from: Math.max(0, candleData.length - 50),
        to: candleData.length,
      };
      chart.timeScale().setVisibleLogicalRange(visibleLogicalRange);
    } catch (error) {
      console.error('Error setting up chart:', error);
    }

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [candleData, selectedChartType, isFullscreen]);

  useEffect(() => {
    if (seriesRef.current && chartRef.current && ma7SeriesRef.current && ma25SeriesRef.current && ma99SeriesRef.current) {
      seriesRef.current.setData(candleData);

      const ma7Data = calculateMA(candleData, 7);
      const ma25Data = calculateMA(candleData, 25);
      const ma99Data = calculateMA(candleData, 99);

      ma7SeriesRef.current.setData(ma7Data);
      ma25SeriesRef.current.setData(ma25Data);
      ma99SeriesRef.current.setData(ma99Data);

      const visibleLogicalRange = {
        from: Math.max(0, candleData.length - 100),
        to: candleData.length,
      };
      chartRef.current.timeScale().setVisibleLogicalRange(visibleLogicalRange);
    }
  }, [selectedCoin, selectedTimeframe]);

  const handleTimeframeSelect = (timeframe: string) => {
    setSelectedCoinTimeframe(timeframe);
  };

  const handleCoinSelect = (coin: string) => {
    setSelectedCoin(coin);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="flex flex-1 overflow-hidden relative">
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-800 flex flex-col bg-[#0e1217] transform transition-transform duration-300 md:static md:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
        >
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
            {['NOT', 'TON', 'TRUMP', 'BTC', 'CATI'].map((coin) => (
              <div
                key={coin}
                className={`flex items-center p-3 hover:bg-[#1e2329] border-l-4 ${selectedCoin === coin ? 'border-blue-500 bg-[#1e2329]' : 'border-transparent'
                  }`}
                onClick={() => handleCoinSelect(coin)}
                style={{ cursor: 'pointer' }}
              >
                <div className="mr-3">
                  {coin === 'BTC' ? (
                    <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center text-white font-bold">
                      ₿
                    </div>
                  ) : coin === 'TON' ? (
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
                  ) : (
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
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-bold">{coin}</span>
                    <span className="ml-1 text-gray-400">USD</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span>{marketData[coin]?.name || coin}</span>
                    <span className="ml-2 px-1 text-xs bg-gray-700 rounded">
                      x{coin === 'BTC' ? '125' : coin === 'TON' ? '75' : '50'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div>
                    {marketData[coin]?.timeframes[selectedTimeframe]?.length > 0
                      ? marketData[coin].timeframes[selectedTimeframe][
                        marketData[coin].timeframes[selectedTimeframe].length - 1
                      ].close.toFixed(coin === 'BTC' ? 1 : 5)
                      : 'N/A'}
                  </div>
                  <div
                    className={`text-sm ${coin === 'BTC' || coin === 'TRUMP' ? 'text-green-500' : 'text-red-500'
                      }`}
                  >
                    {coin === 'BTC' ? '+0.24%' : coin === 'TRUMP' ? '+0.04%' : '-2.89%'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="md:hidden fixed top-16 right-4 z-50 p-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <ArrowDownWideNarrow className="w-6 h-6 bg-transparent" />}
        </button>

        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Main trading area */}
          <div className="flex-1 flex flex-col h-full">
            {/* Chart header */}
            <div className={`flex items-center justify-between p-4 border-b border-gray-800 ${isFullscreen ? 'hidden' : ''}`}>
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
                <div className="hidden lg:grid grid-cols-4 gap-4 text-sm">
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
            </div>

            {/* Chart area */}
            <div className="flex-1 p-4">
              <div className={`flex items-center justify-between mb-4 ${isFullscreen ? 'hidden' : ''}`}>
                <div className="flex items-center space-x-2">
                  <div className="flex rounded-md overflow-hidden">
                    {['1m', '5m', '15m', '1h', '1d'].map((timeframe) => (
                      <button
                        key={timeframe}
                        className={`px-3 py-1 ${selectedTimeframe === timeframe ? 'bg-blue-500' : 'bg-[#1e2329]'}`}
                        onClick={() => handleTimeframeSelect(timeframe)}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className={`px-3 py-1 rounded flex items-center space-x-1 ${selectedChartType === 'Line' ? 'bg-blue-500' : 'bg-[#1e2329]'}`}
                      onClick={() => setSelectedChartType('Line')}
                    >
                      <LineChart className="w-4 h-4" />
                      <span>Line</span>
                    </button>
                    <button
                      className={`px-3 py-1 rounded flex items-center space-x-1 ${selectedChartType === 'Candles' ? 'bg-blue-500' : 'bg-[#1e2329]'}`}
                      onClick={() => setSelectedChartType('Candles')}
                    >
                      <CandlestickChart className="w-4 h-4" />
                      <span>Candles</span>
                    </button>
                    <button
                      className={`px-3 py-1 rounded flex items-center space-x-1 ${selectedChartType === 'Hollow candles' ? 'bg-blue-500' : 'bg-[#1e2329]'}`}
                      onClick={() => setSelectedChartType('Hollow candles')}
                    >
                      <CircleDot className="w-4 h-4" />
                      <span>Hollow</span>
                    </button>
                    <div className="relative">
                      <button
                        className="p-2 hover:bg-[#1e2329] rounded-md flex items-center"
                        onClick={() => setShowChartMenu(!showChartMenu)}
                      >
                        <BarChart2 className="w-4 h-4 mr-1" />
                        <span className="text-sm">More</span>
                      </button>

                      {showChartMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-[#1e2329] border border-gray-800 rounded-md shadow-lg z-50">
                          {['Step line', 'Area', 'Baseline', 'Columns'].map((type) => (
                            <button
                              key={type}
                              className={`w-full px-4 py-2 text-left hover:bg-[#2b3139] ${selectedChartType === type ? 'bg-[#2b3139]' : ''}`}
                              onClick={() => {
                                setSelectedChartType(type);
                                setShowChartMenu(false);
                              }}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-[#1e2329] rounded-md">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2 ml-auto">
                  <button className="p-2 hover:bg-[#1e2329] rounded-md">
                    <BarChart2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-[#1e2329] rounded-md">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 hover:bg-[#1e2329] rounded-md"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                      </svg>
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-[#1e2329] rounded-md">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div
                ref={chartContainerRef}
                className={` bg-[#1e2329] rounded-lg ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-300px)]'}`}
              ></div>
            </div>
          </div>

          <div className={`hidden lg:block w-[280px] border-l border-gray-800 transition-opacity duration-200 ${isFullscreen ? 'hidden' : ''}`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  className={`flex-1 py-2 rounded-l-md transition-colors flex items-center justify-center gap-2 ${tradeType === 'long' ? 'bg-green-500 text-white' : 'bg-[#1e2329] text-gray-400'
                    }`}
                  onClick={() => setTradeType('long')}
                >
                  <TrendingUp className={`w-4 h-4 ${tradeType === 'short' ? 'text-green-500' : ''}`} />
                  <span>Long</span>
                </button>
                <button
                  className={`flex-1 py-2 rounded-r-md transition-colors flex items-center justify-center gap-2 ${tradeType === 'short' ? 'bg-red-500 text-white' : 'bg-[#1e2329] text-gray-400'
                    }`}
                  onClick={() => setTradeType('short')}
                >
                  <TrendingDown className={`w-4 h-4 ${tradeType === 'long' ? 'text-red-500' : ''}`} />
                  <span>Short</span>
                </button>
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

      </div>
      <div className="md:hidden flex items-center justify-between px-4">
        <button
          className={`flex-1 py-2 rounded-l-md transition-colors flex items-center justify-center gap-2 ${tradeType === 'long' ? 'bg-green-500 text-white' : 'bg-[#1e2329] text-gray-400'
            }`}
          onClick={() => setTradeType('long')}
        >
          <TrendingUp className={`w-4 h-4 ${tradeType === 'short' ? 'text-green-500' : ''}`} />
          <span>Long</span>
        </button>
        <button
          className={`flex-1 py-2 rounded-r-md transition-colors flex items-center justify-center gap-2 ${tradeType === 'short' ? 'bg-red-500 text-white' : 'bg-[#1e2329] text-gray-400'
            }`}
          onClick={() => setTradeType('short')}
        >
          <TrendingDown className={`w-4 h-4 ${tradeType === 'long' ? 'text-red-500' : ''}`} />
          <span>Short</span>
        </button>
      </div>
    </>

  );
}