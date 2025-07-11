// Enhanced infinite scroll for blockchain networks - FIXED VERSION
document.addEventListener("DOMContentLoaded", function () {
    const blockchainSection = document.getElementById("blockchain-networks");
    let isAnimating = false;

    // Configuration for blockchain card animations
    const animationConfig = {
        triggerThreshold: 0.01,
        rootMargin: '-20px 0px -20px 0px',
        preparationDelay: 10,
        animationDuration: 800,
        resetDelay: 300,
        preparationOpacity: 0.2,
        preparationTransform: {
            y: 40,
            scale: 0.9
        }
    };

    // Setup TRULY seamless infinite scroll
    function setupSeamlessScroll() {
        const wrapper = document.querySelector('.blockchain-cards-wrapper');
        const cardsContainer = document.querySelector('.blockchain-scroll-container');
        
        if (!wrapper || !cardsContainer) return;

        // Get all existing blockchain cards
        const originalCards = Array.from(wrapper.querySelectorAll('.blockchain-card'));
        
        if (originalCards.length === 0) return;

        // Clear the wrapper
        wrapper.innerHTML = '';

        // Calculate dimensions
        const cardWidth = 200; // Width of each card
        const gap = 4; // Gap between cards (0.25rem = 4px)
        const totalCards = originalCards.length;
        const singleSetWidth = (cardWidth + gap) * totalCards - gap; // Subtract last gap

        // Create THREE sets for seamless scrolling (original + 2 duplicates)
        for (let setIndex = 0; setIndex < 3; setIndex++) {
            const cardSet = document.createElement('div');
            cardSet.className = 'blockchain-cards-set';
            cardSet.style.display = 'flex';
            cardSet.style.gap = '0.25rem';
            cardSet.style.flexShrink = '0';
            
            // Clone all original cards to this set
            originalCards.forEach(card => {
                const clonedCard = card.cloneNode(true);
                cardSet.appendChild(clonedCard);
            });
            
            wrapper.appendChild(cardSet);
        }

        // Set wrapper styles for seamless scrolling
        wrapper.style.display = 'flex';
        wrapper.style.gap = '0.25rem';
        wrapper.style.width = 'fit-content';

        // Create and inject the seamless scroll animation
        const animationName = 'seamlessInfiniteScroll';
        const existingStyle = document.getElementById('blockchain-infinite-scroll-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'blockchain-infinite-scroll-style';
        style.textContent = `
            @keyframes ${animationName} {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-${singleSetWidth + gap}px);
                }
            }
            
            .blockchain-cards-wrapper {
                animation: ${animationName} 60s linear infinite;
            }
            
            .blockchain-cards-wrapper:hover {
                animation-play-state: paused;
            }
            
            /* Ensure smooth performance */
            .blockchain-cards-wrapper {
                will-change: transform;
                backface-visibility: hidden;
                transform: translateZ(0);
            }
        `;
        document.head.appendChild(style);

        console.log('True infinite scroll setup complete');
        console.log(`Single set width: ${singleSetWidth}px, Cards: ${totalCards}, Total sets: 3`);
    }

    // Alternative method using pure CSS approach
    function setupCSSInfiniteScroll() {
        const wrapper = document.querySelector('.blockchain-cards-wrapper');
        const cardsContainer = document.querySelector('.blockchain-scroll-container');
        
        if (!wrapper || !cardsContainer) return;

        // Get original cards
        const originalCards = Array.from(wrapper.querySelectorAll('.blockchain-card'));
        if (originalCards.length === 0) return;

        // Clear wrapper
        wrapper.innerHTML = '';

        // Create a container for all the scrolling content
        const scrollContent = document.createElement('div');
        scrollContent.className = 'blockchain-scroll-content';
        
        // Add original cards
        originalCards.forEach(card => {
            scrollContent.appendChild(card.cloneNode(true));
        });
        
        // Add duplicates for seamless scroll (we need enough to fill the screen + extra)
        for (let i = 0; i < 2; i++) {
            originalCards.forEach(card => {
                scrollContent.appendChild(card.cloneNode(true));
            });
        }

        wrapper.appendChild(scrollContent);

        // Apply styles
        const cardWidth = 200;
        const gap = 4;
        const totalOriginalWidth = (cardWidth + gap) * originalCards.length;

        // Update CSS
        const existingStyle = document.getElementById('blockchain-css-infinite-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'blockchain-css-infinite-style';
        style.textContent = `
            .blockchain-scroll-content {
                display: flex;
                gap: 0.25rem;
                animation: infiniteScrollCSS 60s linear infinite;
                will-change: transform;
            }
            
            .blockchain-scroll-content:hover {
                animation-play-state: paused;
            }
            
            @keyframes infiniteScrollCSS {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-${totalOriginalWidth}px);
                }
            }
            
            .blockchain-cards-wrapper {
                display: flex;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);

        console.log('CSS infinite scroll setup complete');
    }

    // Handle video background
    function initializeVideoBackground() {
        const video = document.querySelector('.blockchain-video-background video');
        if (video) {
            video.addEventListener('canplaythrough', function() {
                video.classList.add('loaded');
            });
            
            setTimeout(() => {
                if (!video.classList.contains('loaded')) {
                    video.classList.add('loaded');
                }
            }, 1000);
        }
    }

    // Animation Handler for card entrance effects
    function initializeBlockchainCardAnimations() {
        const blockchainCards = document.querySelectorAll('.blockchain-card');
        let hasTriggered = false;
        
        function triggerAnimation() {
            if (isAnimating) return;
            
            isAnimating = true;
            hasTriggered = true;
            
            blockchainCards.forEach((card) => {
                card.classList.remove('animate-in');
                card.classList.add('preparing-animation');
            });
            
            setTimeout(() => {
                blockchainCards.forEach((card) => {
                    card.classList.remove('preparing-animation');
                    card.classList.add('animate-in');
                });
                
                setTimeout(() => {
                    isAnimating = false;
                }, animationConfig.animationDuration + 1000);
            }, animationConfig.preparationDelay);
        }
        
        function resetAnimation() {
            if (!hasTriggered) return;
            
            blockchainCards.forEach((card) => {
                card.classList.remove('animate-in', 'preparing-animation');
            });
            isAnimating = false;
            hasTriggered = false;
        }
        
        const cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (entry.intersectionRatio >= animationConfig.triggerThreshold) {
                            setTimeout(() => {
                                triggerAnimation();
                            }, 100);
                        }
                    } else {
                        if (entry.intersectionRatio < 0.05) {
                            setTimeout(() => {
                                resetAnimation();
                            }, animationConfig.resetDelay);
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: animationConfig.rootMargin,
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
            }
        );
        
        if (blockchainSection) {
            cardObserver.observe(blockchainSection);
        }
        
        return { triggerAnimation, resetAnimation };
    }

    // Initialize everything
    function initialize() {
        // Use the improved seamless scroll method
        setupSeamlessScroll();
        
        // Alternative: uncomment this line and comment the above to try the CSS method
        // setupCSSInfiniteScroll();
        
        initializeVideoBackground();
        
        setTimeout(() => {
            const animationController = initializeBlockchainCardAnimations();
            window.blockchainAnimationController = animationController;
        }, 100);
    }

    // Initialize when DOM is ready
    initialize();

    // Expose setup functions globally
    window.setupSeamlessBlockchainScroll = setupSeamlessScroll;
    window.setupCSSInfiniteScroll = setupCSSInfiniteScroll;
});

// Keep the rest of the existing animation classes
class OeconomiaAnimations {
    constructor() {
        this.particles = [];
        this.observers = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.setupScrollAnimations();
        this.setupScrollToTop();
        this.setupNavigation();
    }

    createParticles() {
        const particleContainer = document.getElementById('particles');
        if (!particleContainer) return;
        
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            
            const colors = ['rgba(0, 212, 255, 0.6)', 'rgba(255, 0, 255, 0.6)', 'rgba(0, 255, 136, 0.6)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            particleContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }

    setupScrollAnimations() {
        const animateElements = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    const staggerElements = entry.target.querySelectorAll('[class*="stagger-"]');
                    staggerElements.forEach((el, index) => {
                        setTimeout(() => {
                            if (el.classList.contains('feature-card')) {
                                el.classList.add('animate');
                            } else if (el.classList.contains('phase-card')) {
                                el.classList.add('animate');
                            }
                        }, index * 150);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }

    setupScrollToTop() {
        const scrollBtn = document.getElementById('scrollToTopBtn');
        if (!scrollBtn) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
                nav.style.background = 'rgba(0, 0, 0, 0.9)';
            }
        });

        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const oeconomiaAnimations = new OeconomiaAnimations();
    
    // Add interactive cursor effect
    document.addEventListener('mousemove', (e) => {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            width: 4px;
            height: 4px;
            background: rgba(0, 212, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: cursorFade 0.5s ease-out forwards;
        `;
        
        document.body.appendChild(cursor);
        
        setTimeout(() => {
            cursor.remove();
        }, 500);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cursorFade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
    `;
    document.head.appendChild(style);
});

// Expose animations globally
window.OeconomiaAnimations = OeconomiaAnimations;