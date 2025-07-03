        document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const scrollIndicator = document.getElementById('scrollIndicator');
            const tocSidebar = document.getElementById('tocSidebar');
            const tocToggle = document.getElementById('tocToggle');
            const fabButton = document.getElementById('fabButton');
            const tocLinks = document.querySelectorAll('.toc-list a');
            const sections = document.querySelectorAll('.section');

            // Scroll progress indicator
            function updateScrollProgress() {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                if (scrollIndicator) {
                    scrollIndicator.style.width = scrollPercent + '%';
                }
            }

            // Table of Contents functionality - MAIN FIX
            function toggleTOC() {
                const isOpen = tocSidebar.classList.contains('open');
                
                if (isOpen) {
                    // Close sidebar
                    tocSidebar.classList.remove('open');
                    document.body.classList.remove('sidebar-open');
                    fabButton.innerHTML = '<span class="fab-icon">📚</span>';
                } else {
                    // Open sidebar
                    tocSidebar.classList.add('open');
                    document.body.classList.add('sidebar-open');
                    fabButton.innerHTML = '<span class="fab-icon">×</span>';
                }
            }

            // Close TOC when clicking outside
            function closeTOCOnOutsideClick(event) {
                if (tocSidebar && fabButton && 
                    !tocSidebar.contains(event.target) && 
                    !fabButton.contains(event.target) && 
                    tocSidebar.classList.contains('open')) {
                    toggleTOC();
                }
            }

            // Smooth scrolling for TOC links
            function smoothScrollToSection(event) {
                event.preventDefault();
                const targetId = event.target.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerOffset = 100;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close TOC on mobile after clicking
                    if (window.innerWidth <= 768) {
                        setTimeout(() => {
                            toggleTOC();
                        }, 300);
                    }
                }
            }

            // Update active TOC link based on scroll position
            function updateActiveTOCLink() {
                let currentSection = '';
                const scrollPos = window.scrollY + 150;

                sections.forEach(section => {
                    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
                    const sectionHeight = section.offsetHeight;

                    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                        currentSection = section.getAttribute('id');
                    }
                });

                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentSection) {
                        link.classList.add('active');
                    }
                });
            }

            // Animate elements on scroll
            function animateOnScroll() {
                const elements = document.querySelectorAll('.feature-item, .philosophy-item, .protocol-box');
                const windowHeight = window.innerHeight;

                elements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;

                    if (elementTop < windowHeight - elementVisible) {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }
                });
            }

    // Back to top functionality
    function initializeBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.className = 'back-to-top-btn';
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(45deg, #00d4ff, #ff00ff);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.3s ease;
            z-index: 997;
        `;
        
        document.body.appendChild(backToTopBtn);
        
        function toggleBackToTop() {
            if (window.scrollY > 500) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.transform = 'translateY(0)';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.transform = 'translateY(100px)';
            }
        }
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', toggleBackToTop);
    }


            // Initialize animations
            function initializeAnimations() {
                const elements = document.querySelectorAll('.feature-item, .philosophy-item, .protocol-box');
                
                elements.forEach(element => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                });
            }

            // Performance optimization - throttle scroll events
            function throttle(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }

            // Event Listeners
            window.addEventListener('scroll', throttle(() => {
                updateScrollProgress();
                updateActiveTOCLink();
                animateOnScroll();
            }, 16));

            document.addEventListener('click', closeTOCOnOutsideClick);

            // TOC toggle button
            if (tocToggle) {
                tocToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleTOC();
                });
            }

            // FAB button
            if (fabButton) {
                fabButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleTOC();
                });
            }

            // TOC links
            tocLinks.forEach(link => {
                link.addEventListener('click', smoothScrollToSection);
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && tocSidebar && tocSidebar.classList.contains('open')) {
                    toggleTOC();
                }
            });

            // Initialize features
            initializeAnimations();
            
            // Initial animation trigger
            setTimeout(() => {
                animateOnScroll();
            }, 100);

            console.log('📚 Complete Oeconomia Documentation loaded successfully!');
        });