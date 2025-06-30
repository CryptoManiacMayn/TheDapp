        // Animated counter for stats
        function animateCounter(element, target, duration = 2000) {
            let start = 0;
            const startTime = Date.now();
            
            function updateCounter() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const current = start + (target - start) * easeOutCubic(progress);
                
                if (target > 50) {
                    element.textContent = Math.floor(current) + 'B';
                } else if (target > 10) {
                    element.textContent = Math.floor(current);
                } else {
                    element.textContent = current.toFixed(1);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            updateCounter();
        }

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        // Intersection Observer for stats animation
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseFloat(stat.dataset.target);
                        animateCounter(stat, target);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        function launchDApp() {
            showNotification('Launching DApp interface...', 'info');
            
            // Simulate loading
            setTimeout(() => {
                showNotification('DApp successfully launched!', 'success');
            }, 1500);
        }

        // Wallet connection simulation
// Wallet connection state
        let isWalletConnected = false;

        // Wallet connection simulation
        function connectWallet() {
            const button = document.querySelector('.connect-btn');
            
            if (isWalletConnected) {
                // Disconnect wallet
                disconnectWallet();
                return;
            }
            
            button.textContent = 'Connecting...';
            button.style.opacity = '0.7';
            
            setTimeout(() => {
                button.textContent = 'Disconnect';
                button.style.background = 'linear-gradient(45deg, #ff4757, #ff6b7a)';
                button.style.opacity = '1';
                isWalletConnected = true;
                
                // Show success message
                showNotification('Wallet connected successfully!', 'success');
            }, 2000);
        }

        // Wallet disconnection function
        function disconnectWallet() {
            const button = document.querySelector('.connect-btn');
            button.textContent = 'Disconnecting';
            button.style.opacity = '0.7';
            
            setTimeout(() => {
                button.textContent = 'Connect';
                button.style.background = 'linear-gradient(45deg, #00d4ff, #ff00ff)';
                button.style.opacity = '1';
                isWalletConnected = false;
                
                // Show disconnect message
                showNotification('Wallet disconnected successfully!', 'info');
            }, 1000);
        }

        function startTrading() {
            showNotification('Redirecting to trading platform...', 'info');
        }

        function signUp() {
            showNotification('Opening registration form...', 'info');
        }

        // Notification system
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? 'linear-gradient(45deg, #00ff88, #00d4ff)' : 'linear-gradient(45deg, #00d4ff, #ff00ff)'};
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                font-weight: bold;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Parallax effect for floating elements
        document.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            document.querySelectorAll('.floating-crypto').forEach((element, index) => {
                element.style.transform = `translateY(${parallax * (index + 1) * 0.1}px)`;
            });
        });

        // Add some interactive hover effects
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) rotateY(5deg)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateY(0deg)';
            });
        });


// Blockchain Networks Section JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdown = document.getElementById('productsDropdown');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (dropdown) {
        dropdown.addEventListener('click', (event) => {
            if (window.innerWidth <= 768) {
                event.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    }

    initializeBlockchainSection();
});

function initializeBlockchainSection() {
    setupScrollingCards();
    setupCardInteractions();
    setupIntersectionObserver();
    setupResponsiveScrolling();
    setupTouchSupport();
    optimizePerformance();
}

// Scrolling Cards Management
function setupScrollingCards() {
    const cardsWrapper = document.querySelector('.blockchain-cards-wrapper');
    
    if (!cardsWrapper) return;
    
    // Pause animation on hover
    cardsWrapper.addEventListener('mouseenter', () => {
        cardsWrapper.style.animationPlayState = 'paused';
    });
    
    cardsWrapper.addEventListener('mouseleave', () => {
        cardsWrapper.style.animationPlayState = 'running';
    });
    
    // Pause animation on focus for accessibility
    const cards = document.querySelectorAll('.blockchain-card');
    cards.forEach(card => {
        card.addEventListener('focus', () => {
            cardsWrapper.style.animationPlayState = 'paused';
        });
        
        card.addEventListener('blur', () => {
            cardsWrapper.style.animationPlayState = 'running';
        });
    });
}

// Card Interactions
function setupCardInteractions() {
    const cards = document.querySelectorAll('.blockchain-card');
    
    cards.forEach(card => {
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        // Click/Enter handler
        function handleCardActivation(e) {
            if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
                e.preventDefault();
                showBlockchainDetails(card);
            }
        }
        
        card.addEventListener('click', handleCardActivation);
        card.addEventListener('keydown', handleCardActivation);
        
        // Hover effects with mouse tracking
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Show blockchain details modal
function showBlockchainDetails(card) {
    const blockchainName = card.querySelector('h3').textContent;
    const features = Array.from(card.querySelectorAll('.feature')).map(f => f.textContent);
    const timeline = card.querySelector('.timeline-status').textContent;
    const isLaunching = card.classList.contains('primary-launch');
    
    // Create and show modal
    createBlockchainModal({
        name: blockchainName,
        features: features,
        timeline: timeline,
        isLaunching: isLaunching,
        card: card
    });
}

function createBlockchainModal(data) {
    // Remove existing modal
    const existingModal = document.querySelector('.blockchain-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'blockchain-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${data.name} Network</h3>
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-features">
                        <h4>Key Features:</h4>
                        <ul>
                            ${data.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-timeline">
                        <h4>Deployment Timeline:</h4>
                        <p>${data.timeline}</p>
                    </div>
                    <div class="modal-integration">
                        <h4>Oeconomia Integration:</h4>
                        <p>All five Oeconomia protocols will be deployed on ${data.name} with full cross-chain compatibility and unified governance.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .blockchain-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            animation: modalFadeIn 0.3s ease;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .modal-content {
            background: rgba(15, 15, 30, 0.95);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 20px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalSlideUp 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem 2rem 1rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-header h3 {
            color: white;
            font-size: 1.5rem;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }
        
        .modal-body {
            padding: 1rem 2rem 2rem 2rem;
        }
        
        .modal-features, .modal-timeline, .modal-integration {
            margin-bottom: 1.5rem;
        }
        
        .modal-features h4, .modal-timeline h4, .modal-integration h4 {
            color: #00d4ff;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        
        .modal-features ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .modal-features li {
            color: rgba(255, 255, 255, 0.8);
            padding: 0.3rem 0;
            position: relative;
            padding-left: 1.5rem;
        }
        
        .modal-features li::before {
            content: "▸";
            color: #00d4ff;
            position: absolute;
            left: 0;
        }
        
        .modal-timeline p, .modal-integration p {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin: 0;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes modalSlideUp {
            from { 
                opacity: 0;
                transform: translateY(50px) scale(0.9);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @media (max-width: 768px) {
            .modal-overlay {
                padding: 1rem;
            }
            
            .modal-header, .modal-body {
                padding: 1.5rem;
            }
            
            .modal-header {
                padding-bottom: 1rem;
            }
            
            .modal-body {
                padding-top: 1rem;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#blockchain-modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'blockchain-modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    function closeModal() {
        modal.style.animation = 'modalFadeIn 0.3s ease reverse';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    // Focus management
    closeBtn.focus();
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate phase cards with stagger
                if (entry.target.classList.contains('deployment-strategy')) {
                    const phaseCards = entry.target.querySelectorAll('.phase-card');
                    phaseCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animation = `fadeInUp 0.6s ease forwards`;
                            card.style.opacity = '1';
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe section elements
    const section = document.querySelector('.blockchain-networks');
    const strategy = document.querySelector('.deployment-strategy');
    
    if (section) observer.observe(section);
    if (strategy) observer.observe(strategy);
    
    // Initially hide phase cards for animation
    const phaseCards = document.querySelectorAll('.phase-card');
    phaseCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
    });
}

// Responsive scrolling adjustments
function setupResponsiveScrolling() {
    function adjustScrollSpeed() {
        const cardsWrapper = document.querySelector('.blockchain-cards-wrapper');
        if (!cardsWrapper) return;
        
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        if (isMobile) {
            cardsWrapper.style.animationDuration = '40s';
        } else if (isTablet) {
            cardsWrapper.style.animationDuration = '50s';
        } else {
            cardsWrapper.style.animationDuration = '60s';
        }
    }
    
    // Initial adjustment
    adjustScrollSpeed();
    
    // Adjust on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(adjustScrollSpeed, 250);
    });
}

// Touch/swipe support for mobile
function setupTouchSupport() {
    const cardsWrapper = document.querySelector('.blockchain-cards-wrapper');
    if (!cardsWrapper) return;
    
    let startX, startY, isDragging = false;
    
    cardsWrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = false;
        cardsWrapper.style.animationPlayState = 'paused';
    });
    
    cardsWrapper.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        if (diffX > diffY && diffX > 10) {
            isDragging = true;
            e.preventDefault();
        }
    });
    
    cardsWrapper.addEventListener('touchend', () => {
        setTimeout(() => {
            cardsWrapper.style.animationPlayState = 'running';
        }, 1000);
        
        startX = null;
        startY = null;
        isDragging = false;
    });
}

// Performance optimization
function optimizePerformance() {
    // Use requestAnimationFrame for smooth animations
    const cards = document.querySelectorAll('.blockchain-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            requestAnimationFrame(() => {
                card.style.willChange = 'transform';
            });
        });
        
        card.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                card.style.willChange = 'auto';
            });
        });
    });
}

// Notification system for card interactions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #00ff88, #00d4ff)' : 'linear-gradient(45deg, #00d4ff, #ff00ff)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: bold;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Export functions for potential external use
window.BlockchainNetworks = {
    showBlockchainDetails,
    createBlockchainModal,
    showNotification
};