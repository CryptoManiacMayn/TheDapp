// Create the mask element
const mask = document.createElement('div');
mask.className = 'cursor-blur-mask';
document.body.appendChild(mask);

// Create blur blobs
const createBlurBlob = (color, top, left) => {
    const blob = document.createElement('div');
    blob.className = 'blur-blob';
    blob.style.background = `radial-gradient(circle, ${color} 0%, transparent 40%)`;
    blob.style.top = top;
    blob.style.left = left;
    document.body.appendChild(blob);
    return blob;
};

// Add your blur blobs
const blobs = [
    createBlurBlob('rgba(255, 105, 180, 0.5)', '20%', '60%'),
    createBlurBlob('rgba(11, 142, 223, 0.5)', '50%', '10%'),
    createBlurBlob('rgba(11, 14, 223, 0.5)', '50%', '50%'),
    createBlurBlob('rgba(138, 43, 226, 0.4)', '70%', '20%'),  
    createBlurBlob('rgba(230, 230, 12, 0.4)', '70%', '70%'),  
    createBlurBlob('rgba(138, 43, 226, 0.4)', '10%', '50%'),  
    createBlurBlob('rgba(213, 17, 17, 0.4)', '10%', '10%'),  
    createBlurBlob('rgba(30, 144, 255, 0.4)', '80%', '45%') 
];

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 15;
    const centerY = window.innerHeight / 35;
    
    const offsetX = (e.clientX - centerX) * 0.89;
    const offsetY = (e.clientY - centerY) * 0.89;
    
    const dampedX = centerX + offsetX;
    const dampedY = centerY + offsetY;
    
    const xPercent = (dampedX / window.innerWidth) * 120;
    const yPercent = (dampedY / window.innerHeight) * 120;
    
    mask.style.setProperty('--x', xPercent + '%');
    mask.style.setProperty('--y', yPercent + '%');
});