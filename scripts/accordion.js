// Accordion
// File: scripts/accordion.js
// This script manages the accordion functionality for the dynamic cube sections.
document.addEventListener("DOMContentLoaded", function () {
  const accordionItems = document.querySelectorAll(".accordion-item");
  let cubeManager = null;

  // Initialize cube manager
  function initializeCube() {
    try {
      cubeManager = new CubeManager("dynamic-cube-container");
      // Start with the first section (Oeconomia)
      cubeManager.rotateTo("oeconomia");
    } catch (error) {
      console.error("Failed to initialize cube:", error);
    }
  }

  // Set the first item to be open by default
  accordionItems[0].classList.add("active");

  // Initialize cube after a short delay to ensure DOM is ready
  setTimeout(initializeCube, 100);

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const content = item.querySelector(".accordion-content");

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all items
      accordionItems.forEach((accItem) => {
        accItem.classList.remove("active");
        const accContent = accItem.querySelector(".accordion-content");
        accContent.style.maxHeight = null;
      });

      // If clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";

        // Rotate cube to corresponding section
        const sectionKey = item.getAttribute("data-dynamic-image");
        if (cubeManager && sectionKey) {
          cubeManager.rotateTo(sectionKey);
        }
      } else {
        // When all are closed, show default rotation (Oeconomia)
        if (cubeManager) {
          cubeManager.rotateTo("oeconomia");
        }
      }
    });
  });

  // Set the max-height for the active item on initial load
  const activeContent = document.querySelector(
    ".accordion-item.active .accordion-content"
  );
  if (activeContent) {
    activeContent.style.maxHeight = activeContent.scrollHeight + "px";
  }

  // Clean up on page unload
  window.addEventListener("beforeunload", () => {
    if (cubeManager) {
      cubeManager.dispose();
    }
  });
});

// Keep the scrollToRoadmap function for compatibility
function scrollToRoadmap() {
  const roadmapSection = document.getElementById("roadmap-section");
  if (roadmapSection) {
    roadmapSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(() => {
        const roadmapSection = document.getElementById("roadmap-section");
        if (roadmapSection) {
          roadmapSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 500);
    });
  }
}


