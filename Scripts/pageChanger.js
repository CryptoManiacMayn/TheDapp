// Enhanced Navigation System for DeFiTools
// This file handles navigation between Portfolio and Staking pages

// Update the existing selectPage function to handle actual navigation
function selectPage(page) {
    // Remove active class from all nav items
    var allNavItems = document.querySelectorAll('.nav-item, .expanded-nav-item');
    for (var i = 0; i < allNavItems.length; i++) {
        allNavItems[i].classList.remove('active');
    }
    
    // Add active class to clicked items (for visual feedback before navigation)
    var regularNavItems = document.querySelectorAll('.nav-item[data-page="' + page + '"]');
    var expandedNavItems = document.querySelectorAll('.expanded-nav-item[data-page="' + page + '"]');
    
    for (var i = 0; i < regularNavItems.length; i++) {
        regularNavItems[i].classList.add('active');
    }
    for (var i = 0; i < expandedNavItems.length; i++) {
        expandedNavItems[i].classList.add('active');
    }
    
    // Handle navigation to different pages
    handleNavigation(page);
}

// Enhanced navigation handler with smooth transitions
function handleNavigation(page) {
    try {
        // Save current wallet state before navigation
        saveNavigationState();
        
        // Close expanded sidebar if open
        const expandedSidebar = document.getElementById('expandedSidebar');
        if (expandedSidebar && expandedSidebar.classList.contains('active')) {
            expandedSidebar.classList.remove('active');
        }
        
        // Navigate based on page
        switch(page) {
            case 'portfolio':
                if (window.location.pathname.includes('staking.html')) {
                    // Navigate from staking to portfolio
                    window.location.href = 'index.html';
                }
                // If already on portfolio page, just update content
                break;
                
            case 'staking':
                if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                    // Navigate from portfolio to staking
                    window.location.href = 'staking.html';
                }
                // If already on staking page, just update content
                break;
                
            case 'governance':
                showComingSoonMessage('Governance');
                break;
                
            case 'lender':
                showComingSoonMessage('Lender');
                break;
                
            case 'yieldfi':
                showComingSoonMessage('YieldFi');
                break;
                
            case 'accelerate':
                showComingSoonMessage('Accelerate');
                break;
                
            default:
                showComingSoonMessage(page.charAt(0).toUpperCase() + page.slice(1));
        }
    } catch (error) {
        console.error('Navigation error:', error);
        if (typeof showMessage === 'function') {
            showMessage('Navigation failed. Please try again.', 'error');
        }
    }
}

// Save navigation state (wallet connection, theme, etc.)
function saveNavigationState() {
    try {
        // Save wallet connection state
        if (typeof userAccount !== 'undefined' && userAccount) {
            const walletState = {
                account: userAccount,
                connected: (typeof isWalletConnected === 'function') ? isWalletConnected() : false,
                timestamp: Date.now()
            };
            localStorage.setItem('defitools_wallet_state', JSON.stringify(walletState));
        }
        
        // Save theme state
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        localStorage.setItem('defitools_theme', currentTheme);
        
    } catch (error) {
        console.error('Error saving navigation state:', error);
    }
}

// Restore navigation state on page load
function restoreNavigationState() {
    try {
        // Restore theme
        const savedTheme = localStorage.getItem('defitools_theme');
        if (savedTheme && savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            updateThemeIcons('dark');
        }
        
        // Wallet state restoration is handled by existing checkWalletConnection function
        
    } catch (error) {
        console.error('Error restoring navigation state:', error);
    }
}

// Update theme icons helper function
function updateThemeIcons(theme) {
    const themeIcon = document.getElementById('theme-icon');
    const themeIconExpanded = document.getElementById('theme-icon-expanded');
    
    if (theme === 'dark') {
        const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
        if (themeIcon) themeIcon.innerHTML = moonIcon;
        if (themeIconExpanded) themeIconExpanded.innerHTML = moonIcon;
    } else {
        const sunIcon = '<path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM12 4V2c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1zM12 22v-2c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1zM20 13h2c.6 0 1-.4 1-1s-.4-1-1-1h-2c-.6 0-1 .4-1 1s.4 1 1 1zM4 13H2c-.6 0-1-.4-1-1s.4-1 1-1h2c.6 0 1 .4 1 1s-.4 1-1 1zM17.7 7.7c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4l-1.4-1.4c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l1.4 1.4zM5.6 19.8c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L5.6 17c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l1.4 1.4zM19.8 18.4c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L17 18.4c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l1.4-1.4zM7 5.6c.4-.4.4-1 0-1.4C6.6 3.8 6 3.8 5.6 4.2L4.2 5.6c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L7 5.6z"/>';
        if (themeIcon) themeIcon.innerHTML = sunIcon;
        if (themeIconExpanded) themeIconExpanded.innerHTML = sunIcon;
    }
}

// Show coming soon message for unimplemented pages
function showComingSoonMessage(pageName) {
    const message = `${pageName} page coming soon! 🚀`;
    
    // Use existing showMessage function if available, otherwise create a simple alert
    if (typeof showMessage === 'function') {
        showMessage(message, 'success');
    } else {
        // Fallback to console log and simple alert
        console.log(message);
        alert(message);
    }
}

// Set the correct active navigation item based on current page
function setActiveNavigationItem() {
    try {
        let currentPage = 'portfolio'; // default
        
        // Determine current page from URL
        if (window.location.pathname.includes('staking.html')) {
            currentPage = 'staking';
        } else if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            currentPage = 'portfolio';
        }
        
        // Remove active class from all nav items
        const allNavItems = document.querySelectorAll('.nav-item, .expanded-nav-item');
        allNavItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to current page nav items
        const currentNavItems = document.querySelectorAll(`[data-page="${currentPage}"]`);
        currentNavItems.forEach(item => item.classList.add('active'));
        
    } catch (error) {
        console.error('Error setting active navigation item:', error);
    }
}

// Update page content based on current page
function updatePageContent() {
    try {
        const pageTitle = document.getElementById('pageTitle');
        const contentSubtitle = document.querySelector('.content-subtitle');
        
        let currentPage = 'portfolio';
        if (window.location.pathname.includes('staking.html')) {
            currentPage = 'staking';
        }
        
        const pageContent = {
            portfolio: {
                title: 'PORTFOLIO',
                subtitle: 'Track your DeFi investments and performance'
            },
            staking: {
                title: 'STAKING',
                subtitle: 'Stake tokens and earn rewards across multiple protocols'
            }
        };
        
        if (pageContent[currentPage]) {
            if (pageTitle) {
                pageTitle.textContent = pageContent[currentPage].title;
            }
            if (contentSubtitle) {
                contentSubtitle.textContent = pageContent[currentPage].subtitle;
            }
        }
    } catch (error) {
        console.error('Error updating page content:', error);
    }
}

// Enhanced wallet state management for cross-page persistence
function onWalletConnected() {
    if (typeof userAccount !== 'undefined' && userAccount && typeof provider !== 'undefined' && provider) {
        const walletState = {
            account: userAccount,
            connected: true,
            timestamp: Date.now(),
            network: 'Base' // You can make this dynamic
        };
        localStorage.setItem('defitools_wallet_state', JSON.stringify(walletState));
    }
}

// Call this when wallet disconnects
function onWalletDisconnected() {
    localStorage.removeItem('defitools_wallet_state');
}

// Initialize navigation system on page load
document.addEventListener('DOMContentLoaded', function() {
    // Restore navigation state
    restoreNavigationState();
    
    // Set correct active navigation item based on current page
    setActiveNavigationItem();
    
    // Update page title and content
    updatePageContent();
});

// Console log for debugging
console.log('DeFiTools Navigation System Loaded');
console.log('Current page:', window.location.pathname);