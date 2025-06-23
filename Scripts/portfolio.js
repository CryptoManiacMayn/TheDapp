// ==========================================
// PORTFOLIO PAGE JAVASCRIPT
// ==========================================

// Portfolio state management
let portfolioState = {
  isWalletConnected: false,
  data: {
    totalValue: 0,
    totalChange: 0,
    totalStaked: 0,
    stakedRewards: 0,
    totalLending: 0,
    lendingAPY: 0,
    totalYield: 0,
    yieldAPY: 0,
    assets: []
  }
};

// Mock asset data
const mockAssets = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 2.45,
    price: 2500.00,
    value: 6125.00,
    change24h: 5.2,
    allocation: 45.5
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 5420.50,
    price: 1.00,
    value: 5420.50,
    change24h: 0.1,
    allocation: 40.2
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    balance: 0.085,
    price: 43750.00,
    value: 3718.75,
    change24h: 3.8,
    allocation: 14.3
  }
];

// ==========================================
// WALLET CONNECTION HANDLERS
// ==========================================

function connectWallet() {
  console.log('Portfolio: connectWallet called - using global wallet');
  
  // Use the global wallet connection function
  if (typeof window.globalWalletConnect === 'function') {
    window.globalWalletConnect();
  } else {
    console.error('Global wallet connect function not available');
  }
}

// Listen for global wallet connection
window.addEventListener('globalWalletConnected', function(event) {
  console.log('Portfolio: Received global wallet connected event');
  
  portfolioState.isWalletConnected = true;
  loadPortfolioData();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Portfolio: Received global wallet disconnected event');
  
  portfolioState.isWalletConnected = false;
  resetPortfolioData();
});

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

function loadPortfolioData() {
  if (!portfolioState.isWalletConnected) {
    console.log("No wallet connected for portfolio data");
    return;
  }

  try {
    console.log("Loading portfolio data...");
    
    // Calculate totals from mock assets
    const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
    const totalChange = totalValue * 0.052; // 5.2% gain
    
    // Update portfolio state
    portfolioState.data = {
      totalValue: totalValue,
      totalChange: totalChange,
      totalStaked: 2400.00,
      stakedRewards: 125.50,
      totalLending: 1200.00,
      lendingAPY: 8.5,
      totalYield: 850.00,
      yieldAPY: 12.3,
      assets: mockAssets
    };
    
    // Update UI
    updatePortfolioOverview();
    updateAssetsTable();
    
    console.log("Portfolio data loaded successfully");
    
    if (typeof window.showMessage === 'function') {
      window.showMessage('Portfolio data updated!', 'success');
    }
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
    if (typeof window.showMessage === 'function') {
      window.showMessage("Failed to load portfolio data: " + error.message, "error");
    }
    resetPortfolioData();
  }
}

function updatePortfolioOverview() {
  const data = portfolioState.data;
  
  // Update total portfolio value
  const totalValueEl = document.getElementById('totalValue');
  if (totalValueEl) {
    totalValueEl.textContent = `$${data.totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  }
  
  // Update total change
  const totalChangeEl = document.getElementById('totalChange');
  if (totalChangeEl) {
    const changePercent = ((data.totalChange / (data.totalValue - data.totalChange)) * 100).toFixed(2);
    totalChangeEl.textContent = `+$${data.totalChange.toFixed(2)} (+${changePercent}%)`;
    totalChangeEl.className = data.totalChange >= 0 ? 'card-change positive' : 'card-change negative';
  }
  
  // Update staking info
  const totalStakedEl = document.getElementById('totalStaked');
  if (totalStakedEl) {
    totalStakedEl.textContent = `$${data.totalStaked.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  }
  
  const stakedRewardsEl = document.getElementById('stakedRewards');
  if (stakedRewardsEl) {
    stakedRewardsEl.textContent = `+$${data.stakedRewards.toFixed(2)} rewards`;
  }
  
  // Update lending info
  const totalLendingEl = document.getElementById('totalLending');
  if (totalLendingEl) {
    totalLendingEl.textContent = `$${data.totalLending.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  }
  
  const lendingAPYEl = document.getElementById('lendingAPY');
  if (lendingAPYEl) {
    lendingAPYEl.textContent = `${data.lendingAPY}% APY`;
  }
  
  // Update yield farming info
  const totalYieldEl = document.getElementById('totalYield');
  if (totalYieldEl) {
    totalYieldEl.textContent = `$${data.totalYield.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  }
  
  const yieldAPYEl = document.getElementById('yieldAPY');
  if (yieldAPYEl) {
    yieldAPYEl.textContent = `${data.yieldAPY}% APY`;
  }
}

function updateAssetsTable() {
  const assetsTableBody = document.getElementById('assetsTableBody');
  if (!assetsTableBody) return;
  
  const assets = portfolioState.data.assets;
  
  if (assets.length === 0) {
    assetsTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 40px; font-size: 1.1rem;">
          <div style="margin-bottom: 10px;">📊 No assets found</div>
          <div style="font-size: 0.9rem; opacity: 0.8;">Your portfolio appears to be empty</div>
        </td>
      </tr>
    `;
    return;
  }
  
  assetsTableBody.innerHTML = assets.map(asset => {
    const changeClass = asset.change24h >= 0 ? 'positive' : 'negative';
    const changeSymbol = asset.change24h >= 0 ? '+' : '';
    
    return `
      <tr>
        <td>
          <div class="asset-info">
            <div class="asset-icon">${asset.symbol}</div>
            <div class="asset-details">
              <div class="asset-symbol">${asset.symbol}</div>
              <div class="asset-name">${asset.name}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="balance-info">
            <div class="balance-amount">${asset.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6})}</div>
            <div class="balance-symbol">${asset.symbol}</div>
          </div>
        </td>
        <td>
          <div class="value-info">
            <div class="value-amount">$${asset.value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div class="value-price">@$${asset.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
        </td>
        <td>
          <div class="change-info ${changeClass}">
            ${changeSymbol}${asset.change24h.toFixed(1)}%
          </div>
        </td>
        <td>
          <div class="allocation-info">
            <div class="allocation-percent">${asset.allocation.toFixed(1)}%</div>
            <div class="allocation-bar">
              <div class="allocation-fill" style="width: ${asset.allocation}%"></div>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function resetPortfolioData() {
  portfolioState.data = {
    totalValue: 0,
    totalChange: 0,
    totalStaked: 0,
    stakedRewards: 0,
    totalLending: 0,
    lendingAPY: 0,
    totalYield: 0,
    yieldAPY: 0,
    assets: []
  };
  
  // Update overview with zeros
  updatePortfolioOverview();
  
  // Reset assets table
  const assetsTableBody = document.getElementById('assetsTableBody');
  if (assetsTableBody) {
    assetsTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 40px; font-size: 1.1rem;">
          <div style="margin-bottom: 10px;">🔒 Connect your wallet to view your portfolio</div>
          <div style="font-size: 0.9rem; opacity: 0.8;">Your assets and balances will appear here once connected</div>
        </td>
      </tr>
    `;
  }
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

function initializePortfolioPage() {
  console.log('Portfolio page initialized');
  
  // Initialize with default state
  resetPortfolioData();
  
  // Check if wallet is already connected
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, loading portfolio data');
    portfolioState.isWalletConnected = true;
    loadPortfolioData();
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolioPage);
} else {
  // If already loaded (dynamic loading case)
  setTimeout(initializePortfolioPage, 100);
}

// ==========================================
// EXPORT FOR GLOBAL ACCESS
// ==========================================

window.initializePortfolioPage = initializePortfolioPage;