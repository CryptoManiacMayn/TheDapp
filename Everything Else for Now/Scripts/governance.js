// ==========================================
// ENHANCED GOVERNANCE PAGE JAVASCRIPT
// ==========================================

// Governance state management
let governanceState = {
  isWalletConnected: false,
  globalData: {
    totalVotingPower: 12500,
    activeProposals: 2,
    votesThisMonth: 47,
    totalProposals: 15
  },
  userData: {
    votingPower: 0,
    votesThisMonth: 0,
    votingHistory: []
  }
};

// Mock proposals data (always visible)
const governanceProposals = [
  {
    id: 1,
    title: "Increase Staking Rewards for ETH Pool",
    description: "Proposal to increase ETH staking rewards from 5.2% to 6.5% APY to attract more liquidity and remain competitive with other protocols. This change would be implemented gradually over a 30-day period.",
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
    description: "Enable cross-chain functionality to support multiple blockchain networks including Polygon, Arbitrum, and Optimism. This will allow users to stake tokens across different chains seamlessly.",
    status: "Active",
    votesFor: 78,
    votesAgainst: 22,
    totalVotes: 892,
    endDate: "7 days",
    userVote: null
  },
  {
    id: 3,
    title: "Reduce Protocol Trading Fees",
    description: "Reduce trading fees from 0.3% to 0.25% to improve competitiveness and increase trading volume. This proposal passed with overwhelming community support.",
    status: "Passed",
    votesFor: 89,
    votesAgainst: 11,
    totalVotes: 1567,
    endDate: "Ended 2 days ago",
    userVote: "for"
  }
];

// ==========================================
// WALLET EVENT LISTENERS
// ==========================================

// Listen for global wallet connection
window.addEventListener('globalWalletConnected', function(event) {
  console.log('Governance: Received global wallet connected event');
  
  governanceState.isWalletConnected = true;
  
  // Add wallet connected class to body for CSS targeting
  document.body.classList.add('wallet-connected');
  
  // Load user-specific governance data
  loadUserGovernanceData();
  
  // Update wallet status info
  updateWalletStatusInfo();
  
  // Update user-specific highlighting
  updateUserSpecificHighlighting();
});

// Listen for global wallet disconnection
window.addEventListener('globalWalletDisconnected', function(event) {
  console.log('Governance: Received global wallet disconnected event');
  
  governanceState.isWalletConnected = false;
  
  // Remove wallet connected class
  document.body.classList.remove('wallet-connected');
  
  // Reset user-specific data
  resetUserGovernanceData();
  
  // Update wallet status info
  updateWalletStatusInfo();
});

// ==========================================
// DATA MANAGEMENT FUNCTIONS
// ==========================================

function loadGlobalGovernanceData() {
  // Always show global governance data
  const elements = {
    votingPower: document.getElementById('votingPower'),
    activeProposals: document.getElementById('activeProposals'),
    votesThisMonth: document.getElementById('votesThisMonth'),
    totalProposals: document.getElementById('totalProposals')
  };
  
  if (elements.votingPower) {
    elements.votingPower.textContent = governanceState.globalData.totalVotingPower.toLocaleString();
  }
  if (elements.activeProposals) {
    elements.activeProposals.textContent = governanceState.globalData.activeProposals.toString();
  }
  if (elements.votesThisMonth) {
    elements.votesThisMonth.textContent = governanceState.globalData.votesThisMonth.toString();
  }
  if (elements.totalProposals) {
    elements.totalProposals.textContent = governanceState.globalData.totalProposals.toString();
  }
}

function loadUserGovernanceData() {
  if (!governanceState.isWalletConnected) {
    return;
  }

  try {
    console.log("Loading user governance data...");
    
    // Generate user-specific governance data
    governanceState.userData = {
      votingPower: 2500,
      votesThisMonth: 3,
      votingHistory: generateUserVotingHistory()
    };
    
    // Update overview cards with user data
    updateOverviewCardsForUser();
    
    // Update voting history table
    updateVotingHistory();
    
    console.log("User governance data loaded successfully");
    
    if (typeof window.showMessage === 'function') {
      window.showMessage('Personal governance data loaded!', 'success');
    }
  } catch (error) {
    console.error("Failed to load user governance data:", error);
    if (typeof window.showMessage === 'function') {
      window.showMessage("Failed to load user governance data: " + error.message, "error");
    }
  }
}

function updateOverviewCardsForUser() {
  // Update overview cards to show user-specific data when wallet is connected
  const elements = {
    votingPower: document.getElementById('votingPower'),
    votesThisMonth: document.getElementById('votesThisMonth')
  };
  
  if (elements.votingPower) {
    elements.votingPower.textContent = governanceState.userData.votingPower.toLocaleString();
  }
  if (elements.votesThisMonth) {
    elements.votesThisMonth.textContent = governanceState.userData.votesThisMonth.toString();
  }
  
  // Update card labels for user context
  const labels = document.querySelectorAll('.overview-label');
  if (labels.length >= 4) {
    labels[0].textContent = 'Your Voting Power';
    labels[2].textContent = 'Your Votes This Month';
  }
}

function updateUserSpecificHighlighting() {
  // Add highlighting to user-specific sections
  const userSpecificElements = document.querySelectorAll('.user-specific');
  userSpecificElements.forEach((el, index) => {
    // Add a subtle animation
    setTimeout(() => {
      el.style.animation = 'pulse 0.6s ease-in-out';
      setTimeout(() => {
        if (el.style) {
          el.style.animation = '';
        }
      }, 600);
    }, index * 200);
  });
}

function updateVotingHistory() {
  const votingHistoryBody = document.getElementById('votingHistoryBody');
  if (!votingHistoryBody) return;
  
  if (!governanceState.isWalletConnected || governanceState.userData.votingHistory.length === 0) {
    votingHistoryBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 40px;">
          <div style="margin-bottom: 10px">
            ${governanceState.isWalletConnected ? 
              '📊 No voting history found' : 
              '🔒 Connect your wallet to view your voting history'}
          </div>
          <div style="font-size: 0.9rem; opacity: 0.8">
            ${governanceState.isWalletConnected ? 
              'Cast your first vote to see your history here' : 
              'Your votes and participation record will appear here once connected'}
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  votingHistoryBody.innerHTML = governanceState.userData.votingHistory.map(vote => `
    <tr class="user-vote-row">
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

function generateUserVotingHistory() {
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

function resetUserGovernanceData() {
  governanceState.userData = {
    votingPower: 0,
    votesThisMonth: 0,
    votingHistory: []
  };
  
  // Reset overview cards to global data
  loadGlobalGovernanceData();
  
  // Reset card labels to global context
  const labels = document.querySelectorAll('.overview-label');
  if (labels.length >= 4) {
    labels[0].textContent = 'Total Voting Power';
    labels[2].textContent = 'Votes This Month';
  }
  
  // Reset voting history
  updateVotingHistory();
  
  // Remove user highlighting
  document.querySelectorAll('.user-specific').forEach(el => {
    el.classList.remove('user-highlight');
  });
}

function updateWalletStatusInfo() {
  const walletStatusInfo = document.getElementById('governanceWalletStatusInfo');
  const statusMessage = walletStatusInfo?.querySelector('.status-message span');
  
  if (statusMessage) {
    if (governanceState.isWalletConnected) {
      statusMessage.textContent = 'Wallet connected! Your personal voting history and governance participation are now visible.';
      walletStatusInfo.style.background = 'rgba(56, 161, 105, 0.1)';
      walletStatusInfo.style.borderColor = 'rgba(56, 161, 105, 0.3)';
    } else {
      statusMessage.textContent = 'Connect your wallet to view your personal voting history and participate in governance';
      walletStatusInfo.style.background = 'rgba(255, 193, 7, 0.1)';
      walletStatusInfo.style.borderColor = 'rgba(255, 193, 7, 0.3)';
    }
  }
}

// ==========================================
// VOTING ACTION HANDLERS
// ==========================================

function handleVote(proposalId, voteType) {
  if (!governanceState.isWalletConnected) {
    // Instead of blocking, show connection prompt
    if (typeof window.showMessage === 'function') {
      window.showMessage('Please connect your wallet to participate in governance', 'warning');
    }
    
    // Trigger wallet connection
    if (typeof window.globalWalletConnect === 'function') {
      window.globalWalletConnect();
    }
    return;
  }
  
  const proposal = governanceProposals.find(p => p.id === proposalId);
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
  
  if (proposal.status !== 'Active') {
    if (typeof window.showMessage === 'function') {
      window.showMessage('Voting has ended for this proposal', 'error');
    }
    return;
  }
  
  console.log(`Voting ${voteType} on proposal ${proposalId}: ${proposal.title}`);
  
  // Show loading state
  const voteButtons = document.querySelectorAll(`#proposal${proposalId}Actions .vote-btn`);
  voteButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent.toLowerCase().includes(voteType)) {
      btn.textContent = `Voting ${voteType}...`;
    }
  });
  
  if (typeof window.showMessage === 'function') {
    window.showMessage(`Submitting your ${voteType} vote...`, 'info');
  }
  
  // Mock: Simulate voting transaction
  setTimeout(() => {
    proposal.userVote = voteType;
    
    // Reset button states and disable after voting
    voteButtons.forEach(btn => {
      btn.disabled = true;
      btn.textContent = btn.textContent.replace(/Voting \w+\.\.\./, btn.textContent.includes('For') ? 'Vote For' : 'Vote Against');
    });
    
    // Show voted state
    const actionsContainer = document.getElementById(`proposal${proposalId}Actions`);
    if (actionsContainer) {
      actionsContainer.innerHTML = `
        <button class="vote-btn vote-${voteType}" disabled>
          ✓ Voted ${voteType.charAt(0).toUpperCase() + voteType.slice(1)}
        </button>
      `;
    }
    
    if (typeof window.showMessage === 'function') {
      window.showMessage(`Successfully voted ${voteType} on "${proposal.title}"!`, 'success');
    }
    
    // Update user stats
    if (governanceState.userData.votesThisMonth !== undefined) {
      governanceState.userData.votesThisMonth++;
      updateOverviewCardsForUser();
    }
    
  }, 2000);
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

function initializeGovernancePage() {
  console.log('Enhanced governance page initialized');
  
  // Always load global data first
  loadGlobalGovernanceData();
  
  // Check if wallet is already connected
  if (window.globalWalletState && 
      window.globalWalletState.isConnected && 
      window.globalWalletState.hasUserConnected) {
    
    console.log('Wallet already connected, loading user governance data');
    governanceState.isWalletConnected = true;
    
    // Add wallet connected class
    document.body.classList.add('wallet-connected');
    
    // Load user-specific data
    loadUserGovernanceData();
    updateUserSpecificHighlighting();
  }
  
  // Always update wallet status info
  updateWalletStatusInfo();
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function getProposalInfo(proposalId) {
  return governanceProposals.find(p => p.id === proposalId) || null;
}

function formatVotingPower(power) {
  if (power >= 1000000) {
    return `${(power / 1000000).toFixed(1)}M`;
  }
  if (power >= 1000) {
    return `${(power / 1000).toFixed(1)}K`;
  }
  return power.toString();
}

function calculateVotingWeight(tokenBalance, stakedBalance) {
  // Regular tokens: 1:1 voting power
  // Staked tokens: 1.5:1 voting power
  return tokenBalance + (stakedBalance * 1.5);
}

function getTimeRemaining(endDate) {
  // Parse different date formats and return readable time remaining
  if (endDate.includes('days')) {
    return endDate;
  }
  
  const end = new Date(endDate);
  const now = new Date();
  const diff = end - now;
  
  if (diff <= 0) {
    return 'Ended';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${hours > 0 ? `${hours}h` : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''}`;
}

// ==========================================
// AUTO-INITIALIZATION
// ==========================================

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGovernancePage);
} else {
  // If already loaded (dynamic loading case)
  setTimeout(initializeGovernancePage, 100);
}

// Export functions for global access
window.governancePageFunctions = {
  handleVote,
  loadUserGovernanceData,
  resetUserGovernanceData,
  updateWalletStatusInfo,
  getProposalInfo,
  formatVotingPower,
  calculateVotingWeight
};