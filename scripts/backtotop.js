// Back to Top Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    
    // Only initialize if button exists on the page
    if (!scrollBtn) return;
    
    // Throttle function for performance optimization
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
    
    // Show/hide button based on scroll position
    const handleScroll = throttle(() => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }, 100);
    
    // Scroll to top functionality
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    scrollBtn.addEventListener('click', scrollToTop);
    
    // Keyboard accessibility (optional)
    scrollBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    });
    
    // Add ARIA label for accessibility
    scrollBtn.setAttribute('aria-label', 'Scroll to top of page');
    scrollBtn.setAttribute('title', 'Back to top');
    
    console.log('Back to top button initialized successfully');
});