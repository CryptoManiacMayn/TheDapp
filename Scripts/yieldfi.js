// ==========================================
// YIELDFI PAGE JAVASCRIPT - NO WALLET PROMPT VERSION
// ==========================================

// YieldFi state management
let yieldFiState = {
  isWalletConnected: false,
  currentTab: 'swap',
  slippageTolerance: 0.5,
  currentTokenSelector: null,
  currentNetworkSelector: null,
  priceChart: null,
  tokens: {
    from: { symbol: 'ETH', name: 'Ethereum', icon: 'ETH', price: 2400.52, balance: 0 },
    to: { symbol: 'USDC', name: 'USD Coin', icon: 'USDC', price: 1.00, balance: 0 },
    bridge: { symbol: 'ETH', name: 'Ethereum', icon: 'ETH', price: 2400.52, balance: 0 },
    liquidity1: { symbol: 'ETH', name: 'Ethereum', icon: 'ETH', price: 2400.52, balance: 0 },
    liquidity2: { symbol: 'USDC', name: 'USD Coin', icon: 'USDC', price: 1.00, balance: 0 }
  },
  networks: {
    from: { name: 'Ethereum', icon: 'ethereum' },
    to: { name: 'Polygon', icon: 'polygon' }
  }
};

// Available tokens for trading
const availableTokens = [
  { symbol: 'ETH', name: 'Ethereum', icon: 'ETH', price: 2400.52, address: '0x0000000000000000000000000000000000000000' },
  { symbol: 'USDC', name: 'USD Coin', icon: 'USDC', price: 1.00, address: '0xa0b86a33e6ba6ad3b2936b89068ae1d3c5d35e34' },
  { symbol: 'USDT', name: 'Tether', icon: 'USDT', price: 1.00, address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: 'WBTC', price: 65432.10, address: '0x321162cd933e2be498cd2267a90534a804051b11' },
  { symbol: 'LINK', name: 'Chainlink', icon: 'LINK', price: 14.52, address: '0xa57ac35ce91ee92caefaa8dc04140c8e232c2e62' },
  { symbol: 'UNI', name: 'Uniswap', icon: 'UNI', price: 6.75, address: '0xbf5140a22578168fd562dccf235e5d43a02ce9b1' },
  { symbol: 'AAVE', name: 'Aave', icon: 'AAVE', price: 89.32, address: '0xfb6115445bff7b52feb98650c87f44907e58f802' },
  { symbol: 'DEFI', name: 'DeFiTools', icon: 'DEFI', price: 12.45, address: '0x1234567890123456789012345678901234567890' }
];

// Available networks for bridging
const availableNetworks = [
  { name: 'Ethereum', icon: 'ethereum', chainId: 1 },
  { name: 'Polygon', icon: 'polygon', chainId: 137 },
  { name: 'BSC', icon: 'bsc', chainId: 56 },
  { name: 'Arbitrum', icon: 'arbitrum', chainId: 42161 },
  { name: 'Optimism', icon: 'optimism', chainId: 10 }
];

// ==========================================
// WALLET EVENT LISTENERS
// ==========================================

// Listen for global wallet connection
window.addEventListener('globalWalletConnected', function(event) {
  console.log('YieldFi: Received global wallet connected event');
  
  yieldFiState.isWalletConnected = true;
  
  // Load user balances
  loadUserBalances();
  
  // Update UI to show connected state
  updateConnectedState();
  
  // Initialize chart
  initializePriceChart();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('YieldFi: Received global wallet disconnected event');
  
  yieldFiState.isWalletConnected = false;
  
  // Reset balances
  resetUserBalances();
  
  // Update UI to show disconnected state
  updateDisconnectedState();
});

// ==========================================
// TAB SWITCHING
// ==========================================

function switchYieldFiTab(tabName) {
  console.log(`Switching to YieldFi tab: ${tabName}`);
  
  // Update active tab
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Update active content
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => {
    if (content.id === `${tabName}-content`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
  
  yieldFiState.currentTab = tabName;
  
  // Initialize tab-specific functionality
  if (tabName === 'swap') {
    initializePriceChart();
  }
}

// ==========================================
// USER BALANCE MANAGEMENT
// ==========================================

function loadUserBalances() {
  if (!yieldFiState.isWalletConnected) return;
  
  try {
    // Mock balance loading - in real app, would query blockchain
    const mockBalances = {
      'ETH': (Math.random() * 10).toFixed(4),
      'USDC': (Math.random() * 10000).toFixed(2),
      'USDT': (Math.random() * 5000).toFixed(2),
      'WBTC': (Math.random() * 0.5).toFixed(6),
      'LINK': (Math.random() * 100).toFixed(2),
      'UNI': (Math.random() * 200).toFixed(2),
      'AAVE': (Math.random() * 50).toFixed(3),
      'DEFI': (Math.random() * 1000).toFixed(2)
    };
    
    // Update token balances
    Object.keys(yieldFiState.tokens).forEach(key => {
      const token = yieldFiState.tokens[key];
      token.balance = parseFloat(mockBalances[token.symbol] || '0');
    });
    
    // Update UI
    updateAllBalanceDisplays();
    
    console.log('User balances loaded');
    
  } catch (error) {
    console.error('Failed to load user balances:', error);
  }
}

function resetUserBalances() {
  Object.keys(yieldFiState.tokens).forEach(key => {
    yieldFiState.tokens[key].balance = 0;
  });
  
  updateAllBalanceDisplays();
}

function updateAllBalanceDisplays() {
  // Update swap balances
  const fromBalance = document.getElementById('fromBalance');
  const toBalance = document.getElementById('toBalance');
  if (fromBalance) fromBalance.textContent = yieldFiState.tokens.from.balance.toFixed(4);
  if (toBalance) toBalance.textContent = yieldFiState.tokens.to.balance.toFixed(4);
  
  // Update bridge balance
  const bridgeBalance = document.getElementById('bridgeBalance');
  if (bridgeBalance) bridgeBalance.textContent = yieldFiState.tokens.bridge.balance.toFixed(4);
  
  // Update liquidity balances
  const liquidityBalance1 = document.getElementById('liquidityBalance1');
  const liquidityBalance2 = document.getElementById('liquidityBalance2');
  if (liquidityBalance1) liquidityBalance1.textContent = yieldFiState.tokens.liquidity1.balance.toFixed(4);
  if (liquidityBalance2) liquidityBalance2.textContent = yieldFiState.tokens.liquidity2.balance.toFixed(4);
}

// ==========================================
// CONNECTED/DISCONNECTED STATE UPDATES
// ==========================================

function updateConnectedState() {
  // Update action buttons to show actual functionality instead of "Connect Wallet"
  const swapBtn = document.getElementById('swapBtn');
  const bridgeBtn = document.getElementById('bridgeBtn');
  const liquidityBtn = document.getElementById('liquidityBtn');
  
  if (swapBtn) {
    const walletText = swapBtn.querySelector('.wallet-action-text');
    if (walletText) {
      walletText.textContent = 'Enter Amount';
      swapBtn.disabled = true; // Will be enabled when amount is entered
    }
  }
  
  if (bridgeBtn) {
    const walletText = bridgeBtn.querySelector('.wallet-action-text');
    if (walletText) {
      walletText.textContent = 'Enter Amount';
      bridgeBtn.disabled = true; // Will be enabled when amount is entered
    }
  }
  
  if (liquidityBtn) {
    const walletText = liquidityBtn.querySelector('.wallet-action-text');
    if (walletText) {
      walletText.textContent = 'Enter Amounts';
      liquidityBtn.disabled = true; // Will be enabled when amounts are entered
    }
  }
  
  // Highlight user balances
  const userBalances = document.querySelectorAll('.user-balance');
  userBalances.forEach(balance => {
    balance.classList.add('connected');
  });
  
  // Update liquidity positions
  updateLiquidityPositions();
  
  if (typeof window.showMessage === 'function') {
    window.showMessage('YieldFi features now available!', 'success');
  }
}

function updateDisconnectedState() {
  // Update action buttons to show "Connect Wallet" text
  const swapBtn = document.getElementById('swapBtn');
  const bridgeBtn = document.getElementById('bridgeBtn');
  const liquidityBtn = document.getElementById('liquidityBtn');
  
  if (swapBtn) {
    const walletText = swapBtn.querySelector('.wallet-action-text');
    if (walletText) {
      walletText.textContent = 'Connect Wallet to Swap';
    }
  }
  
  if (bridgeBtn) {
    const walletText = bridgeBtn.querySelector('.wallet-action-text');
    if (walletText) {
      walletText.textContent = 'Connect Wallet to Bridge';
    }
  }
  
  if (liquidityBtn) {
    const walletText = liquidityBtn.querySelector('.wallet-action-text');
    if (walletText) {
      walletText.textContent = 'Connect Wallet to Add Liquidity';
    }
  }
  
  // Remove highlight from user balances
  const userBalances = document.querySelectorAll('.user-balance');
  userBalances.forEach(balance => {
    balance.classList.remove('connected');
  });
  
  // Reset liquidity positions
  resetLiquidityPositions();
}

function updateLiquidityPositions() {
  const positionsContent = document.getElementById('liquidityPositionsContent');
  if (!positionsContent) return;
  
  if (yieldFiState.isWalletConnected) {
    // Mock user positions - in real app, would fetch from contracts
    const mockPositions = [
      {
        pool: 'ETH/USDC',
        liquidity: '$2,845.50',
        tokens: '1.15 ETH + 1,240 USDC',
        rewards: '$12.45'
      },
      {
        pool: 'USDC/USDT',
        liquidity: '$850.00',
        tokens: '425 USDC + 425 USDT',
        rewards: '$3.20'
      }
    ];
    
    if (mockPositions.length > 0) {
      positionsContent.innerHTML = mockPositions.map(position => `
        <div class="position-item">
          <div class="position-header">
            <div class="position-pool">${position.pool}</div>
            <div class="position-liquidity">${position.liquidity}</div>
          </div>
          <div class="position-details">
            <div class="position-tokens">${position.tokens}</div>
            <div class="position-rewards">Rewards: ${position.rewards}</div>
          </div>
        </div>
      `).join('');
    } else {
      positionsContent.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
          <div style="font-size: 2rem; margin-bottom: 15px;">💧</div>
          <div style="font-size: 1.1rem; margin-bottom: 8px; color: var(--text-primary);">No liquidity positions found</div>
          <div style="font-size: 0.9rem;">Add liquidity to start earning fees</div>
        </div>
      `;
    }
  } else {
    resetLiquidityPositions();
  }
}

function resetLiquidityPositions() {
  const positionsContent = document.getElementById('liquidityPositionsContent');
  if (positionsContent) {
    positionsContent.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
        <div style="font-size: 2rem; margin-bottom: 15px;">💧</div>
        <div style="font-size: 1.1rem; margin-bottom: 8px; color: var(--text-primary);">No liquidity positions found</div>
        <div style="font-size: 0.9rem;">Connect your wallet to view your positions</div>
      </div>
    `;
  }
}

// ==========================================
// SWAP FUNCTIONALITY
// ==========================================

function calculateSwapAmount() {
  const fromAmount = parseFloat(document.getElementById('fromAmount').value) || 0;
  const fromToken = yieldFiState.tokens.from;
  const toToken = yieldFiState.tokens.to;
  
  if (fromAmount > 0) {
    // Simple price calculation (in real app, would query DEX/AMM)
    const rate = fromToken.price / toToken.price;
    const toAmount = fromAmount * rate;
    const slippageAdjusted = toAmount * (1 - yieldFiState.slippageTolerance / 100);
    
    // Update UI
    document.getElementById('toAmount').value = toAmount.toFixed(6);
    document.getElementById('fromValue').textContent = (fromAmount * fromToken.price).toFixed(2);
    document.getElementById('toValue').textContent = (toAmount * toToken.price).toFixed(2);
    
    // Update swap details
    updateSwapDetails(fromAmount, toAmount, rate);
    document.getElementById('swapDetails').style.display = 'block';
    
    // Update swap button
    const swapBtn = document.getElementById('swapBtn');
    const walletText = swapBtn.querySelector('.wallet-action-text');
    
    if (!yieldFiState.isWalletConnected) {
      if (walletText) walletText.textContent = 'Connect Wallet to Swap';
      swapBtn.disabled = false;
    } else if (fromAmount > yieldFiState.tokens.from.balance) {
      if (walletText) walletText.textContent = 'Insufficient Balance';
      swapBtn.disabled = true;
    } else {
      if (walletText) walletText.textContent = `Swap ${fromToken.symbol} for ${toToken.symbol}`;
      swapBtn.disabled = false;
    }
  } else {
    // Reset UI
    document.getElementById('toAmount').value = '';
    document.getElementById('fromValue').textContent = '0.00';
    document.getElementById('toValue').textContent = '0.00';
    document.getElementById('swapDetails').style.display = 'none';
    
    const swapBtn = document.getElementById('swapBtn');
    const walletText = swapBtn.querySelector('.wallet-action-text');
    
    if (!yieldFiState.isWalletConnected) {
      if (walletText) walletText.textContent = 'Connect Wallet to Swap';
    } else {
      if (walletText) walletText.textContent = 'Enter Amount';
    }
    swapBtn.disabled = !yieldFiState.isWalletConnected;
  }
}

function updateSwapDetails(fromAmount, toAmount, rate) {
  const fromToken = yieldFiState.tokens.from;
  const toToken = yieldFiState.tokens.to;
  const slippageAdjusted = toAmount * (1 - yieldFiState.slippageTolerance / 100);
  
  document.getElementById('swapRate').textContent = `1 ${fromToken.symbol} = ${rate.toFixed(2)} ${toToken.symbol}`;
  document.getElementById('priceImpact').textContent = '< 0.01%';
  document.getElementById('minimumReceived').textContent = `${slippageAdjusted.toFixed(6)} ${toToken.symbol}`;
  document.getElementById('networkFee').textContent = '~$5.23';
}

function setMaxAmount() {
  if (!yieldFiState.isWalletConnected) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  const maxAmount = yieldFiState.tokens.from.balance;
  document.getElementById('fromAmount').value = maxAmount.toFixed(6);
  calculateSwapAmount();
}

function flipTokens() {
  // Swap the from and to tokens
  const tempToken = { ...yieldFiState.tokens.from };
  yieldFiState.tokens.from = { ...yieldFiState.tokens.to };
  yieldFiState.tokens.to = tempToken;
  
  // Update UI
  updateTokenDisplay('from', yieldFiState.tokens.from);
  updateTokenDisplay('to', yieldFiState.tokens.to);
  
  // Clear amounts and recalculate
  document.getElementById('fromAmount').value = '';
  document.getElementById('toAmount').value = '';
  calculateSwapAmount();
  
  // Update chart
  updateChartPair();
}

function updateTokenDisplay(position, token) {
  document.getElementById(`${position}TokenIcon`).textContent = token.icon;
  document.getElementById(`${position}TokenSymbol`).textContent = token.symbol;
  document.getElementById(`${position}TokenName`).textContent = token.name;
  document.getElementById(`${position}Balance`).textContent = token.balance.toFixed(4);
}

function executeSwap() {
  if (!yieldFiState.isWalletConnected) {
    // Instead of showing error, trigger wallet connection
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    } else {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  const fromAmount = parseFloat(document.getElementById('fromAmount').value) || 0;
  const fromToken = yieldFiState.tokens.from;
  const toToken = yieldFiState.tokens.to;
  
  if (fromAmount <= 0 || fromAmount > fromToken.balance) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Invalid swap amount', 'error');
    }
    return;
  }
  
  console.log(`Executing swap: ${fromAmount} ${fromToken.symbol} for ${toToken.symbol}`);
  
  // Mock swap execution
  if (typeof window.showMessage === 'function') {
    window.showMessage(`Swap initiated: ${fromAmount} ${fromToken.symbol} → ${toToken.symbol}`, 'success');
  }
  
  // In real app, would call smart contract here
  // For demo, simulate successful swap after delay
  setTimeout(() => {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Swap completed successfully!', 'success');
    }
    
    // Update balances (mock)
    yieldFiState.tokens.from.balance -= fromAmount;
    const toAmount = parseFloat(document.getElementById('toAmount').value) || 0;
    yieldFiState.tokens.to.balance += toAmount;
    
    updateAllBalanceDisplays();
    
    // Clear form
    document.getElementById('fromAmount').value = '';
    document.getElementById('toAmount').value = '';
    calculateSwapAmount();
    
  }, 2000);
}

// ==========================================
// SLIPPAGE SETTINGS
// ==========================================

function toggleSlippageSettings() {
  const panel = document.getElementById('slippagePanel');
  if (panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}

function setSlippage(percentage) {
  yieldFiState.slippageTolerance = percentage;
  
  // Update button states
  const buttons = document.querySelectorAll('.slippage-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === `${percentage}%`) {
      btn.classList.add('active');
    }
  });
  
  // Clear custom input
  document.getElementById('customSlippage').value = '';
  
  // Recalculate if there's an amount
  calculateSwapAmount();
}

// ==========================================
// BRIDGE FUNCTIONALITY
// ==========================================

function calculateBridgeFee() {
  const bridgeAmount = parseFloat(document.getElementById('bridgeAmount').value) || 0;
  const bridgeToken = yieldFiState.tokens.bridge;
  
  if (bridgeAmount > 0) {
    const bridgeFee = bridgeAmount * 0.001; // 0.1% bridge fee
    const networkFee = 8.50; // Fixed network fee
    const receiveAmount = bridgeAmount - bridgeFee;
    
    // Update UI
    document.getElementById('bridgeValue').textContent = (bridgeAmount * bridgeToken.price).toFixed(2);
    document.getElementById('bridgeFee').textContent = `${bridgeFee.toFixed(6)} ${bridgeToken.symbol} (~${(bridgeFee * bridgeToken.price).toFixed(2)})`;
    document.getElementById('bridgeNetworkFee').textContent = `~${networkFee.toFixed(2)}`;
    document.getElementById('bridgeTime').textContent = '5-10 minutes';
    document.getElementById('bridgeReceive').textContent = `${receiveAmount.toFixed(6)} ${bridgeToken.symbol}`;
    
    document.getElementById('bridgeDetails').style.display = 'block';
    
    // Update bridge button
    const bridgeBtn = document.getElementById('bridgeBtn');
    const walletText = bridgeBtn.querySelector('.wallet-action-text');
    
    if (!yieldFiState.isWalletConnected) {
      if (walletText) walletText.textContent = 'Connect Wallet to Bridge';
      bridgeBtn.disabled = false;
    } else if (bridgeAmount > yieldFiState.tokens.bridge.balance) {
      if (walletText) walletText.textContent = 'Insufficient Balance';
      bridgeBtn.disabled = true;
    } else {
      if (walletText) walletText.textContent = `Bridge ${bridgeToken.symbol}`;
      bridgeBtn.disabled = false;
    }
  } else {
    // Reset UI
    document.getElementById('bridgeValue').textContent = '0.00';
    document.getElementById('bridgeDetails').style.display = 'none';
    
    const bridgeBtn = document.getElementById('bridgeBtn');
    const walletText = bridgeBtn.querySelector('.wallet-action-text');
    
    if (!yieldFiState.isWalletConnected) {
      if (walletText) walletText.textContent = 'Connect Wallet to Bridge';
    } else {
      if (walletText) walletText.textContent = 'Enter Amount';
    }
    bridgeBtn.disabled = !yieldFiState.isWalletConnected;
  }
}

function setBridgeMaxAmount() {
  if (!yieldFiState.isWalletConnected) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  const maxAmount = yieldFiState.tokens.bridge.balance;
  document.getElementById('bridgeAmount').value = maxAmount.toFixed(6);
  calculateBridgeFee();
}

function flipNetworks() {
  // Swap the from and to networks
  const tempNetwork = { ...yieldFiState.networks.from };
  yieldFiState.networks.from = { ...yieldFiState.networks.to };
  yieldFiState.networks.to = tempNetwork;
  
  // Update UI
  document.getElementById('fromNetwork').textContent = yieldFiState.networks.from.name;
  document.getElementById('toNetwork').textContent = yieldFiState.networks.to.name;
  
  // Update network icons
  const fromIcon = document.querySelector('.bridge-network-from .bridge-network-icon');
  const toIcon = document.querySelector('.bridge-network-to .bridge-network-icon');
  
  if (fromIcon) fromIcon.className = `bridge-network-icon ${yieldFiState.networks.from.icon}`;
  if (toIcon) toIcon.className = `bridge-network-icon ${yieldFiState.networks.to.icon}`;
  
  // Recalculate fees
  calculateBridgeFee();
}

function executeBridge() {
  if (!yieldFiState.isWalletConnected) {
    // Instead of showing error, trigger wallet connection
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    } else {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  const bridgeAmount = parseFloat(document.getElementById('bridgeAmount').value) || 0;
  const bridgeToken = yieldFiState.tokens.bridge;
  
  if (bridgeAmount <= 0 || bridgeAmount > bridgeToken.balance) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Invalid bridge amount', 'error');
    }
    return;
  }
  
  console.log(`Executing bridge: ${bridgeAmount} ${bridgeToken.symbol} from ${yieldFiState.networks.from.name} to ${yieldFiState.networks.to.name}`);
  
  if (typeof window.showMessage === 'function') {
    window.showMessage(`Bridge initiated: ${bridgeAmount} ${bridgeToken.symbol}`, 'success');
  }
  
  // Mock bridge execution
  setTimeout(() => {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Bridge completed successfully!', 'success');
    }
    
    // Update balance (mock)
    yieldFiState.tokens.bridge.balance -= bridgeAmount;
    updateAllBalanceDisplays();
    
    // Clear form
    document.getElementById('bridgeAmount').value = '';
    calculateBridgeFee();
    
  }, 3000);
}

// ==========================================
// LIQUIDITY FUNCTIONALITY
// ==========================================

function calculateLiquidityRatio() {
  const amount1 = parseFloat(document.getElementById('liquidityAmount1').value) || 0;
  const amount2 = parseFloat(document.getElementById('liquidityAmount2').value) || 0;
  const token1 = yieldFiState.tokens.liquidity1;
  const token2 = yieldFiState.tokens.liquidity2;
  
  if (amount1 > 0 || amount2 > 0) {
    // Calculate values
    const value1 = amount1 * token1.price;
    const value2 = amount2 * token2.price;
    const totalValue = value1 + value2;
    
    // Update UI
    document.getElementById('liquidityValue1').textContent = value1.toFixed(2);
    document.getElementById('liquidityValue2').textContent = value2.toFixed(2);
    
    // Update liquidity details
    if (totalValue > 0) {
      const poolShare = (totalValue / 1000000) * 100; // Mock pool share calculation
      const lpTokens = Math.sqrt(amount1 * amount2); // Mock LP tokens calculation
      
      document.getElementById('poolShare').textContent = `${poolShare.toFixed(4)}%`;
      document.getElementById('lpTokens').textContent = `${lpTokens.toFixed(6)} ${token1.symbol}-${token2.symbol} LP`;
      document.getElementById('poolRatio').textContent = `1 ${token1.symbol} = ${(token1.price / token2.price).toFixed(2)} ${token2.symbol}`;
      document.getElementById('liquidityNetworkFee').textContent = '~$12.50';
      
      document.getElementById('liquidityDetails').style.display = 'block';
      
      // Update liquidity button
      const liquidityBtn = document.getElementById('liquidityBtn');
      const walletText = liquidityBtn.querySelector('.wallet-action-text');
      
      if (!yieldFiState.isWalletConnected) {
        if (walletText) walletText.textContent = 'Connect Wallet to Add Liquidity';
        liquidityBtn.disabled = false;
      } else if (amount1 > token1.balance || amount2 > token2.balance) {
        if (walletText) walletText.textContent = 'Insufficient Balance';
        liquidityBtn.disabled = true;
      } else if (amount1 > 0 && amount2 > 0) {
        if (walletText) walletText.textContent = 'Add Liquidity';
        liquidityBtn.disabled = false;
      } else {
        if (walletText) walletText.textContent = 'Enter Amounts';
        liquidityBtn.disabled = true;
      }
    }
  } else {
    // Reset UI
    document.getElementById('liquidityValue1').textContent = '0.00';
    document.getElementById('liquidityValue2').textContent = '0.00';
    document.getElementById('liquidityDetails').style.display = 'none';
    
    const liquidityBtn = document.getElementById('liquidityBtn');
    const walletText = liquidityBtn.querySelector('.wallet-action-text');
    
    if (!yieldFiState.isWalletConnected) {
      if (walletText) walletText.textContent = 'Connect Wallet to Add Liquidity';
    } else {
      if (walletText) walletText.textContent = 'Enter Amounts';
    }
    liquidityBtn.disabled = !yieldFiState.isWalletConnected;
  }
}

function setLiquidityMaxAmount(tokenNumber) {
  if (!yieldFiState.isWalletConnected) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  const token = tokenNumber === 1 ? yieldFiState.tokens.liquidity1 : yieldFiState.tokens.liquidity2;
  const inputId = `liquidityAmount${tokenNumber}`;
  
  document.getElementById(inputId).value = token.balance.toFixed(6);
  calculateLiquidityRatio();
}

function addLiquidity() {
  if (!yieldFiState.isWalletConnected) {
    // Instead of showing error, trigger wallet connection
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    } else {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  const amount1 = parseFloat(document.getElementById('liquidityAmount1').value) || 0;
  const amount2 = parseFloat(document.getElementById('liquidityAmount2').value) || 0;
  const token1 = yieldFiState.tokens.liquidity1;
  const token2 = yieldFiState.tokens.liquidity2;
  
  if (amount1 <= 0 || amount2 <= 0 || amount1 > token1.balance || amount2 > token2.balance) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Invalid liquidity amounts', 'error');
    }
    return;
  }
  
  console.log(`Adding liquidity: ${amount1} ${token1.symbol} + ${amount2} ${token2.symbol}`);
  
  if (typeof window.showMessage === 'function') {
    window.showMessage(`Liquidity addition initiated`, 'success');
  }
  
  // Mock liquidity addition
  setTimeout(() => {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Liquidity added successfully!', 'success');
    }
    
    // Update balances (mock)
    yieldFiState.tokens.liquidity1.balance -= amount1;
    yieldFiState.tokens.liquidity2.balance -= amount2;
    updateAllBalanceDisplays();
    
    // Clear form
    document.getElementById('liquidityAmount1').value = '';
    document.getElementById('liquidityAmount2').value = '';
    calculateLiquidityRatio();
    
    // Update liquidity positions
    updateLiquidityPositions();
    
  }, 2500);
}

// ==========================================
// TOKEN/NETWORK SELECTORS - FIXED MODAL REFERENCES
// ==========================================

function openTokenSelector(type) {
  yieldFiState.currentTokenSelector = type;
  
  // Populate token list
  const tokenList = document.getElementById('tokenList');
  if (tokenList) {
    tokenList.innerHTML = availableTokens.map(token => `
      <div class="yieldfi-token-item" onclick="selectToken('${token.symbol}')">
        <div class="token-icon">${token.icon}</div>
        <div class="yieldfi-token-item-info">
          <span class="token-symbol">${token.symbol}</span>
          <span class="token-name">${token.name}</span>
        </div>
        <div class="yieldfi-token-balance">
          ${yieldFiState.isWalletConnected ? getTokenBalance(token.symbol).toFixed(4) : '0.0000'}
        </div>
      </div>
    `).join('');
  }
  
  // Show modal
  const modal = document.getElementById('tokenSelectorModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function openNetworkSelector(type) {
  yieldFiState.currentNetworkSelector = type;
  
  // Populate network list
  const networkList = document.getElementById('networkList');
  if (networkList) {
    networkList.innerHTML = availableNetworks.map(network => `
      <div class="yieldfi-network-item" onclick="selectYieldFiNetwork('${network.name}')">
        <div class="bridge-network-icon ${network.icon}"></div>
        <div class="yieldfi-network-item-info">
          <span class="bridge-network-name">${network.name}</span>
        </div>
      </div>
    `).join('');
  }
  
  // Show modal
  const modal = document.getElementById('networkSelectorModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function openPoolSelector() {
  // Mock pool selector - in real app would show available pools
  if (typeof window.showMessage === 'function') {
    window.showMessage('Pool selector coming soon', 'success');
  }
}

function selectToken(symbol) {
  const token = availableTokens.find(t => t.symbol === symbol);
  if (!token) return;
  
  const type = yieldFiState.currentTokenSelector;
  
  // Update token in state
  yieldFiState.tokens[type] = {
    symbol: token.symbol,
    name: token.name,
    icon: token.icon,
    price: token.price,
    balance: getTokenBalance(token.symbol)
  };
  
  // Update UI based on type
  if (type === 'from' || type === 'to') {
    updateTokenDisplay(type, yieldFiState.tokens[type]);
    calculateSwapAmount();
    updateChartPair();
  } else if (type === 'bridge') {
    updateBridgeTokenDisplay(yieldFiState.tokens.bridge);
    calculateBridgeFee();
  } else if (type === 'liquidity1' || type === 'liquidity2') {
    updateLiquidityTokenDisplay(type, yieldFiState.tokens[type]);
    calculateLiquidityRatio();
  }
  
  // Close modal
  closeTokenSelector();
}

function selectYieldFiNetwork(name) {
  const network = availableNetworks.find(n => n.name === name);
  if (!network) return;
  
  const type = yieldFiState.currentNetworkSelector;
  
  // Update network in state
  yieldFiState.networks[type] = {
    name: network.name,
    icon: network.icon,
    chainId: network.chainId
  };
  
  // Update UI
  document.getElementById(`${type}Network`).textContent = network.name;
  const iconElement = document.querySelector(`.bridge-network-${type} .bridge-network-icon`);
  if (iconElement) {
    iconElement.className = `bridge-network-icon ${network.icon}`;
  }
  
  // Recalculate bridge fees if applicable
  if (type === 'from' || type === 'to') {
    calculateBridgeFee();
  }
  
  // Close modal
  closeNetworkSelector();
}

function closeTokenSelector() {
  const modal = document.getElementById('tokenSelectorModal');
  if (modal) {
    modal.style.display = 'none';
  }
  yieldFiState.currentTokenSelector = null;
}

function closeNetworkSelector() {
  const modal = document.getElementById('networkSelectorModal');
  if (modal) {
    modal.style.display = 'none';
  }
  yieldFiState.currentNetworkSelector = null;
}

function filterTokens() {
  const searchTerm = document.getElementById('tokenSearch').value.toLowerCase();
  const tokenItems = document.querySelectorAll('.yieldfi-token-item');
  
  tokenItems.forEach(item => {
    const symbol = item.querySelector('.token-symbol').textContent.toLowerCase();
    const name = item.querySelector('.token-name').textContent.toLowerCase();
    
    if (symbol.includes(searchTerm) || name.includes(searchTerm)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function getTokenBalance(symbol) {
  // Return mock balance for token
  const token = availableTokens.find(t => t.symbol === symbol);
  if (!token) return 0;
  
  // Use existing balance if already set
  const existingToken = Object.values(yieldFiState.tokens).find(t => t.symbol === symbol);
  if (existingToken) return existingToken.balance;
  
  // Generate mock balance
  return Math.random() * 100;
}

function updateBridgeTokenDisplay(token) {
  document.getElementById('bridgeTokenIcon').textContent = token.icon;
  document.getElementById('bridgeTokenSymbol').textContent = token.symbol;
  document.getElementById('bridgeTokenName').textContent = token.name;
  document.getElementById('bridgeBalance').textContent = token.balance.toFixed(4);
}

function updateLiquidityTokenDisplay(type, token) {
  const number = type === 'liquidity1' ? '1' : '2';
  document.getElementById(`liquidityToken${number}Label`).textContent = token.symbol;
  document.getElementById(`liquidityInputToken${number}Icon`).textContent = token.icon;
  document.getElementById(`liquidityInputToken${number}Symbol`).textContent = token.symbol;
  document.getElementById(`liquidityBalance${number}`).textContent = token.balance.toFixed(4);
}

// ==========================================
// PRICE CHART
// ==========================================

function initializePriceChart() {
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  // Generate mock price data
  const priceData = generateMockPriceData();
  drawPriceChart(ctx, priceData, canvas.offsetWidth, canvas.offsetHeight);
  
  console.log('Price chart initialized');
}

function generateMockPriceData() {
  const basePrice = yieldFiState.tokens.from.price;
  const points = 100;
  const data = [];
  
  for (let i = 0; i < points; i++) {
    const time = Date.now() - (points - i) * 60000; // 1 minute intervals
    const volatility = 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * volatility;
    const price = i === 0 ? basePrice : data[i - 1].price * (1 + change);
    
    data.push({
      time: time,
      price: Math.max(price, basePrice * 0.8) // Prevent price from going too low
    });
  }
  
  return data;
}

function drawPriceChart(ctx, data, width, height) {
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Find price range
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Set styles
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Draw price line
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  
  // Draw area under curve
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = ctx.strokeStyle;
  ctx.lineTo(padding + chartWidth, padding + chartHeight);
  ctx.lineTo(padding, padding + chartHeight);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  
  // Draw grid lines
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  
  // Horizontal grid lines
  for (let i = 0; i <= 4; i++) {
    const y = padding + (i / 4) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + chartWidth, y);
    ctx.stroke();
  }
  
  // Vertical grid lines
  for (let i = 0; i <= 4; i++) {
    const x = padding + (i / 4) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, padding + chartHeight);
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1;
}

function updateChartPair() {
  const fromToken = yieldFiState.tokens.from;
  const toToken = yieldFiState.tokens.to;
  
  // Update chart title and price
  document.getElementById('chartPairTitle').textContent = `${fromToken.symbol}/${toToken.symbol}`;
  document.getElementById('chartPrice').textContent = `${fromToken.price.toFixed(2)}`;
  
  // Mock price change
  const change = (Math.random() - 0.5) * 5; // ±2.5%
  const changeElement = document.getElementById('chartChange');
  changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  changeElement.className = change >= 0 ? 'positive' : 'negative';
  
  // Reinitialize chart with new data
  setTimeout(() => {
    initializePriceChart();
  }, 100);
}

function setTimeframe(timeframe) {
  // Update active timeframe button
  const buttons = document.querySelectorAll('.timeframe-btn');
  buttons.forEach(btn => {
    if (btn.textContent === timeframe) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Regenerate chart data for timeframe
  setTimeout(() => {
    initializePriceChart();
  }, 100);
  
  console.log(`Chart timeframe set to: ${timeframe}`);
}

// ==========================================
// PAGE INITIALIZATION - NO WALLET PROMPT VERSION
// ==========================================

function initializeYieldFiPage() {
  console.log('YieldFi page initialized (no wallet prompt version)');
  
  // Always show the page content
  const yieldFiContainer = document.querySelector('.yieldfi-container');
  if (yieldFiContainer) {
    yieldFiContainer.style.display = 'block';
  }
  
  // Check if wallet is already connected and load user data
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, loading user data');
    yieldFiState.isWalletConnected = true;
    loadUserBalances();
    updateConnectedState();
    initializePriceChart();
  } else {
    // Initialize with default disconnected state
    updateDisconnectedState();
    initializePriceChart();
  }
  
  // Initialize swap tab by default
  switchYieldFiTab('swap');
  
  // Set up custom slippage input handler
  const customSlippageInput = document.getElementById('customSlippage');
  if (customSlippageInput) {
    customSlippageInput.addEventListener('input', function() {
      const value = parseFloat(this.value);
      if (!isNaN(value) && value >= 0 && value <= 50) {
        yieldFiState.slippageTolerance = value;
        
        // Remove active class from preset buttons
        const buttons = document.querySelectorAll('.slippage-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        calculateSwapAmount();
      }
    });
  }
  
  // Add YieldFi-specific event listeners
  addYieldFiEventListeners();
}

// Add cleanup function for when leaving YieldFi page
function cleanupYieldFiPage() {
  console.log('Cleaning up YieldFi page');
  
  // Remove YieldFi event listeners to prevent conflicts
  removeYieldFiEventListeners();
  
  // Close any open YieldFi modals
  closeTokenSelector();
  closeNetworkSelector();
  
  // Hide slippage panel
  const slippagePanel = document.getElementById('slippagePanel');
  if (slippagePanel) {
    slippagePanel.style.display = 'none';
  }
}

// Listen for page changes to cleanup when leaving YieldFi
window.addEventListener('beforeunload', cleanupYieldFiPage);

// Also listen for navigation changes if using SPA routing
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Page is being hidden, cleanup YieldFi
    const yieldFiContainer = document.querySelector('.yieldfi-container');
    if (yieldFiContainer && yieldFiContainer.style.display !== 'none') {
      cleanupYieldFiPage();
    }
  }
});

// ==========================================
// EVENT HANDLERS - COMPLETELY ISOLATED FROM GLOBAL
// ==========================================

// Store YieldFi event handlers separately to avoid conflicts
const yieldFiEventHandlers = {
  clickHandler: null,
  resizeHandler: null
};

// COMPLETELY SCOPED click handler that ONLY affects YieldFi modals
function handleYieldFiModalClicks(event) {
  // ONLY handle YieldFi-specific modals - never interfere with global elements
  
  // Close YieldFi token selector if clicking outside
  const tokenModal = document.getElementById('tokenSelectorModal');
  if (tokenModal && tokenModal.style.display === 'flex') {
    if (event.target === tokenModal) {
      closeTokenSelector();
      return; // Exit early
    }
  }
  
  // Close YieldFi network selector if clicking outside
  const networkModal = document.getElementById('networkSelectorModal');
  if (networkModal && networkModal.style.display === 'flex') {
    if (event.target === networkModal) {
      closeNetworkSelector();
      return; // Exit early
    }
  }
  
  // Close YieldFi slippage panel if clicking outside
  const slippagePanel = document.getElementById('slippagePanel');
  const settingsBtn = document.querySelector('.yieldfi-container .settings-btn'); // Scope to YieldFi only
  if (slippagePanel && slippagePanel.style.display === 'block') {
    const yieldFiContainer = document.querySelector('.yieldfi-container');
    // Only handle if click is within YieldFi and outside the panel/button
    if (yieldFiContainer && 
        yieldFiContainer.contains(event.target) && 
        !slippagePanel.contains(event.target) && 
        (!settingsBtn || !settingsBtn.contains(event.target))) {
      slippagePanel.style.display = 'none';
    }
  }
}

// Chart resize handler - scoped to YieldFi only
function handleYieldFiResize() {
  // Only resize chart if YieldFi is active and visible
  const yieldFiContainer = document.querySelector('.yieldfi-container');
  if (yieldFiContainer && 
      yieldFiContainer.style.display !== 'none' && 
      yieldFiState.currentTab === 'swap') {
    setTimeout(() => {
      initializePriceChart();
    }, 100);
  }
}

// Function to add YieldFi event listeners
function addYieldFiEventListeners() {
  // Remove any existing listeners first
  removeYieldFiEventListeners();
  
  // Add scoped listeners
  yieldFiEventHandlers.clickHandler = handleYieldFiModalClicks;
  yieldFiEventHandlers.resizeHandler = handleYieldFiResize;
  
  document.addEventListener('click', yieldFiEventHandlers.clickHandler);
  window.addEventListener('resize', yieldFiEventHandlers.resizeHandler);
  
  console.log('YieldFi event listeners added');
}

// Function to remove YieldFi event listeners
function removeYieldFiEventListeners() {
  if (yieldFiEventHandlers.clickHandler) {
    document.removeEventListener('click', yieldFiEventHandlers.clickHandler);
    yieldFiEventHandlers.clickHandler = null;
  }
  
  if (yieldFiEventHandlers.resizeHandler) {
    window.removeEventListener('resize', yieldFiEventHandlers.resizeHandler);
    yieldFiEventHandlers.resizeHandler = null;
  }
  
  console.log('YieldFi event listeners removed');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeYieldFiPage);
} else {
  // If already loaded (dynamic loading case)
  setTimeout(initializeYieldFiPage, 100);
}

// ==========================================
// GLOBAL INTEGRATION - PREVENT CONFLICTS
// ==========================================

// Make cleanup function globally available so shell can call it
window.cleanupYieldFiPage = cleanupYieldFiPage;

// Override any potential conflicts with global functions
if (typeof window.selectNetwork !== 'undefined') {
  // Store original global selectNetwork function
  const originalSelectNetwork = window.selectNetwork;
  
  // Ensure our YieldFi selectNetwork doesn't override the global one
  window.selectNetwork = originalSelectNetwork;
  
  // Rename our function to avoid conflicts
  window.selectYieldFiNetwork = selectYieldFiNetwork;
  
  console.log('YieldFi: Preserved global selectNetwork function');
}

// Ensure YieldFi doesn't interfere with global network operations
const originalShellSelectNetwork = window.shellAPI?.selectNetwork;
if (originalShellSelectNetwork) {
  // Make sure shell network selection always works
  window.shellAPI.selectNetwork = originalShellSelectNetwork;
  console.log('YieldFi: Preserved shell selectNetwork function');
}