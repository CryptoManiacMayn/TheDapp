// ==========================================
// ACCELERATE PAGE JAVASCRIPT - BEEFY-STYLE VAULTS
// ==========================================

// Accelerate state management
let accelerateState = {
  isWalletConnected: false,
  selectedVault: null,
  userPositions: [],
  vaults: [],
  filters: {
    search: '',
    type: 'all',
    sort: 'apy'
  }
};

// Mock vault data (in production, this would come from APIs)
const mockVaults = [
  {
    id: 'eth-usdc-lp',
    name: 'ETH-USDC LP',
    type: 'lp',
    symbol: 'ETH-USDC',
    icon: '🔄',
    apy: 24.56,
    tvl: 2847292,
    daily: 0.067,
    fee: 0.5,
    platform: 'Uniswap V3',
    strategy: 'Auto-compounds LP rewards and trading fees through optimal range management',
    isStable: false,
    tokens: ['ETH', 'USDC'],
    pricePerShare: 1.0847
  },
  {
    id: 'usdc-vault',
    name: 'USDC Vault',
    type: 'single',
    symbol: 'USDC',
    icon: '💵',
    apy: 8.32,
    tvl: 5294837,
    daily: 0.023,
    fee: 0.5,
    platform: 'Aave',
    strategy: 'Auto-compounds USDC lending rewards on Aave with optimal collateral management',
    isStable: true,
    tokens: ['USDC'],
    pricePerShare: 1.1234
  },
  {
    id: 'wbtc-eth-lp',
    name: 'WBTC-ETH LP',
    type: 'lp',
    symbol: 'WBTC-ETH',
    icon: '₿',
    apy: 31.89,
    tvl: 1847293,
    daily: 0.087,
    fee: 0.5,
    platform: 'SushiSwap',
    strategy: 'Auto-compounds WBTC-ETH LP rewards with impermanent loss protection strategies',
    isStable: false,
    tokens: ['WBTC', 'ETH'],
    pricePerShare: 1.0523
  },
  {
    id: 'dai-vault',
    name: 'DAI Maxi',
    type: 'single',
    symbol: 'DAI',
    icon: '🏛️',
    apy: 7.45,
    tvl: 3847592,
    daily: 0.020,
    fee: 0.5,
    platform: 'Compound',
    strategy: 'Auto-compounds DAI lending rewards on Compound with yield optimization',
    isStable: true,
    tokens: ['DAI'],
    pricePerShare: 1.0956
  },
  {
    id: 'link-vault',
    name: 'LINK Vault',
    type: 'single',
    symbol: 'LINK',
    icon: '🔗',
    apy: 12.67,
    tvl: 987543,
    daily: 0.035,
    fee: 0.5,
    platform: 'Beefy',
    strategy: 'Auto-compounds LINK staking rewards with optimal delegation strategies',
    isStable: false,
    tokens: ['LINK'],
    pricePerShare: 1.0743
  },
  {
    id: 'matic-usdc-lp',
    name: 'MATIC-USDC LP',
    type: 'lp',
    symbol: 'MATIC-USDC',
    icon: '🔷',
    apy: 18.34,
    tvl: 1293847,
    daily: 0.050,
    fee: 0.5,
    platform: 'QuickSwap',
    strategy: 'Auto-compounds MATIC-USDC LP rewards with dynamic fee harvesting',
    isStable: false,
    tokens: ['MATIC', 'USDC'],
    pricePerShare: 1.0634
  }
];

// ==========================================
// WALLET CONNECTION FUNCTIONS
// ==========================================

function connectWallet() {
  console.log('Accelerate: connectWallet called - using global wallet');
  
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
  console.log('Accelerate: Received global wallet connected event');
  
  accelerateState.isWalletConnected = true;
  
  // Show accelerate content, hide wallet prompt
  const walletPrompt = document.getElementById('walletPrompt');
  const accelerateContent = document.getElementById('accelerateContent');
  
  if (walletPrompt) walletPrompt.style.display = 'none';
  if (accelerateContent) accelerateContent.style.display = 'block';
  
  // Load accelerate data
  loadAccelerateData();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Accelerate: Received global wallet disconnected event');
  
  accelerateState.isWalletConnected = false;
  
  // Show wallet prompt, hide accelerate content
  const walletPrompt = document.getElementById('walletPrompt');
  const accelerateContent = document.getElementById('accelerateContent');
  
  if (walletPrompt) walletPrompt.style.display = 'block';
  if (accelerateContent) accelerateContent.style.display = 'none';
  
  // Reset accelerate data
  resetAccelerateData();
});

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

function loadAccelerateData() {
  if (!accelerateState.isWalletConnected) {
    console.log("No wallet connected for accelerate data");
    return;
  }

  try {
    console.log("Loading accelerate data...");
    
    // Load vault data
    accelerateState.vaults = mockVaults;
    
    // Generate mock user positions
    generateMockPositions();
    
    // Update overview
    updateOverview();
    
    // Render vaults
    renderVaults();
    
    // Update positions table
    updatePositionsTable();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log("Accelerate data loaded successfully");
    
    if (typeof window.showMessage === 'function') {
      window.showMessage('Vault data loaded!', 'success');
    }
  } catch (error) {
    console.error("Failed to load accelerate data:", error);
    if (typeof window.showMessage === 'function') {
      window.showMessage("Failed to load vault data: " + error.message, "error");
    }
    resetAccelerateData();
  }
}

function generateMockPositions() {
  // Generate some mock positions for demo
  accelerateState.userPositions = [
    {
      vaultId: 'eth-usdc-lp',
      deposited: 1.5,
      mooTokens: 1.427,
      currentValue: 1625.34,
      earnings: 125.34,
      apy: 24.56
    },
    {
      vaultId: 'usdc-vault',
      deposited: 5000,
      mooTokens: 4452.23,
      currentValue: 5416.78,
      earnings: 416.78,
      apy: 8.32
    }
  ];
}

function updateOverview() {
  const totalDeposited = accelerateState.userPositions.reduce((sum, pos) => sum + (pos.deposited * 1000), 0); // Mock USD values
  const totalEarnings = accelerateState.userPositions.reduce((sum, pos) => sum + pos.earnings, 0);
  const avgApy = accelerateState.userPositions.length > 0 
    ? accelerateState.userPositions.reduce((sum, pos) => sum + pos.apy, 0) / accelerateState.userPositions.length
    : 0;
  const activeVaults = accelerateState.userPositions.length;

  const elements = {
    totalDeposited: document.getElementById('totalDeposited'),
    totalEarnings: document.getElementById('totalEarnings'),
    avgApy: document.getElementById('avgApy'),
    activeVaults: document.getElementById('activeVaults')
  };

  if (elements.totalDeposited) {
    elements.totalDeposited.textContent = `$${totalDeposited.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }
  if (elements.totalEarnings) {
    elements.totalEarnings.textContent = `$${totalEarnings.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }
  if (elements.avgApy) {
    elements.avgApy.textContent = `${avgApy.toFixed(2)}%`;
  }
  if (elements.activeVaults) {
    elements.activeVaults.textContent = activeVaults.toString();
  }
}

function renderVaults() {
  const vaultsGrid = document.getElementById('vaultsGrid');
  if (!vaultsGrid) return;

  const filteredVaults = getFilteredVaults();
  
  vaultsGrid.innerHTML = filteredVaults.map(vault => `
    <div class="vault-card" onclick="openVaultModal('${vault.id}')">
      <div class="vault-header">
        <div class="vault-info">
          <div class="vault-icon">${vault.icon}</div>
          <div class="vault-details">
            <h3>${vault.name}</h3>
            <div class="vault-type">${vault.platform} • ${vault.type.toUpperCase()}</div>
          </div>
        </div>
        <div class="vault-apy">
          <div class="apy-value">${vault.apy.toFixed(2)}%</div>
          <div class="apy-label">APY</div>
        </div>
      </div>
      
      <div class="vault-stats">
        <div class="stat-item">
          <div class="stat-value">$${formatNumber(vault.tvl)}</div>
          <div class="stat-label">TVL</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${vault.daily.toFixed(3)}%</div>
          <div class="stat-label">Daily</div>
        </div>
      </div>
      
      <div class="vault-actions">
        <button class="vault-btn primary" onclick="event.stopPropagation(); quickDeposit('${vault.id}')">
          Deposit
        </button>
        <button class="vault-btn secondary" onclick="event.stopPropagation(); openVaultModal('${vault.id}')">
          Details
        </button>
      </div>
    </div>
  `).join('');
}

function getFilteredVaults() {
  let filtered = accelerateState.vaults;
  
  // Apply type filter
  if (accelerateState.filters.type !== 'all') {
    if (accelerateState.filters.type === 'stable') {
      filtered = filtered.filter(vault => vault.isStable);
    } else {
      filtered = filtered.filter(vault => vault.type === accelerateState.filters.type);
    }
  }
  
  // Apply search filter
  if (accelerateState.filters.search) {
    const search = accelerateState.filters.search.toLowerCase();
    filtered = filtered.filter(vault => 
      vault.name.toLowerCase().includes(search) ||
      vault.platform.toLowerCase().includes(search) ||
      vault.tokens.some(token => token.toLowerCase().includes(search))
    );
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    switch (accelerateState.filters.sort) {
      case 'apy':
        return b.apy - a.apy;
      case 'tvl':
        return b.tvl - a.tvl;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  
  return filtered;
}

function updatePositionsTable() {
  const positionsTableBody = document.getElementById('positionsTableBody');
  if (!positionsTableBody) return;
  
  if (accelerateState.userPositions.length === 0) {
    positionsTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 40px;">
          No vault positions found. Deposit into a vault to start earning!
        </td>
      </tr>
    `;
    return;
  }
  
  positionsTableBody.innerHTML = accelerateState.userPositions.map(position => {
    const vault = accelerateState.vaults.find(v => v.id === position.vaultId);
    if (!vault) return '';
    
    return `
      <tr>
        <td>
          <div class="vault-name-cell">
            <div class="vault-icon-small">${vault.icon}</div>
            <div>
              <div style="font-weight: 600;">${vault.name}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">${vault.platform}</div>
            </div>
          </div>
        </td>
        <td>${position.deposited} ${vault.symbol}</td>
        <td>${position.mooTokens.toFixed(4)} moo${vault.symbol}</td>
        <td>$${position.currentValue.toFixed(2)}</td>
        <td class="text-success">+$${position.earnings.toFixed(2)}</td>
        <td class="text-success">${position.apy.toFixed(2)}%</td>
        <td>
          <div class="position-actions">
            <button class="position-btn deposit" onclick="quickDeposit('${vault.id}')">+</button>
            <button class="position-btn withdraw" onclick="quickWithdraw('${vault.id}')">-</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function resetAccelerateData() {
  accelerateState.userPositions = [];
  accelerateState.vaults = [];
  accelerateState.selectedVault = null;
  
  // Reset overview
  const elements = {
    totalDeposited: document.getElementById('totalDeposited'),
    totalEarnings: document.getElementById('totalEarnings'),
    avgApy: document.getElementById('avgApy'),
    activeVaults: document.getElementById('activeVaults')
  };
  
  Object.values(elements).forEach(el => {
    if (el) {
      if (el.id.includes('Apy')) {
        el.textContent = '0.00%';
      } else if (el.id === 'activeVaults') {
        el.textContent = '0';
      } else {
        el.textContent = '$0.00';
      }
    }
  });
  
  // Clear vaults grid
  const vaultsGrid = document.getElementById('vaultsGrid');
  if (vaultsGrid) {
    vaultsGrid.innerHTML = '';
  }
  
  // Reset positions table
  updatePositionsTable();
}

// ==========================================
// EVENT LISTENERS SETUP
// ==========================================

function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('vaultSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      accelerateState.filters.search = e.target.value;
      renderVaults();
    });
  }
  
  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      accelerateState.filters.type = e.target.dataset.filter;
      renderVaults();
    });
  });
  
  // Sort dropdown
  const sortSelect = document.getElementById('sortVaults');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      accelerateState.filters.sort = e.target.value;
      renderVaults();
    });
  }
  
  // Modal tab switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      switchTab(tabName);
    });
  });
}

// ==========================================
// VAULT MODAL FUNCTIONS
// ==========================================

function openVaultModal(vaultId) {
  const vault = accelerateState.vaults.find(v => v.id === vaultId);
  if (!vault) return;
  
  accelerateState.selectedVault = vault;
  
  // Update modal content
  document.getElementById('modalVaultName').textContent = vault.name;
  document.getElementById('modalApy').textContent = `${vault.apy.toFixed(2)}%`;
  document.getElementById('modalTvl').textContent = `$${formatNumber(vault.tvl)}`;
  document.getElementById('modalDaily').textContent = `${vault.daily.toFixed(3)}%`;
  document.getElementById('modalFee').textContent = `${vault.fee}%`;
  document.getElementById('modalStrategy').textContent = vault.strategy;
  
  // Update token symbols
  document.getElementById('depositSymbol').textContent = vault.symbol;
  document.getElementById('balanceSymbol').textContent = vault.symbol;
  document.getElementById('withdrawSymbol').textContent = `moo${vault.symbol}`;
  document.getElementById('mooSymbol').textContent = `moo${vault.symbol}`;
  
  // Show modal
  document.getElementById('vaultModal').style.display = 'flex';
  
  // Update balances
  updateModalBalances();
}

function closeVaultModal() {
  document.getElementById('vaultModal').style.display = 'none';
  accelerateState.selectedVault = null;
}

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  // Update tab panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

function updateModalBalances() {
  if (!accelerateState.selectedVault) return;
  
  // Mock user balances
  const userBalance = 10.5; // Mock balance
  const userPosition = accelerateState.userPositions.find(p => p.vaultId === accelerateState.selectedVault.id);
  const mooBalance = userPosition ? userPosition.mooTokens : 0;
  
  document.getElementById('userBalance').textContent = userBalance.toFixed(4);
  document.getElementById('mooBalance').textContent = mooBalance.toFixed(4);
  
  // Update exchange rate
  const rate = accelerateState.selectedVault.pricePerShare;
  document.getElementById('exchangeRate').textContent = `1 ${accelerateState.selectedVault.symbol} = ${rate.toFixed(4)} moo${accelerateState.selectedVault.symbol}`;
}

// ==========================================
// TRANSACTION FUNCTIONS
// ==========================================

function setMaxDeposit() {
  const userBalance = parseFloat(document.getElementById('userBalance').textContent);
  document.getElementById('depositAmount').value = userBalance.toFixed(4);
  updateDepositPreview();
}

function setMaxWithdraw() {
  const mooBalance = parseFloat(document.getElementById('mooBalance').textContent);
  document.getElementById('withdrawAmount').value = mooBalance.toFixed(4);
  updateWithdrawPreview();
}

function updateDepositPreview() {
  const amount = parseFloat(document.getElementById('depositAmount').value) || 0;
  const rate = accelerateState.selectedVault ? accelerateState.selectedVault.pricePerShare : 1;
  const mooTokens = amount / rate;
  
  document.getElementById('mooTokensReceived').textContent = `${mooTokens.toFixed(4)} moo${accelerateState.selectedVault.symbol}`;
}

function updateWithdrawPreview() {
  const mooAmount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
  const rate = accelerateState.selectedVault ? accelerateState.selectedVault.pricePerShare : 1;
  const tokens = mooAmount * rate;
  const fee = tokens * 0.001; // 0.1% withdrawal fee
  const tokensAfterFee = tokens - fee;
  
  document.getElementById('tokensReceived').textContent = `${tokensAfterFee.toFixed(4)} ${accelerateState.selectedVault.symbol}`;
}

async function handleDeposit() {
  if (!accelerateState.selectedVault) return;
  
  const amount = parseFloat(document.getElementById('depositAmount').value);
  if (!amount || amount <= 0) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Please enter a valid deposit amount', 'error');
    }
    return;
  }
  
  try {
    showLoadingOverlay('Processing deposit...');
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update user position
    const existingPosition = accelerateState.userPositions.find(p => p.vaultId === accelerateState.selectedVault.id);
    const rate = accelerateState.selectedVault.pricePerShare;
    const mooTokens = amount / rate;
    
    if (existingPosition) {
      existingPosition.deposited += amount;
      existingPosition.mooTokens += mooTokens;
      existingPosition.currentValue = existingPosition.mooTokens * rate * 1000; // Mock USD value
    } else {
      accelerateState.userPositions.push({
        vaultId: accelerateState.selectedVault.id,
        deposited: amount,
        mooTokens: mooTokens,
        currentValue: mooTokens * rate * 1000,
        earnings: 0,
        apy: accelerateState.selectedVault.apy
      });
    }
    
    // Update UI
    updateOverview();
    updatePositionsTable();
    updateModalBalances();
    
    // Clear input
    document.getElementById('depositAmount').value = '';
    updateDepositPreview();
    
    hideLoadingOverlay();
    closeVaultModal();
    
    if (typeof window.showMessage === 'function') {
      window.showMessage(`Successfully deposited ${amount} ${accelerateState.selectedVault.symbol}!`, 'success');
    }
    
  } catch (error) {
    hideLoadingOverlay();
    console.error('Deposit failed:', error);
    if (typeof window.showMessage === 'function') {
      window.showMessage('Deposit failed: ' + error.message, 'error');
    }
  }
}

async function handleWithdraw() {
  if (!accelerateState.selectedVault) return;
  
  const mooAmount = parseFloat(document.getElementById('withdrawAmount').value);
  if (!mooAmount || mooAmount <= 0) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Please enter a valid withdrawal amount', 'error');
    }
    return;
  }
  
  const position = accelerateState.userPositions.find(p => p.vaultId === accelerateState.selectedVault.id);
  if (!position || position.mooTokens < mooAmount) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Insufficient mooToken balance', 'error');
    }
    return;
  }
  
  try {
    showLoadingOverlay('Processing withdrawal...');
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const rate = accelerateState.selectedVault.pricePerShare;
    const tokens = mooAmount * rate;
    const fee = tokens * 0.001;
    const tokensAfterFee = tokens - fee;
    
    // Update position
    position.mooTokens -= mooAmount;
    position.deposited -= tokensAfterFee;
    position.currentValue = position.mooTokens * rate * 1000;
    
    // Remove position if empty
    if (position.mooTokens < 0.0001) {
      const index = accelerateState.userPositions.indexOf(position);
      accelerateState.userPositions.splice(index, 1);
    }
    
    // Update UI
    updateOverview();
    updatePositionsTable();
    updateModalBalances();
    
    // Clear input
    document.getElementById('withdrawAmount').value = '';
    updateWithdrawPreview();
    
    hideLoadingOverlay();
    closeVaultModal();
    
    if (typeof window.showMessage === 'function') {
      window.showMessage(`Successfully withdrew ${tokensAfterFee.toFixed(4)} ${accelerateState.selectedVault.symbol}!`, 'success');
    }
    
  } catch (error) {
    hideLoadingOverlay();
    console.error('Withdrawal failed:', error);
    if (typeof window.showMessage === 'function') {
      window.showMessage('Withdrawal failed: ' + error.message, 'error');
    }
  }
}

function quickDeposit(vaultId) {
  openVaultModal(vaultId);
  setTimeout(() => {
    switchTab('deposit');
  }, 100);
}

function quickWithdraw(vaultId) {
  openVaultModal(vaultId);
  setTimeout(() => {
    switchTab('withdraw');
  }, 100);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

function showLoadingOverlay(message = 'Processing...') {
  const overlay = document.getElementById('loadingOverlay');
  const loadingText = document.querySelector('.loading-text');
  
  if (overlay) {
    if (loadingText) loadingText.textContent = message;
    overlay.style.display = 'flex';
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// ==========================================
// HARVEST & COMPOUND SIMULATION
// ==========================================

function simulateHarvests() {
  if (!accelerateState.isWalletConnected || accelerateState.userPositions.length === 0) {
    return;
  }
  
  // Simulate compound growth every 30 seconds for demo
  setInterval(() => {
    accelerateState.userPositions.forEach(position => {
      const vault = accelerateState.vaults.find(v => v.id === position.vaultId);
      if (vault) {
        // Simulate daily compound growth
        const dailyGrowth = vault.daily / 100 / 24 / 120; // Per 30 seconds approximation
        position.mooTokens *= (1 + dailyGrowth);
        position.currentValue = position.mooTokens * vault.pricePerShare * 1000;
        position.earnings = position.currentValue - (position.deposited * 1000);
      }
    });
    
    // Update UI if visible
    if (accelerateState.isWalletConnected) {
      updateOverview();
      updatePositionsTable();
    }
  }, 30000); // Every 30 seconds for demo
}

// ==========================================
// MODAL EVENT LISTENERS
// ==========================================

function setupModalEventListeners() {
  // Input event listeners for live preview updates
  const depositInput = document.getElementById('depositAmount');
  if (depositInput) {
    depositInput.addEventListener('input', updateDepositPreview);
  }
  
  const withdrawInput = document.getElementById('withdrawAmount');
  if (withdrawInput) {
    withdrawInput.addEventListener('input', updateWithdrawPreview);
  }
  
  // Close modal when clicking outside
  const modal = document.getElementById('vaultModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeVaultModal();
      }
    });
  }
  
  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVaultModal();
    }
  });
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

function initializeAcceleratePage() {
  console.log('Accelerate page initialized');
  
  // Initialize with default state
  resetAccelerateData();
  
  // Setup modal event listeners
  setupModalEventListeners();
  
  // Check if wallet is already connected
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, setting up accelerate');
    accelerateState.isWalletConnected = true;
    
    const walletPrompt = document.getElementById('walletPrompt');
    const accelerateContent = document.getElementById('accelerateContent');
    
    if (walletPrompt) walletPrompt.style.display = 'none';
    if (accelerateContent) accelerateContent.style.display = 'block';
    
    loadAccelerateData();
    
    // Start harvest simulation
    setTimeout(simulateHarvests, 5000);
  } else {
    // Show wallet prompt
    const walletPrompt = document.getElementById('walletPrompt');
    const accelerateContent = document.getElementById('accelerateContent');
    
    if (walletPrompt) walletPrompt.style.display = 'block';
    if (accelerateContent) accelerateContent.style.display = 'none';
  }
}

// ==========================================
// ADVANCED FEATURES
// ==========================================

// APY calculation with compound frequency
function calculateRealAPY(nominalAPY, compoundFrequency = 365) {
  const rate = nominalAPY / 100;
  const realAPY = Math.pow(1 + rate / compoundFrequency, compoundFrequency) - 1;
  return realAPY * 100;
}

// Impermanent loss calculator for LP positions
function calculateImpermanentLoss(priceRatio) {
  const il = 2 * Math.sqrt(priceRatio) / (1 + priceRatio) - 1;
  return il * 100;
}

// Risk score calculation
function calculateRiskScore(vault) {
  let score = 0;
  
  // Platform risk
  const platformRisk = {
    'Uniswap V3': 2,
    'Aave': 1,
    'Compound': 1,
    'SushiSwap': 3,
    'QuickSwap': 3,
    'Beefy': 2
  };
  score += platformRisk[vault.platform] || 3;
  
  // Asset risk
  if (vault.isStable) score += 1;
  else score += 3;
  
  // LP risk
  if (vault.type === 'lp') score += 2;
  
  // APY risk (high APY = higher risk)
  if (vault.apy > 30) score += 3;
  else if (vault.apy > 15) score += 2;
  else score += 1;
  
  return Math.min(score, 10); // Cap at 10
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAcceleratePage);
} else {
  // If already loaded (dynamic loading case)
  setTimeout(initializeAcceleratePage, 100);
}

// ==========================================
// GLOBAL FUNCTIONS FOR EXTERNAL ACCESS
// ==========================================

// Export functions for global access
window.accelerateAPI = {
  openVaultModal,
  closeVaultModal,
  quickDeposit,
  quickWithdraw,
  handleDeposit,
  handleWithdraw,
  setMaxDeposit,
  setMaxWithdraw,
  connectWallet
};