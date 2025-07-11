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

