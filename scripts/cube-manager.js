// Enhanced cube-manager.js - Single color cube that changes with sections

class CubeManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cube = null;
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    this.isAnimating = false;
    this.hasTargetRotation = false;
    
    // Mouse tracking
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.isMouseMoving = false;
    this.mouseStopTimeout = null;
    
    // Enhanced mouse settings
    this.mouseInfluence = 5;
    this.hoverInfluence = 0.12;
    this.baseInfluence = 2.5;
    this.targetInfluence = 0.5;
    this.interpolationSpeed = 0.08;
    
    // Define rotations for each accordion section
    this.sectionRotations = {
      'oeconomia': { x: 0, y: 0 },           // Front face (+Z)
      'alluria': { x: 0, y: -Math.PI / 2 },  // Right face (+X)
      'iridescia': { x: Math.PI / 2, y: 0 },   // Bottom face (-Y)
      'artivya': { x: 0, y: Math.PI / 2 },   // Left face (-X)
      'eloqura': { x: -Math.PI / 2, y: 0 } // Top face (+Y)
    };
    
    // Define colors for each section
    this.sectionColors = {
      'oeconomia': '#09CBFB',   // Cyan/blue
      'alluria': '#5090FD',     // Blue
      'iridescia': '#F00AFE',   // Pink/magenta
      'artivya': '#BC36FE',     // Purple
      'eloqura': '#8D5DFE'      // Purple/blue
    };
    
    this.currentColor = this.sectionColors.oeconomia; // Default to oeconomia color
    
    this.init();
  }
  
  enableMouseControl() {
    this.hasTargetRotation = false;
    console.log('Mouse control enabled - Free rotation mode');
  }
  
  init() {
    this.setupScene();
    this.createCube();
    this.setupLights();
    this.setupRenderer();
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }
  
  setupScene() {
    this.scene = new THREE.Scene();
    
    // Camera setup
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 5;
  }
  
  createCube() {
    // Create geometry with more segments for smoother surfaces
    const geometry = new THREE.BoxGeometry(3, 3, 3, 8, 8, 8);
    
    // Apply rounded corners effect
    this.applyRoundedEffect(geometry);
    
    // Create materials for each face with the same initial color
    const materials = [
      this.createMetallicFaceMaterial(this.currentColor, 'Alluria\nProtocol\nLending\n\nClick for\nFlow Chart'),
      this.createMetallicFaceMaterial(this.currentColor, 'Artivya\nProtocol\nNFTs\n\nClick for\nFlow Chart'),
      this.createMetallicFaceMaterial(this.currentColor, 'Iridescia\nProtocol\nTools\n\nClick for\nFlow Chart'),
      this.createMetallicFaceMaterial(this.currentColor, 'Eloqura\nProtocol\nLiquidity\n\nClick for\nFlow Chart'),
      this.createMetallicFaceMaterial(this.currentColor, 'Oeconomia\nProtocol\nPantheon\n\nClick for\nFlow Chart'),
      this.createMetallicFaceMaterial(this.currentColor, 'Future\nReserved\nSpace\n\nClick for\nFlow Chart')
    ];
    
    // Create cube with materials
    this.cube = new THREE.Mesh(geometry, materials);
    this.scene.add(this.cube);
    
    // Hide loading message once cube is created
    this.hideLoadingMessage();
    
    // Add mouse effects
    this.addMouseEffects();
  }
  
  // New method to change the cube color
  changeCubeColor(newColor) {
    if (!this.cube || !this.cube.material) return;
    
    this.currentColor = newColor;
    
    // Update all face materials with the new color
    const faceTexts = [
      'Alluria\nProtocol\nLending\n\nClick for\nFlow Chart',
      'Artivya\nProtocol\nNFTs\n\nClick for\nFlow Chart',
      'Iridescia\nProtocol\nTools\n\nClick for\nFlow Chart',
      'Eloqura\nProtocol\nLiquidity\n\nClick for\nFlow Chart',
      'Oeconomia\nProtocol\nPantheon\n\nClick for\nFlow Chart',
      'Future\nReserved\nSpace\n\nClick for\nFlow Chart'
    ];
    
    // Create new materials with the new color
    const newMaterials = faceTexts.map(text => 
      this.createMetallicFaceMaterial(newColor, text)
    );
    
    // Dispose old materials
    if (Array.isArray(this.cube.material)) {
      this.cube.material.forEach(material => {
        if (material.map) material.map.dispose();
        material.dispose();
      });
    }
    
    // Apply new materials
    this.cube.material = newMaterials;
  }
  
  applyRoundedEffect(geometry) {
    // Get vertex positions
    const positions = geometry.attributes.position.array;
    const radius = 1.5;
    
    // Apply subtle rounding to corners
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Calculate distance from center of each edge
      const edgeX = Math.abs(x) > 1.3;
      const edgeY = Math.abs(y) > 1.3;
      const edgeZ = Math.abs(z) > 1.3;
      
      // Apply rounding to corner vertices
      if (edgeX && edgeY && edgeZ) {
        const factor = 0.85; // Rounding factor
        positions[i] = x * factor;
        positions[i + 1] = y * factor;
        positions[i + 2] = z * factor;
      } else if ((edgeX && edgeY) || (edgeX && edgeZ) || (edgeY && edgeZ)) {
        const factor = 0.92; // Edge rounding
        positions[i] = x * factor;
        positions[i + 1] = y * factor;
        positions[i + 2] = z * factor;
      }
    }
    
    // Update the geometry
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  }
  
  createMetallicFaceMaterial(color, text) {
    // Create canvas for text texture
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 1024;
    
    // Create metallic gradient background
    const gradient = context.createRadialGradient(512, 300, 0, 512, 512, 700);
    gradient.addColorStop(0, this.lightenColor(color, 1));
    gradient.addColorStop(0.1, color);
    gradient.addColorStop(0.1, this.darkenColor(color, .1));
    gradient.addColorStop(1, this.darkenColor(color, .1));
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1024, 1024);
    
    // Add metallic highlights
    this.addMetallicHighlights(context, color);
    
    // Add text with metallic effect
    this.addMetallicText(context, text);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    
    // Use MeshStandardMaterial for better metallic properties
    return new THREE.MeshStandardMaterial({ 
      map: texture,
      metalness: 0.6,
      roughness: 0,
      envMapIntensity: 1.0,
      transparent: false,
      side: THREE.FrontSide
    });
  }
  
  addMetallicHighlights(context, baseColor) {
    // Add metallic shine streaks
    const streaks = 8;
    for (let i = 0; i < streaks; i++) {
      context.save();
      
      const angle = (i / streaks) * Math.PI * 2;
      const x = 512 + Math.cos(angle) * 300;
      const y = 512 + Math.sin(angle) * 300;
      
      const gradient = context.createRadialGradient(x, y, 0, x, y, 150);
      gradient.addColorStop(0, `rgba(255, 255, 255, 0.4)`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, 0.1)`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 1024, 1024);
      
      context.restore();
    }
    
    // Add central highlight
    const centerGradient = context.createRadialGradient(512, 512, 0, 512, 512, 400);
    centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    centerGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.1)');
    centerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = centerGradient;
    context.fillRect(0, 0, 1024, 1024);
  }
  
  addMetallicText(context, text) {
    // Add text shadow for depth
    context.shadowColor = 'rgba(0, 0, 0, 0.8)';
    context.shadowBlur = 8;
    context.shadowOffsetX = 4;
    context.shadowOffsetY = 4;
    
    // Main text
    context.fillStyle = '#ffffff';
    context.font = 'bold 122px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    const lines = text.split('\n');
    const lineHeight = 110;
    const startY = 512 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, index) => {
      context.fillText(line, 512, startY + index * lineHeight);
    });
    
    // Add metallic text highlight
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    
    // Metallic text overlay
    const textGradient = context.createLinearGradient(0, startY - 50, 0, startY + (lines.length - 1) * lineHeight + 50);
    textGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    textGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    textGradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
    
    context.fillStyle = textGradient;
    context.font = 'bold 122px Arial';
    
    lines.forEach((line, index) => {
      context.fillText(line, 512, startY + index * lineHeight);
    });
  }
  
  lightenColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + (255 * amount));
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + (255 * amount));
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + (255 * amount));
    
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  }
  
  darkenColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount));
    
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  }
  
  setupLights() {
    // Enhanced lighting for metallic effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    // Multiple directional lights for better metallic reflections
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(10, 10, 5);
    this.scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0x00d4ff, 0.3);
    light2.position.set(-10, -10, 5);
    this.scene.add(light2);
    
    const light3 = new THREE.DirectionalLight(0xff00ff, 0.2);
    light3.position.set(0, 10, -5);
    this.scene.add(light3);
    
    // Point lights for extra glow
    const pointLight1 = new THREE.PointLight(0x00d4ff, 0.5, 100);
    pointLight1.position.set(5, 0, 8);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 0.3, 100);
    pointLight2.position.set(-5, 0, 8);
    this.scene.add(pointLight2);
  }
  
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      premultipliedAlpha: false
    });
    
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    
    this.container.appendChild(this.renderer.domElement);
    
    this.setupClickHandling();
  }
  
  addMouseEffects() {
    // Simple mouse tracking with proper movement detection
    document.addEventListener('mousemove', (event) => {
      // Convert mouse position to normalized coordinates
      const newMouseX = (event.clientX / window.innerWidth) * 4 - 2;
      const newMouseY = -(event.clientY / window.innerHeight) * 4 + 2;
      
      // Check if mouse actually moved
      if (Math.abs(newMouseX - this.lastMouseX) > 0.001 || Math.abs(newMouseY - this.lastMouseY) > 0.001) {
        this.mouseX = newMouseX;
        this.mouseY = newMouseY;
        this.lastMouseX = newMouseX;
        this.lastMouseY = newMouseY;
        this.isMouseMoving = true;
        
        // Clear existing timeout
        if (this.mouseStopTimeout) {
          clearTimeout(this.mouseStopTimeout);
        }
        
        // Set timeout to detect when mouse stops
        this.mouseStopTimeout = setTimeout(() => {
          this.isMouseMoving = false;
        }, 50); // 50ms delay before considering mouse stopped
      }
    });
    
    // Container-specific effects for cursor and tooltips
    this.container.addEventListener('mousemove', (event) => {
      this.handleCursorAndTooltips(event);
    });
    
    // Enhanced mouse effects when entering/leaving the container
    this.container.addEventListener('mouseenter', () => {
      this.mouseInfluence = this.hoverInfluence;
      this.container.classList.add('interactive');
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.mouseInfluence = this.baseInfluence;
      this.container.classList.remove('interactive');
      this.isMouseMoving = false;
    });
    
    // Double-click to enable free rotation
    this.container.addEventListener('dblclick', () => {
      this.enableMouseControl();
    });
    
    // Right-click for instant free mode
    this.container.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this.enableMouseControl();
    });
  }
  
  handleCursorAndTooltips(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Calculate mouse position relative to the container for raycasting
    const rect = this.container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    if (this.hasTargetRotation) {
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObject(this.cube);
      
      if (intersects.length > 0) {
        const faceIndex = intersects[0].face.materialIndex;
        const protocol = this.faceToProtocol[faceIndex];
        
        if (protocol && protocol.url !== '#') {
          this.container.style.cursor = 'pointer';
          this.container.title = `Click to view ${protocol.name.charAt(0).toUpperCase() + protocol.name.slice(1)} Protocol flowchart`;
        } else {
          this.container.style.cursor = 'default';
          this.container.title = 'Future expansion space';
        }
      } else {
        this.container.style.cursor = 'grab';
        this.container.title = 'Move mouse to rotate, double-click for free rotation';
      }
    } else {
      this.container.style.cursor = 'grab';
      this.container.title = 'Free rotation mode - Move mouse anywhere to rotate cube';
    }
  }
  
  hideLoadingMessage() {
    const loadingElement = this.container.querySelector('.cube-loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }
  
  setupClickHandling() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    this.faceToProtocol = {
      0: { name: 'alluria', url: 'content/more/flowcharts.html#alluria' },
      1: { name: 'artivya', url: 'content/more/flowcharts.html#artivya' },
      2: { name: 'iridescia', url: 'content/more/flowcharts.html#iridescia' },
      3: { name: 'eloqura', url: 'content/more/flowcharts.html#eloqura' },
      4: { name: 'oeconomia', url: 'content/more/flowcharts.html#oeconomia' },
      5: { name: 'future', url: '#' }
    };
    
    this.container.addEventListener('click', (event) => {
      const rect = this.container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObject(this.cube);
      
      if (intersects.length > 0) {
        const faceIndex = intersects[0].face.materialIndex;
        const protocol = this.faceToProtocol[faceIndex];
        
        if (protocol && protocol.url !== '#') {
          this.animateClick();
          setTimeout(() => {
            window.location.href = protocol.url;
          }, 150);
          console.log(`Clicked on ${protocol.name} face - opening flowchart`);
        } else if (protocol && protocol.url === '#') {
          this.showFutureMessage();
        }
      }
    });
  }
  
  animateClick() {
    const originalScale = this.cube.scale.x;
    this.cube.scale.set(originalScale * 0.95, originalScale * 0.95, originalScale * 0.95);
    
    setTimeout(() => {
      this.cube.scale.set(originalScale, originalScale, originalScale);
    }, 150);
  }
  
  showFutureMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: #00d4ff;
      padding: 1rem 2rem;
      border-radius: 8px;
      border: 1px solid rgba(0, 212, 255, 0.3);
      z-index: 10000;
      font-family: inherit;
      backdrop-filter: blur(10px);
      animation: fadeInOut 2s ease-in-out forwards;
    `;
    message.textContent = '🚀 Future Protocol Space - Coming Soon!';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(message);
    
    setTimeout(() => {
      document.body.removeChild(message);
      document.head.removeChild(style);
    }, 2000);
  }
  
  rotateTo(sectionName) {
    if (!this.sectionRotations[sectionName]) {
      console.warn(`No rotation defined for section: ${sectionName}`);
      return;
    }
    
    // Change cube color to match the section
    if (this.sectionColors[sectionName]) {
      this.changeCubeColor(this.sectionColors[sectionName]);
    }
    
    this.targetRotation = { ...this.sectionRotations[sectionName] };
    this.isAnimating = true;
    this.hasTargetRotation = true;
    
    const animateRotation = () => {
      const lerpFactor = 0.12;
      
      let deltaX = this.targetRotation.x - this.cube.rotation.x;
      let deltaY = this.targetRotation.y - this.cube.rotation.y;
      
      while (deltaX > Math.PI) deltaX -= 2 * Math.PI;
      while (deltaX < -Math.PI) deltaX += 2 * Math.PI;
      while (deltaY > Math.PI) deltaY -= 2 * Math.PI;
      while (deltaY < -Math.PI) deltaY += 2 * Math.PI;
      
      this.cube.rotation.x += deltaX * lerpFactor;
      this.cube.rotation.y += deltaY * lerpFactor;
      
      if (Math.abs(deltaX) > 0.01 || Math.abs(deltaY) > 0.01) {
        requestAnimationFrame(animateRotation);
      } else {
        this.cube.rotation.x = this.targetRotation.x;
        this.cube.rotation.y = this.targetRotation.y;
        this.isAnimating = false;
      }
    };
    
    animateRotation();
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Only update rotation if mouse is actively moving and not during section animations
    if (this.isMouseMoving && !this.isAnimating) {
      // Calculate target rotation
      const sensitivity = this.mouseInfluence * 0.2;
      const targetRotationX = this.mouseY * sensitivity;
      const targetRotationY = this.mouseX * sensitivity;
      
      if (this.hasTargetRotation) {
        // Allow slight mouse influence when locked to section
        const influenceFactor = this.targetInfluence;
        this.cube.rotation.x = this.targetRotation.x + targetRotationX * influenceFactor;
        this.cube.rotation.y = this.targetRotation.y + targetRotationY * influenceFactor;
      } else {
        // Free mouse movement
        const maxRotation = 6;
        const clampedTargetX = Math.max(-maxRotation, Math.min(maxRotation, targetRotationX));
        const clampedTargetY = Math.max(-maxRotation, Math.min(maxRotation, targetRotationY));
        
        // Smooth interpolation
        this.cube.rotation.x += (clampedTargetX - this.cube.rotation.x) * this.interpolationSpeed;
        this.cube.rotation.y += (clampedTargetY - this.cube.rotation.y) * this.interpolationSpeed;
      }
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  dispose() {
    if (this.renderer) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
    
    if (this.cube) {
      this.cube.geometry.dispose();
      if (Array.isArray(this.cube.material)) {
        this.cube.material.forEach(material => {
          if (material.map) material.map.dispose();
          material.dispose();
        });
      }
    }
  }
}

// Export for use in other files
window.CubeManager = CubeManager;