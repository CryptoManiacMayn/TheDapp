// Enhanced Intersection Observer for scroll animations with retrigger capability
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const element = entry.target;
      const animationType = element.dataset.animate;
      
      if (animationType === 'fadeIn') {
        // Trigger header animation with dynamic CSS
        element.style.animation = 'fadeInUp 1s ease-out forwards';
        
      } else if (animationType === 'slideUp') {
        // Trigger individual card animation
        element.style.animation = 'cardReveal 0.8s ease-out forwards';
        
        // Add shimmer effect after delay
        setTimeout(() => {
          const shimmer = element.querySelector(".zshimmer");
          if (shimmer) {
            shimmer.style.animation = 'shimmer 3s ease-in-out infinite';
          }
        }, 500);
        
      } else if (animationType === 'stagger') {
        // For stagger animation, animate all children with delays
        const children = element.children;
        
        // Reset all children first
        Array.from(children).forEach(child => {
          child.style.animation = 'none';
          child.style.opacity = '0';
          child.style.transform = 'translateY(50px) rotateX(15deg)';
          
          // Reset shimmer
          const shimmer = child.querySelector(".zshimmer");
          if (shimmer) {
            shimmer.style.animation = 'none';
          }
        });
        
        // Animate each card with delays using setTimeout
        Array.from(children).forEach((child, index) => {
          setTimeout(() => {
            // Trigger the animation for this specific card
            child.style.animation = 'cardReveal 0.8s ease-out forwards';
            
            // Add shimmer effect after card animation starts
            setTimeout(() => {
              const shimmer = child.querySelector(".zshimmer");
              if (shimmer) {
                shimmer.style.animation = 'shimmer 3s ease-in-out infinite';
              }
            }, 500);
            
          }, index * 200); // 200ms delay between each card
        });
      }
      
    } else {
      // Reset animations when leaving viewport (for retrigger)
      const element = entry.target;
      const animationType = element.dataset.animate;
      
      if (animationType === 'fadeIn') {
        element.style.animation = 'none';
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
      } else if (animationType === 'slideUp') {
        element.style.animation = 'none';
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px) rotateX(15deg)';
        
        // Reset shimmer effect
        const shimmer = element.querySelector(".zshimmer");
        if (shimmer) {
          shimmer.style.animation = 'none';
        }
        
      } else if (animationType === 'stagger') {
        // Reset all children in stagger container
        const children = element.children;
        Array.from(children).forEach(child => {
          child.style.animation = 'none';
          child.style.opacity = '0';
          child.style.transform = 'translateY(50px) rotateX(15deg)';
          
          // Reset shimmer effect for each card
          const shimmer = child.querySelector(".zshimmer");
          if (shimmer) {
            shimmer.style.animation = 'none';
          }
        });
      }
    }
  });
}, observerOptions);

// Observe elements with data-animate attributes
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('[data-animate]');
  animatedElements.forEach(element => {
    observer.observe(element);
  });
});

// Add parallax effect on mouse move (keeping your existing code exactly as before)
document.querySelectorAll(".zreport-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    // Only apply parallax if not currently animating
    if (card.style.opacity !== '0') {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }
  });

  card.addEventListener("mouseleave", () => {
    // Only reset if not currently animating
    if (card.style.opacity !== '0') {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
  });
});

// Add click effects (keeping your existing code exactly as before)
document.querySelectorAll(".zreport-card").forEach((card) => {
  card.addEventListener("click", () => {
    // Only apply click effect if visible
    if (card.style.opacity !== '0') {
      const originalTransform = card.style.transform;
      card.style.transform = "scale(0.98)";
      setTimeout(() => {
        card.style.transform = originalTransform || "";
      }, 150);
    }
  });
});

// Animate floating elements (keeping your existing code)
function createFloatingDot() {
  const dot = document.createElement("div");
  dot.style.position = "absolute";
  dot.style.width = "4px";
  dot.style.height = "4px";
  dot.style.background = "rgba(255, 107, 157, 0.6)";
  dot.style.borderRadius = "50%";
  dot.style.left = Math.random() * 100 + "%";
  dot.style.top = "100%";
  dot.style.animation = "float 8s linear infinite";

  const floatingElements = document.querySelector(".zfloating-elements");
  if (floatingElements) {
    floatingElements.appendChild(dot);

    setTimeout(() => {
      dot.remove();
    }, 8000);
  }
}

// Create floating dots periodically (keeping your existing code)
setInterval(createFloatingDot, 2000);

// Manual reset function for testing (optional)
function resetCTAAnimations() {
  document.querySelectorAll('[data-animate]').forEach((element) => {
    const animationType = element.dataset.animate;
    
    if (animationType === 'fadeIn') {
      element.style.animation = 'none';
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
    } else if (animationType === 'slideUp') {
      element.style.animation = 'none';
      element.style.opacity = '0';
      element.style.transform = 'translateY(50px) rotateX(15deg)';
      
      const shimmer = element.querySelector(".zshimmer");
      if (shimmer) {
        shimmer.style.animation = 'none';
      }
      
    } else if (animationType === 'stagger') {
      const children = element.children;
      Array.from(children).forEach(child => {
        child.style.animation = 'none';
        child.style.opacity = '0';
        child.style.transform = 'translateY(50px) rotateX(15deg)';
        
        const shimmer = child.querySelector(".zshimmer");
        if (shimmer) {
          shimmer.style.animation = 'none';
        }
      });
    }
  });
}

// You can call resetCTAAnimations() in the console to test the retrigger functionality