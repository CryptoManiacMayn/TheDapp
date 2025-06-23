// ==========================================
// GOVERNANCE PAGE JAVASCRIPT - SIMPLIFIED FINAL VERSION
// ==========================================

// Governance state management (READ ONLY - doesn't manage wallet connection)
let governanceState = {
  isWalletConnected: false,
  data: {
    votingPower: 0,
    activeProposals: 0,
    votesThisMonth: 0,
    totalProposals: 0,
    proposals: [],
    votingHistory: []
  }
};

// Mock governance data
const mockProposals = [
  {
    id: 1,
    title: "Increase Staking Rewards for ETH Pool",
    description: "Proposal to increase ETH staking rewards from 5.2% to 6.5% APY to attract more liquidity.",
    status: "Active",
    votesFor: 65,
    votesAgainst: 35,
    totalVotes: 1234,
    endDate: "3 days",
    userVote: null
  },
  {
    id: 2,
    title: "Implement Cross-Chain Bridge",
    description: "Enable cross-chain functionality to support multiple blockchain networks.",
    status: "Active",
    votesFor: 78,
    votesAgainst: 22,
    totalVotes: 892,
    endDate: "7 days",
    userVote: null
  }
];

// ==========================================
// WALLET CONNECTION FUNCTIONS FOR PAGE-SPECIFIC BUTTONS
// ==========================================

function connectWallet() {
  console.log('Governance: connectWallet called - using global wallet');
  
  const connectBtn = document.getElementById('governanceConnectBtn');
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
  console.log('Governance: Received global wallet connected event');
  
  governanceState.isWalletConnected = true;
  
  // Show governance content, hide wallet prompt
  const walletPrompt = document.getElementById('governanceWalletPrompt');
  const governanceContent = document.getElementById('governanceContent');
  
  if (walletPrompt) walletPrompt.style.display = 'none';
  if (governanceContent) governanceContent.style.display = 'block';
  
  // Load governance data
  loadGovernanceData();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Governance: Received global wallet disconnected event');
  
  governanceState.isWalletConnected = false;
  
  // Show wallet prompt, hide governance content
  const walletPrompt = document.getElementById('governanceWalletPrompt');
  const governanceContent = document.getElementById('governanceContent');
  
  if (walletPrompt) walletPrompt.style.display = 'block';
  if (governanceContent) governanceContent.style.display = 'none';
  
  // Reset governance data
  resetGovernanceData();
});

// ==========================================
// GOVERNANCE DATA FUNCTIONS
// ==========================================

function loadGovernanceData() {
  if (!governanceState.isWalletConnected) {
    console.log("No wallet connected for governance data");
    return;
  }

  try {
    console.log("Loading governance data...");
    
    // Calculate mock governance overview
    const votingPowerValue = 12500;
    const activeProposalsValue = 2;
    const votesThisMonthValue = 3;
    const totalProposalsValue = 15;
    
    // Update governance data
    governanceState.data = {
      votingPower: votingPowerValue,
      activeProposals: activeProposalsValue,
      votesThisMonth: votesThisMonthValue,
      totalProposals: totalProposalsValue,
      proposals: mockProposals,
      votingHistory: generateMockVotingHistory()
    };
    
    updateGovernanceOverview();
    updateProposalsList();
    updateVotingHistory();
    
    console.log("Governance data loaded successfully");
    
    if (typeof window.showMessage === 'function') {
      window.showMessage('Governance data updated!', 'success');
    }
  } catch (error) {
    console.error("Failed to load governance data:", error);
    if (typeof window.showMessage === 'function') {
      window.showMessage("Failed to load governance data: " + error.message, "error");
    }
    resetGovernanceData();
  }
}

function updateGovernanceOverview() {
  const elements = {
    votingPower: document.getElementById('votingPower'),
    activeProposals: document.getElementById('activeProposals'),
    votesThisMonth: document.getElementById('votesThisMonth'),
    totalProposals: document.getElementById('totalProposals')
  };
  
  if (elements.votingPower) {
    elements.votingPower.textContent = governanceState.data.votingPower.toLocaleString();
  }
  if (elements.activeProposals) {
    elements.activeProposals.textContent = governanceState.data.activeProposals.toString();
  }
  if (elements.votesThisMonth) {
    elements.votesThisMonth.textContent = governanceState.data.votesThisMonth.toString();
  }
  if (elements.totalProposals) {
    elements.totalProposals.textContent = governanceState.data.totalProposals.toString();
  }
}

function updateProposalsList() {
  const proposalsList = document.getElementById('proposalsList');
  if (!proposalsList) return;
  
  if (governanceState.data.proposals.length === 0) {
    proposalsList.innerHTML = `
      <div class="no-proposals glass-card">
        <p>No active proposals found.</p>
      </div>
    `;
    return;
  }
  
  proposalsList.innerHTML = governanceState.data.proposals.map(proposal => `
    <div class="proposal-card glass-card">
      <div class="proposal-header">
        <h3>${proposal.title}</h3>
        <span class="proposal-status status-${proposal.status.toLowerCase()}">${proposal.status}</span>
      </div>
      <p class="proposal-description">${proposal.description}</p>
      <div class="proposal-stats">
        <div class="vote-progress">
          <div class="vote-bar">
            <div class="vote-for" style="width: ${proposal.votesFor}%"></div>
            <div class="vote-against" style="width: ${proposal.votesAgainst}%"></div>
          </div>
          <div class="vote-labels">
            <span class="for-label">For: ${proposal.votesFor}%</span>
            <span class="against-label">Against: ${proposal.votesAgainst}%</span>
          </div>
        </div>
        <div class="proposal-meta">
          <span>Ends in ${proposal.endDate}</span>
          <span>${proposal.totalVotes} votes cast</span>
        </div>
      </div>
      <div class="proposal-actions">
        <button class="vote-btn vote-for" onclick="handleVote(${proposal.id}, 'for')" ${proposal.userVote ? 'disabled' : ''}>
          Vote For
        </button>
        <button class="vote-btn vote-against" onclick="handleVote(${proposal.id}, 'against')" ${proposal.userVote ? 'disabled' : ''}>
          Vote Against
        </button>
      </div>
    </div>
  `).join('');
}

function updateVotingHistory() {
  const votingHistoryBody = document.getElementById('votingHistoryBody');
  if (!votingHistoryBody) return;
  
  if (governanceState.data.votingHistory.length === 0) {
    votingHistoryBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 40px;">
          No voting history found. Cast your first vote!
        </td>
      </tr>
    `;
    return;
  }
  
  votingHistoryBody.innerHTML = governanceState.data.votingHistory.map(vote => `
    <tr>
      <td>${vote.proposal}</td>
      <td>
        <span class="vote-badge vote-${vote.vote.toLowerCase()}">${vote.vote}</span>
      </td>
      <td>${vote.date}</td>
      <td>
        <span class="status-badge status-${vote.status.toLowerCase()}">${vote.status}</span>
      </td>
    </tr>
  `).join('');
}

function generateMockVotingHistory() {
  return [
    {
      proposal: "Reduce Trading Fees",
      vote: "For",
      date: "2025-06-15",
      status: "Passed"
    },
    {
      proposal: "Add New Token Support",
      vote: "Against", 
      date: "2025-06-10",
      status: "Failed"
    },
    {
      proposal: "Increase Governance Threshold",
      vote: "For",
      date: "2025-06-05",
      status: "Passed"
    }
  ];
}

function resetGovernanceData() {
  governanceState.data = {
    votingPower: 0,
    activeProposals: 0,
    votesThisMonth: 0,
    totalProposals: 0,
    proposals: [],
    votingHistory: []
  };
  
  // Reset overview
  const elements = {
    votingPower: document.getElementById('votingPower'),
    activeProposals: document.getElementById('activeProposals'),
    votesThisMonth: document.getElementById('votesThisMonth'),
    totalProposals: document.getElementById('totalProposals')
  };
  
  Object.values(elements).forEach(el => {
    if (el) {
      el.textContent = '0';
    }
  });
  
  // Reset proposals list
  const proposalsList = document.getElementById('proposalsList');
  if (proposalsList) {
    proposalsList.innerHTML = `
      <div class="no-proposals glass-card">
        <p>🔒 Connect your wallet to view governance proposals</p>
      </div>
    `;
  }
  
  // Reset voting history
  const votingHistoryBody = document.getElementById('votingHistoryBody');
  if (votingHistoryBody) {
    votingHistoryBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 40px;">
          🔒 Connect your wallet to view your voting history
        </td>
      </tr>
    `;
  }
}

// ==========================================
// VOTING ACTION HANDLERS
// ==========================================

function handleVote(proposalId, voteType) {
  if (!governanceState.isWalletConnected) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Please connect your wallet first', 'error');
    }
    return;
  }
  
  const proposal = governanceState.data.proposals.find(p => p.id === proposalId);
  if (!proposal) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Proposal not found', 'error');
    }
    return;
  }
  
  if (proposal.userVote) {
    if (typeof window.showMessage === 'function') {
      window.showMessage('You have already voted on this proposal', 'error');
    }
    return;
  }
  
  console.log(`Voting ${voteType} on proposal ${proposalId}: ${proposal.title}`);
  
  if (typeof window.showMessage === 'function') {
    window.showMessage(`Submitting your ${voteType} vote...`, 'success');
  }
  
  // Mock: Simulate voting transaction
  setTimeout(() => {
    proposal.userVote = voteType;
    updateProposalsList();
    if (typeof window.showMessage === 'function') {
      window.showMessage(`Successfully voted ${voteType} on "${proposal.title}"!`, 'success');
    }
  }, 2000);
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

function initializeGovernancePage() {
  console.log('Governance page initialized');
  
  // Initialize with default state
  resetGovernanceData();
  
  // Check if wallet is already connected
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, setting up governance');
    governanceState.isWalletConnected = true;
    
    const walletPrompt = document.getElementById('governanceWalletPrompt');
    const governanceContent = document.getElementById('governanceContent');
    
    if (walletPrompt) walletPrompt.style.display = 'none';
    if (governanceContent) governanceContent.style.display = 'block';
    
    loadGovernanceData();
  } else {
    // Show wallet prompt
    const walletPrompt = document.getElementById('governanceWalletPrompt');
    const governanceContent = document.getElementById('governanceContent');
    
    if (walletPrompt) walletPrompt.style.display = 'block';
    if (governanceContent) governanceContent.style.display = 'none';
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGovernancePage);
} else {
  // If already loaded (dynamic loading case)
  setTimeout(initializeGovernancePage, 100);
}