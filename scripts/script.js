// Add some interactive hover effects
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) rotateY(5deg)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateY(0deg)';
            });
        });

        // Hero section animation on scroll/navigation
        function setupHeroAnimation() {
            const heroContent = document.querySelector('.hero-content');
            const heroSection = document.querySelector('.hero');
            
            if (!heroContent || !heroSection) return;
            
            // Remove the initial CSS animation
            heroContent.style.animation = 'none';
            
            // Function to animate hero content
            function animateHeroContent() {
                heroContent.style.opacity = '0';
                heroContent.style.transform = 'translateY(30px)';
                heroContent.style.transition = 'none';
                
                // Force reflow
                heroContent.offsetHeight;
                
                // Apply animation
                requestAnimationFrame(() => {
                    heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
                    heroContent.style.opacity = '1';
                    heroContent.style.transform = 'translateY(0)';
                });
            }
            
            // Check if hero is already visible on page load
            const rect = heroSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                // If hero is visible on page load, animate immediately
                setTimeout(animateHeroContent, 100);
            }
            
            // Create intersection observer for subsequent visits
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateHeroContent();
                    } else {
                        // Reset when out of view to prepare for next animation
                        heroContent.style.transition = 'none';
                        heroContent.style.opacity = '0';
                        heroContent.style.transform = 'translateY(30px)';
                    }
                });
            }, {
                threshold: 0.1, // Trigger when 10% of hero is visible
                rootMargin: '0px 0px -100px 0px' // Only trigger when coming back to hero
            });
            
            // Observe the hero section
            heroObserver.observe(heroSection);
        }
        
        // Initialize hero animation when DOM is ready
        document.addEventListener('DOMContentLoaded', setupHeroAnimation);
        
        // Also run immediately in case DOMContentLoaded already fired
        if (document.readyState === 'loading') {
            // Document is still loading
        } else {
            // Document is already loaded
            setupHeroAnimation();
        }





        // Mobile Menu Functionality
// Add this to a new file: scripts/mobile-menu.js or add to existing script.js

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');
    const nav = document.querySelector('nav');
    
    // Create mobile menu container
    function createMobileMenu() {
        // Check if mobile menu already exists
        if (document.querySelector('.mobile-menu')) return;
        
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-content">
                <ul class="mobile-nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#products">Services</a></li>
                    <li><a href="#blockchain-networks">Networks</a></li>
                    <li><a href="#roadmap-section">Roadmap</a></li>
                    <li><a href="#cta">Insights</a></li>
                    <li><a href="#footer">More</a></li>
                </ul>
                <div class="mobile-nav-buttons">
                    <button class="dapp-btn" onclick="launchDApp()">Launch DApp</button>
                </div>
            </div>
        `;
        
        // Insert after nav
        nav.parentNode.insertBefore(mobileMenu, nav.nextSibling);
    }
    
    // Initialize mobile menu
    createMobileMenu();
    
    const mobileMenu = document.querySelector('.mobile-menu');
    let isMenuOpen = false;
    
    // Toggle menu function
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenu.classList.add('active');
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        } else {
            mobileMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = ''; // Restore scroll
        }
    }
    
    // Add click event to hamburger button
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !mobileMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Close menu on window resize if going back to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMobileMenu();
        }
    });
});