        // Products Section Entry Animation Script
        document.addEventListener('DOMContentLoaded', function() {
            const productsSection = document.getElementById('products');
            
            if (!productsSection) {
                console.warn('Products section not found');
                return;
            }

            // Create intersection observer for the products section
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -20% 0px', // Trigger when 20% of the section is visible
                threshold: 0.2 // Require more of the section to be visible
            };

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add animation class
                        entry.target.classList.add('animate-in');
                        
                        // Add floating animation to cube after entry animation completes
                        setTimeout(() => {
                            const cubeContainer = entry.target.querySelector('.dynamic-image-container');
                            if (cubeContainer) {
                                cubeContainer.classList.add('floating');
                            }
                        }, 2000);
                    } else {
                        // Remove animation class when out of view to allow re-triggering
                        entry.target.classList.remove('animate-in');
                        const cubeContainer = entry.target.querySelector('.dynamic-image-container');
                        if (cubeContainer) {
                            cubeContainer.classList.remove('floating');
                            // Reset any inline transforms
                            cubeContainer.style.transform = '';
                        }
                        
                        // Reset accordion items
                        const accordionItems = entry.target.querySelectorAll('.accordion-item');
                        accordionItems.forEach(item => {
                            item.style.transform = '';
                            item.style.transition = '';
                        });
                    }
                });
            }, observerOptions);

            // Start observing the products section
            sectionObserver.observe(productsSection);

            // Enhanced cube animation integration
            // Wait for cube manager to be available
            function waitForCubeManager() {
                if (window.CubeManager && productsSection.classList.contains('animate-in')) {
                    // Add special entry animation to the cube
                    const cubeContainer = document.getElementById('dynamic-cube-container');
                    if (cubeContainer) {
                        // Add a pulse effect when the cube loads
                        setTimeout(() => {
                            cubeContainer.style.transform = 'scale(1.05)';
                            setTimeout(() => {
                                cubeContainer.style.transform = 'scale(1)';
                                cubeContainer.style.transition = 'transform 0.3s ease';
                            }, 200);
                        }, 1500);
                    }
                } else {
                    setTimeout(waitForCubeManager, 100);
                }
            }

            // Start waiting for cube manager
            setTimeout(waitForCubeManager, 500);

            // Add scroll-triggered micro-animations
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', () => {
                if (!productsSection.classList.contains('animate-in')) return;
                
                const currentScrollY = window.scrollY;
                const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
                
                const rect = productsSection.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isInViewport) {
                    // Subtle parallax effect for the cube
                    const cubeContainer = productsSection.querySelector('.dynamic-image-container');
                    if (cubeContainer) {
                        const scrollPercent = Math.max(0, Math.min(1, 
                            (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
                        ));
                        const translateY = (scrollPercent - 0.5) * 20; // Subtle movement
                        cubeContainer.style.transform = `translateY(${translateY}px)`;
                    }
                }
                
                lastScrollY = currentScrollY;
            });

            // Add hover effects for accordion items (will reapply when section animates in)
            function setupHoverEffects() {
                const accordionItems = productsSection.querySelectorAll('.accordion-item');
                accordionItems.forEach((item, index) => {
                    // Remove existing listeners to prevent duplicates
                    item.removeEventListener('mouseenter', item._hoverEnter);
                    item.removeEventListener('mouseleave', item._hoverLeave);
                    
                    // Create new hover functions
                    item._hoverEnter = () => {
                        if (productsSection.classList.contains('animate-in')) {
                            item.style.transform = 'translateX(1px) scale(1.02)';
                            item.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        }
                    };

                    item._hoverLeave = () => {
                        if (productsSection.classList.contains('animate-in')) {
                            item.style.transform = 'translateX(0) scale(1)';
                        }
                    };
                    
                    // Add new listeners
                    item.addEventListener('mouseenter', item._hoverEnter);
                    item.addEventListener('mouseleave', item._hoverLeave);
                });
            }
            
            // Setup initial hover effects
            setupHoverEffects();
            
            // Re-setup hover effects whenever animation triggers
            const mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'class' && 
                        mutation.target.classList.contains('animate-in')) {
                        setTimeout(setupHoverEffects, 2000);
                    }
                });
            });
            
            mutationObserver.observe(productsSection, { attributes: true });
        });

        // Optional: Manual trigger function for testing
        function triggerProductsAnimation() {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.classList.add('animate-in');
                setTimeout(() => {
                    const cubeContainer = productsSection.querySelector('.dynamic-image-container');
                    if (cubeContainer) {
                        cubeContainer.classList.add('floating');
                    }
                }, 2000);
            }
        }

        // Optional: Reset animation function
        function resetProductsAnimation() {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.classList.remove('animate-in');
                const cubeContainer = productsSection.querySelector('.dynamic-image-container');
                if (cubeContainer) {
                    cubeContainer.classList.remove('floating');
                }
            }
        }