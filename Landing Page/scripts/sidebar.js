        // OEC Coin Stats Sidebar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('oec-stats-sidebar');
    let isHidden = false;
    
    // Mock data for dynamic updates
    const mockData = {
        price: { min: 20.00, max: 30.00, current: 24.87 },
        change: { min: -15, max: 20, current: 12.4 },
        tvl: { min: 800, max: 900, current: 847.2 },
        supply: { min: 150, max: 160, current: 158.7 },
        rewards: { min: 10, max: 15, current: 12.8 },
        marketcap: { min: 3.5, max: 4.2, current: 3.95 }
    };
    
    // Scroll handler for sidebar visibility
    function handleScroll() {
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        const shouldHide = scrollPosition > (window.innerHeight * 0.1); // 10vh
        
        if (shouldHide && !isHidden) {
            sidebar.classList.add('hidden');
            isHidden = true;
        } else if (!shouldHide && isHidden) {
            sidebar.classList.remove('hidden');
            isHidden = false;
        }
    }
    
    // Add scroll event listener with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    });
    
    // Function to generate random price movement
    function generateRandomChange(current, min, max, volatility = 0.02) {
        const change = (Math.random() - 0.5) * volatility * current;
        const newValue = current + change;
        return Math.max(min, Math.min(max, newValue));
    }
    
    // Function to format numbers
    function formatNumber(num, decimals = 2, suffix = '') {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B' + suffix;
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M' + suffix;
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K' + suffix;
        }
        return num.toFixed(decimals) + suffix;
    }
    
    // Function to update stats with animation
    function updateStats() {
        // Update price
        mockData.price.current = generateRandomChange(
            mockData.price.current, 
            mockData.price.min, 
            mockData.price.max
        );
        
        // Update 24h change
        mockData.change.current = generateRandomChange(
            mockData.change.current, 
            mockData.change.min, 
            mockData.change.max, 
            0.1
        );
        
        // Update TVL
        mockData.tvl.current = generateRandomChange(
            mockData.tvl.current, 
            mockData.tvl.min, 
            mockData.tvl.max, 
            0.005
        );
        
        // Update supply (minimal changes)
        mockData.supply.current = generateRandomChange(
            mockData.supply.current, 
            mockData.supply.min, 
            mockData.supply.max, 
            0.001
        );
        
        // Update rewards
        mockData.rewards.current = generateRandomChange(
            mockData.rewards.current, 
            mockData.rewards.min, 
            mockData.rewards.max, 
            0.01
        );
        
        // Calculate market cap
        mockData.marketcap.current = (mockData.price.current * mockData.supply.current) / 1000;
        
        // Update DOM elements
        document.getElementById('oec-price').textContent = '$' + mockData.price.current.toFixed(2);
        
        const changeElement = document.getElementById('oec-change');
        const changeValue = mockData.change.current;
        changeElement.textContent = (changeValue > 0 ? '+' : '') + changeValue.toFixed(1) + '%';
        changeElement.className = 'oec-stat-value ' + (changeValue > 0 ? 'oec-positive' : 'oec-negative');
        
        document.getElementById('oec-tvl').textContent = '$' + formatNumber(mockData.tvl.current * 1000000);
        document.getElementById('oec-supply').textContent = formatNumber(mockData.supply.current * 1000000, 1, ' OEC');
        document.getElementById('oec-rewards').textContent = '$' + formatNumber(mockData.rewards.current * 1000000);
        document.getElementById('oec-marketcap').textContent = '$' + formatNumber(mockData.marketcap.current * 1000000000);
    }
    
    // Function to add subtle animation to stat updates
    function animateStatUpdate(elementId) {
        const element = document.getElementById(elementId);
        element.style.transform = 'scale(1.05)';
        element.style.color = '#00d4ff';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 200);
    }
    
    // Enhanced update function with animations
    function updateStatsWithAnimation() {
        updateStats();
        
        // Randomly animate some stats
        const statIds = ['oec-price', 'oec-change', 'oec-tvl', 'oec-supply', 'oec-rewards', 'oec-marketcap'];
        const randomStat = statIds[Math.floor(Math.random() * statIds.length)];
        animateStatUpdate(randomStat);
    }
    
    // Initial stats update
    updateStats();
    
    // Update stats every 3 seconds
    setInterval(updateStatsWithAnimation, 3000);
    
    // Add click interaction for manual refresh
    sidebar.addEventListener('click', function(e) {
        if (e.target.closest('.oec-sidebar-header')) {
            updateStatsWithAnimation();
            
            // Visual feedback
            const logo = document.querySelector('.oec-logo-circle');
            logo.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                logo.style.transform = 'rotate(0deg)';
            }, 500);
        }
    });
    
    // Add hover effects for individual stats
    document.querySelectorAll('.oec-stat-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0, 212, 255, 0.05)';
            this.style.borderRadius = '8px';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.borderRadius = '';
        });
    });
    
    // Performance optimization: pause updates when sidebar is hidden
    let updateInterval;
    
    function startUpdates() {
        updateInterval = setInterval(updateStatsWithAnimation, 3000);
    }
    
    function stopUpdates() {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    }
    
    // Monitor visibility changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (sidebar.classList.contains('hidden')) {
                    stopUpdates();
                } else {
                    startUpdates();
                }
            }
        });
    });
    
    observer.observe(sidebar, { attributes: true });
    
    // Start the updates
    startUpdates();
});