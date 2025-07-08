// Advanced Animation Controller with Customizable Triggers
document.addEventListener("DOMContentLoaded", function () {
  const serviceObjects = [];
  const featuresSection = document.getElementById("features");
  
  let isAnimating = false;
  let hasTriggered = false;

  // CONFIGURATION - Adjust these values to control when animation triggers
  const animationConfig = {
    // Intersection Observer settings
    triggerThreshold: 0.1, // 0.5 = 50% of section must be visible
    rootMargin: '-50px 0px -50px 0px', // Adjust viewport margins
    
    // Animation timing
    preparationDelay: 10, // ms - how long to wait before starting animation
    animationDuration: 600, // ms - how long the animation takes
    resetDelay: 250, // ms - delay before resetting when leaving section
    
    // Animation intensity
    preparationOpacity: 0.3, // 0.8 = less dramatic fade (vs 0.3 = more dramatic)
    preparationTransform: {
      y: 30, // pixels to move up/down
      scale: 0.905 // scale factor (0.995 = very subtle)
    },
    
    // Stagger delays (ms)
    staggerDelays: [60, 160, 260], // Delays for each card
    
    // Advanced options
    requireCompleteExit: true, // Must completely leave section to reset
    preventRapidTrigger: true, // Prevent animation from triggering too quickly
    debugMode: false // Set to true to see console logs
  };

  // Apply dynamic CSS based on config
  function applyDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .feature-card.preparing-animation {
        opacity: ${animationConfig.preparationOpacity};
        transform: translateY(${animationConfig.preparationTransform.y}px) scale(${animationConfig.preparationTransform.scale});
        transition: none;
      }
      
      .feature-card.animate-in {
        opacity: 1;
        transform: translateY(0) scale(1);
        transition: all ${animationConfig.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .feature-card.animate-in:nth-child(1) {
        transition-delay: ${animationConfig.staggerDelays[0]}ms;
      }
      
      .feature-card.animate-in:nth-child(2) {
        transition-delay: ${animationConfig.staggerDelays[1]}ms;
      }
      
      .feature-card.animate-in:nth-child(3) {
        transition-delay: ${animationConfig.staggerDelays[2]}ms;
      }
    `;
    document.head.appendChild(style);
  }

  // Apply the dynamic styles
  applyDynamicStyles();

  // Debug logging
  function debugLog(message, data = '') {
    if (animationConfig.debugMode) {
      console.log(`[Features Animation] ${message}`, data);
    }
  }

  // Handle video background smoothly
  function initializeVideoBackground() {
    const video = document.querySelector('.features-video-background video');
    if (video) {
      video.addEventListener('canplaythrough', function() {
        video.classList.add('loaded');
        debugLog('Video loaded');
      });
      
      setTimeout(() => {
        if (!video.classList.contains('loaded')) {
          video.classList.add('loaded');
          debugLog('Video loaded (fallback)');
        }
      }, 1000);
    }
  }

  // Initialize video background
  initializeVideoBackground();

  // Advanced Animation Handler
  function initializeAdvancedCardAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    let lastTriggerTime = 0;
    
    // Function to trigger animation
    function triggerAnimation() {
      const now = Date.now();
      
      // Prevent rapid triggering
      if (animationConfig.preventRapidTrigger && (now - lastTriggerTime) < 500) {
        debugLog('Animation trigger blocked - too soon');
        return;
      }
      
      if (isAnimating) {
        debugLog('Animation trigger blocked - already animating');
        return;
      }
      
      isAnimating = true;
      lastTriggerTime = now;
      hasTriggered = true;
      
      debugLog('Starting animation');
      
      // Step 1: Prepare cards for animation
      featureCards.forEach((card) => {
        card.classList.remove('animate-in');
        card.classList.add('preparing-animation');
      });
      
      // Step 2: Start animation after delay
      setTimeout(() => {
        featureCards.forEach((card) => {
          card.classList.remove('preparing-animation');
          card.classList.add('animate-in');
        });
        
        debugLog('Animation triggered');
        
        // Reset animation flag after animation completes
        const maxDelay = Math.max(...animationConfig.staggerDelays);
        setTimeout(() => {
          isAnimating = false;
          debugLog('Animation complete');
        }, animationConfig.animationDuration + maxDelay);
      }, animationConfig.preparationDelay);
    }
    
    // Function to reset animation state
    function resetAnimation() {
      if (!hasTriggered) return;
      
      debugLog('Resetting animation');
      
      featureCards.forEach((card) => {
        card.classList.remove('animate-in', 'preparing-animation');
      });
      isAnimating = false;
      hasTriggered = false;
    }
    
    // Advanced Intersection Observer
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          debugLog(`Intersection: ${entry.isIntersecting}, Ratio: ${entry.intersectionRatio.toFixed(2)}`);
          
          if (entry.isIntersecting) {
            // Trigger animation when enough of the section is visible
            if (entry.intersectionRatio >= animationConfig.triggerThreshold) {
              setTimeout(() => {
                triggerAnimation();
              }, 50);
            }
          } else {
            // Reset animation when leaving section
            if (animationConfig.requireCompleteExit) {
              // Only reset if completely out of view
              if (entry.intersectionRatio < 0.05) {
                setTimeout(() => {
                  resetAnimation();
                }, animationConfig.resetDelay);
              }
            } else {
              // Reset as soon as we start leaving
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
    
    if (featuresSection) {
      cardObserver.observe(featuresSection);
    }
    
    return { triggerAnimation, resetAnimation };
  }

  // Initialize animation system
  const animationController = initializeAdvancedCardAnimations();
  
  // Expose controls globally
  window.featuresAnimationController = {
    ...animationController,
    config: animationConfig,
    updateConfig: (newConfig) => {
      Object.assign(animationConfig, newConfig);
      applyDynamicStyles();
      debugLog('Config updated', animationConfig);
    }
  };

  // Create shared 3D lighting
  const sharedLights = new THREE.Group();
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(5, 5, 10);
  const fillLight = new THREE.PointLight(0x00aaff, 3, 100);
  fillLight.position.set(-10, -5, 5);
  sharedLights.add(keyLight, fillLight);

  // Service configurations
  const serviceConfigs = [
    {
      containerId: "service-security-icon",
      objectType: "octahedron",
      color: 0xff6b9d,
      rotationSpeed: { x: 0.004, y: 0.006, z: 0.003 },
    },
    {
      containerId: "service-speed-icon",
      objectType: "icosahedron",
      color: 0xff6b9d,
      rotationSpeed: { x: 0.008, y: 0.012, z: 0.005 },
    },
    {
      containerId: "service-fees-icon",
      objectType: "tetrahedron",
      color: 0xffd700,
      rotationSpeed: { x: 0.003, y: 0.005, z: 0.002 },
    },
    {
      containerId: "service-reliability-icon",
      objectType: "dodecahedron",
      color: 0x8a2be2,
      rotationSpeed: { x: 0.002, y: 0.004, z: 0.003 },
    },
    {
      containerId: "service-innovation-icon",
      objectType: "torusKnot",
      color: 0xff6b9d,
      rotationSpeed: { x: 0.006, y: 0.009, z: 0.007 },
    },
    {
      containerId: "service-support-icon",
      objectType: "torus",
      color: 0x32cd32,
      rotationSpeed: { x: 0.005, y: 0.007, z: 0.004 },
    },
  ];

  // Initialize 3D objects with staggered timing
  setTimeout(() => {
    serviceConfigs.forEach((config, index) => {
      setTimeout(() => {
        const serviceObject = createServiceObject(config);
        if (serviceObject) {
          serviceObjects.push(serviceObject);
        }
      }, index * 50);
    });
  }, 200);

  // Enhanced lighting observer
  const lightingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            serviceObjects.forEach(({ scene }) => {
              scene.add(sharedLights);
            });
          }, 100);
        } else {
          serviceObjects.forEach(({ scene }) => {
            scene.remove(sharedLights);
          });
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: '50px 0px 50px 0px'
    }
  );

  if (featuresSection) {
    lightingObserver.observe(featuresSection);
  }

  // Keyboard shortcuts for testing
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F' && e.ctrlKey) {
      e.preventDefault();
      animationController.triggerAnimation();
    }
    if (e.key === 'R' && e.ctrlKey) {
      e.preventDefault();
      animationController.resetAnimation();
    }
  });

  // Log current config for easy adjustment
  debugLog('Animation system initialized with config:', animationConfig);
});

// Global functions for manual control
function updateAnimationConfig(newConfig) {
  if (window.featuresAnimationController) {
    window.featuresAnimationController.updateConfig(newConfig);
  }
}

function triggerFeaturesAnimation() {
  if (window.featuresAnimationController) {
    window.featuresAnimationController.triggerAnimation();
  }
}

// Example usage:
// updateAnimationConfig({ triggerThreshold: 0.3, debugMode: true });
// updateAnimationConfig({ preparationOpacity: 0.9, preparationTransform: { y: 5, scale: 0.998 } });



