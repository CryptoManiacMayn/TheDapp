// ==========================================
// LENDER PAGE JAVASCRIPT - LIQUITY STYLE
// ==========================================

// Lender state management
let lenderState = {
  isWalletConnected: false,
  data: {
    // Protocol stats
    totalCollateral: 0,
    totalDebt: 0,
    borrowFee: 0.5,
    butfiApy: 42.5,
    
    // User position
    hasPosition: false,
    userCollateral: 0,
    userCollateralType: 'ETH',
    userDebt: 0,
    collateralRatio: 0,
    liquidationPrice: 0,
    
    // Stability pool
    stabilityPoolTotal: 24700000,
    stabilityPoolAPR: 18.5,
    userStabilityDeposit: 0,
    
    // BUTFI staking
    totalBUTFIStaked: 5800000,
    butfiStakingAPR: 28.3,
    userBUTFIStake: 0
  }
};

// Mock price data
const collateralPrices = {
  ETH: 2420,
  WBTC: 43850,
  wTAO: 625
};

// Minimum collateral ratios
const minCollateralRatios = {
  ETH: 110,
  WBTC: 110,
  wTAO: 150
};

// ==========================================
// WALLET CONNECTION HANDLERS
// ==========================================

function connectWallet() {
  console.log('Lender: connectWallet called - using global wallet');
  
  const connectBtn = document.getElementById('lenderConnectBtn');
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

// Listen for global wallet connection
window.addEventListener('globalWalletConnected', function(event) {
  console.log('Lender: Received global wallet connected event');
  
  lenderState.isWalletConnected = true;
  
  // Show lender content, hide wallet prompt
  const walletPrompt = document.getElementById('lenderWalletPrompt');
  const lenderContent = document.getElementById('lenderContent');
  
  if (walletPrompt) walletPrompt.style.display = 'none';
  if (lenderContent) lenderContent.style.display = 'block';
  
  // Load lender data
  loadLenderData();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Lender: Received global wallet disconnected event');
  
  lenderState.isWalletConnected = false;
  
  // Show wallet prompt, hide lender content
  const walletPrompt = document.getElementById('lenderWalletPrompt');
  const lenderContent = document.getElementById('lenderContent');
  
  if (walletPrompt) walletPrompt.style.display = 'block';
  if (lenderContent) lenderContent.style.display = 'none';
  
  // Reset lender data
  resetLenderData();
});

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

function loadLenderData() {
  if (!lenderState.isWalletConnected) {
    console.log("No wallet connected for lender data");
    return;
  }

  try {
    console.log("Loading lender data...");
    
    // Simulate loading protocol data
    updateProtocolOverview();
    
    // Check if user has an active position (mock)
    const hasPosition = Math.random() > 0.7; // 30% chance of having a position
    
    if (hasPosition) {
      // Generate mock position data
      const collateralType = ['ETH', 'WBTC', 'wTAO'][Math.floor(Math.random() * 3)];
      const collateralAmount = Math.random() * 10 + 1;
      const collateralValue = collateralAmount * collateralPrices[collateralType];
      const debtAmount = collateralValue / (1.5 + Math.random()); // 150-250% ratio
      
      lenderState.data.hasPosition = true;
      lenderState.data.userCollateral = collateralAmount;
      lenderState.data.userCollateralType = collateralType;
      lenderState.data.userDebt = debtAmount;
      lenderState.data.collateralRatio = (collateralValue / debtAmount) * 100;
      lenderState.data.liquidationPrice = (debtAmount * minCollateralRatios[collateralType] / 100) / collateralAmount;
      
      showUserPosition();
    }
    
    console.log("Lender data loaded successfully");
    
    if (typeof window.showMessage === 'function') {
      window.showMessage('Lender data updated!', 'success');
    }
  } catch (error) {
    console.error("Failed to load lender data:", error);
    if (typeof window.showMessage === 'function') {
      window.showMessage("Failed to load lender data: " + error.message, "error");
    }
    resetLenderData();
  }
}

function updateProtocolOverview() {
  // Calculate mock protocol totals
  const totalCollateralValue = 19925000 + Math.random() * 1000000;
  const totalDebtValue = 17900000 + Math.random() * 500000;
  
  // Update DOM
  const elements = {
    totalCollateral: document.getElementById('totalCollateral'),
    totalDebt: document.getElementById('totalDebt'),
    borrowFee: document.getElementById('borrowFee'),
    butfiApy: document.getElementById('butfiApy')
  };
  
  if (elements.totalCollateral) {
    elements.totalCollateral.textContent = `$${(totalCollateralValue / 1000000).toFixed(1)}M`;
  }
  if (elements.totalDebt) {
    elements.totalDebt.textContent = `${(totalDebtValue / 1000000).toFixed(1)}M BUTDC`;
  }
  if (elements.borrowFee) {
    elements.borrowFee.textContent = `${lenderState.data.borrowFee}%`;
  }
  if (elements.butfiApy) {
    elements.butfiApy.textContent = `${lenderState.data.butfiApy}%`;
  }
}

function showUserPosition() {
  const emptyPosition = document.getElementById('emptyPosition');
  const activePosition = document.getElementById('activePosition');
  
  if (emptyPosition) emptyPosition.style.display = 'none';
  if (activePosition) activePosition.style.display = 'block';
  
  // Update position details
  updatePositionDisplay();
}

function updatePositionDisplay() {
  const data = lenderState.data;
  
  // Update collateral
  const userCollateral = document.getElementById('userCollateral');
  if (userCollateral) {
    userCollateral.textContent = `${data.userCollateral.toFixed(3)} ${data.userCollateralType}`;
  }
  
  const userCollateralUSD = document.getElementById('userCollateralUSD');
  if (userCollateralUSD) {
    const value = data.userCollateral * collateralPrices[data.userCollateralType];
    userCollateralUSD.textContent = `$${value.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }
  
  // Update debt
  const userDebt = document.getElementById('userDebt');
  if (userDebt) {
    userDebt.textContent = `${Math.floor(data.userDebt).toLocaleString()} BUTDC`;
  }
  
  // Update ratio
  const userRatio = document.getElementById('userRatio');
  const ratioStatus = document.getElementById('ratioStatus');
  if (userRatio) {
    userRatio.textContent = `${data.collateralRatio.toFixed(1)}%`;
  }
  
  if (ratioStatus) {
    const minRatio = minCollateralRatios[data.userCollateralType];
    if (data.collateralRatio < minRatio * 1.1) {
      ratioStatus.textContent = 'Danger';
      ratioStatus.className = 'position-status danger';
    } else if (data.collateralRatio < minRatio * 1.5) {
      ratioStatus.textContent = 'Warning';
      ratioStatus.className = 'position-status warning';
    } else {
      ratioStatus.textContent = 'Safe';
      ratioStatus.className = 'position-status safe';
    }
  }
  
  // Update liquidation price
  const liquidationPrice = document.getElementById('liquidationPrice');
  if (liquidationPrice) {
    liquidationPrice.textContent = `$${data.liquidationPrice.toFixed(2)}`;
  }
}

function resetLenderData() {
  lenderState.data.hasPosition = false;
  
  // Reset position display
  const emptyPosition = document.getElementById('emptyPosition');
  const activePosition = document.getElementById('activePosition');
  
  if (emptyPosition) emptyPosition.style.display = 'block';
  if (activePosition) activePosition.style.display = 'none';
  
  // Reset overview values
  const elements = {
    totalCollateral: document.getElementById('totalCollateral'),
    totalDebt: document.getElementById('totalDebt')
  };
  
  if (elements.totalCollateral) elements.totalCollateral.textContent = '$0.00';
  if (elements.totalDebt) elements.totalDebt.textContent = '0 BUTDC';
}

// ==========================================
// MODAL HANDLERS
// ==========================================

function openTroveModal(collateralType = 'ETH') {
  console.log(`Opening trove modal for ${collateralType}`);
  if (typeof window.showMessage === 'function') {
    window.showMessage(`Opening ${collateralType} borrowing interface...`, 'success');
  }
  
  // In a real implementation, this would open a modal
  setTimeout(() => {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Trove modal functionality coming soon!', 'success');
    }
  }, 1000);
}

function adjustTrove() {
  console.log('Adjusting trove');
  if (typeof window.showMessage === 'function') {
    window.showMessage('Opening trove adjustment interface...', 'success');
  }
}

function closeTrove() {
  console.log('Closing trove');
  if (typeof window.showMessage === 'function') {
    window.showMessage('Are you sure you want to close your trove?', 'error');
  }
}

function openStabilityPoolModal() {
  console.log('Opening stability pool modal');
  if (typeof window.showMessage === 'function') {
    window.showMessage('Stability pool deposit interface opening...', 'success');
  }
}

function openBUTFIStakeModal() {
  console.log('Opening BUTFI staking modal');
  if (typeof window.showMessage === 'function') {
    window.showMessage('BUTFI staking interface opening...', 'success');
  }
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

function initializeLenderPage() {
  console.log('Lender page initialized');
  console.log('Global wallet state:', window.globalWalletState);
  
  // Initialize with default state
  resetLenderData();
  
  // Check if wallet is already connected
  // Using the same pattern as other pages - check hasUserConnected
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, setting up lender');
    console.log('Account:', window.globalWalletState.account);
    lenderState.isWalletConnected = true;
    
    const walletPrompt = document.getElementById('lenderWalletPrompt');
    const lenderContent = document.getElementById('lenderContent');
    
    if (walletPrompt) walletPrompt.style.display = 'none';
    if (lenderContent) lenderContent.style.display = 'block';
    
    // Trigger the wallet connected event handler
    loadLenderData();
  } else {
    console.log('No wallet connected on page load');
    // Show wallet prompt
    const walletPrompt = document.getElementById('lenderWalletPrompt');
    const lenderContent = document.getElementById('lenderContent');
    
    if (walletPrompt) walletPrompt.style.display = 'block';
    if (lenderContent) lenderContent.style.display = 'none';
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLenderPage);
} else {
  // If already loaded (dynamic loading case)
  // Add a slightly longer delay to ensure global wallet state is available
  setTimeout(initializeLenderPage, 200);
}