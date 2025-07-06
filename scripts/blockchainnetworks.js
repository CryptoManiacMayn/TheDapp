// Add this to your existing script.js or create a new file
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

    // Initialize video background
    initializeVideoBackground();

    // Animation Handler
    function initializeBlockchainCardAnimations() {
        const blockchainCards = document.querySelectorAll('.blockchain-card');
        let hasTriggered = false;
        
        // Function to trigger animation
        function triggerAnimation() {
            if (isAnimating) return;
            
            isAnimating = true;
            hasTriggered = true;
            
            // Step 1: Prepare cards for animation
            blockchainCards.forEach((card) => {
                card.classList.remove('animate-in');
                card.classList.add('preparing-animation');
            });
            
            // Step 2: Start animation after delay
            setTimeout(() => {
                blockchainCards.forEach((card) => {
                    card.classList.remove('preparing-animation');
                    card.classList.add('animate-in');
                });
                
                // Reset animation flag after animation completes
                setTimeout(() => {
                    isAnimating = false;
                }, animationConfig.animationDuration + 1000);
            }, animationConfig.preparationDelay);
        }
        
        // Function to reset animation state
        function resetAnimation() {
            if (!hasTriggered) return;
            
            blockchainCards.forEach((card) => {
                card.classList.remove('animate-in', 'preparing-animation');
            });
            isAnimating = false;
            hasTriggered = false;
        }
        
        // Intersection Observer for blockchain cards
        const cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Trigger animation when enough of the section is visible
                        if (entry.intersectionRatio >= animationConfig.triggerThreshold) {
                            setTimeout(() => {
                                triggerAnimation();
                            }, 100);
                        }
                    } else {
                        // Reset animation when leaving section
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

    // Initialize animation system
    const animationController = initializeBlockchainCardAnimations();
    
    // Expose controls globally
    window.blockchainAnimationController = animationController;
});







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

        // Create floating particles
        createParticles() {
          const particleContainer = document.getElementById('particles');
          const particleCount = 50;

          for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            
            // Random colors
            const colors = ['rgba(0, 212, 255, 0.6)', 'rgba(255, 0, 255, 0.6)', 'rgba(0, 255, 136, 0.6)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            particleContainer.appendChild(particle);
            this.particles.push(particle);
          }
        }

        // Setup scroll-triggered animations
        setupScrollAnimations() {
          const animateElements = document.querySelectorAll('.section');
          
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate child elements with stagger
                const staggerElements = entry.target.querySelectorAll('[class*="stagger-"]');
                staggerElements.forEach((el, index) => {
                  setTimeout(() => {
                    if (el.classList.contains('feature-card')) {
                      el.classList.add('animate');
                    }  else if (el.classList.contains('phase-card')) {
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

        // Setup accordion functionality
        setupAccordion() {
          const accordionItems = document.querySelectorAll('.accordion-item');
          
          accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', () => {
              const isActive = item.classList.contains('active');
              
              // Close all accordion items
              accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
              });
              
              // Open clicked item if it wasn't active
              if (!isActive) {
                item.classList.add('active');
              }
            });
          });
        }

        // Setup scroll to top button
        setupScrollToTop() {
          const scrollBtn = document.getElementById('scrollToTopBtn');
          
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

        // Setup navigation effects
        setupNavigation() {
          const nav = document.querySelector('nav');
          
          window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
              nav.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
              nav.style.background = 'rgba(0, 0, 0, 0.9)';
            }
          });

          // Smooth scrolling for navigation links
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

        // Cleanup observers
        destroy() {
          this.observers.forEach(observer => observer.disconnect());
        }
      }

      // Enhanced Blockchain Network Animation
      class BlockchainNetworkAnimations {
        constructor() {
          this.isAnimating = false;
          this.init();
        }

        init() {
          this.initializeVideoBackground();
          this.initializeCardAnimations();
        }

        initializeVideoBackground() {
          const video = document.querySelector('.blockchain-video-background video');
          if (video) {
            video.addEventListener('canplaythrough', () => {
              video.classList.add('loaded');
            });
            
            setTimeout(() => {
              if (!video.classList.contains('loaded')) {
                video.classList.add('loaded');
              }
            }, 1000);
          }
        }

        initializeCardAnimations() {
          const blockchainSection = document.getElementById('blockchain-networks');
          const blockchainCards = document.querySelectorAll('.blockchain-card');
          let hasTriggered = false;
          
          const triggerAnimation = () => {
            if (this.isAnimating) return;
            
            this.isAnimating = true;
            hasTriggered = true;
            
            blockchainCards.forEach((card, index) => {
              setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px) scale(0.9)';
                
                setTimeout(() => {
                  card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                  card.style.opacity = '1';
                  card.style.transform = 'translateY(0) scale(1)';
                }, 100);
              }, index * 100);
            });
            
            setTimeout(() => {
              this.isAnimating = false;
            }, 2000);
          };
          
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                if (!hasTriggered) {
                  setTimeout(triggerAnimation, 200);
                }
              }
            });
          }, {
            threshold: [0.1, 0.3, 0.5]
          });
          
          if (blockchainSection) {
            observer.observe(blockchainSection);
          }
        }
      }

      // Initialize animations when DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
        const oeconomiaAnimations = new OeconomiaAnimations();
        const blockchainAnimations = new BlockchainNetworkAnimations();
        
        // Add some interactive effects
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
        
        // Add cursor fade animation
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
      window.BlockchainNetworkAnimations = BlockchainNetworkAnimations;