// Section navigation functionality
class SectionNavigator {
    constructor() {
        // Updated to match your ACTUAL section IDs in the HTML
        this.sections = ['home', 'features', 'products', 'blockchain-networks', 'roadmap-section','cta', 'footer']; 
        this.currentSectionIndex = 0;
        this.prevBtn = document.getElementById('prevSectionBtn');
        this.nextBtn = document.getElementById('nextSectionBtn');
        this.isScrolling = false;

        this.init();
    }

    init() {
        // Check if buttons exist before proceeding
        if (!this.prevBtn || !this.nextBtn) {
            console.error('Section navigation buttons not found in DOM');
            return;
        }

        // Show buttons after a delay
        setTimeout(() => {
            this.prevBtn.classList.add('show');
            this.nextBtn.classList.add('show');
        }, 1000);

        // Add event listeners for navigation buttons
        this.prevBtn.addEventListener('click', () => this.navigateToSection('prev'));
        this.nextBtn.addEventListener('click', () => this.navigateToSection('next'));

        // UNIFIED SMOOTH SCROLLING - Handle both navbar and section navigation
        this.setupSmoothScrolling();

        // Update current section on scroll with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                this.updateCurrentSection();
            }, 100);
        });

        // Initial state - detect current section on load
        setTimeout(() => {
            this.updateCurrentSection();
        }, 500);
    }

    // Unified smooth scrolling for both navbar links and section navigation
    setupSmoothScrolling() {
        // Handle all anchor links with smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.smoothScrollToTarget(targetId);
            });
        });
    }

    // Unified smooth scroll function used by both navbar and section navigation
    smoothScrollToTarget(targetId) {
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        this.isScrolling = true;

        // Different offsets for different sections
        const sectionOffsets = {
            'home': 100,              // No offset for hero section
            'features': 20,        // Medium offset for features
            'products': 20,        // More offset for products
            'blockchain-networks': 10,        // More offset for products
            'roadmap-section': -20, // Less offset for roadmap
            'cta': 20,            // Less offset for CTA
            'footer': 0            // Most offset for footer
        };

        const scrollOffset = sectionOffsets[targetId] || -20; // Default offset
        const targetPosition = targetSection.offsetTop - scrollOffset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Update current section index if this target is in our sections array
        const sectionIndex = this.sections.indexOf(targetId);
        if (sectionIndex !== -1) {
            this.currentSectionIndex = sectionIndex;
        }

        // Re-enable scroll detection after animation
        setTimeout(() => {
            this.isScrolling = false;
            this.updateButtons();
        }, 1000);
    }

    updateCurrentSection() {
        if (this.isScrolling) return;

        const scrollPosition = window.scrollY + 200; // Offset for better detection
        let newIndex = 0;
        
        for (let i = 0; i < this.sections.length; i++) {
            const section = document.getElementById(this.sections[i]);
            if (section) {
                const sectionTop = section.offsetTop;
                
                if (scrollPosition >= sectionTop) {
                    newIndex = i;
                }
            }
        }

        if (newIndex !== this.currentSectionIndex) {
            this.currentSectionIndex = newIndex;
            this.updateButtons();
        }
    }

    navigateToSection(direction) {
        if (this.isScrolling) return;

        let targetIndex = this.currentSectionIndex;
        
        if (direction === 'next' && this.currentSectionIndex < this.sections.length - 1) {
            targetIndex = this.currentSectionIndex + 1;
        } else if (direction === 'prev' && this.currentSectionIndex > 0) {
            targetIndex = this.currentSectionIndex - 1;
        }

        if (targetIndex !== this.currentSectionIndex) {
            this.scrollToSection(targetIndex);
        }
    }

    scrollToSection(index) {
        this.isScrolling = true;
        this.currentSectionIndex = index;
        
        const targetSection = document.getElementById(this.sections[index]);
        if (targetSection) {
            // Different offsets for different sections
            const sectionOffsets = {
                'home': 100,              // No offset for hero section
                'features': 20,        // Medium offset for features
                'products': 20,        // More offset for products
                'blockchain-networks': 10,        // More offset for products
                'roadmap-section': -20, // Less offset for roadmap
                'cta': 20,            // Less offset for CTA
                'footer': 0            // Most offset for footer
            };
            
            const sectionName = this.sections[index];
            const scrollOffset = sectionOffsets[sectionName] || -20; // Default to -20
            
            const targetPosition = targetSection.offsetTop - scrollOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            setTimeout(() => {
                this.isScrolling = false;
                this.updateButtons();
            }, 1000);
        }
    }

    updateButtons() {
        // Update previous button
        if (this.currentSectionIndex === 0) {
            this.prevBtn.disabled = true;
            this.prevBtn.style.opacity = '0.3';
        } else {
            this.prevBtn.disabled = false;
            this.prevBtn.style.opacity = '1';
        }

        // Update next button
        if (this.currentSectionIndex === this.sections.length - 1) {
            this.nextBtn.disabled = true;
            this.nextBtn.style.opacity = '0.3';
        } else {
            this.nextBtn.disabled = false;
            this.nextBtn.style.opacity = '1';
        }

        // Add visual feedback
        this.prevBtn.title = this.currentSectionIndex > 0 
            ? `Previous: ${this.sections[this.currentSectionIndex - 1].charAt(0).toUpperCase() + this.sections[this.currentSectionIndex - 1].slice(1)}`
            : 'At top';
        
        this.nextBtn.title = this.currentSectionIndex < this.sections.length - 1
            ? `Next: ${this.sections[this.currentSectionIndex + 1].charAt(0).toUpperCase() + this.sections[this.currentSectionIndex + 1].slice(1)}`
            : 'At bottom';

        // Debug logging - remove this after testing
        console.log('Current section:', this.sections[this.currentSectionIndex], 'Index:', this.currentSectionIndex);
    }
}

// Initialize section navigator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SectionNavigator();
});

// Keep your existing functions
function launchDApp() {
    showNotification('Launching DApp interface...', 'info');
    setTimeout(() => {
        showNotification('DApp successfully launched!', 'success');
    }, 1500);
}

// Wallet connection state
let isWalletConnected = false;

function connectWallet() {
    const button = document.querySelector('.connect-btn');
    
    if (isWalletConnected) {
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
        showNotification('Wallet connected successfully!', 'success');
    }, 2000);
}

function disconnectWallet() {
    const button = document.querySelector('.connect-btn');
    button.textContent = 'Disconnecting';
    button.style.opacity = '0.7';
    
    setTimeout(() => {
        button.textContent = 'Connect';
        button.style.background = 'linear-gradient(45deg, #00d4ff, #ff00ff)';
        button.style.opacity = '1';
        isWalletConnected = false;
        showNotification('Wallet disconnected successfully!', 'info');
    }, 1000);
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
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}