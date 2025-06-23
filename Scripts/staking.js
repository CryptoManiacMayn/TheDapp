// ==========================================
// STAKING PAGE JAVASCRIPT - SIMPLIFIED FINAL VERSION
// ==========================================

// Staking state management (READ ONLY - doesn't manage wallet connection)
let stakingState = {
  isWalletConnected: false,
  data: {
    totalStaked: 0,
    totalRewards: 0,
    avgApy: 0,
    activeStakes: 0,
    userStakes: []
  }
};

// ==========================================
// WALLET CONNECTION FUNCTIONS FOR PAGE-SPECIFIC BUTTONS
// ==========================================

function connectWallet() {
  console.log('Staking: connectWallet called - using global wallet');
  
  const connectBtn = document.getElementById('connectBtn');
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
  console.log('Staking: Received global wallet connected event');
  
  stakingState.isWalletConnected = true;
  
  // Show staking content, hide wallet prompt
  const walletPrompt = document.getElementById('walletPrompt');
  const stakingContent = document.getElementById('stakingContent');
  
  if (walletPrompt) walletPrompt.style.display = 'none';
  if (stakingContent) stakingContent.style.display = 'block';
  
  // Load staking data
  loadStakingData();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Staking: Received global wallet disconnected event');
  
  stakingState.isWalletConnected = false;
  
  // Show wallet prompt, hide staking content
  const walletPrompt = document.getElementById('walletPrompt');
  const stakingContent = document.getElementById('stakingContent');
  
  if (walletPrompt) walletPrompt.style.display = 'block';
  if (stakingContent) stakingContent.style.display = 'none';
  
  // Reset staking data
  resetStakingData();
});

// ==========================================
// STAKING DATA FUNCTIONS
// ==========================================

function loadStakingData() {
  if (!stakingState.isWalletConnected) {
    console.log("No wallet connected for staking data");
    return;
  }

  try {
    console.log("Loading staking data...");
    
    // Calculate mock staking overview
    const totalStakedValue = 17500.00;
    const totalRewardsValue = 1247.82;
    const avgApyValue = 8.9;
    const activeStakesCount = 3;
    
    // Update staking data
    stakingState.data = {
      totalStaked: totalStakedValue,
      totalRewards: totalRewardsValue,
      avgApy: avgApyValue,
      activeStakes: activeStakesCount,
      userStakes: generateMockStakes()
    };
    
    updateStakingOverview();
    updateStakesTable();
    
    console.log("Staking data loaded successfully");
    
    if (typeof window.showMessage === 'function') {
      window.showMessage('Staking data updated!', 'success');
    }
  } catch (error) {
    console.error("Failed to load staking data:", error);
    if (typeof window.showMessage === 'function') {
      window.showMessage("Failed to load staking data: " + error.message, "error");
    }
    resetStakingData();
  }
}

function updateStakingOverview() {
  const elements = {
    totalStaked: document.getElementById('totalStaked'),
    totalRewards: document.getElementById('totalRewards'),
    avgApy: document.getElementById('avgApy'),
    activeStakes: document.getElementById('activeStakes')
  };
  
  if (elements.totalStaked) {
    elements.totalStaked.textContent = `$${stakingState.data.totalStaked.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }
  if (elements.totalRewards) {
    elements.totalRewards.textContent = `$${stakingState.data.totalRewards.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }
  if (elements.avgApy) {
    elements.avgApy.textContent = `${stakingState.data.avgApy}%`;
  }
  if (elements.activeStakes) {
    elements.activeStakes.textContent = stakingState.data.activeStakes.toString();
  }
}

function updateStakesTable() {
  const stakesTableBody = document.getElementById('stakesTableBody');
  if (!stakesTableBody) return;
  
  if (stakingState.data.userStakes.length === 0) {
    stakesTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 40px;">
          No active stakes found. Start staking to see your positions here.
        </td>
      </tr>
    `;
    return;
  }
  
  stakesTableBody.innerHTML = stakingState.data.userStakes.map(stake => `
    <tr>
      <td>
        <div class="stake-pool">
          <div class="stake-pool-icon">${stake.symbol}</div>
          <span>${stake.name}</span>
        </div>
      </td>
      <td>${stake.stakedAmount}</td>
      <td>${stake.rewardsEarned}</td>
      <td>${stake.apy}%</td>
      <td>${stake.unlockDate}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn btn-claim" onclick="handleStakeAction('claim', '${stake.symbol}')">Claim</button>
          <button class="action-btn btn-unstake" onclick="handleStakeAction('unstake', '${stake.symbol}')">Unstake</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function generateMockStakes() {
  return [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      stakedAmount: '2.5 ETH',
      rewardsEarned: '0.13 ETH',
      apy: 5.2,
      unlockDate: 'Dec 25, 2025'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      stakedAmount: '5000 USDC',
      rewardsEarned: '425 USDC',
      apy: 8.5,
      unlockDate: 'Jan 15, 2026'
    },
    {
      symbol: 'DEFI',
      name: 'DeFiTools',
      stakedAmount: '10000 DEFI',
      rewardsEarned: '1280 DEFI',
      apy: 12.8,
      unlockDate: 'Mar 20, 2026'
    }
  ];
}

function resetStakingData() {
  stakingState.data = {
    totalStaked: 0,
    totalRewards: 0,
    avgApy: 0,
    activeStakes: 0,
    userStakes: []
  };
  
  // Reset overview
  const elements = {
    totalStaked: document.getElementById('totalStaked'),
    totalRewards: document.getElementById('totalRewards'),
    avgApy: document.getElementById('avgApy'),
    activeStakes: document.getElementById('activeStakes')
  };
  
  Object.values(elements).forEach(el => {
    if (el) {
      if (el.id.includes('Apy')) {
        el.textContent = '0.00%';
      } else if (el.id === 'activeStakes') {
        el.textContent = '0';
      } else {
        el.textContent = '$0.00';
      }
    }
  });
  
  // Reset stakes table
  const stakesTableBody = document.getElementById('stakesTableBody');
  if (stakesTableBody) {
    stakesTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 40px;">
          🔒 Connect your wallet to view your staking positions
        </td>
      </tr>
    `;
  }
}

// ==========================================
// STAKING ACTION HANDLERS
// ==========================================

function handleStakeAction(action, token) {
  if (!stakingState.isWalletConnected) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  console.log(`Handling ${action} for ${token}`);
  
  if (typeof window.showMessage === 'function') {
    window.showMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} ${token} action initiated`, 'success');
  }
  
  // Mock: Simulate action completion
  setTimeout(() => {
    if (typeof window.showMessage === 'function') {
      window.showMessage(`Successfully ${action}ed ${token}!`, 'success');
    }
  }, 2000);
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

function initializeStakingPage() {
  console.log('Staking page initialized');
  
  // Initialize with default state
  resetStakingData();
  
  // Check if wallet is already connected
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, setting up staking');
    stakingState.isWalletConnected = true;
    
    const walletPrompt = document.getElementById('walletPrompt');
    const stakingContent = document.getElementById('stakingContent');
    
    if (walletPrompt) walletPrompt.style.display = 'none';
    if (stakingContent) stakingContent.style.display = 'block';
    
    loadStakingData();
  } else {
    // Show wallet prompt
    const walletPrompt = document.getElementById('walletPrompt');
    const stakingContent = document.getElementById('stakingContent');
    
    if (walletPrompt) walletPrompt.style.display = 'block';
    if (stakingContent) stakingContent.style.display = 'none';
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStakingPage);
} else {
  // If already loaded (dynamic loading case)
  setTimeout(initializeStakingPage, 100);
}