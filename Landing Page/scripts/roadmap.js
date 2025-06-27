// Roadmap functionality
class RoadmapRenderer {
  constructor() {
    this.roadmapData = [];
    this.container = null;
    this.init();
  }

  async init() {
    try {
      await this.loadRoadmapData();
      this.setupContainer();
      this.renderRoadmap();
      this.setupScrollAnimation();
    } catch (error) {
      console.error('Failed to initialize roadmap:', error);
      // Fallback to show error message
      this.showErrorMessage(error);
    }
  }

  async loadRoadmapData() {
    try {
      // Fetch data from the JSON file
      const response = await fetch('./roadmap.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.roadmapData = await response.json();
      
      // Validate that we have data
      if (!Array.isArray(this.roadmapData) || this.roadmapData.length === 0) {
        throw new Error('Invalid or empty roadmap data');
      }
      
      console.log('Roadmap data loaded successfully:', this.roadmapData.length, 'items');
      
    } catch (error) {
      console.error('Error loading roadmap data:', error);
      
      // Fallback data in case the JSON file can't be loaded
      console.log('Using fallback roadmap data');
      this.roadmapData = [
        {
          "id": 1,
          "date": "Q1 2024",
          "title": "Foundation & Governance",
          "description": "Establish core governance framework and launch OEC token with Guardian staking mechanism.",
          "status": "completed",
          "protocols": ["Oeconomia Gov"],
          "milestones": [
            "OEC token deployment",
            "Guardian staking system",
            "Governance voting mechanism",
            "Treasury management setup"
          ]
        },
        {
          "id": 2,
          "date": "Q2 2024",
          "title": "Alluria Protocol Launch",
          "description": "Deploy Alluria lending protocol with ALUD stablecoin and ETH collateral vaults.",
          "status": "in-progress",
          "protocols": ["Alluria", "Oeconomia Gov"],
          "milestones": [
            "Smart contract audit completion",
            "ALUD stablecoin deployment",
            "Vault system implementation",
            "Stability pool launch"
          ]
        },
        {
          "id": 3,
          "date": "Q3 2024",
          "title": "Development Continues",
          "description": "Additional protocol development and ecosystem expansion.",
          "status": "planned",
          "protocols": ["All Protocols"],
          "milestones": [
            "Continue development",
            "Expand ecosystem",
            "Community growth"
          ]
        }
      ];
      
      // Re-throw the error to be handled by the calling function
      throw error;
    }
  }

  // Get status indicator HTML based on status
  getStatusIndicator(status) {
    switch (status) {
      case 'completed':
        return '<i class="fas fa-check-circle milestone-status milestone-completed" title="Completed"></i>';
      case 'in-progress':
        return '<i class="fas fa-circle milestone-status milestone-in-progress" title="In Progress"></i>';
      case 'planned':
        return '<i class="far fa-circle milestone-status milestone-planned" title="Planned"></i>';
      default:
        return '<i class="far fa-circle milestone-status milestone-planned" title="Unknown"></i>';
    }
  }

  // Get status text with better formatting
  getStatusText(status) {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
      default:
        return 'Unknown';
    }
  }

  showErrorMessage(error) {
    // Create a simple error message if JSON loading fails
    this.setupContainer();
    this.container.innerHTML = `
      <div class="container">
        <div class="roadmap-header">
          <h2>Development Roadmap</h2>
          <p style="color: #ff6b6b;">
            Unable to load roadmap data. Please check that roadmap.json is accessible.
            <br><small>Error: ${error.message}</small>
          </p>
        </div>
      </div>
    `;
  }

  setupContainer() {
    // Create roadmap section if it doesn't exist
    let roadmapSection = document.getElementById('roadmap-section');
    if (!roadmapSection) {
      roadmapSection = document.createElement('section');
      roadmapSection.id = 'roadmap-section';
      roadmapSection.className = 'roadmap-section';
      
      // Insert before CTA section
      const ctaSection = document.querySelector('.cta');
      if (ctaSection) {
        ctaSection.parentNode.insertBefore(roadmapSection, ctaSection);
      } else {
        document.body.appendChild(roadmapSection);
      }
    }

    this.container = roadmapSection;
  }

  renderRoadmap() {
    const roadmapHTML = `
      <div class="container">
        <div class="roadmap-header">
          <h2>Development Roadmap</h2>
          <p>Follow our journey as we build the future of decentralized finance infrastructure</p>
        </div>
        <div class="roadmap-timeline">
          ${this.roadmapData.map(item => this.renderRoadmapItem(item)).join('')}
        </div>
      </div>
    `;

    this.container.innerHTML = roadmapHTML;
    
    // Create navigation controls after the main content
    this.createNavigationControls();
  }

  renderRoadmapItem(item) {
    const protocolTags = item.protocols.map(protocol => 
      `<span class="protocol-tag">${protocol}</span>`
    ).join('');

    // Updated milestone rendering with status indicators
    const milestones = item.milestones.map(milestone => 
      `<li class="milestone-item">
        ${this.getStatusIndicator(item.status)}
        <span class="milestone-text">${milestone}</span>
      </li>`
    ).join('');

    // Get main status indicator for the card header
    const mainStatusIndicator = this.getStatusIndicator(item.status);
    const statusText = this.getStatusText(item.status);

    return `
      <div class="roadmap-item" data-id="${item.id}">
        <div class="roadmap-node ${item.status}"></div>
        <div class="roadmap-content">
          <div class="roadmap-status status-${item.status}">
            ${mainStatusIndicator}
            <span class="status-text">${statusText}</span>
          </div>
          <div class="roadmap-date">${item.date}</div>
          <h3 class="roadmap-title">${item.title}</h3>
          <p class="roadmap-description">${item.description}</p>
          <div class="roadmap-protocols">
            ${protocolTags}
          </div>
          <div class="roadmap-milestones">
            <h4>Key Milestones:</h4>
            <ul class="milestone-list">
              ${milestones}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  setupScrollAnimation() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Add staggered animation to milestones
          const milestones = entry.target.querySelectorAll('.milestone-item');
          milestones.forEach((milestone, index) => {
            setTimeout(() => {
              milestone.classList.add('animate-in');
            }, index * 150);
          });
        }
      });
    }, observerOptions);

    // Observe all roadmap items
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    roadmapItems.forEach(item => {
      observer.observe(item);
    });

    // Setup navigation controls first
    this.setupNavigationControls();
    
    // Setup scroll tracking
    this.setupScrollTracking();

    // Add click handlers for interactive features
    this.setupInteractivity();
  }

  setupInteractivity() {
    const roadmapItems = document.querySelectorAll('.roadmap-content');
    
    roadmapItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Add a subtle click animation
        item.style.transform = 'translateY(-5px) scale(0.98)';
        setTimeout(() => {
          item.style.transform = 'translateY(-5px) scale(1)';
        }, 150);
      });

      // Add hover effects for milestones
      const milestones = item.querySelectorAll('.milestone-item');
      milestones.forEach(milestone => {
        milestone.addEventListener('mouseenter', () => {
          const statusIcon = milestone.querySelector('.milestone-status');
          if (statusIcon) {
            statusIcon.style.transform = 'scale(1.2)';
            statusIcon.style.transition = 'transform 0.2s ease';
          }
        });
        
        milestone.addEventListener('mouseleave', () => {
          const statusIcon = milestone.querySelector('.milestone-status');
          if (statusIcon) {
            statusIcon.style.transform = 'scale(1)';
          }
        });
      });

      // Add hover sound effect (optional)
      item.addEventListener('mouseenter', () => {
        item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    });
  }

  setupNavigationControls() {
    this.currentCardIndex = 0;
    const prevBtn = document.getElementById('roadmap-prev');
    const nextBtn = document.getElementById('roadmap-next');
    
    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => this.navigateToCard('prev'));
    nextBtn.addEventListener('click', () => this.navigateToCard('next'));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isInRoadmapSection()) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          this.navigateToCard('prev');
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          this.navigateToCard('next');
        }
      }
    });

    this.updateNavigationState();
  }

  createNavigationControls() {
    // Remove any existing navigation controls
    const existingNav = document.querySelector('.roadmap-navigation');
    const existingProgress = document.querySelector('.roadmap-progress');
    const existingCounter = document.querySelector('.roadmap-counter');
    
    if (existingNav) existingNav.remove();
    if (existingProgress) existingProgress.remove();
    if (existingCounter) existingCounter.remove();

    // Create navigation controls
    const navigationHTML = `
      <!-- Navigation Controls -->
      <div class="roadmap-navigation">
        <button class="roadmap-nav-btn" id="roadmap-prev" data-tooltip="Previous Milestone">
          <i class="fas fa-chevron-up"></i>
        </button>
        <button class="roadmap-nav-btn" id="roadmap-next" data-tooltip="Next Milestone">
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
      
      <!-- Progress Indicator -->
      <div class="roadmap-progress">
        <div class="roadmap-progress-bar" id="roadmap-progress-bar"></div>
      </div>
      
      <!-- Card Counter -->
      <div class="roadmap-counter" id="roadmap-counter">
        <span id="current-card">1</span> / <span id="total-cards">${this.roadmapData.length}</span>
      </div>
    `;

    // Add to body so they're fixed positioned correctly
    document.body.insertAdjacentHTML('beforeend', navigationHTML);
  }

  setupScrollTracking() {
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    const progressBar = document.getElementById('roadmap-progress-bar');
    const counter = document.getElementById('roadmap-counter');
    const currentCard = document.getElementById('current-card');
    const navigation = document.querySelector('.roadmap-navigation');
    const progress = document.querySelector('.roadmap-progress');

    // Create intersection observer for tracking current card
    const trackingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const cardIndex = Array.from(roadmapItems).indexOf(entry.target);
          this.currentCardIndex = cardIndex;
          this.updateNavigationState();
          
          // Update counter
          if (currentCard) {
            currentCard.textContent = cardIndex + 1;
          }
          
          // Update progress bar
          if (progressBar) {
            const progress = ((cardIndex + 1) / roadmapItems.length) * 100;
            progressBar.style.height = `${progress}%`;
          }
        }
      });
    }, { threshold: 0.5 });

    roadmapItems.forEach(item => trackingObserver.observe(item));

    // Show/hide navigation and counter based on roadmap section visibility
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Show navigation elements
          if (counter) counter.classList.add('visible');
          if (navigation) navigation.classList.add('visible');
          if (progress) progress.classList.add('visible');
        } else {
          // Hide navigation elements
          if (counter) counter.classList.remove('visible');
          if (navigation) navigation.classList.remove('visible');
          if (progress) progress.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    if (this.container) {
      sectionObserver.observe(this.container);
    }
  }

  navigateToCard(direction) {
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    const totalCards = roadmapItems.length;
    
    if (direction === 'next' && this.currentCardIndex < totalCards - 1) {
      this.currentCardIndex++;
    } else if (direction === 'prev' && this.currentCardIndex > 0) {
      this.currentCardIndex--;
    }
    
    // Scroll to the target card with better centering
    const targetCard = roadmapItems[this.currentCardIndex];
    if (targetCard) {
      // Calculate better scroll position for true centering
      const cardRect = targetCard.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const cardHeight = cardRect.height;
      const navHeight = 80; // Account for fixed navigation
      
      // Calculate the ideal scroll position to center the card
      const idealTop = (windowHeight - cardHeight) / 2 + navHeight;
      const currentTop = cardRect.top;
      const scrollOffset = currentTop - idealTop;
      
      window.scrollBy({
        top: scrollOffset,
        behavior: 'smooth'
      });
      
      // Add highlight effect
      this.highlightCard(targetCard);
    }
    
    this.updateNavigationState();
  }

  updateNavigationState() {
    const prevBtn = document.getElementById('roadmap-prev');
    const nextBtn = document.getElementById('roadmap-next');
    const totalCards = document.querySelectorAll('.roadmap-item').length;
    
    if (prevBtn) {
      prevBtn.disabled = this.currentCardIndex === 0;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentCardIndex === totalCards - 1;
    }
  }

  highlightCard(cardElement) {
    // Remove any existing highlights
    document.querySelectorAll('.roadmap-content').forEach(content => {
      content.style.borderColor = '';
      content.style.boxShadow = '';
    });
    
    // Highlight the current card
    const content = cardElement.querySelector('.roadmap-content');
    if (content) {
      content.style.borderColor = '#00d4ff';
      content.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)';
      
      // Remove highlight after animation
      setTimeout(() => {
        content.style.borderColor = '';
        content.style.boxShadow = '';
      }, 2000);
    }
  }

  isInRoadmapSection() {
    const roadmapSection = document.getElementById('roadmap-section');
    if (!roadmapSection) return false;
    
    const rect = roadmapSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    return rect.top < windowHeight && rect.bottom > 0;
  }

  // Method to update roadmap data dynamically
  updateRoadmapData(newData) {
    this.roadmapData = newData;
    this.renderRoadmap();
    this.setupScrollAnimation();
  }

  // Method to highlight specific roadmap item
  highlightItem(itemId) {
    const item = document.querySelector(`[data-id="${itemId}"]`);
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const content = item.querySelector('.roadmap-content');
      content.style.borderColor = '#00d4ff';
      content.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)';
      
      setTimeout(() => {
        content.style.borderColor = '';
        content.style.boxShadow = '';
      }, 2000);
    }
  }

  // Method to reload data from JSON file
  async reloadData() {
    try {
      await this.loadRoadmapData();
      this.renderRoadmap();
      this.setupScrollAnimation();
      console.log('Roadmap data reloaded successfully');
    } catch (error) {
      console.error('Failed to reload roadmap data:', error);
    }
  }
}

// Initialize roadmap when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new RoadmapRenderer();
});

// Export for potential external use
window.RoadmapRenderer = RoadmapRenderer;