// ==========================================
// ACCELERATE PAGE JAVASCRIPT - NO WALLET PROMPT VERSION
// ==========================================

// Accelerate state management
let accelerateState = {
  isWalletConnected: false,
  data: {
    totalTVL: 24700000,
    userLiquidity: 0,
    totalPools: 12,
    avgAPR: 24.5,
    userPositions: []
  },
  currentFilter: 'all',
  currentSort: 'tvl',
  searchQuery: ''
};

// Mock pool data
const mockPools = [
  {
    id: 'eth-usdc',
    name: 'ETH/USDC',
    type: 'weighted',
    composition: 'Weighted 80/20',
    tokens: ['ETH', 'USDC'],
    address: '0x1234...5678',
    tvl: 8250000,
    apr: 28.5,
    tradingFees: 12.1,
    incentives: 16.4,
    volume24h: 1200000,
    userLiquidity: 0,
    userTokens: '0 ETH, 0 USDC',
    tvlChange: 5.2,
    volumeChange: 12.4
  },
  {
    id: 'usdc-usdt',
    name: 'USDC/USDT',
    type: 'stable',
    composition: 'Stable Pool',
    tokens: ['USDC', 'USDT'],
    address: '0x5678...9012',
    tvl: 12800000,
    apr: 8.2,
    tradingFees: 3.1,
    incentives: 5.1,
    volume24h: 2800000,
    userLiquidity: 0,
    userTokens: '0 USDC, 0 USDT',
    tvlChange: 2.1,
    volumeChange: 8.7
  },
  {
    id: 'wbtc-eth',
    name: 'WBTC/ETH',
    type: 'weighted',
    composition: 'Weighted 50/50',
    tokens: ['BTC', 'ETH'],
    address: '0x9012...3456',
    tvl: 6450000,
    apr: 32.1,
    tradingFees: 15.2,
    incentives: 16.9,
    volume24h: 890000,
    userLiquidity: 0,
    userTokens: '0 WBTC, 0 ETH',
    tvlChange: 7.8,
    volumeChange: 15.3
  },
  {
    id: 'boosted-eth',
    name: 'Boosted ETH Pool',
    type: 'boosted',
    composition: 'Boosted Yield',
    tokens: ['ETH', '⚡'],
    address: '0x3456...7890',
    tvl: 15200000,
    apr: 45.8,
    tradingFees: 8.5,
    incentives: 37.3,
    volume24h: 1800000,
    userLiquidity: 0,
    userTokens: '0 ETH',
    tvlChange: 9.1,
    volumeChange: 22.1
  }
];

// ==========================================
// WALLET EVENT LISTENERS
// ==========================================

// Listen for global wallet connection
window.addEventListener('globalWalletConnected', function(event) {
  console.log('Accelerate: Received global wallet connected event');
  
  accelerateState.isWalletConnected = true;
  
  // Load user-specific data when wallet connects
  loadUserData();
  
  // Update displays to show user information
  updateOverviewStats();
  renderPools();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Accelerate: Received global wallet disconnected event');
  
  accelerateState.isWalletConnected = false;
  
  // Reset user data when wallet disconnects
  resetUserData();
  
  // Update displays to show default information
  updateOverviewStats();
  renderPools();
});

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

function loadUserData() {
  if (typeof window.showMessage === 'function') {
    window.showMessage(`Opening ${pool.name} pool details...`, 'success');
  }
  
  // Use the global navigation function to stay within the shell
  setTimeout(() => {
    if (typeof window.navigateToPoolDetails === 'function') {
      window.navigateToPoolDetails(poolId);
    } else {
      console.error('navigateToPoolDetails function not available');
    }
  }, 500);
}

function navigateToPoolDetails(poolId) {
  const pool = mockPools.find(p => p.id === poolId);
  if (!pool) {
    console.error('Pool not found:', poolId);
    return;
  }
  
  console.log('Navigating to pool details for:', pool.name);
  
  // Use the global navigation function to stay within the shell
  if (typeof window.navigateToPoolDetails === 'function') {
    window.navigateToPoolDetails(poolId);
  } else {
    console.error('navigateToPoolDetails function not available');
  }
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

function initializeAcceleratePage() {
  console.log('Accelerate page initialized (no wallet prompt version)');
  
  // Always show the page content
  const accelerateContent = document.getElementById('accelerateContent');
  if (accelerateContent) {
    accelerateContent.style.display = 'block';
  }
  
  // Initialize with default data
  updateOverviewStats();
  renderPools();
  
  // Initialize filters and search
  initializeFilters();
  
  // Check if wallet is already connected and load user data
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, loading user data');
    accelerateState.isWalletConnected = true;
    loadUserData();
  }
}

// ==========================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ==========================================

// Make functions available globally for onclick handlers
window.openLiquidityModal = openLiquidityModal;
window.viewPoolDetails = viewPoolDetails;
window.navigateToPoolDetails = navigateToPoolDetails;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAcceleratePage);
} else {
  // If already loaded (dynamic loading case)
  setTimeout(initializeAcceleratePage, 100);
} (!accelerateState.isWalletConnected) {
    console.log("No wallet connected for user data");
    return;
  }

  try {
    console.log("Loading user-specific accelerate data...");
    
    // Simulate loading user's actual liquidity positions
    // In a real app, this would fetch from blockchain/API
    loadUserLiquidityPositions();
    
    if (typeof window.showMessage === 'function') {
      window.showMessage('Loaded your liquidity positions!', 'success');
    }
  } catch (error) {
    console.error("Failed to load user data:", error);
    if (typeof window.showMessage === 'function') {
      window.showMessage("Failed to load user data: " + error.message, "error");
    }
  }
}

function loadUserLiquidityPositions() {
  // Mock user data - in real app, fetch from wallet/contracts
  const mockUserPositions = [
    {
      poolId: 'eth-usdc',
      liquidity: 5420.50,
      tokens: '1.85 ETH, 2,840 USDC',
      rewards: 45.20
    },
    {
      poolId: 'usdc-usdt', 
      liquidity: 1200.00,
      tokens: '600 USDC, 600 USDT',
      rewards: 8.50
    }
  ];
  
  // Update user liquidity in pools
  mockUserPositions.forEach(position => {
    const pool = mockPools.find(p => p.id === position.poolId);
    if (pool) {
      pool.userLiquidity = position.liquidity;
      pool.userTokens = position.tokens;
    }
  });
  
  // Update total user liquidity
  accelerateState.data.userLiquidity = mockUserPositions.reduce((total, pos) => total + pos.liquidity, 0);
  accelerateState.data.userPositions = mockUserPositions;
}

function resetUserData() {
  // Reset all user-specific data
  mockPools.forEach(pool => {
    pool.userLiquidity = 0;
    pool.userTokens = `0 ${pool.tokens[0]}${pool.tokens[1] ? ', 0 ' + pool.tokens[1] : ''}`;
  });
  
  accelerateState.data.userLiquidity = 0;
  accelerateState.data.userPositions = [];
}

function updateOverviewStats() {
  const elements = {
    totalTVL: document.getElementById('totalTVL'),
    userLiquidity: document.getElementById('userLiquidity'),
    userRewards: document.getElementById('userRewards'),
    totalPools: document.getElementById('totalPools'),
    avgAPR: document.getElementById('avgAPR')
  };
  
  if (elements.totalTVL) {
    elements.totalTVL.textContent = `$${(accelerateState.data.totalTVL / 1000000).toFixed(1)}M`;
  }
  if (elements.userLiquidity) {
    elements.userLiquidity.textContent = `$${accelerateState.data.userLiquidity.toFixed(2)}`;
  }
  if (elements.userRewards) {
    const totalRewards = accelerateState.data.userPositions.reduce((total, pos) => total + (pos.rewards || 0), 0);
    elements.userRewards.textContent = `+$${totalRewards.toFixed(2)} rewards`;
  }
  if (elements.totalPools) {
    elements.totalPools.textContent = accelerateState.data.totalPools.toString();
  }
  if (elements.avgAPR) {
    elements.avgAPR.textContent = `${accelerateState.data.avgAPR}%`;
  }
}

// ==========================================
// POOL RENDERING AND FILTERING
// ==========================================

function renderPools() {
  const poolsList = document.getElementById('poolsList');
  if (!poolsList) return;
  
  let filteredPools = [...mockPools];
  
  // Apply search filter
  if (accelerateState.searchQuery) {
    filteredPools = filteredPools.filter(pool => 
      pool.name.toLowerCase().includes(accelerateState.searchQuery.toLowerCase()) ||
      pool.tokens.some(token => token.toLowerCase().includes(accelerateState.searchQuery.toLowerCase()))
    );
  }
  
  // Apply type filter
  if (accelerateState.currentFilter !== 'all') {
    if (accelerateState.currentFilter === 'my-pools') {
      filteredPools = filteredPools.filter(pool => pool.userLiquidity > 0);
    } else {
      filteredPools = filteredPools.filter(pool => pool.type === accelerateState.currentFilter);
    }
  }
  
  // Apply sorting
  filteredPools.sort((a, b) => {
    switch (accelerateState.currentSort) {
      case 'tvl':
        return b.tvl - a.tvl;
      case 'apr':
        return b.apr - a.apr;
      case 'volume':
        return b.volume24h - a.volume24h;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  
  if (filteredPools.length === 0) {
    poolsList.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
        <div style="font-size: 2rem; margin-bottom: 15px;">🔍</div>
        <div style="font-size: 1.1rem; margin-bottom: 8px;">No pools found</div>
        <div style="font-size: 0.9rem;">Try adjusting your search or filters</div>
      </div>
    `;
    return;
  }
  
  poolsList.innerHTML = filteredPools.map(pool => createPoolRow(pool)).join('');
}

function createPoolRow(pool) {
  const tokenIcons = pool.tokens.map(token => 
    `<div class="token-icon ${token === '⚡' ? 'boost' : ''}">${token}</div>`
  ).join('');
  
  const changeClass = pool.tvlChange >= 0 ? 'positive' : 'negative';
  const volumeChangeClass = pool.volumeChange >= 0 ? 'positive' : 'negative';
  
  // Show user liquidity with highlighting if they have positions
  const hasUserLiquidity = pool.userLiquidity > 0;
  const liquidityClass = hasUserLiquidity ? 'user-has-liquidity' : '';
  
  return `
    <div class="pool-row ${liquidityClass}" data-pool-type="${pool.type}" data-tvl="${pool.tvl}" data-apr="${pool.apr}" onclick="navigateToPoolDetails('${pool.id}')">
      <div class="table-cell pool-info" data-label="Pool">
        <div class="pool-tokens">
          <div class="token-icons">
            ${tokenIcons}
          </div>
          <div class="pool-details">
            <div class="pool-name">${pool.name}</div>
            <div class="pool-type">${pool.composition}</div>
            <div class="pool-address">${pool.address}</div>
          </div>
        </div>
      </div>
      
      <div class="table-cell pool-tvl" data-label="TVL">
        <div class="value">${formatNumber(pool.tvl)}</div>
        <div class="change ${changeClass}">+${pool.tvlChange}%</div>
      </div>
      
      <div class="table-cell pool-apr" data-label="APR">
        <div class="apr-value">${pool.apr}%</div>
        <div class="apr-breakdown">
          <span class="trading-fees">${pool.tradingFees}% Trading</span>
          <span class="incentives">${pool.incentives}% Rewards</span>
        </div>
      </div>
      
      <div class="table-cell pool-volume" data-label="Volume (24h)">
        <div class="value">${formatNumber(pool.volume24h)}</div>
        <div class="change ${volumeChangeClass}">+${pool.volumeChange}%</div>
      </div>
      
      <div class="table-cell my-liquidity" data-label="My Liquidity">
        <div class="value ${hasUserLiquidity ? 'has-liquidity' : ''}">${hasUserLiquidity ? '$' + pool.userLiquidity.toFixed(2) : '$0.00'}</div>
        <div class="tokens">${pool.userTokens}</div>
      </div>
      
      <div class="table-cell pool-actions" data-label="Actions">
        <button class="action-btn add-liquidity ${pool.type === 'boosted' ? 'boost' : ''}" onclick="event.stopPropagation(); openLiquidityModal('${pool.id}', 'add')">Add</button>
        <button class="action-btn view-pool" onclick="event.stopPropagation(); viewPoolDetails('${pool.id}')">View</button>
        ${hasUserLiquidity ? `<button class="action-btn remove-liquidity" onclick="event.stopPropagation(); openLiquidityModal('${pool.id}', 'remove')">Remove</button>` : ''}
      </div>
    </div>
  `;
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toLocaleString();
}

// ==========================================
// FILTER AND SEARCH FUNCTIONALITY
// ==========================================

function initializeFilters() {
  // Search input
  const searchInput = document.getElementById('poolSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      accelerateState.searchQuery = e.target.value;
      renderPools();
    });
  }
  
  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      accelerateState.currentFilter = btn.dataset.filter;
      renderPools();
    });
  });
  
  // Sort select
  const sortSelect = document.getElementById('sortBy');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      accelerateState.currentSort = e.target.value;
      renderPools();
    });
  }
}

// ==========================================
// LIQUIDITY MODAL FUNCTIONS
// ==========================================

function openLiquidityModal(poolId, action) {
  if (!accelerateState.isWalletConnected) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  const pool = mockPools.find(p => p.id === poolId);
  if (!pool) {
    console.error('Pool not found:', poolId);
    return;
  }
  
  // For now, just show a message
  if (typeof window.showMessage === 'function') {
    window.showMessage(`${action === 'add' ? 'Add' : 'Remove'} liquidity for ${pool.name} coming soon!`, 'success');
  }
}

// ==========================================
// POOL DETAILS FUNCTIONS
// ==========================================

function viewPoolDetails(poolId) {
  const pool = mockPools.find(p => p.id === poolId);
  if (!pool) {
    console.error('Pool not found:', poolId);
    return;
  }
  
  console.log('Viewing pool details for:', pool.name);
  
  if