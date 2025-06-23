// ==========================================
// POOL DETAILS PAGE JAVASCRIPT - INTEGRATED WITH SHELL
// ==========================================

// Pool details state
let poolDetailsState = {
  currentPool: null,
  priceChart: null,
  volumeChart: null,
  compositionChart: null,
  currentPeriod: '24h',
  currentVolumePeriod: '24h',
  isWalletConnected: false
};

// Mock pool data (expanded from accelerate.js)
const poolsDatabase = {
  'eth-usdc': {
    id: 'eth-usdc',
    name: 'ETH/USDC',
    type: 'weighted',
    composition: 'Weighted 80/20',
    tokens: ['ETH', 'USDC'],
    weights: [80, 20],
    address: '0x1234567890123456789012345678901234567890',
    tvl: 8250000,
    apr: 28.5,
    tradingFees: 12.1,
    incentives: 16.4,
    volume24h: 1200000,
    swapFee: 0.3,
    totalSwaps: 12450,
    uniqueLPs: 245,
    poolAge: 127,
    utilization: 85.2,
    balances: {
      'ETH': { amount: 2640, value: 6600000, price: 2500 },
      'USDC': { amount: 1650000, value: 1650000, price: 1 }
    }
  },
  'usdc-usdt': {
    id: 'usdc-usdt',
    name: 'USDC/USDT',
    type: 'stable',
    composition: 'Stable Pool',
    tokens: ['USDC', 'USDT'],
    weights: [50, 50],
    address: '0x5678901234567890123456789012345678901234',
    tvl: 12800000,
    apr: 8.2,
    tradingFees: 3.1,
    incentives: 5.1,
    volume24h: 2800000,
    swapFee: 0.05,
    totalSwaps: 45230,
    uniqueLPs: 892,
    poolAge: 89,
    utilization: 92.5,
    balances: {
      'USDC': { amount: 6400000, value: 6400000, price: 1 },
      'USDT': { amount: 6400000, value: 6400000, price: 1 }
    }
  },
  'wbtc-eth': {
    id: 'wbtc-eth',
    name: 'WBTC/ETH',
    type: 'weighted',
    composition: 'Weighted 50/50',
    tokens: ['BTC', 'ETH'],
    weights: [50, 50],
    address: '0x9012345678901234567890123456789012345678',
    tvl: 6450000,
    apr: 32.1,
    tradingFees: 15.2,
    incentives: 16.9,
    volume24h: 890000,
    swapFee: 0.25,
    totalSwaps: 8945,
    uniqueLPs: 156,
    poolAge: 203,
    utilization: 78.9,
    balances: {
      'BTC': { amount: 73.7, value: 3225000, price: 43750 },
      'ETH': { amount: 1290, value: 3225000, price: 2500 }
    }
  },
  'boosted-eth': {
    id: 'boosted-eth',
    name: 'Boosted ETH Pool',
    type: 'boosted',
    composition: 'Boosted Yield',
    tokens: ['ETH', '⚡'],
    weights: [100, 0],
    address: '0x3456789012345678901234567890123456789012',
    tvl: 15200000,
    apr: 45.8,
    tradingFees: 8.5,
    incentives: 37.3,
    volume24h: 1800000,
    swapFee: 0.1,
    totalSwaps: 23450,
    uniqueLPs: 334,
    poolAge: 45,
    utilization: 95.8,
    balances: {
      'ETH': { amount: 6080, value: 15200000, price: 2500 },
      '⚡': { amount: 0, value: 0, price: 0 }
    }
  }
};

// ==========================================
// WALLET CONNECTION FUNCTIONS FOR PAGE-SPECIFIC BUTTONS
// ==========================================

function connectWallet() {
  console.log('Pool Details: connectWallet called - using global wallet');
  
  const connectBtn = document.getElementById('poolDetailsConnectBtn');
  if (connectBtn) {
    connectBtn.textContent = 'Connecting...';
    connectBtn.disabled = true;
  }
  
  // Use the global wallet connection function
  if (typeof window.globalWalletConnect === 'function') {
    window.globalWalletConnect().then(success => {
      // Reset button state
      if (connectBtn) {
        connectBtn.textContent = 'Connect Wallet';
        connectBtn.disabled = false;
      }
    });
  } else {
    console.error('Global wallet connect function not available');
    if (connectBtn) {
      connectBtn.textContent = 'Connect Wallet';
      connectBtn.disabled = false;
    }
  }
}

// ==========================================
// WALLET EVENT LISTENERS
// ==========================================

// Listen for global wallet connection
window.addEventListener('globalWalletConnected', function(event) {
  console.log('Pool Details: Received global wallet connected event');
  
  poolDetailsState.isWalletConnected = true;
  
  // Show pool details content, hide wallet prompt
  const walletPrompt = document.getElementById('poolDetailsWalletPrompt');
  const poolDetailsContent = document.getElementById('poolDetailsContent');
  
  if (walletPrompt) walletPrompt.style.display = 'none';
  if (poolDetailsContent) poolDetailsContent.style.display = 'block';
  
  // Load pool details data
  initializePoolDetailsWithData();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Pool Details: Received global wallet disconnected event');
  
  poolDetailsState.isWalletConnected = false;
  
  // Show wallet prompt, hide pool details content
  const walletPrompt = document.getElementById('poolDetailsWalletPrompt');
  const poolDetailsContent = document.getElementById('poolDetailsContent');
  
  if (walletPrompt) walletPrompt.style.display = 'block';
  if (poolDetailsContent) poolDetailsContent.style.display = 'none';
});

// ==========================================
// INITIALIZATION
// ==========================================

function initializePoolDetailsPage() {
  console.log('Initializing pool details page (integrated)');
  
  // Check if wallet is already connected
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, setting up pool details');
    poolDetailsState.isWalletConnected = true;
    
    const walletPrompt = document.getElementById('poolDetailsWalletPrompt');
    const poolDetailsContent = document.getElementById('poolDetailsContent');
    
    if (walletPrompt) walletPrompt.style.display = 'none';
    if (poolDetailsContent) poolDetailsContent.style.display = 'block';
    
    initializePoolDetailsWithData();
  } else {
    // Show wallet prompt
    const walletPrompt = document.getElementById('poolDetailsWalletPrompt');
    const poolDetailsContent = document.getElementById('poolDetailsContent');
    
    if (walletPrompt) walletPrompt.style.display = 'block';
    if (poolDetailsContent) poolDetailsContent.style.display = 'none';
  }
}

function initializePoolDetailsWithData() {
  // Get pool ID from session storage (set by accelerate page)
  const poolId = sessionStorage.getItem('currentPoolId') || 'eth-usdc';
  
  const pool = poolsDatabase[poolId];
  if (!pool) {
    console.error('Pool not found:', poolId);
    showError('Pool not found');
    return;
  }
  
  poolDetailsState.currentPool = pool;
  loadPoolDetails(pool);
  
  // Wait for Chart.js to be available, then initialize charts
  waitForChartJS().then(() => {
    initializeCharts();
  }).catch(() => {
    console.warn('Chart.js not available, skipping chart initialization');
  });
  
  loadRecentTransactions();
}

// Wait for Chart.js to be available
function waitForChartJS() {
  return new Promise((resolve, reject) => {
    if (typeof Chart !== 'undefined') {
      resolve();
      return;
    }
    
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadPoolDetails(pool) {
  console.log('Loading pool details for:', pool.name);
  
  // Update pool header
  updatePoolHeader(pool);
  
  // Update pool composition
  updatePoolComposition(pool);
  
  // Update pool statistics
  updatePoolStatistics(pool);
  
  // Update APR breakdown
  updateAPRBreakdown(pool);
  
  // Update user position (mock)
  updateUserPosition();
}

// ==========================================
// POOL HEADER UPDATES
// ==========================================

function updatePoolHeader(pool) {
  // Update token icons
  const tokenIconsContainer = document.getElementById('poolTokenIconsLarge');
  if (tokenIconsContainer) {
    tokenIconsContainer.innerHTML = pool.tokens.map(token => 
      `<div class="token-icon-large ${token === '⚡' ? 'boost' : ''}">${token}</div>`
    ).join('');
  }
  
  // Update title and meta
  const titleElement = document.getElementById('poolTitle');
  if (titleElement) titleElement.textContent = pool.name;
  
  const compositionElement = document.getElementById('poolComposition');
  if (compositionElement) compositionElement.textContent = pool.composition;
  
  const addressElement = document.getElementById('poolAddress');
  if (addressElement) {
    const shortAddress = `${pool.address.slice(0, 6)}...${pool.address.slice(-4)}`;
    addressElement.textContent = shortAddress;
  }
  
  // Update key stats
  const aprElement = document.getElementById('poolAPR');
  if (aprElement) aprElement.textContent = `${pool.apr}%`;
  
  const tvlElement = document.getElementById('poolTVL');
  if (tvlElement) tvlElement.textContent = `${formatNumber(pool.tvl)}`;
  
  const volumeElement = document.getElementById('poolVolume');
  if (volumeElement) volumeElement.textContent = `${formatNumber(pool.volume24h)}`;
}

// ==========================================
// POOL COMPOSITION
// ==========================================

function updatePoolComposition(pool) {
  const breakdownContainer = document.getElementById('compositionBreakdown');
  if (!breakdownContainer) return;
  
  const colors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
  
  breakdownContainer.innerHTML = pool.tokens.map((token, index) => {
    const balance = pool.balances[token];
    const percentage = pool.weights[index];
    
    return `
      <div class="composition-item">
        <div class="composition-token">
          <div class="composition-color" style="background-color: ${colors[index]}"></div>
          <span>${token}</span>
        </div>
        <div class="composition-details">
          <div class="composition-percentage">${percentage}%</div>
          <div class="composition-amount">${formatNumber(balance?.amount || 0)} ${token}</div>
        </div>
      </div>
    `;
  }).join('');
  
  // Create composition chart (only if Chart.js is available)
  if (typeof Chart !== 'undefined') {
    createCompositionChart(pool, colors);
  }
}

function createCompositionChart(pool, colors) {
  const canvas = document.getElementById('compositionChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (poolDetailsState.compositionChart) {
    poolDetailsState.compositionChart.destroy();
  }
  
  poolDetailsState.compositionChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: pool.tokens,
      datasets: [{
        data: pool.weights,
        backgroundColor: colors.slice(0, pool.tokens.length),
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const token = context.label;
              const percentage = context.parsed;
              const balance = pool.balances[token];
              return `${token}: ${percentage}% (${formatNumber(balance?.amount || 0)} ${token})`;
            }
          }
        }
      },
      cutout: '60%'
    }
  });
}

// ==========================================
// POOL STATISTICS
// ==========================================

function updatePoolStatistics(pool) {
  const elements = {
    poolType: document.getElementById('poolType'),
    swapFee: document.getElementById('swapFee'),
    totalSwaps: document.getElementById('totalSwaps'),
    uniqueLPs: document.getElementById('uniqueLPs'),
    poolAge: document.getElementById('poolAge'),
    poolUtilization: document.getElementById('poolUtilization')
  };
  
  if (elements.poolType) {
    elements.poolType.textContent = pool.type === 'weighted' ? 'Weighted Pool' : 
                                    pool.type === 'stable' ? 'Stable Pool' : 
                                    'Boosted Pool';
  }
  if (elements.swapFee) elements.swapFee.textContent = `${pool.swapFee}%`;
  if (elements.totalSwaps) elements.totalSwaps.textContent = formatNumber(pool.totalSwaps);
  if (elements.uniqueLPs) elements.uniqueLPs.textContent = formatNumber(pool.uniqueLPs);
  if (elements.poolAge) elements.poolAge.textContent = `${pool.poolAge} days`;
  if (elements.poolUtilization) elements.poolUtilization.textContent = `${pool.utilization}%`;
}

// ==========================================
// APR BREAKDOWN
// ==========================================

function updateAPRBreakdown(pool) {
  const elements = {
    tradingAPR: document.getElementById('tradingAPR'),
    incentiveAPR: document.getElementById('incentiveAPR'),
    totalAPR: document.getElementById('totalAPR')
  };
  
  if (elements.tradingAPR) elements.tradingAPR.textContent = `${pool.tradingFees}%`;
  if (elements.incentiveAPR) elements.incentiveAPR.textContent = `${pool.incentives}%`;
  if (elements.totalAPR) elements.totalAPR.textContent = `${pool.apr}%`;
  
  // Update progress bars
  const totalAPR = pool.tradingFees + pool.incentives;
  const tradingPercentage = (pool.tradingFees / totalAPR) * 100;
  const incentivePercentage = (pool.incentives / totalAPR) * 100;
  
  const tradingBar = document.querySelector('.apr-fill.trading');
  const incentiveBar = document.querySelector('.apr-fill.incentive');
  
  if (tradingBar) tradingBar.style.width = `${tradingPercentage}%`;
  if (incentiveBar) incentiveBar.style.width = `${incentivePercentage}%`;
}

// ==========================================
// USER POSITION
// ==========================================

function updateUserPosition() {
  const container = document.getElementById('userPositionContent');
  if (!container) return;
  
  // For now, show no position - in a real app this would check user's actual position
  container.innerHTML = `
    <div class="no-position">
      <div class="no-position-icon">💧</div>
      <div class="no-position-text">No liquidity provided</div>
      <div class="no-position-subtext">Add liquidity to start earning fees</div>
    </div>
  `;
}

// ==========================================
// CHARTS INITIALIZATION
// ==========================================

function initializeCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not available, skipping chart initialization');
    return;
  }
  
  createPriceChart();
  createVolumeChart();
}

function createPriceChart() {
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Generate mock price data
  const priceData = generateMockPriceData('24h');
  
  poolDetailsState.priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: priceData.labels,
      datasets: [{
        label: 'Price',
        data: priceData.values,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: '#4F46E5',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    }
  });
}

function createVolumeChart() {
  const canvas = document.getElementById('volumeChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Generate mock volume data
  const volumeData = generateMockVolumeData('24h');
  
  poolDetailsState.volumeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: volumeData.labels,
      datasets: [{
        label: 'Volume',
        data: volumeData.values,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10B981',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: '#10B981',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `Volume: ${formatNumber(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return '
   + formatNumber(value);
            }
          }
        }
      }
    }
  });
}

// ==========================================
// CHART DATA GENERATION
// ==========================================

function generateMockPriceData(period) {
  const pool = poolDetailsState.currentPool;
  const basePrice = pool.tokens[0] === 'ETH' ? 2500 : 
                   pool.tokens[0] === 'BTC' ? 43750 : 1;
  
  let dataPoints;
  let labelFormat;
  
  switch (period) {
    case '24h':
      dataPoints = 24;
      labelFormat = (i) => `${i}:00`;
      break;
    case '7d':
      dataPoints = 7;
      labelFormat = (i) => `Day ${i + 1}`;
      break;
    case '30d':
      dataPoints = 30;
      labelFormat = (i) => `Day ${i + 1}`;
      break;
    case '90d':
      dataPoints = 90;
      labelFormat = (i) => `Day ${i + 1}`;
      break;
    default:
      dataPoints = 24;
      labelFormat = (i) => `${i}:00`;
  }
  
  const labels = Array.from({ length: dataPoints }, (_, i) => labelFormat(i));
  const values = Array.from({ length: dataPoints }, (_, i) => {
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    return basePrice * (1 + variation);
  });
  
  return { labels, values };
}

function generateMockVolumeData(period) {
  const pool = poolDetailsState.currentPool;
  const baseVolume = pool.volume24h / 24; // Hourly average
  
  let dataPoints;
  let labelFormat;
  
  switch (period) {
    case '24h':
      dataPoints = 24;
      labelFormat = (i) => `${i}:00`;
      break;
    case '7d':
      dataPoints = 7;
      labelFormat = (i) => `Day ${i + 1}`;
      break;
    case '30d':
      dataPoints = 30;
      labelFormat = (i) => `Day ${i + 1}`;
      break;
    case '90d':
      dataPoints = 90;
      labelFormat = (i) => `Day ${i + 1}`;
      break;
    default:
      dataPoints = 24;
      labelFormat = (i) => `${i}:00`;
  }
  
  const labels = Array.from({ length: dataPoints }, (_, i) => labelFormat(i));
  const values = Array.from({ length: dataPoints }, (_, i) => {
    const variation = Math.random() * 2; // 0-2x variation
    return baseVolume * variation;
  });
  
  return { labels, values };
}

// ==========================================
// CHART UPDATE FUNCTIONS
// ==========================================

function updateChart(period) {
  poolDetailsState.currentPeriod = period;
  
  // Update active button
  const chartContainer = document.querySelector('#priceChart').closest('.chart-card');
  chartContainer.querySelectorAll('.chart-period').forEach(btn => {
    btn.classList.remove('active');
  });
  chartContainer.querySelector(`[data-period="${period}"]`).classList.add('active');
  
  // Update chart data
  const newData = generateMockPriceData(period);
  
  if (poolDetailsState.priceChart) {
    poolDetailsState.priceChart.data.labels = newData.labels;
    poolDetailsState.priceChart.data.datasets[0].data = newData.values;
    poolDetailsState.priceChart.update();
  }
}

function updateVolumeChart(period) {
  poolDetailsState.currentVolumePeriod = period;
  
  // Update active button in volume chart
  const volumeCard = document.querySelector('#volumeChart').closest('.chart-card');
  volumeCard.querySelectorAll('.chart-period').forEach(btn => {
    btn.classList.remove('active');
  });
  volumeCard.querySelector(`[data-period="${period}"]`).classList.add('active');
  
  // Update chart data
  const newData = generateMockVolumeData(period);
  
  if (poolDetailsState.volumeChart) {
    poolDetailsState.volumeChart.data.labels = newData.labels;
    poolDetailsState.volumeChart.data.datasets[0].data = newData.values;
    poolDetailsState.volumeChart.update();
  }
}

// ==========================================
// RECENT TRANSACTIONS
// ==========================================

function loadRecentTransactions() {
  const container = document.getElementById('transactionsList');
  if (!container) return;
  
  // Generate mock transaction data
  const transactions = generateMockTransactions();
  
  container.innerHTML = transactions.map(tx => `
    <div class="transaction-row">
      <div class="table-cell transaction-type" data-label="Type">
        <span class="type-badge ${tx.type}">${tx.type.toUpperCase()}</span>
      </div>
      <div class="table-cell" data-label="Amount">${tx.amount}</div>
      <div class="table-cell" data-label="Value">${formatNumber(tx.value)}</div>
      <div class="table-cell transaction-account" data-label="Account">${tx.account}</div>
      <div class="table-cell transaction-time" data-label="Time">${tx.time}</div>
    </div>
  `).join('');
}

function generateMockTransactions() {
  const pool = poolDetailsState.currentPool;
  const types = ['swap', 'add', 'remove'];
  const timeOffsets = [5, 12, 28, 45, 67, 89, 123, 156, 234, 345]; // minutes ago
  
  return timeOffsets.map((offset, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const token1 = pool.tokens[0];
    const token2 = pool.tokens[1] || pool.tokens[0];
    
    let amount, value;
    
    switch (type) {
      case 'swap':
        const amount1 = (Math.random() * 10).toFixed(2);
        const amount2 = (Math.random() * 5000).toFixed(0);
        amount = `${amount1} ${token1} → ${amount2} ${token2}`;
        value = parseFloat(amount1) * 2500; // Rough ETH price
        break;
      case 'add':
        const addAmount1 = (Math.random() * 5).toFixed(2);
        const addAmount2 = (Math.random() * 12000).toFixed(0);
        amount = `${addAmount1} ${token1} + ${addAmount2} ${token2}`;
        value = parseFloat(addAmount1) * 2500 + parseFloat(addAmount2);
        break;
      case 'remove':
        const removeAmount1 = (Math.random() * 3).toFixed(2);
        const removeAmount2 = (Math.random() * 7500).toFixed(0);
        amount = `${removeAmount1} ${token1} + ${removeAmount2} ${token2}`;
        value = parseFloat(removeAmount1) * 2500 + parseFloat(removeAmount2);
        break;
    }
    
    return {
      type,
      amount,
      value,
      account: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
      time: `${offset}m ago`
    };
  });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toLocaleString();
}

function copyAddress() {
  const pool = poolDetailsState.currentPool;
  if (!pool) return;
  
  navigator.clipboard.writeText(pool.address).then(() => {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Address copied to clipboard!', 'success');
    }
  }).catch(() => {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Failed to copy address', 'error');
    }
  });
}

function showError(message) {
  const container = document.querySelector('.pool-details-content');
  if (container) {
    container.innerHTML = `
      <div class="error-container" style="
        display: flex; 
        align-items: center; 
        justify-content: center; 
        min-height: 400px; 
        flex-direction: column; 
        gap: 20px;
        text-align: center;
        padding: 2rem;
      ">
        <div style="color: var(--text-primary); font-size: 1.5rem;">⚠️ ${message}</div>
        <div style="color: var(--text-secondary); font-size: 1rem;">
          The requested pool could not be found or loaded.
        </div>
        <div style="display: flex; gap: 1rem;">
          <button onclick="goBackToAccelerate()" style="
            background: var(--accent); 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 8px; 
            cursor: pointer;
            font-weight: 600;
          ">← Back to Pools</button>
        </div>
      </div>
    `;
  }
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

function goBackToAccelerate() {
  // Use the global function from shell
  if (typeof window.goBackToAccelerate === 'function') {
    window.goBackToAccelerate();
  } else {
    console.error('goBackToAccelerate function not available');
  }
}

function openSwapModal() {
  const pool = poolDetailsState.currentPool;
  if (!pool) return;
  
  console.log('Redirecting to YieldFi page for swap:', pool.name);
  
  if (typeof window.showMessage === 'function') {
    window.showMessage(`Redirecting to YieldFi for ${pool.name} swap...`, 'success');
  }
  
  // Store the pool info for YieldFi page to use
  sessionStorage.setItem('swapPoolInfo', JSON.stringify({
    poolId: pool.id,
    tokens: pool.tokens,
    name: pool.name
  }));
  
  // Navigate to YieldFi page using the shell's selectPage function
  setTimeout(() => {
    if (typeof window.selectPage === 'function') {
      window.selectPage('yieldfi');
    }
  }, 500);
}

function openLiquidityModal(action) {
  const pool = poolDetailsState.currentPool;
  if (!pool) return;
  
  console.log(`Opening ${action} liquidity modal for pool:`, pool.name);
  
  if (typeof window.showMessage === 'function') {
    window.showMessage(`${action === 'add' ? 'Add' : 'Remove'} liquidity feature coming soon!`, 'success');
  }
}

// ==========================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ==========================================

// Make functions available globally for onclick handlers
window.updateChart = updateChart;
window.updateVolumeChart = updateVolumeChart;
window.openLiquidityModal = openLiquidityModal;
window.openSwapModal = openSwapModal;
window.copyAddress = copyAddress;
window.goBackToAccelerate = goBackToAccelerate;
window.initializePoolDetailsPage = initializePoolDetailsPage;