// ==========================================
// SHELL DYNAMIC CONTENT LOADING SYSTEM - WITH NETWORK SELECTOR
// ==========================================

// Current page state
let currentPage = 'portfolio';
let loadedScripts = new Set();

// SIMPLIFIED Global wallet state - this is the single source of truth
window.globalWalletState = {
  isConnected: false,
  account: null,
  provider: null,
  hasUserConnected: false
};

// Network configurations
window.networkConfigs = {
  base: { 
    name: 'Base', 
    chainId: 8453, 
    connected: false,
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org'
  },
  ethereum: { 
    name: 'Ethereum', 
    chainId: 1, 
    connected: false,
    rpcUrl: 'https://ethereum.llamarpc.com',
    blockExplorer: 'https://etherscan.io'
  },
  arbitrum: { 
    name: 'Arbitrum One', 
    chainId: 42161, 
    connected: false,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io'
  },
  polygon: { 
    name: 'Polygon', 
    chainId: 137, 
    connected: false,
    rpcUrl: 'https://polygon.llamarpc.com',
    blockExplorer: 'https://polygonscan.com'
  },
  optimism: { 
    name: 'Optimism', 
    chainId: 10, 
    connected: false,
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io'
  }
};

// Current network state
window.currentNetworkState = {
  selectedNetwork: 'base'
};

// Page configurations
const pageConfigs = {
  portfolio: {
    title: "PORTFOLIO",
    subtitle: "Track your DeFi investments and performance",
    contentFile: null, // Portfolio is embedded in shell
    scriptFile: "Scripts/portfolio.js",
    cssFiles: [] // Portfolio CSS already loaded in shell
  },
  staking: {
    title: "STAKING", 
    subtitle: "Stake tokens and earn rewards across multiple protocols",
    contentFile: "Content/staking-content.html",
    scriptFile: "Scripts/staking.js",
    cssFiles: ["Styles/staking.css"]
  },
  governance: {
    title: "GOVERNANCE",
    subtitle: "Participate in protocol governance and voting",
    contentFile: "Content/governance-content.html",
    scriptFile: "Scripts/governance.js",
    cssFiles: ["Styles/governance.css"]
  },
  lender: {
    title: "LENDER",
    subtitle: "Borrow BUTDC against ETH, WBTC, and wTAO collateral",
    contentFile: "Content/lender-content.html",
    scriptFile: "Scripts/lender.js",
    cssFiles: ["Styles/lender.css"]
  },
  yieldfi: {
    title: "YIELDFI",
    subtitle: "Swap, bridge, and provide liquidity across DeFi protocols",
    contentFile: "Content/yieldfi-content.html",
    scriptFile: "Scripts/yieldfi.js",
    cssFiles: ["Styles/yieldfi.css"]
  },
  accelerate: {
    title: "ACCELERATE",
    subtitle: "Boost your yields with advanced DeFi strategies",
    contentFile: "Content/accelerate-content.html",
    scriptFile: "Scripts/accelerate.js",
    cssFiles: ["Styles/accelerate.css"]
  }
};

// ==========================================
// NETWORK SELECTOR FUNCTIONALITY
// ==========================================

function initializeNetworkSelector() {
  const networkButton = document.getElementById('networkButton');
  const networkDropdown = document.getElementById('networkDropdown');
  const chevronIcon = document.getElementById('chevronIcon');

  if (!networkButton || !networkDropdown || !chevronIcon) {
    console.warn('Network selector elements not found');
    return;
  }

  // Toggle dropdown
  networkButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = networkDropdown.classList.toggle('active');
    chevronIcon.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    networkDropdown.classList.remove('active');
    chevronIcon.style.transform = 'rotate(0deg)';
  });

  // Handle network selection
  const networkOptions = document.querySelectorAll('.network-option');
  networkOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const networkKey = option.dataset.network;
      selectNetwork(networkKey);
      networkDropdown.classList.remove('active');
      chevronIcon.style.transform = 'rotate(0deg)';
    });
  });

  // Initialize network status
  updateNetworkStatus();
  console.log('Network selector initialized');
}

function selectNetwork(networkKey) {
  const network = window.networkConfigs[networkKey];
  if (!network) {
    console.error(`Network ${networkKey} not found`);
    return;
  }

  console.log(`Selecting network: ${network.name} (Chain ID: ${network.chainId})`);
  
  // Update current selection
  window.currentNetworkState.selectedNetwork = networkKey;
  
  // Update UI selection
  document.querySelectorAll('.network-option').forEach(option => {
    option.classList.remove('selected');
  });
  const selectedOption = document.querySelector(`[data-network="${networkKey}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
  }

  // Update button display
  const networkNameElement = document.getElementById('networkName');
  if (networkNameElement) {
    networkNameElement.textContent = network.name;
  }
  
  // Update network status
  updateNetworkStatus();

  // If wallet is connected, attempt to switch network
  if (window.globalWalletState.isConnected) {
    switchNetwork(network.chainId);
  }

  // Notify other components of network change
  window.dispatchEvent(new CustomEvent('networkChanged', {
    detail: { networkKey, network }
  }));

  window.showMessage(`Selected ${network.name} network`, "success");
}

function updateNetworkStatus() {
  const networkDot = document.getElementById('networkDot');
  if (!networkDot) return;

  const currentNetworkKey = window.currentNetworkState.selectedNetwork;
  const currentNetwork = window.networkConfigs[currentNetworkKey];
  
  // Show connected status based on whether wallet is connected to this network
  if (window.globalWalletState.isConnected && currentNetwork && currentNetwork.connected) {
    networkDot.classList.remove('disconnected');
  } else {
    networkDot.classList.add('disconnected');
  }
}

async function switchNetwork(chainId) {
  if (!window.globalWalletState.isConnected) {
    window.showMessage('Please connect your wallet first', 'error');
    return false;
  }

  if (typeof window.ethereum === "undefined") {
    window.showMessage('Web3 wallet not detected', 'error');
    return false;
  }

  try {
    console.log(`Attempting to switch to chain ID: ${chainId}`);
    
    // Attempt to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });

    // Reset all network connections
    Object.keys(window.networkConfigs).forEach(key => {
      window.networkConfigs[key].connected = false;
    });
    
    // Set current network as connected
    const currentNetworkKey = window.currentNetworkState.selectedNetwork;
    if (window.networkConfigs[currentNetworkKey]) {
      window.networkConfigs[currentNetworkKey].connected = true;
    }
    
    updateNetworkStatus();
    window.showMessage(`Switched to ${window.networkConfigs[currentNetworkKey]?.name || 'selected network'}`, 'success');
    return true;
    
  } catch (error) {
    console.error('Failed to switch network:', error);
    
    if (error.code === 4902) {
      // Network not added to wallet
      window.showMessage('Network not added to wallet. Please add it manually.', 'error');
    } else if (error.code === 4001) {
      // User rejected the request
      window.showMessage('Network switch rejected by user', 'error');
    } else {
      window.showMessage(`Failed to switch network: ${error.message}`, 'error');
    }
    return false;
  }
}

// Function to get current network info
window.getCurrentNetwork = function() {
  const currentNetworkKey = window.currentNetworkState.selectedNetwork;
  return {
    key: currentNetworkKey,
    config: window.networkConfigs[currentNetworkKey]
  };
};

// ==========================================
// SIMPLIFIED WALLET MANAGEMENT - CENTRALIZED
// ==========================================

// This is the ONLY place wallet connection happens
window.globalWalletConnect = async function() {
  console.log('Global wallet connect called');
  
  if (typeof window.ethereum === "undefined") {
    window.showMessage("Please install MetaMask or another Web3 wallet!", "error");
    return false;
  }

  try {
    // Update UI to show connecting
    updateGlobalWalletUI('connecting');
    
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      throw new Error("No accounts found");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const account = accounts[0];

    // Update global state
    window.globalWalletState.isConnected = true;
    window.globalWalletState.account = account;
    window.globalWalletState.provider = provider;
    window.globalWalletState.hasUserConnected = true;

    // Get current network from wallet
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    
    // Find and set the matching network
    const matchingNetworkKey = Object.keys(window.networkConfigs).find(
      key => window.networkConfigs[key].chainId === chainId
    );
    
    if (matchingNetworkKey) {
      // Reset all connections
      Object.keys(window.networkConfigs).forEach(key => {
        window.networkConfigs[key].connected = false;
      });
      
      // Set current network as connected
      window.networkConfigs[matchingNetworkKey].connected = true;
      
      // Update selected network if different
      if (window.currentNetworkState.selectedNetwork !== matchingNetworkKey) {
        selectNetwork(matchingNetworkKey);
      } else {
        updateNetworkStatus();
      }
    }

    // Update UI
    updateGlobalWalletUI('connected');
    
    // Set up event listeners
    if (!window.ethereum._hasGlobalListeners) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum._hasGlobalListeners = true;
    }
    
    // Notify all pages
    window.dispatchEvent(new CustomEvent('globalWalletConnected', {
      detail: { account, provider, chainId }
    }));

    window.showMessage("Wallet connected successfully!", "success");
    console.log('Global wallet connected:', account, 'Chain ID:', chainId);
    return true;
    
  } catch (error) {
    console.error("Wallet connection failed:", error);
    
    // Reset state
    window.globalWalletState.isConnected = false;
    window.globalWalletState.account = null;
    window.globalWalletState.provider = null;
    
    updateGlobalWalletUI('disconnected');
    updateNetworkStatus();
    
    if (error.code === 4001) {
      window.showMessage("Connection rejected by user", "error");
    } else {
      window.showMessage("Failed to connect wallet: " + error.message, "error");
    }
    return false;
  }
};

// This is the ONLY place wallet disconnection happens
window.globalWalletDisconnect = function() {
  console.log('Global wallet disconnect called');
  
  // Update global state
  window.globalWalletState.isConnected = false;
  window.globalWalletState.account = null;
  window.globalWalletState.provider = null;
  
  // Reset all network connections
  Object.keys(window.networkConfigs).forEach(key => {
    window.networkConfigs[key].connected = false;
  });
  
  // Update UI
  updateGlobalWalletUI('disconnected');
  updateNetworkStatus();
  
  // Notify all pages
  window.dispatchEvent(new CustomEvent('globalWalletDisconnected'));
  
  window.showMessage("Wallet disconnected", "success");
};

// Toggle function for the top wallet button
window.toggleWallet = function() {
  if (window.globalWalletState.isConnected) {
    window.globalWalletDisconnect();
  } else {
    window.globalWalletConnect();
  }
};

// Update the top wallet button UI
function updateGlobalWalletUI(state) {
  const walletBtn = document.getElementById("walletBtn");
  const walletBtnText = document.getElementById("walletBtnText");

  if (!walletBtn || !walletBtnText) return;

  switch (state) {
    case 'connecting':
      walletBtn.disabled = true;
      walletBtnText.textContent = "Connecting...";
      walletBtn.classList.remove("connected");
      break;
      
    case 'connected':
      walletBtn.disabled = false;
      walletBtn.classList.add("connected");
      walletBtnText.textContent = `${window.globalWalletState.account.slice(0, 6)}...${window.globalWalletState.account.slice(-4)}`;
      break;
      
    case 'disconnected':
    default:
      walletBtn.disabled = false;
      walletBtn.classList.remove("connected");
      walletBtnText.textContent = "Connect Wallet";
      break;
  }
}

// ==========================================
// WALLET AUTO-CONNECTION CHECK
// ==========================================

async function checkExistingWalletConnection() {
  if (typeof window.ethereum === "undefined") {
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    // Only auto-connect if user has previously connected manually
    if (accounts.length > 0 && window.globalWalletState.hasUserConnected) {
      console.log("Auto-connecting based on previous manual connection");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const account = accounts[0];
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Update global state
      window.globalWalletState.isConnected = true;
      window.globalWalletState.account = account;
      window.globalWalletState.provider = provider;

      // Find and set the matching network
      const matchingNetworkKey = Object.keys(window.networkConfigs).find(
        key => window.networkConfigs[key].chainId === chainId
      );
      
      if (matchingNetworkKey) {
        // Reset all connections
        Object.keys(window.networkConfigs).forEach(key => {
          window.networkConfigs[key].connected = false;
        });
        
        // Set current network as connected
        window.networkConfigs[matchingNetworkKey].connected = true;
        
        // Update selected network if different
        if (window.currentNetworkState.selectedNetwork !== matchingNetworkKey) {
          window.currentNetworkState.selectedNetwork = matchingNetworkKey;
          
          // Update UI selection
          document.querySelectorAll('.network-option').forEach(option => {
            option.classList.remove('selected');
          });
          const selectedOption = document.querySelector(`[data-network="${matchingNetworkKey}"]`);
          if (selectedOption) {
            selectedOption.classList.add('selected');
          }
          
          // Update button display
          const networkNameElement = document.getElementById('networkName');
          if (networkNameElement) {
            networkNameElement.textContent = window.networkConfigs[matchingNetworkKey].name;
          }
        }
      }

      // Update UI
      updateGlobalWalletUI('connected');
      updateNetworkStatus();
      
      // Notify pages
      window.dispatchEvent(new CustomEvent('globalWalletConnected', {
        detail: { account, provider, chainId }
      }));

      // Set up event listeners
      if (!window.ethereum._hasGlobalListeners) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum._hasGlobalListeners = true;
      }
    }
  } catch (error) {
    console.error("Error checking existing wallet connection:", error);
  }
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    window.globalWalletDisconnect();
  } else if (accounts[0] !== window.globalWalletState.account) {
    // Account changed
    window.globalWalletState.account = accounts[0];
    updateGlobalWalletUI('connected');
    
    window.dispatchEvent(new CustomEvent('globalWalletConnected', {
      detail: { account: accounts[0], provider: window.globalWalletState.provider }
    }));
    
    window.showMessage("Account changed", "success");
  }
}

async function handleChainChanged(chainIdHex) {
  const chainId = parseInt(chainIdHex, 16);
  console.log("Chain changed to:", chainId);
  
  // Find matching network
  const matchingNetworkKey = Object.keys(window.networkConfigs).find(
    key => window.networkConfigs[key].chainId === chainId
  );
  
  if (matchingNetworkKey) {
    // Reset all connections
    Object.keys(window.networkConfigs).forEach(key => {
      window.networkConfigs[key].connected = false;
    });
    
    // Set new network as connected
    window.networkConfigs[matchingNetworkKey].connected = true;
    
    // Update selected network if different
    if (window.currentNetworkState.selectedNetwork !== matchingNetworkKey) {
      selectNetwork(matchingNetworkKey);
    } else {
      updateNetworkStatus();
    }
    
    window.showMessage(`Switched to ${window.networkConfigs[matchingNetworkKey].name}`, "success");
  } else {
    // Unknown network
    Object.keys(window.networkConfigs).forEach(key => {
      window.networkConfigs[key].connected = false;
    });
    updateNetworkStatus();
    window.showMessage(`Connected to unsupported network (Chain ID: ${chainId})`, "error");
  }
  
  // Notify pages of network change
  window.dispatchEvent(new CustomEvent('networkChanged', {
    detail: { chainId, networkKey: matchingNetworkKey }
  }));
}

// ==========================================
// PAGE NAVIGATION (UNCHANGED)
// ==========================================

function selectPage(page) {
  if (currentPage === page) return;
  
  console.log(`Switching to page: ${page}`);
  
  // Remove active class from all nav items
  var allNavItems = document.querySelectorAll(".nav-item, .expanded-nav-item");
  for (var i = 0; i < allNavItems.length; i++) {
    allNavItems[i].classList.remove("active");
  }

  // Add active class to clicked items
  var regularNavItems = document.querySelectorAll('.nav-item[data-page="' + page + '"]');
  var expandedNavItems = document.querySelectorAll('.expanded-nav-item[data-page="' + page + '"]');

  for (var i = 0; i < regularNavItems.length; i++) {
    regularNavItems[i].classList.add("active");
  }
  for (var i = 0; i < expandedNavItems.length; i++) {
    expandedNavItems[i].classList.add("active");
  }

  updateContent(page);
}

async function updateContent(page) {
  const config = pageConfigs[page];
  if (!config) {
    console.error(`No configuration found for page: ${page}`);
    return;
  }

  updatePageTitleAndSubtitle(config);
  
  try {
    await loadPageContent(page, config);
    currentPage = page;
    console.log(`Successfully loaded page: ${page}`);
  } catch (error) {
    console.error(`Failed to load page ${page}:`, error);
  }
}

function updatePageTitleAndSubtitle(config) {
  const pageTitle = document.getElementById("pageTitle");
  const contentSubtitle = document.querySelector(".content-subtitle");

  if (pageTitle) {
    pageTitle.textContent = config.title;
  }
  if (contentSubtitle) {
    contentSubtitle.textContent = config.subtitle;
  }
}

async function loadPageContent(page, config) {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) {
    console.error('Main content container not found');
    return;
  }

  try {
    showLoadingState(mainContent);
    await loadCSSFiles(config.cssFiles);
    
    if (config.contentFile) {
      console.log(`Loading content from: ${config.contentFile}`);
      await loadHTMLContent(config.contentFile, mainContent);
    } else {
      console.log('Restoring portfolio content');
      restorePortfolioContent(mainContent);
    }
    
    if (config.scriptFile && !loadedScripts.has(config.scriptFile)) {
      console.log(`Loading script: ${config.scriptFile}`);
      await loadScript(config.scriptFile);
      loadedScripts.add(config.scriptFile);
    }
    
    setTimeout(() => {
      initializePage(page);
    }, 100);
    
  } catch (error) {
    console.error(`Error loading page ${page}:`, error);
    showErrorState(mainContent, `Failed to load ${page} page: ${error.message}`);
  }
}

function showLoadingState(container) {
  container.innerHTML = `

    <div style="display: flex; align-items: center; justify-content: center; min-height: 400px; flex-direction: column; gap: 20px;">
      <div class="loading-spinner" style="width: 40px; height: 40px; border: 3px solid var(--border); border-top: 3px solid var(--accent); border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <div style="color: var(--text-secondary); font-size: 1.1rem;">Loading page content...</div>
    </div>
  `;
}

function showErrorState(container, message) {
  container.innerHTML = `

    <div style="display: flex; align-items: center; justify-content: center; min-height: 400px; flex-direction: column; gap: 20px;">
      <div style="color: var(--text-primary); font-size: 1.5rem;">⚠️ Error</div>
      <div style="color: var(--text-secondary); font-size: 1rem; text-align: center; max-width: 500px;">${message}</div>
      <button onclick="location.reload()" style="background: var(--accent); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Reload Page</button>
    </div>
  `;
}

async function loadCSSFiles(cssFiles) {
  if (!cssFiles || cssFiles.length === 0) return;
  
  const promises = cssFiles.map(cssFile => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`link[href="${cssFile}"]`)) {
        resolve();
        return;
      }
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssFile;
      link.onload = resolve;
      link.onerror = () => {
        console.warn(`Failed to load CSS: ${cssFile}`);
        resolve();
      };
      document.head.appendChild(link);
    });
  });
  
  await Promise.all(promises);
}

async function loadHTMLContent(contentFile, container) {
  try {
    console.log(`Fetching content from: ${contentFile}`);
    const response = await fetch(contentFile);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const htmlContent = await response.text();
    
    const contentHeader = `
      <div class="content-header">
        <p class="content-subtitle">${pageConfigs[currentPage]?.subtitle || ''}</p>
      </div>
    `;
    
    container.innerHTML = htmlContent;
    console.log(`Successfully loaded content from: ${contentFile}`);
    
  } catch (error) {
    console.error(`Failed to load content from ${contentFile}:`, error);
    throw error;
  }
}

function restorePortfolioContent(container) {
  const portfolioHTML = `

    <div class="portfolio-container">
      <div class="portfolio-grid">
        <div class="portfolio-card">
          <div class="card-title">Total Portfolio Value</div>
          <div class="spacer"></div>
          <div class="card-value" id="totalValue">$0.00</div>
          <div class="card-change positive" id="totalChange">+$0.00 (0.00%)</div>
        </div>

        <div class="portfolio-card">
          <div class="card-title">Total Staked</div>
          <div class="spacer"></div>
          <div class="card-value" id="totalStaked">$0.00</div>
          <div class="card-change positive" id="stakedRewards">+$0.00 rewards</div>
        </div>

        <div class="portfolio-card">
          <div class="card-title">Lending Positions</div>
          <div class="spacer"></div>
          <div class="card-value" id="totalLending">$0.00</div>
          <div class="card-change positive" id="lendingAPY">0.00% APY</div>
        </div>

        <div class="portfolio-card">
          <div class="card-title">Yield Farming</div>
          <div class="spacer"></div>
          <div class="card-value" id="totalYield">$0.00</div>
          <div class="card-change positive" id="yieldAPY">0.00% APY</div>
        </div>
      </div>

      <div class="assets-table">
        <h2 style="margin-bottom: 20px; color: var(--text-primary)">Your Assets</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Balance</th>
              <th>Value (USD)</th>
              <th>24h Change</th>
              <th>Allocation</th>
            </tr>
          </thead>
          <tbody id="assetsTableBody">
            <tr>
              <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 40px; font-size: 1.1rem;">
                <div style="margin-bottom: 10px;">🔒 Connect your wallet to view your portfolio</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Your assets and balances will appear here once connected</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="portfolioStatus"></div>
    </div>
  `;
  
  container.innerHTML = portfolioHTML;
  console.log('Portfolio content restored');
}

async function loadScript(scriptFile) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${scriptFile}"]`)) {
      console.log(`Script already loaded: ${scriptFile}`);
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = scriptFile;
    script.onload = () => {
      console.log(`Successfully loaded script: ${scriptFile}`);
      resolve();
    };
    script.onerror = (error) => {
      console.error(`Failed to load script: ${scriptFile}`, error);
      reject(new Error(`Failed to load script: ${scriptFile}`));
    };
    document.head.appendChild(script);
  });
}

function initializePage(page) {
  console.log(`Initializing page: ${page}`);
  
  switch (page) {
    case 'portfolio':
      if (typeof initializePortfolioPage === 'function') {
        initializePortfolioPage();
      }
      break;
    case 'staking':
      if (typeof initializeStakingPage === 'function') {
        initializeStakingPage();
      }
      break;
    case 'governance':
      if (typeof initializeGovernancePage === 'function') {
        initializeGovernancePage();
      }
      break;
    case 'lender':
      if (typeof initializeLenderPage === 'function') {
        initializeLenderPage();
      }
      break;
    case 'yieldfi':
      if (typeof initializeYieldFiPage === 'function') {
        initializeYieldFiPage();
      }
      break;
    case 'accelerate':
      if (typeof initializeAcceleratePage === 'function') {
        initializeAcceleratePage();
      }
      break;
  }
}

// ==========================================
// SIDEBAR & THEME FUNCTIONS (UNCHANGED)
// ==========================================

function toggleSidebar() {
  var expandedSidebar = document.getElementById("expandedSidebar");
  if (expandedSidebar) {
    expandedSidebar.classList.toggle("active");
  }
}

function handleOutsideClick(event) {
  var expandedSidebar = document.getElementById("expandedSidebar");
  var hamburger = document.querySelector(".hamburger");
  var expandedHamburger = document.querySelector(".expanded-hamburger");

  if (expandedSidebar && expandedSidebar.classList.contains("active")) {
    if (
      !expandedSidebar.contains(event.target) &&
      !hamburger.contains(event.target) &&
      (!expandedHamburger || !expandedHamburger.contains(event.target))
    ) {
      expandedSidebar.classList.remove("active");
    }
  }
}

function toggleTheme() {
  var body = document.body;
  var themeIcon = document.getElementById("theme-icon");
  var themeIconExpanded = document.getElementById("theme-icon-expanded");
  var currentTheme = body.getAttribute("data-theme");

  if (currentTheme === "light") {
    body.setAttribute("data-theme", "dark");
    var moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    if (themeIcon) themeIcon.innerHTML = moonIcon;
    if (themeIconExpanded) themeIconExpanded.innerHTML = moonIcon;
  } else {
    body.setAttribute("data-theme", "light");
    var sunIcon = '<path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM12 4V2c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1zM12 22v-2c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1zM20 13h2c.6 0 1-.4 1-1s-.4-1-1-1h-2c-.6 0-1 .4-1 1s.4 1 1 1zM4 13H2c-.6 0-1-.4-1-1s.4-1 1-1h2c.6 0 1 .4 1 1s-.4 1-1 1zM17.7 7.7c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4l-1.4-1.4c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l1.4 1.4zM5.6 19.8c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L5.6 17c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l1.4 1.4zM19.8 18.4c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L17 18.4c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l1.4-1.4zM7 5.6c.4-.4.4-1 0-1.4C6.6 3.8 6 3.8 5.6 4.2L4.2 5.6c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L7 5.6z"/>';
    if (themeIcon) themeIcon.innerHTML = sunIcon;
    if (themeIconExpanded) themeIconExpanded.innerHTML = sunIcon;
  }
}

// ==========================================
// INITIALIZATION
// ==========================================

window.addEventListener("load", function () {
  console.log('Shell loading...');
  
  document.addEventListener("click", handleOutsideClick);
  
  // Add CSS for loading spinner
  if (!document.querySelector('#loading-spinner-css')) {
    const style = document.createElement('style');
    style.id = 'loading-spinner-css';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize network selector
  setTimeout(() => {
    initializeNetworkSelector();
  }, 100);
  
  // Check for existing wallet connection
  setTimeout(() => {
    checkExistingWalletConnection();
  }, 500);
  
  // Initialize with portfolio page
  setTimeout(() => {
    selectPage('portfolio');
  }, 200);
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

window.showMessage = function(message, type) {
  console.log(`Showing message: ${type} - ${message}`);
  
  const existingMessage = document.querySelector('.success-message, .error-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
};

// Error boundary for page loading
window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
  
  if (event.error && event.error.message && event.error.message.includes('Failed to load')) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      showErrorState(mainContent, 'Failed to load page content');
    }
  }
});

// ==========================================
// PUBLIC API FOR PAGE SCRIPTS
// ==========================================

window.shellAPI = {
  getCurrentPage: () => currentPage,
  getGlobalWalletState: () => window.globalWalletState,
  getCurrentNetwork: window.getCurrentNetwork,
  getNetworkConfigs: () => window.networkConfigs,
  selectNetwork: selectNetwork,
  switchNetwork: switchNetwork,
  connectWallet: window.globalWalletConnect,
  disconnectWallet: window.globalWalletDisconnect,
  showMessage: window.showMessage
};