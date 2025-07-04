// Enhanced Features Section Animation for Images
// Add this to your existing JavaScript files or create a new one

document.addEventListener("DOMContentLoaded", function () {
  const featuresSection = document.getElementById("features");
  const featureCards = document.querySelectorAll(".feature-card");
  const sectionTitle = document.querySelector("#features h1");
  const sectionSubtitle = document.querySelector("#features h3");
  
  // Advanced reset function
  function resetFeaturesAnimation() {
    // Reset title
    if (sectionTitle) {
      sectionTitle.style.opacity = "0";
      sectionTitle.style.transform = "translateY(-30px)";
      sectionTitle.style.transition = "none";
    }
    
    // Reset subtitle
    if (sectionSubtitle) {
      sectionSubtitle.style.opacity = "0";
      sectionSubtitle.style.transform = "translateY(-20px)";
      sectionSubtitle.style.transition = "none";
    }
    
    // Reset cards
    featureCards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(60px) scale(0.9)";
      card.style.transition = "none";
      
      // Reset image containers (both 3D icon containers and regular images)
      const serviceIcon = card.querySelector(".service-3d-icon");
      const cardImage = card.querySelector("img");
      const iconContainer = card.querySelector(".service-icon");
      
      if (serviceIcon) {
        serviceIcon.style.opacity = "0";
        serviceIcon.style.transform = "translateY(30px) scale(0.8)";
        serviceIcon.style.transition = "none";
      }
      
      if (cardImage) {
        cardImage.style.opacity = "0";
        cardImage.style.transform = "translateY(30px) scale(0.8)";
        cardImage.style.transition = "none";
      }
      
      if (iconContainer) {
        iconContainer.style.opacity = "0";
        iconContainer.style.transform = "translateY(30px) scale(0.8)";
        iconContainer.style.transition = "none";
      }
      
      // Reset other card elements
      const cardTitle = card.querySelector("h2");
      const cardSubtitle = card.querySelector("h3");
      const cardDescription = card.querySelector("p");
      const techTags = card.querySelectorAll(".tech-tag");
      
      if (cardTitle) {
        cardTitle.style.opacity = "0";
        cardTitle.style.transform = "translateY(20px)";
        cardTitle.style.transition = "none";
      }
      
      if (cardSubtitle) {
        cardSubtitle.style.opacity = "0";
        cardSubtitle.style.transform = "translateY(20px)";
        cardSubtitle.style.transition = "none";
      }
      
      if (cardDescription) {
        cardDescription.style.opacity = "0";
        cardDescription.style.transform = "translateY(20px)";
        cardDescription.style.transition = "none";
      }
      
      techTags.forEach((tag, tagIndex) => {
        tag.style.opacity = "0";
        tag.style.transform = "translateY(10px)";
        tag.style.transition = "none";
      });
    });
  }
  
  // Advanced animation function
  function animateFeaturesSection() {
    // Animate title first
    if (sectionTitle) {
      sectionTitle.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
      setTimeout(() => {
        sectionTitle.style.opacity = "1";
        sectionTitle.style.transform = "translateY(0)";
      }, 100);
    }
    
    // Animate subtitle
    if (sectionSubtitle) {
      sectionSubtitle.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
      setTimeout(() => {
        sectionSubtitle.style.opacity = "1";
        sectionSubtitle.style.transform = "translateY(0)";
      }, 200);
    }
    
    // Animate cards with stagger
    featureCards.forEach((card, index) => {
      const baseDelay = 400 + (index * 200);
      
      // Animate card container
      card.style.transition = "opacity 0.7s ease-out, transform 0.7s ease-out";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0) scale(1)";
      }, baseDelay);
      
      // Animate image/icon containers
      const serviceIcon = card.querySelector(".service-3d-icon");
      const cardImage = card.querySelector("img");
      const iconContainer = card.querySelector(".service-icon");
      
      if (serviceIcon) {
        serviceIcon.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        setTimeout(() => {
          serviceIcon.style.opacity = "1";
          serviceIcon.style.transform = "translateY(0) scale(1)";
        }, baseDelay + 50);
      }
      
      if (cardImage) {
        cardImage.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        setTimeout(() => {
          cardImage.style.opacity = "1";
          cardImage.style.transform = "translateY(0) scale(1)";
        }, baseDelay + 50);
      }
      
      if (iconContainer) {
        iconContainer.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        setTimeout(() => {
          iconContainer.style.opacity = "1";
          iconContainer.style.transform = "translateY(0) scale(1)";
        }, baseDelay + 50);
      }
      
      // Animate card content
      const cardTitle = card.querySelector("h2");
      const cardSubtitle = card.querySelector("h3");
      const cardDescription = card.querySelector("p");
      const techTags = card.querySelectorAll(".tech-tag");
      
      if (cardTitle) {
        cardTitle.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        setTimeout(() => {
          cardTitle.style.opacity = "1";
          cardTitle.style.transform = "translateY(0)";
        }, baseDelay + 100);
      }
      
      if (cardSubtitle) {
        cardSubtitle.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        setTimeout(() => {
          cardSubtitle.style.opacity = "1";
          cardSubtitle.style.transform = "translateY(0)";
        }, baseDelay + 150);
      }
      
      if (cardDescription) {
        cardDescription.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        setTimeout(() => {
          cardDescription.style.opacity = "1";
          cardDescription.style.transform = "translateY(0)";
        }, baseDelay + 200);
      }
      
      // Animate tech tags
      techTags.forEach((tag, tagIndex) => {
        tag.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
        setTimeout(() => {
          tag.style.opacity = "1";
          tag.style.transform = "translateY(0)";
        }, baseDelay + 250 + (tagIndex * 50));
      });
    });
  }
  
  // Initialize in hidden state
  resetFeaturesAnimation();
  
  // Create intersection observer with more precise control
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          resetFeaturesAnimation();
          setTimeout(() => {
            animateFeaturesSection();
          }, 50);
        }
      });
    },
    {
      root: null,
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px"
    }
  );
  
  if (featuresSection) {
    observer.observe(featuresSection);
  }
  
  // Handle navigation clicks
  document.querySelectorAll('a[href="#features"]').forEach(link => {
    link.addEventListener('click', (e) => {
      setTimeout(() => {
        resetFeaturesAnimation();
        setTimeout(() => {
          animateFeaturesSection();
        }, 100);
      }, 600);
    });
  });
  
  // Handle section navigation buttons if they exist
  const sectionNavButtons = document.querySelectorAll('.section-nav-btn');
  sectionNavButtons.forEach(button => {
    button.addEventListener('click', () => {
      setTimeout(() => {
        const currentSection = document.querySelector('#features');
        if (currentSection) {
          const rect = currentSection.getBoundingClientRect();
          const isInView = rect.top >= -100 && rect.bottom <= window.innerHeight + 100;
          
          if (isInView) {
            resetFeaturesAnimation();
            setTimeout(() => {
              animateFeaturesSection();
            }, 100);
          }
        }
      }, 700);
    });
  });
});

// Simple version for just images (alternative approach)
document.addEventListener("DOMContentLoaded", function () {
  const featuresSection = document.getElementById("features");
  const featureCards = document.querySelectorAll(".feature-card");
  
  // Simple reset function for images
  function resetImageAnimation() {
    featureCards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(50px)";
      card.style.transition = "none";
      
      // Reset any images within the card
      const images = card.querySelectorAll("img");
      images.forEach(img => {
        img.style.opacity = "0";
        img.style.transform = "translateY(30px) scale(0.9)";
        img.style.transition = "none";
      });
      
      // Reset icon containers
      const iconContainers = card.querySelectorAll(".service-icon, .service-3d-icon, .feature-icon");
      iconContainers.forEach(icon => {
        icon.style.opacity = "0";
        icon.style.transform = "translateY(30px) scale(0.9)";
        icon.style.transition = "none";
      });
    });
  }
  
  // Simple animate function for images
  function animateImageCards() {
    featureCards.forEach((card, index) => {
      const delay = index * 200;
      
      // Animate card
      card.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, delay);
      
      // Animate images within the card
      const images = card.querySelectorAll("img");
      images.forEach(img => {
        img.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        setTimeout(() => {
          img.style.opacity = "1";
          img.style.transform = "translateY(0) scale(1)";
        }, delay + 100);
      });
      
      // Animate icon containers
      const iconContainers = card.querySelectorAll(".service-icon, .service-3d-icon, .feature-icon");
      iconContainers.forEach(icon => {
        icon.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        setTimeout(() => {
          icon.style.opacity = "1";
          icon.style.transform = "translateY(0) scale(1)";
        }, delay + 100);
      });
    });
  }
  
  // Initialize simple version
  resetImageAnimation();
  
  // Create observer for simple version
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          resetImageAnimation();
          setTimeout(() => {
            animateImageCards();
          }, 100);
        }
      });
    },
    {
      root: null,
      threshold: 0.3
    }
  );
  
  if (featuresSection) {
    imageObserver.observe(featuresSection);
  }
});