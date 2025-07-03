// ==========================================
// ENHANCED STAKING PAGE JAVASCRIPT
// ==========================================

// Staking state management
let stakingState = {
  isWalletConnected: false,
  globalData: {
    totalValueLocked: 24750.00,
    totalRewardsDistributed: 3247.82,
    avgApy: 8.9,
    activeStakers: 247
  },
  userData: {
    totalStaked: 0,
    totalRewards: 0,
    avgApy: 0,
    activeStakes: 0,
    userStakes: []
  }
};

// Pool configurations
const stakingPools = {
  ETH: {
    name: 'Ethereum Staking',
    symbol: 'ETH',
    apy: 5.2,
    totalStaked: '1,234 ETH',
    minStake: '0.1 ETH',
    lockPeriod: '365 days',
    userStake: '2.5 ETH'
  },
  USDC: {
    name: 'USDC Staking',
    symbol: 'USDC',
    apy: 8.5,
    totalStaked: '2.1M USDC',
    minStake: '100 USDC',
    lockPeriod: '30 days',
    userStake: '5,000 USDC'
  },
  DEFI: {
    name: 'DeFiTools Token',
    symbol: 'DEFI',
    apy: 12.8,
    totalStaked: '5.7M DEFI',
    minStake: '1,000 DEFI',
    lockPeriod: '90 days',
    userStake: '10,000 DEFI'
  },
  LST: {
    name: 'Liquid Staking Pool',
    symbol: 'LST',
    apy: 6.7,
    totalStaked: '890 ETH',
    minStake: '0.01 ETH',
    lockPeriod: 'Flexible',
    userStake: '0.0 ETH'
  }
};

// ==========================================
// WALLET EVENT LISTENERS
// ==========================================

// Listen for global wallet connection
window.addEventListener('globalWalletConnected', function(event) {
  console.log('Staking: Received global wallet connected event');
  
  stakingState.isWalletConnected = true;
  
  // Add wallet connected class to body for CSS targeting
  document.body.classList.add('wallet-connected');
  
  // Update user stats highlighting
  updateUserStatsDisplay();
  
  // Load user-specific staking data
  loadUserStakingData();
  
  // Update wallet status info
  updateWalletStatusInfo();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Staking: Received global wallet disconnected event');
  
  stakingState.isWalletConnected = false;
  
  // Remove wallet connected class
  document.body.classList.remove('wallet-connected');
  
  // Reset user-specific data
  resetUserStakingData();
  
  // Update wallet status info
  updateWalletStatusInfo();
});

// ==========================================
// DATA MANAGEMENT FUNCTIONS
// ==========================================

function loadGlobalStakingData() {
  // Always show global staking pool data
  const elements = {
    totalStaked: document.getElementById('totalStaked'),
    totalRewards: document.getElementById('totalRewards'),
    avgApy: document.getElementById('avgApy'),
    activeStakes: document.getElementById('activeStakes')
  };
  
  if (elements.totalStaked) {
    elements.totalStaked.textContent = `$${stakingState.globalData.totalValueLocked.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }
  if (elements.totalRewards) {
    elements.totalRewards.textContent = `$${stakingState.globalData.totalRewardsDistributed.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }
  if (elements.avgApy) {
    elements.avgApy.textContent = `${stakingState.globalData.avgApy}%`;
  }
  if (elements.activeStakes) {
    elements.activeStakes.textContent = stakingState.globalData.activeStakers.toString();
  }
}

function loadUserStakingData() {
  if (!stakingState.isWalletConnected) {
    return;
  }

  try {
    console.log("Loading user staking data...");
    
    // Generate user-specific data
    stakingState.userData = {
      totalStaked: 17500.00,
      totalRewards: 1247.82,
      avgApy: 8.9,
      activeStakes: 3,
      userStakes: generateUserStakes()
    };
    
    // Update overview cards with user data
    updateOverviewCardsForUser();
    
    // Update stakes table
    updateStakesTable();
    
    console.log("User staking data loaded successfully");
    
    if (typeof window.showMessage === 'function') {
      window.showMessage('Personal staking data loaded!', 'success');
    }
  } catch (error) {
    console.error("Failed to load user staking data:", error);
    if (typeof window.showMessage === 'function') {
      window.showMessage("Failed to load user staking data: " + error.message, "error");
    }
  }
}

function updateOverviewCardsForUser() {
  // Update overview cards to show user-specific data when wallet is connected
  const elements = {
    totalStaked: document.getElementById('totalStaked'),
    totalRewards: document.getElementById('totalRewards'),
    avgApy: document.getElementById('avgApy'),
    activeStakes: document.getElementById('activeStakes')
  };
  
  if (elements.totalStaked) {
    elements.totalStaked.textContent = `$${stakingState.userData.totalStaked.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }
  if (elements.totalRewards) {
    elements.totalRewards.textContent = `$${stakingState.userData.totalRewards.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }
  if (elements.avgApy) {
    elements.avgApy.textContent = `${stakingState.userData.avgApy}%`;
  }
  if (elements.activeStakes) {
    elements.activeStakes.textContent = stakingState.userData.activeStakes.toString();
  }
  
  // Update card labels for user context
  const labels = document.querySelectorAll('.overview-label');
  if (labels.length >= 4) {
    labels[0].textContent = 'Your Total Staked';
    labels[1].textContent = 'Your Total Rewards';
    labels[2].textContent = 'Your Average APY';
    labels[3].textContent = 'Your Active Stakes';
  }
}

function updateUserStatsDisplay() {
  // Highlight user-specific stats in pools
  Object.keys(stakingPools).forEach(symbol => {
    const userStatElement = document.getElementById(`${symbol.toLowerCase()}UserStake`);
    if (userStatElement) {
      userStatElement.classList.add('user-highlight');
      
      // Add a subtle animation
      userStatElement.style.animation = 'pulse 0.6s ease-in-out';
      setTimeout(() => {
        if (userStatElement.style) {
          userStatElement.style.animation = '';
        }
      }, 600);
    }
  });
}

function updateStakesTable() {
  const stakesTableBody = document.getElementById('stakesTableBody');
  if (!stakesTableBody) return;
  
  if (!stakingState.isWalletConnected || stakingState.userData.userStakes.length === 0) {
    stakesTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 40px;">
          <div style="margin-bottom: 10px">
            ${stakingState.isWalletConnected ? 
              '📊 No active stakes found' : 
              '🔒 Connect your wallet to view your staking positions'}
          </div>
          <div style="font-size: 0.9rem; opacity: 0.8">
            ${stakingState.isWalletConnected ? 
              'Start staking to see your positions here' : 
              'Your active stakes and rewards will appear here once connected'}
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  stakesTableBody.innerHTML = stakingState.userData.userStakes.map(stake => `
    <tr class="user-stake-row">
      <td>
        <div class="stake-pool">
          <div class="stake-pool-icon">${stake.symbol}</div>
          <span>${stake.name}</span>
        </div>
      </td>
      <td>${stake.stakedAmount}</td>
      <td class="rewards-cell">${stake.rewardsEarned}</td>
      <td class="apy-cell">${stake.apy}%</td>
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

function generateUserStakes() {
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
      stakedAmount: '5,000 USDC',
      rewardsEarned: '425 USDC',
      apy: 8.5,
      unlockDate: 'Jan 15, 2026'
    },
    {
      symbol: 'DEFI',
      name: 'DeFiTools',
      stakedAmount: '10,000 DEFI',
      rewardsEarned: '1,280 DEFI',
      apy: 12.8,
      unlockDate: 'Mar 20, 2026'
    }
  ];
}

function resetUserStakingData() {
  stakingState.userData = {
    totalStaked: 0,
    totalRewards: 0,
    avgApy: 0,
    activeStakes: 0,
    userStakes: []
  };
  
  // Reset overview cards to global data
  loadGlobalStakingData();
  
  // Reset card labels to global context
  const labels = document.querySelectorAll('.overview-label');
  if (labels.length >= 4) {
    labels[0].textContent = 'Total Value Locked';
    labels[1].textContent = 'Total Rewards Distributed';
    labels[2].textContent = 'Average APY';
    labels[3].textContent = 'Active Stakers';
  }
  
  // Reset stakes table
  updateStakesTable();
  
  // Remove user highlighting from pool stats
  document.querySelectorAll('.user-stat').forEach(el => {
    el.classList.remove('user-highlight');
  });
}

function updateWalletStatusInfo() {
  const walletStatusInfo = document.getElementById('walletStatusInfo');
  const statusMessage = walletStatusInfo?.querySelector('.status-message span');
  
  if (statusMessage) {
    if (stakingState.isWalletConnected) {
      statusMessage.textContent = 'Wallet connected! Your personal staking positions are now visible below.';
      walletStatusInfo.style.background = 'rgba(56, 161, 105, 0.1)';
      walletStatusInfo.style.borderColor = 'rgba(56, 161, 105, 0.3)';
    } else {
      statusMessage.textContent = 'Connect your wallet to view your personal staking positions and manage your stakes';
      walletStatusInfo.style.background = 'rgba(255, 193, 7, 0.1)';
      walletStatusInfo.style.borderColor = 'rgba(255, 193, 7, 0.3)';
    }
  }
}

// ==========================================
// STAKING ACTION HANDLERS
// ==========================================

function handleStakeAction(action, token) {
  if (!stakingState.isWalletConnected) {
    // Instead of blocking, show connection prompt
    if (typeof window.showMessage === 'function') {
      window.showMessage('Please connect your wallet to perform staking actions', 'warning');
    }
    
    // Trigger wallet connection
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    }
    return;
  }
  
  console.log(`Handling ${action} for ${token}`);
  
  // Show loading state
  const actionButtons = document.querySelectorAll(`.pool-card button, .action-btn`);
  actionButtons.forEach(btn => {
    if (btn.textContent.toLowerCase() === action) {
      btn.disabled = true;
      btn.textContent = `${action}ing...`;
    }
  });
  
  if (typeof window.showMessage === 'function') {
    window.showMessage(`${action.charAt(0).toUpperCase() + action.slice(1)}ing ${token}...`, 'info');
  }
  
  // Mock: Simulate action completion
  setTimeout(() => {
    // Reset button states
    actionButtons.forEach(btn => {
      btn.disabled = false;
      btn.textContent = btn.textContent.replace('ing...', '');
    });
    
    if (typeof window.showMessage === 'function') {
      window.showMessage(`Successfully ${action}ed ${token}!`, 'success');
    }
    
    // Refresh data after action
    if (action === 'stake' || action === 'unstake') {
      loadUserStakingData();
    }
  }, 2000);
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

function initializeStakingPage() {
  console.log('Enhanced staking page initialized');
  
  // Always load global data first
  loadGlobalStakingData();
  
  // Check if wallet is already connected
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, loading user data');
    stakingState.isWalletConnected = true;
    
    // Add wallet connected class
    document.body.classList.add('wallet-connected');
    
    // Load user-specific data
    loadUserStakingData();
    updateUserStatsDisplay();
  }
  
  // Always update wallet status info
  updateWalletStatusInfo();
  
  // Add smooth animations to cards
  addPageAnimations();
}

function addPageAnimations() {
  // Animation removed per user request
  // Cards now appear immediately without fade-in effects
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatCurrency(value, currency = 'USD') {
  if (currency === 'USD') {
    return `${value.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }
  return `${value.toLocaleString('en-US', {minimumFractionDigits: 4})} ${currency}`;
}

function calculateAPY(principal, rate, time) {
  return principal * Math.pow((1 + rate / 365), 365 * time) - principal;
}

function getPoolInfo(symbol) {
  return stakingPools[symbol] || null;
}

// ==========================================
// AUTO-INITIALIZATION
// ==========================================

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStakingPage);
} else {
  // If already loaded (dynamic loading case)
  setTimeout(initializeStakingPage, 100);
}

// Export functions for global access
window.stakingPageFunctions = {
  handleStakeAction,
  loadUserStakingData,
  resetUserStakingData,
  updateWalletStatusInfo,
  getPoolInfo
};