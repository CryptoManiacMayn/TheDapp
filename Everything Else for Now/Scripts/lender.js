// ==========================================
// LENDER PAGE JAVASCRIPT - WITH AUTO-BLUR FOCUS
// ==========================================

// Lender state management
let lenderState = {
  isWalletConnected: false,
  data: {
    // Protocol stats
    totalCollateral: 19900000,
    totalDebt: 17900000,
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
    userStabilityRewards: 0,
    
    // BUTFI staking
    totalBUTFIStaked: 5800000,
    butfiStakingAPR: 28.3,
    userBUTFIStake: 0,
    userBUTFIFees: 0
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
// AUTO-BLUR FOCUS FUNCTIONALITY
// ==========================================

function setupAutoBlur() {
  const buttons = document.querySelectorAll(`
    .lender-container .borrow-btn, 
    .lender-container .open-trove-btn, 
    .lender-container .adjust-btn, 
    .lender-container .close-btn,
    .lender-container .deposit-btn, 
    .lender-container .withdraw-btn, 
    .lender-container .claim-rewards-btn,
    .lender-container .stake-butfi-btn, 
    .lender-container .unstake-butfi-btn, 
    .lender-container .claim-fees-btn,
    .lender-container .wallet-action-btn,
    .lender-container .action-btn
  `);
  
  buttons.forEach(button => {
    // Remove any existing listeners to avoid duplicates
    button.removeEventListener('click', handleButtonClick);
    button.removeEventListener('keydown', handleButtonKeydown);
    button.removeEventListener('mousedown', handleButtonMousedown);
    
    // Add new listeners
    button.addEventListener('click', handleButtonClick);
    button.addEventListener('keydown', handleButtonKeydown);
    button.addEventListener('mousedown', handleButtonMousedown);
  });
}

function handleButtonClick(event) {
  const button = event.target;
  
  // Add auto-blur class to trigger fade transition
  button.classList.add('auto-blur');
  
  // Remove focus after animation completes
  setTimeout(() => {
    button.blur();
    // Force outline removal for stubborn buttons
    button.style.outline = 'none';
    button.classList.remove('auto-blur');
    
    // Clean up inline style after a short delay
    setTimeout(() => {
      button.style.outline = '';
    }, 100);
  }, 400); // Slightly longer than CSS transition
}

function handleButtonKeydown(event) {
  // Handle Enter and Space key presses
  if (event.key === 'Enter' || event.key === ' ') {
    handleButtonClick(event);
  }
}

function handleButtonMousedown(event) {
  // Also handle mousedown for immediate feedback
  const button = event.target;
  button.classList.add('auto-blur');
}

// ==========================================
// WALLET EVENT LISTENERS
// ==========================================

// Listen for global wallet connection
window.addEventListener('globalWalletConnected', function(event) {
  console.log('Lender: Received global wallet connected event');
  
  lenderState.isWalletConnected = true;
  
  // Load user data
  loadLenderData();
  
  // Update UI to show connected state
  updateConnectedState();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Lender: Received global wallet disconnected event');
  
  lenderState.isWalletConnected = false;
  
  // Reset user data
  resetLenderData();
  
  // Update UI to show disconnected state
  updateDisconnectedState();
});

// ==========================================
// CONNECTED/DISCONNECTED STATE UPDATES
// ==========================================

function updateConnectedState() {
  // Update action buttons to show actual functionality instead of "Connect Wallet"
  const walletActionBtns = document.querySelectorAll('.wallet-action-btn');
  
  walletActionBtns.forEach(btn => {
    const walletText = btn.querySelector('.wallet-action-text');
    if (walletText) {
      const originalText = walletText.textContent;
      
      if (originalText.includes('Open Trove')) {
        walletText.textContent = 'Open Trove';
      } else if (originalText.includes('Borrow')) {
        walletText.textContent = 'Borrow BUTDC';
      } else if (originalText.includes('Deposit')) {
        walletText.textContent = 'Deposit BUTDC';
      } else if (originalText.includes('Stake')) {
        walletText.textContent = 'Stake BUTFI';
      }
    }
  });
  
  // Highlight user position elements
  const userHighlights = document.querySelectorAll('.user-position-highlight, .user-pool-highlight, .user-butfi-highlight');
  userHighlights.forEach(element => {
    element.classList.add('connected');
  });
  
  // Enable previously disabled buttons if user has positions
  updateUserSpecificButtons();
  
  // Set wallet connected attribute for CSS
  const lenderContainer = document.querySelector('.lender-container');
  if (lenderContainer) {
    lenderContainer.setAttribute('data-wallet-connected', 'true');
  }
  
  // Bind button handlers and auto-blur
  bindButtonHandlers();
  setupAutoBlur();
  
  if (typeof window.showMessage === 'function') {
    window.showMessage('Lender features now available!', 'success');
  }
}

function updateDisconnectedState() {
  // Update action buttons to show "Connect Wallet" text
  const walletActionBtns = document.querySelectorAll('.wallet-action-btn');
  
  walletActionBtns.forEach(btn => {
    const walletText = btn.querySelector('.wallet-action-text');
    if (walletText) {
      const currentText = walletText.textContent;
      
      if (currentText.includes('Open Trove')) {
        walletText.textContent = 'Connect Wallet to Open Trove';
      } else if (currentText.includes('Borrow')) {
        walletText.textContent = 'Connect Wallet to Borrow';
      } else if (currentText.includes('Deposit')) {
        walletText.textContent = 'Connect Wallet to Deposit';
      } else if (currentText.includes('Stake')) {
        walletText.textContent = 'Connect Wallet to Stake';
      }
    }
  });
  
  // Remove highlight from user elements
  const userHighlights = document.querySelectorAll('.user-position-highlight, .user-pool-highlight, .user-butfi-highlight');
  userHighlights.forEach(element => {
    element.classList.remove('connected');
  });
  
  // Disable user-specific buttons
  const userBtns = document.querySelectorAll('.withdraw-btn, .claim-rewards-btn, .unstake-butfi-btn, .claim-fees-btn, .adjust-btn, .close-btn');
  userBtns.forEach(btn => {
    btn.disabled = true;
  });
  
  // Remove wallet connected attribute for CSS
  const lenderContainer = document.querySelector('.lender-container');
  if (lenderContainer) {
    lenderContainer.removeAttribute('data-wallet-connected');
  }
}

function updateUserSpecificButtons() {
  // Enable buttons based on user positions
  const withdrawBtn = document.querySelector('.withdraw-btn');
  const claimRewardsBtn = document.querySelector('.claim-rewards-btn');
  const unstakeBtnButfi = document.querySelector('.unstake-butfi-btn');
  const claimFeesBtn = document.querySelector('.claim-fees-btn');
  
  if (withdrawBtn) {
    withdrawBtn.disabled = lenderState.data.userStabilityDeposit <= 0;
  }
  if (claimRewardsBtn) {
    claimRewardsBtn.disabled = lenderState.data.userStabilityRewards <= 0;
  }
  if (unstakeBtnButfi) {
    unstakeBtnButfi.disabled = lenderState.data.userBUTFIStake <= 0;
  }
  if (claimFeesBtn) {
    claimFeesBtn.disabled = lenderState.data.userBUTFIFees <= 0;
  }
}

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
    
    // Generate mock stability pool data
    if (Math.random() > 0.5) {
      lenderState.data.userStabilityDeposit = Math.random() * 10000 + 1000;
      lenderState.data.userStabilityRewards = Math.random() * 500;
    }
    
    // Generate mock BUTFI staking data
    if (Math.random() > 0.6) {
      lenderState.data.userBUTFIStake = Math.random() * 50000 + 5000;
      lenderState.data.userBUTFIFees = Math.random() * 2;
    }
    
    // Update user displays
    updateUserDisplays();
    
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
  // Calculate dynamic protocol totals
  const totalCollateralValue = lenderState.data.totalCollateral + Math.random() * 1000000;
  const totalDebtValue = lenderState.data.totalDebt + Math.random() * 500000;
  
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

function updateUserDisplays() {
  // Update stability pool user data
  const userStabilityDeposit = document.querySelector('.user-stability-deposit');
  const userStabilityRewards = document.querySelector('.user-stability-rewards');
  
  if (userStabilityDeposit) {
    userStabilityDeposit.textContent = `${Math.floor(lenderState.data.userStabilityDeposit).toLocaleString()} BUTDC`;
  }
  if (userStabilityRewards) {
    userStabilityRewards.textContent = `${lenderState.data.userStabilityRewards.toFixed(2)} BUTFI`;
  }
  
  // Update BUTFI staking user data
  const userButfiStake = document.querySelector('.user-butfi-stake');
  const userButfiFees = document.querySelector('.user-butfi-fees');
  
  if (userButfiStake) {
    userButfiStake.textContent = `${Math.floor(lenderState.data.userBUTFIStake).toLocaleString()} BUTFI`;
  }
  if (userButfiFees) {
    userButfiFees.textContent = `${lenderState.data.userBUTFIFees.toFixed(4)} ETH`;
  }
  
  // Update button states
  updateUserSpecificButtons();
}

function resetLenderData() {
  lenderState.data.hasPosition = false;
  lenderState.data.userStabilityDeposit = 0;
  lenderState.data.userStabilityRewards = 0;
  lenderState.data.userBUTFIStake = 0;
  lenderState.data.userBUTFIFees = 0;
  
  // Reset position display
  const emptyPosition = document.getElementById('emptyPosition');
  const activePosition = document.getElementById('activePosition');
  
  if (emptyPosition) emptyPosition.style.display = 'block';
  if (activePosition) activePosition.style.display = 'none';
  
  // Reset user displays
  const userStabilityDeposit = document.querySelector('.user-stability-deposit');
  const userStabilityRewards = document.querySelector('.user-stability-rewards');
  const userButfiStake = document.querySelector('.user-butfi-stake');
  const userButfiFees = document.querySelector('.user-butfi-fees');
  
  if (userStabilityDeposit) userStabilityDeposit.textContent = '0 BUTDC';
  if (userStabilityRewards) userStabilityRewards.textContent = '0 BUTFI';
  if (userButfiStake) userButfiStake.textContent = '0 BUTFI';
  if (userButfiFees) userButfiFees.textContent = '0 ETH';
  
  // Reset overview values to defaults
  const elements = {
    totalCollateral: document.getElementById('totalCollateral'),
    totalDebt: document.getElementById('totalDebt')
  };
  
  if (elements.totalCollateral) elements.totalCollateral.textContent = '$19.9M';
  if (elements.totalDebt) elements.totalDebt.textContent = '17.9M BUTDC';
}

// ==========================================
// MODAL HANDLERS
// ==========================================

function openTroveModal(collateralType = 'ETH') {
  if (!lenderState.isWalletConnected) {
    // Instead of showing error, trigger wallet connection
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    } else {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
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
  if (!lenderState.isWalletConnected) {
    // Instead of showing error, trigger wallet connection
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    } else {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  console.log('Opening stability pool modal');
  if (typeof window.showMessage === 'function') {
    window.showMessage('Stability pool deposit interface opening...', 'success');
  }
}

function openBUTFIStakeModal() {
  if (!lenderState.isWalletConnected) {
    // Instead of showing error, trigger wallet connection
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    } else {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  console.log('Opening BUTFI staking modal');
  if (typeof window.showMessage === 'function') {
    window.showMessage('BUTFI staking interface opening...', 'success');
  }
}

// ==========================================
// USER ACTION HANDLERS
// ==========================================

function handleWithdrawStability() {
  if (!lenderState.isWalletConnected) {
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    }
    return;
  }
  
  if (lenderState.data.userStabilityDeposit <= 0) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('No stability pool deposit to withdraw', 'error');
    }
    return;
  }
  
  console.log('Withdrawing from stability pool');
  if (typeof window.showMessage === 'function') {
    window.showMessage('Stability pool withdrawal initiated...', 'success');
  }
  
  // Mock withdrawal
  setTimeout(() => {
    lenderState.data.userStabilityDeposit = 0;
    updateUserDisplays();
    if (typeof window.showMessage === 'function') {
      window.showMessage('Stability pool withdrawal completed!', 'success');
    }
  }, 2000);
}

function handleClaimStabilityRewards() {
  if (!lenderState.isWalletConnected) {
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    }
    return;
  }
  
  if (lenderState.data.userStabilityRewards <= 0) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('No rewards to claim', 'error');
    }
    return;
  }
  
  console.log('Claiming stability pool rewards');
  if (typeof window.showMessage === 'function') {
    window.showMessage('Claiming BUTFI rewards...', 'success');
  }
  
  // Mock claim
  setTimeout(() => {
    lenderState.data.userStabilityRewards = 0;
    updateUserDisplays();
    if (typeof window.showMessage === 'function') {
      window.showMessage('BUTFI rewards claimed!', 'success');
    }
  }, 2000);
}

function handleUnstakeBUTFI() {
  if (!lenderState.isWalletConnected) {
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    }
    return;
  }
  
  if (lenderState.data.userBUTFIStake <= 0) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('No BUTFI staked to unstake', 'error');
    }
    return;
  }
  
  console.log('Unstaking BUTFI');
  if (typeof window.showMessage === 'function') {
    window.showMessage('BUTFI unstaking initiated...', 'success');
  }
  
  // Mock unstake
  setTimeout(() => {
    lenderState.data.userBUTFIStake = 0;
    updateUserDisplays();
    if (typeof window.showMessage === 'function') {
      window.showMessage('BUTFI unstaked successfully!', 'success');
    }
  }, 2000);
}

function handleClaimBUTFIFees() {
  if (!lenderState.isWalletConnected) {
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    }
    return;
  }
  
  if (lenderState.data.userBUTFIFees <= 0) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('No fees to claim', 'error');
    }
    return;
  }
  
  console.log('Claiming BUTFI staking fees');
  if (typeof window.showMessage === 'function') {
    window.showMessage('Claiming staking fees...', 'success');
  }
  
  // Mock claim
  setTimeout(() => {
    lenderState.data.userBUTFIFees = 0;
    updateUserDisplays();
    if (typeof window.showMessage === 'function') {
      window.showMessage('Staking fees claimed!', 'success');
    }
  }, 2000);
}

// ==========================================
// BUTTON BINDING
// ==========================================

function bindButtonHandlers() {
  // Bind withdraw button
  const withdrawBtn = document.querySelector('.withdraw-btn');
  if (withdrawBtn) {
    withdrawBtn.onclick = handleWithdrawStability;
  }
  
  // Bind claim rewards button
  const claimRewardsBtn = document.querySelector('.claim-rewards-btn');
  if (claimRewardsBtn) {
    claimRewardsBtn.onclick = handleClaimStabilityRewards;
  }
  
  // Bind unstake BUTFI button
  const unstakeBtn = document.querySelector('.unstake-butfi-btn');
  if (unstakeBtn) {
    unstakeBtn.onclick = handleUnstakeBUTFI;
  }
  
  // Bind claim fees button
  const claimFeesBtn = document.querySelector('.claim-fees-btn');
  if (claimFeesBtn) {
    claimFeesBtn.onclick = handleClaimBUTFIFees;
  }
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

function initializeLenderPage() {
  console.log('Lender page initialized with auto-blur focus');
  
  // Always show the page content
  const lenderContent = document.getElementById('lenderContent');
  if (lenderContent) {
    lenderContent.style.display = 'block';
  }
  
  // Initialize with default data
  resetLenderData();
  updateProtocolOverview();
  
  // Check if wallet is already connected and load user data
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, loading user data');
    lenderState.isWalletConnected = true;
    loadLenderData();
    updateConnectedState();
  } else {
    // Initialize with disconnected state
    updateDisconnectedState();
  }
  
  // Bind button handlers and setup auto-blur
  bindButtonHandlers();
  setupAutoBlur();
}

// ==========================================
// CLEANUP AND UTILITIES
// ==========================================

function cleanupLenderPage() {
  console.log('Cleaning up Lender page');
  
  // Reset state
  lenderState.isWalletConnected = false;
  resetLenderData();
  
  // Remove wallet connected attribute
  const lenderContainer = document.querySelector('.lender-container');
  if (lenderContainer) {
    lenderContainer.removeAttribute('data-wallet-connected');
  }
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================

// Make functions available globally for onclick handlers
window.openTroveModal = openTroveModal;
window.adjustTrove = adjustTrove;
window.closeTrove = closeTrove;
window.openStabilityPoolModal = openStabilityPoolModal;
window.openBUTFIStakeModal = openBUTFIStakeModal;
window.handleWithdrawStability = handleWithdrawStability;
window.handleClaimStabilityRewards = handleClaimStabilityRewards;
window.handleUnstakeBUTFI = handleUnstakeBUTFI;
window.handleClaimBUTFIFees = handleClaimBUTFIFees;
window.cleanupLenderPage = cleanupLenderPage;

// ==========================================
// INITIALIZATION
// ==========================================

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLenderPage);
} else {
  // If already loaded (dynamic loading case)
  setTimeout(initializeLenderPage, 100);
}

console.log('Lender page JavaScript loaded successfully with auto-blur focus');