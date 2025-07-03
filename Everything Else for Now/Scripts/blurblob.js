// Create the mask element
const mask = document.createElement('div');
mask.className = 'cursor-blur-mask';
document.body.appendChild(mask);

// Create blur blobs
const createBlurBlob = (color, top, left) => {
    const blob = document.createElement('div');
    blob.className = 'blur-blob';
    blob.style.background = `radial-gradient(circle, ${color} 0%, transparent 60%)`;
    blob.style.top = top;
    blob.style.left = left;
    document.body.appendChild(blob);
    return blob;
};

// Add your blur blobs
const blobs = [
    createBlurBlob('rgb(77, 162, 255, .4)', '10%', '90%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '10%', '80%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '10%', '70%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '10%', '60%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '10%', '50%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '10%', '40%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '10%', '30%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '10%', '20%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '10%', '10%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '60%', '20%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '60%', '30%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '60%', '40%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '60%', '50%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '60%', '60%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '60%', '70%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '60%', '80%'),
    createBlurBlob('rgb(77, 162, 255, .4)', '60%', '90%'),
];

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 15;
    const centerY = window.innerHeight / 15;
    
    const offsetX = (e.clientX - centerX) * 1;
    const offsetY = (e.clientY - centerY) * 1;
    
    const dampedX = centerX + offsetX;
    const dampedY = centerY + offsetY;
    
    const xPercent = (dampedX / window.innerWidth) * 100;
    const yPercent = (dampedY / window.innerHeight) * 100;
    
    mask.style.setProperty('--x', xPercent + '%');
    mask.style.setProperty('--y', yPercent + '%');
});