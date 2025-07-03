document.addEventListener('DOMContentLoaded', function() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  // Set the first item to be open by default
  accordionItems[0].classList.add('active');
  
  // Initialize with first image
  changeDynamicImage('oeconomia');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      accordionItems.forEach(accItem => {
        accItem.classList.remove('active');
        const accContent = accItem.querySelector('.accordion-content');
        accContent.style.maxHeight = null;
      });
      
      // If clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
        
        // Change the dynamic image
        const imageKey = item.getAttribute('data-dynamic-image');
        changeDynamicImage(imageKey);
      } else {
        // Show default image when all are closed
        changeDynamicImage('default');
      }
    });
  });
  
  // Set the max-height for the active item on initial load
  const activeContent = document.querySelector('.accordion-item.active .accordion-content');
  if (activeContent) {
    activeContent.style.maxHeight = activeContent.scrollHeight + "px";
  }
  
  function changeDynamicImage(imageKey) {
    // Hide all dynamic images
    const allDynamicImages = document.querySelectorAll('.dynamic-image-display');
    allDynamicImages.forEach(img => {
      img.classList.remove('active');
    });
    
    // Show the target image
    if (imageKey === 'default') {
      const defaultImage = document.querySelector('.default-dynamic-display');
      if (defaultImage) {
        setTimeout(() => {
          defaultImage.classList.add('active');
        }, 50);
      }
    } else {
      const targetImage = document.querySelector(`.dynamic-image-display[data-dynamic-image="${imageKey}"]`);
      if (targetImage) {
        setTimeout(() => {
          targetImage.classList.add('active');
        }, 50);
      }
    }
  }
});

// Add this function to your accordion.js or in a script tag
function scrollToRoadmap() {
  const roadmapSection = document.getElementById('roadmap-section');
  if (roadmapSection) {
    roadmapSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    // Fallback if roadmap section hasn't been created yet
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const roadmapSection = document.getElementById('roadmap-section');
        if (roadmapSection) {
          roadmapSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500);
    });
  }
}