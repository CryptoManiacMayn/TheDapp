// ==========================================
// PORTFOLIO PAGE JAVASCRIPT - SIMPLIFIED FINAL VERSION
// ==========================================

// Portfolio-specific state (READ ONLY - doesn't manage wallet connection)
let portfolioData = {
  totalValue: 0,
  totalStaked: 0,
  totalLending: 0,
  totalYield: 0,
  assets: []
};

// ==========================================
// WALLET EVENT LISTENERS - SIMPLIFIED
// ==========================================

// Listen for global wallet connection
window.addEventListener('globalWalletConnected', function(event) {
  console.log('Portfolio: Received global wallet connected event', event.detail);
  loadPortfolioData(event.detail.account, event.detail.provider);
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Portfolio: Received global wallet disconnected event');
  clearPortfolioData();
});

// ==========================================
// PORTFOLIO DATA FUNCTIONS
// ==========================================

async function loadPortfolioData(account, provider) {
  if (!account || !provider) {
    console.log("No account or provider available for portfolio data");
    return;
  }

  try {
    console.log("Loading portfolio data for:", account);

    // Get ETH balance
    const balance = await provider.getBalance(account);
    const ethBalance = ethers.formatEther(balance);
    const ethPrice = 2400; // Mock price for demo
    const ethValue = parseFloat(ethBalance) * ethPrice;

    // Update portfolio data
    portfolioData = {
      totalValue: ethValue,
      totalStaked: ethValue * 0.3,
      totalLending: ethValue * 0.2,
      totalYield: ethValue * 0.15,
      assets: [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: parseFloat(ethBalance).toFixed(4),
          value: ethValue.toFixed(2),
          change: '+2.34%',
          allocation: ethValue > 0 ? '100%' : '0%'
        }
      ]
    };

    // Update UI
    updatePortfolioUI();

    console.log("Portfolio data loaded successfully");
    if (typeof window.showMessage === 'function') {
      window.showMessage("Portfolio data updated!", "success");
    }
    
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
    if (typeof window.showMessage === 'function') {
      window.showMessage("Failed to load portfolio data: " + error.message, "error");
    }
    clearPortfolioData();
  }
}

function updatePortfolioUI() {
  // Update portfolio cards
  const elements = {
    totalValue: document.getElementById("totalValue"),
    totalChange: document.getElementById("totalChange"),
    totalStaked: document.getElementById("totalStaked"),
    stakedRewards: document.getElementById("stakedRewards"),
    totalLending: document.getElementById("totalLending"),
    lendingAPY: document.getElementById("lendingAPY"),
    totalYield: document.getElementById("totalYield"),
    yieldAPY: document.getElementById("yieldAPY")
  };

  if (elements.totalValue) {
    elements.totalValue.textContent = `$${portfolioData.totalValue.toFixed(2)}`;
  }
  if (elements.totalChange) {
    elements.totalChange.textContent = "+$23.45 (0.97%)";
  }
  if (elements.totalStaked) {
    elements.totalStaked.textContent = `$${portfolioData.totalStaked.toFixed(2)}`;
  }
  if (elements.stakedRewards) {
    elements.stakedRewards.textContent = "+$12.34 rewards";
  }
  if (elements.totalLending) {
    elements.totalLending.textContent = `${portfolioData.totalLending.toFixed(2)}`;
  }
  if (elements.lendingAPY) {
    elements.lendingAPY.textContent = "4.25% APY";
  }
  if (elements.totalYield) {
    elements.totalYield.textContent = `${portfolioData.totalYield.toFixed(2)}`;
  }
  if (elements.yieldAPY) {
    elements.yieldAPY.textContent = "8.5% APY";
  }

  // Update assets table
  updateAssetsTable();
}

function updateAssetsTable() {
  const assetsTableBody = document.getElementById("assetsTableBody");
  if (!assetsTableBody) return;

  if (portfolioData.assets.length === 0) {
    assetsTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 40px; font-size: 1.1rem;">
          <div style="margin-bottom: 10px;">🔒 Connect your wallet to view your portfolio</div>
          <div style="font-size: 0.9rem; opacity: 0.8;">Your assets and balances will appear here once connected</div>
        </td>
      </tr>
    `;
    return;
  }

  assetsTableBody.innerHTML = portfolioData.assets.map(asset => `
    <tr>
      <td>
        <div class="asset-info">
          <div class="asset-icon">${asset.symbol}</div>
          <div>
            <div style="font-weight: 600;">${asset.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${asset.symbol}</div>
          </div>
        </div>
      </td>
      <td>${asset.balance} ${asset.symbol}</td>
      <td>${asset.value}</td>
      <td class="positive">${asset.change}</td>
      <td>${asset.allocation}</td>
    </tr>
  `).join('') + `
    <tr>
      <td>
        <div class="asset-info">
          <div class="asset-icon">USDC</div>
          <div>
            <div style="font-weight: 600;">USD Coin</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">USDC</div>
          </div>
        </div>
      </td>
      <td>0.00 USDC</td>
      <td>$0.00</td>
      <td class="positive">+0.01%</td>
      <td>0%</td>
    </tr>
  `;
}

function clearPortfolioData() {
  // Reset portfolio data
  portfolioData = {
    totalValue: 0,
    totalStaked: 0,
    totalLending: 0,
    totalYield: 0,
    assets: []
  };

  // Reset UI to default values
  const elements = {
    totalValue: document.getElementById("totalValue"),
    totalChange: document.getElementById("totalChange"),
    totalStaked: document.getElementById("totalStaked"),
    stakedRewards: document.getElementById("stakedRewards"),
    totalLending: document.getElementById("totalLending"),
    lendingAPY: document.getElementById("lendingAPY"),
    totalYield: document.getElementById("totalYield"),
    yieldAPY: document.getElementById("yieldAPY")
  };

  if (elements.totalValue) elements.totalValue.textContent = "$0.00";
  if (elements.totalChange) elements.totalChange.textContent = "+$0.00 (0.00%)";
  if (elements.totalStaked) elements.totalStaked.textContent = "$0.00";
  if (elements.stakedRewards) elements.stakedRewards.textContent = "+$0.00 rewards";
  if (elements.totalLending) elements.totalLending.textContent = "$0.00";
  if (elements.lendingAPY) elements.lendingAPY.textContent = "0.00% APY";
  if (elements.totalYield) elements.totalYield.textContent = "$0.00";
  if (elements.yieldAPY) elements.yieldAPY.textContent = "0.00% APY";

  // Reset assets table
  updateAssetsTable();
}

// ==========================================
// PORTFOLIO INITIALIZATION
// ==========================================

function initializePortfolioPage() {
  console.log("Portfolio page initialized");
  
  // Start with cleared data
  clearPortfolioData();
  
  // Check if wallet is already connected
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.account && 
      window.globalWalletState.provider) {
    
    console.log("Wallet already connected, loading portfolio data");
    loadPortfolioData(window.globalWalletState.account, window.globalWalletState.provider);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolioPage);
} else {
  // If already loaded (dynamic loading case)
  setTimeout(initializePortfolioPage, 100);
}