// Enhanced Blockchain Networks Section Animation
// This script creates repeatable entrance effects for the blockchain networks section

class BlockchainNetworksAnimator {
    constructor() {
        this.section = document.getElementById('blockchain-networks');
        this.cards = [];
        this.observer = null;
        this.isAnimating = false;
        this.animationTimers = [];
        
        this.init();
    }

    init() {
        if (!this.section) {
            console.warn('Blockchain networks section not found');
            return;
        }
        
        this.setupCards();
        this.setupIntersectionObserver();
        this.addCustomStyles();
        
        console.log('Blockchain Networks Animator initialized');
    }

    setupCards() {
        // Get all blockchain cards within the section
        this.cards = Array.from(this.section.querySelectorAll('.blockchain-card'));
        
        // Initialize card states
        this.cards.forEach((card, index) => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.dataset.cardIndex = index;
            this.resetCard(card);
        });
    }

    resetCard(card) {
        // Reset card to initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) rotateX(15deg) scale(0.9)';
        card.style.filter = 'blur(5px)';
        card.classList.remove('animate-in', 'glow-effect');
    }

    animateCard(card, delay = 0) {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
            card.style.filter = 'blur(0px)';
            card.classList.add('animate-in');
            
            // Add glow effect after animation
            setTimeout(() => {
                card.classList.add('glow-effect');
            }, 300);
            
        }, delay);
    }

    triggerAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Clear any existing timers
        this.animationTimers.forEach(timer => clearTimeout(timer));
        this.animationTimers = [];
        
        // Create wave animation effect
        this.cards.forEach((card, index) => {
            const delay = index * 150; // Stagger animation
            
            const timer = setTimeout(() => {
                this.animateCard(card);
            }, delay);
            
            this.animationTimers.push(timer);
        });
        
        // Add section-wide effects
        this.addSectionEffects();
        
        // Reset animation flag after all animations complete
        const totalAnimationTime = (this.cards.length * 150) + 1000;
        const resetTimer = setTimeout(() => {
            this.isAnimating = false;
        }, totalAnimationTime);
        
        this.animationTimers.push(resetTimer);
    }

    resetAnimation() {
        if (this.isAnimating) {
            // Clear all timers if animation is in progress
            this.animationTimers.forEach(timer => clearTimeout(timer));
            this.animationTimers = [];
            this.isAnimating = false;
        }
        
        // Reset all cards
        this.cards.forEach(card => {
            this.resetCard(card);
        });
        
        // Remove section effects
        this.removeSectionEffects();
    }

    addSectionEffects() {
        // Add dynamic background particles
        this.createFloatingParticles();
        
        // Add pulsing border effect to section
        this.section.classList.add('section-animated');
        
        // Add subtle screen flash effect
        this.createScreenFlash();
    }

    removeSectionEffects() {
        // Remove particles
        const particles = this.section.querySelectorAll('.floating-particle');
        particles.forEach(particle => particle.remove());
        
        // Remove section animation class
        this.section.classList.remove('section-animated');
    }

    createFloatingParticles() {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            // Random position within section
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: 4px;
                height: 4px;
                background: rgba(0, 212, 255, 0.8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
                animation: particleFloat 3s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            this.section.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 5000);
        }
    }

    createScreenFlash() {
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            animation: screenFlash 0.8s ease-out;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 800);
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Section is entering viewport
                    if (entry.intersectionRatio > 0.3) {
                        this.triggerAnimation();
                    }
                } else {
                    // Section is leaving viewport
                    if (entry.intersectionRatio < 0.1) {
                        setTimeout(() => {
                            this.resetAnimation();
                        }, 500);
                    }
                }
            });
        }, {
            threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0],
            rootMargin: '-50px 0px -50px 0px'
        });

        this.observer.observe(this.section);
    }

    addCustomStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            /* Animation styles for blockchain networks */
 /*
            .blockchain-card.animate-in {
                box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
            }
            
            .blockchain-card.glow-effect {
                box-shadow: 
                    0 10px 30px rgba(0, 212, 255, 0.3),
                    0 0 20px rgba(0, 212, 255, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
            */
            .blockchain-networks.section-animated {
                position: relative;
            }
            
            .blockchain-networks.section-animated::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 2px solid transparent;
                border-radius: 16px;
                background: linear-gradient(45deg, rgba(0, 212, 255, 0.2), rgba(255, 0, 255, 0.2)) border-box;
                -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: destination-out;
                mask-composite: exclude;
                animation: borderPulse 2s ease-in-out infinite;
                pointer-events: none;
            }
            
            @keyframes particleFloat {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                50% {
                    transform: translateY(-20px) rotate(180deg);
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-40px) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes screenFlash {
                0% {
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
            
            @keyframes borderPulse {
                0%, 100% {
                    opacity: 0.3;
                }
                50% {
                    opacity: 0.8;
                }
            }
            
            /* Enhanced hover effects for animated cards */
            .blockchain-card.animate-in:hover {
                transform: translateY(-15px) rotateY(10deg) scale(1.05);
                box-shadow: 
                    0 2px 10px rgba(0, 212, 255, 0.4),
                    0 0 10px rgba(0, 212, 255, 0.3);
            }
            
            /* Primary launch cards special effects */
            .blockchain-card.primary-launch.animate-in {

            }
            
            .blockchain-card.primary-launch.glow-effect {
                box-shadow: 
                    0 1px 10px rgba(0, 255, 136, 0.3),
                    0 0 10px rgba(0, 255, 136, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
            
            .blockchain-card.primary-launch.animate-in:hover {
                box-shadow: 
                    0 1px 10px rgba(0, 255, 136, 0.4),
                    0 0 10px rgba(0, 255, 136, 0.3);
            }
        `;
        
        document.head.appendChild(styleSheet);
    }

    // Manual trigger method
    manualTrigger() {
        this.resetAnimation();
        setTimeout(() => {
            this.triggerAnimation();
        }, 100);
    }

    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        this.animationTimers.forEach(timer => clearTimeout(timer));
        this.resetAnimation();
    }
}

// Initialize the animator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.blockchainAnimator = new BlockchainNetworksAnimator();
    }, 500);
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // Document is still loading, event listener above will handle it
} else {
    // Document is already loaded
    setTimeout(() => {
        window.blockchainAnimator = new BlockchainNetworksAnimator();
    }, 500);
}

// Export for manual control
window.BlockchainNetworksAnimator = BlockchainNetworksAnimator;

// Add keyboard shortcut for manual trigger (for testing)
document.addEventListener('keydown', (e) => {
    if (e.key === 'b' && e.ctrlKey && e.shiftKey) {
        if (window.blockchainAnimator) {
            window.blockchainAnimator.manualTrigger();
        }
    }
});