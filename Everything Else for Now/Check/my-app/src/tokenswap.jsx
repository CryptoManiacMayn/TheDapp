import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDownUp, Plus, Minus, Wallet, Settings, ChevronDown, TrendingUp, DollarSign, Layers, Shuffle } from 'lucide-react';

const TokenSwapDApp = () => {
  const [activeTab, setActiveTab] = useState('swap');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [liquidityTokenA, setLiquidityTokenA] = useState('ETH');
  const [liquidityTokenB, setLiquidityTokenB] = useState('USDC');
  const [liquidityAmountA, setLiquidityAmountA] = useState('');
  const [liquidityAmountB, setLiquidityAmountB] = useState('');
  const [bridgeFromChain, setBridgeFromChain] = useState('Ethereum');
  const [bridgeToChain, setBridgeToChain] = useState('Polygon');
  const [bridgeToken, setBridgeToken] = useState('USDC');
  const [bridgeAmount, setBridgeAmount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [slippage, setSlippage] = useState('0.5');

  const tokens = ['ETH', 'USDC', 'USDT', 'DAI', 'WBTC', 'UNI', 'LINK', 'AAVE'];
  const chains = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'];

  const priceData = [
    { time: '00:00', price: 2420 },
    { time: '04:00', price: 2435 },
    { time: '08:00', price: 2458 },
    { time: '12:00', price: 2441 },
    { time: '16:00', price: 2467 },
    { time: '20:00', price: 2478 },
    { time: '24:00', price: 2485 }
  ];

  const exchangeRates = {
    'ETH-USDC': 2485.32,
    'ETH-USDT': 2483.45,
    'ETH-DAI': 2486.78,
    'USDC-USDT': 0.9998,
    'USDC-DAI': 1.0002
  };

  const getExchangeRate = (from, to) => {
    if (from === to) return 1;
    const key = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;
    return exchangeRates[key] || (1 / (exchangeRates[reverseKey] || 1));
  };

  useEffect(() => {
    if (fromAmount && fromToken !== toToken) {
      const rate = getExchangeRate(fromToken, toToken);
      setToAmount((parseFloat(fromAmount) * rate).toFixed(6));
    }
  }, [fromAmount, fromToken, toToken]);

  useEffect(() => {
    if (liquidityAmountA && liquidityTokenA !== liquidityTokenB) {
      const rate = getExchangeRate(liquidityTokenA, liquidityTokenB);
      setLiquidityAmountB((parseFloat(liquidityAmountA) * rate).toFixed(6));
    }
  }, [liquidityAmountA, liquidityTokenA, liquidityTokenB]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const TokenSelect = ({ value, onChange, label }) => (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
      >
        {tokens.map(token => (
          <option key={token} value={token}>{token}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-8 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );

  const ChainSelect = ({ value, onChange, label }) => (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
      >
        {chains.map(chain => (
          <option key={chain} value={chain}>{chain}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-8 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ArrowDownUp className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SwapDEX</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button 
              onClick={() => setIsConnected(!isConnected)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                isConnected 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Wallet className="h-4 w-4" />
              <span>{isConnected ? 'Connected' : 'Connect Wallet'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Trading Interface */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
<div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
  {[
    { id: 'swap', label: 'Swap', icon: ArrowDownUp },
    { id: 'liquidity', label: 'Liquidity', icon: Layers },
    { id: 'bridge', label: 'Bridge', icon: Shuffle }
  ].map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors flex-1 justify-center ${
        activeTab === tab.id
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {/* ✅ Correct: render icon component, not the raw object */}
      <tab.icon className="h-4 w-4" />
      <span>{tab.label}</span>
    </button>
  ))}
</div>


            </div>

            {/* Swap Interface */}
            {activeTab === 'swap' && (
              <div className="bg-white rounded-xl shadow-lg p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Swap Tokens</h2>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Slippage: {slippage}%</span>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={slippage}
                      onChange={(e) => setSlippage(e.target.value)}
                      className="w-12 h-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-600">From</span>
                      <span className="text-xs text-gray-500">Balance: 2.45 {fromToken}</span>
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 text-xl font-semibold bg-transparent border-none outline-none"
                      />
                      <TokenSelect value={fromToken} onChange={setFromToken} label="" />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleSwapTokens}
                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                    >
                      <ArrowDownUp className="h-4 w-4 text-blue-600" />
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-600">To</span>
                      <span className="text-xs text-gray-500">Balance: 1,250.32 {toToken}</span>
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        value={toAmount}
                        onChange={(e) => setToAmount(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 text-xl font-semibold bg-transparent border-none outline-none"
                        readOnly
                      />
                      <TokenSelect value={toToken} onChange={setToToken} label="" />
                    </div>
                  </div>
                </div>

                {fromAmount && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Exchange Rate</span>
                      <span>1 {fromToken} = {getExchangeRate(fromToken, toToken).toFixed(4)} {toToken}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Price Impact</span>
                      <span className="text-green-600">0.12%</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Fee</span>
                      <span>0.3%</span>
                    </div>
                  </div>
                )}

                <button
                  disabled={!isConnected || !fromAmount}
                  className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {!isConnected ? 'Connect Wallet' : !fromAmount ? 'Enter Amount' : 'Swap Tokens'}
                </button>
              </div>
            )}

            {/* Liquidity Interface */}
            {activeTab === 'liquidity' && (
              <div className="bg-white rounded-xl shadow-lg p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Liquidity</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-600">Token A</span>
                      <span className="text-xs text-gray-500">Balance: 2.45 {liquidityTokenA}</span>
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        value={liquidityAmountA}
                        onChange={(e) => setLiquidityAmountA(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 text-lg font-semibold bg-transparent border-none outline-none"
                      />
                      <TokenSelect value={liquidityTokenA} onChange={setLiquidityTokenA} label="" />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Plus className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-600">Token B</span>
                      <span className="text-xs text-gray-500">Balance: 1,250.32 {liquidityTokenB}</span>
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        value={liquidityAmountB}
                        onChange={(e) => setLiquidityAmountB(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 text-lg font-semibold bg-transparent border-none outline-none"
                      />
                      <TokenSelect value={liquidityTokenB} onChange={setLiquidityTokenB} label="" />
                    </div>
                  </div>
                </div>

                {liquidityAmountA && liquidityAmountB && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Pool Share</span>
                      <span>0.0234%</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>LP Tokens</span>
                      <span>12.45 {liquidityTokenA}-{liquidityTokenB}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>APY</span>
                      <span className="text-green-600">24.5%</span>
                    </div>
                  </div>
                )}

                <button
                  disabled={!isConnected || !liquidityAmountA || !liquidityAmountB}
                  className="w-full mt-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {!isConnected ? 'Connect Wallet' : 'Add Liquidity'}
                </button>

                <div className="mt-6 border-t pt-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Your Liquidity Positions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">ETH-USDC</span>
                        <p className="text-xs text-gray-500">Pool Share: 0.12%</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">$1,245.67</span>
                        <p className="text-xs text-green-600">+2.34% (24h)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bridge Interface */}
            {activeTab === 'bridge' && (
              <div className="bg-white rounded-xl shadow-lg p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cross-Chain Bridge</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <ChainSelect value={bridgeFromChain} onChange={setBridgeFromChain} label="From Chain" />
                    <ChainSelect value={bridgeToChain} onChange={setBridgeToChain} label="To Chain" />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-600">Amount to Bridge</span>
                      <span className="text-xs text-gray-500">Balance: 1,250.32 {bridgeToken}</span>
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        value={bridgeAmount}
                        onChange={(e) => setBridgeAmount(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 text-lg font-semibold bg-transparent border-none outline-none"
                      />
                      <TokenSelect value={bridgeToken} onChange={setBridgeToken} label="" />
                    </div>
                  </div>
                </div>

                {bridgeAmount && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Bridge Fee</span>
                      <span>0.1% + $2.50</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Estimated Time</span>
                      <span>5-10 minutes</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>You'll Receive</span>
                      <span>{(parseFloat(bridgeAmount) * 0.999).toFixed(4)} {bridgeToken}</span>
                    </div>
                  </div>
                )}

                <button
                  disabled={!isConnected || !bridgeAmount}
                  className="w-full mt-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {!isConnected ? 'Connect Wallet' : 'Bridge Tokens'}
                </button>

                <div className="mt-6 border-t pt-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Recent Transactions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">500 USDC</span>
                        <p className="text-xs text-gray-500">Ethereum → Polygon</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-green-600">Completed</span>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Chart */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-gray-900">ETH/USD</h3>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+2.34%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$2,485.32</div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        fontSize: '12px', 
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Market Stats */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Market Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">24h Volume</span>
                  <span className="text-sm font-medium">$45.2M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Liquidity</span>
                  <span className="text-sm font-medium">$892.4M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Pairs</span>
                  <span className="text-sm font-medium">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fees (24h)</span>
                  <span className="text-sm font-medium text-green-600">$135.6K</span>
                </div>
              </div>
            </div>

            {/* Top Pools */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Top Pools</h3>
              <div className="space-y-2">
                {[
                  { pair: 'ETH/USDC', apy: '24.5%', tvl: '$45.2M' },
                  { pair: 'USDC/USDT', apy: '18.3%', tvl: '$32.1M' },
                  { pair: 'ETH/DAI', apy: '22.1%', tvl: '$28.9M' }
                ].map((pool, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <span className="text-sm font-medium">{pool.pair}</span>
                      <p className="text-xs text-gray-500">TVL: {pool.tvl}</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">{pool.apy}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default TokenSwapDApp;