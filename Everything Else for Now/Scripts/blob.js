// ===== BLOB BACKGROUND SCRIPT =====
document.addEventListener('DOMContentLoaded', () => {
  const bg = document.querySelector('.animated-bg');
  
  // Customize colors and transparency here (RGBA format)
  const colors = [
    'rgba(22, 240, 236, 1)',    // Purple
    'rgb(0, 51, 255)',    // Yellow
    'rgb(183, 0, 255)',    // Purple
  ];

  // Create blobs
  const blobs = [];
  for (let i = 0; i < 8; i++) {
    const blob = document.createElement('div');
    blob.classList.add('blob');
    
    const size = Math.random() * 300 + 200; // Random size (200-500px)
    const color = colors[Math.floor(Math.random() * colors.length)];
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;
    blob.style.background = color;
    blob.style.left = `${posX}%`;
    blob.style.top = `${posY}%`;
    blob.style.animationDelay = `${Math.random() * 1}s`;
    
    bg.appendChild(blob);
    blobs.push({
      element: blob,
      baseX: posX,
      baseY: posY,
      size: size
    });
  }

  // Mouse movement effect
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth * 100;
    const mouseY = e.clientY / window.innerHeight * 100;
    
    blobs.forEach(blob => {
      const dx = blob.baseX - mouseX;
      const dy = blob.baseY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const pushForce = 20 * (blob.size / 300);
      const pushFactor = Math.min(pushForce / (distance + 5), 1.5);
      
      blob.element.style.left = `${blob.baseX + dx * pushFactor}%`;
      blob.element.style.top = `${blob.baseY + dy * pushFactor}%`;
    });
  });

  // Reset on mouse leave
  document.addEventListener('mouseleave', () => {
    blobs.forEach(blob => {
      blob.element.style.left = `${blob.baseX}%`;
      blob.element.style.top = `${blob.baseY}%`;
    });
  });
});