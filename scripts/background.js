// Wrap your entire background.js code in this:
document.addEventListener('DOMContentLoaded', function() {
    // 1. Setup scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = null; // Ensure scene has no background
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true, // Enable transparency
        powerPreference: "high-performance"
    });
    
    // Set transparent background
    renderer.setClearColor(0x000000, 0); // 0 alpha = fully transparent
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add renderer to the container
    const container = document.getElementById('threejs-background');
    if (container) {
        container.appendChild(renderer.domElement);
    }

    // 2. Starfield Configuration - CUSTOMIZE THESE VALUES
    const starfieldConfig = {
        count: 15000,              // Number of stars (matching test.html)
        size: 0.65,                // Base star size (matching test.html)
        opacity: 1,                // Star opacity
        spread: 2000,              // How far stars spread out
        animationSpeed: {
            x: 0.0005,  // X-axis rotation speed
            y: 0.0005   // Y-axis rotation speed
        }
    };

    // Create starfield (matching test.html exactly)
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: starfieldConfig.size,
        transparent: true,
    });
    
    const starVertices = [];
    for (let i = 0; i < starfieldConfig.count; i++) {
        starVertices.push(
            (Math.random() - 0.5) * starfieldConfig.spread,
            (Math.random() - 0.5) * starfieldConfig.spread,
            (Math.random() - 0.5) * starfieldConfig.spread
        );
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 3. Lighting Setup (EXACTLY matching test.html)
    // --- Ambient Light (soft fill) ---
    const ambientLight = new THREE.AmbientLight(0xffddbb, 2);
    scene.add(ambientLight);

    // --- Directional Lights ---
    const keyLight = new THREE.DirectionalLight(0xff88cc, 2.5);
    keyLight.position.set(1, 1, 1).normalize();
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00ffaa, 2.5);
    rimLight.position.set(-1, -1, -1).normalize();
    scene.add(rimLight);

    // --- Point Light (sparkle) ---
    const pointLight = new THREE.PointLight(0xffcc00, 15, 5);
    pointLight.position.set(0, 2, 10);
    scene.add(pointLight);

    // 4. Glass cube grid (4x4x4)
    const gridContainer = new THREE.Group();
    scene.add(gridContainer);
    gridContainer.position.x = -2; // Move left by 2 units

    const gridSize = 4;
    const spacing = 1.1;
    
    // Check if RoundedBoxGeometry is available, fallback to BoxGeometry
    let geometry;
    if (THREE.RoundedBoxGeometry) {
        geometry = new THREE.RoundedBoxGeometry(0.7, 0.7, 0.7, 6, .1);
    } else {
        geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    }
    
    // Create cubes with individual materials (so we can animate them separately)
    const cubes = [];
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                // Create material for each cube (matching test.html)
                const material = new THREE.MeshPhysicalMaterial({
                    transmission: 0.97,
                    roughness: 0.05,
                    metalness: 10,
                    clearcoat: 1,
                    ior: 1.5,
                    thickness: 1,
                    color: 0x88ccff,
                    envMapIntensity: 1.5,
                    specularColor: 0xffffff,
                    transparent: false,
                    opacity: 1
                
                });
                
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(
                    (x - (gridSize - 1) / 2) * spacing,
                    (y - (gridSize - 1) / 2) * spacing,
                    (z - (gridSize - 1) / 2) * spacing
                );
                
                // Store original material values
                cube.userData = {
                    originalTransmission: 0.97,
                    originalOpacity: 1,
                    originalClearcoat: 1,
                    originalEnvMapIntensity: 1.5
                };
                
                gridContainer.add(cube);
                cubes.push(cube);
            }
        }
    }

    // Adjust camera (matching test.html positioning)
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);

    // Scroll Configuration - CUSTOMIZE THESE VALUES
    const scrollConfig = {
        // Scaling settings
        minScale: 0.5,        // Minimum scale when fully scrolled
        maxScale: 1,          // Maximum scale at top
        scaleSpeed: 0.3,      // How fast scale animates (0.01 = slow, 0.5 = fast)
        
        // Position settings
        moveBackward: true,   // Move cubes away on scroll
        maxZOffset: 1,        // Maximum distance to move back
        
        // New right shift setting
        moveRight: true,      // Move cubes to the right on scroll
        maxXOffset: 5,        // Maximum distance to move right
        
        // Opacity settings
        fadeOnScroll: true,   // Enable opacity change on scroll
        minOpacity: .1,      // Minimum opacity when scrolled
        
        // Rotation settings
        rotateOnScroll: true, // Add rotation as you scroll
        scrollRotationSpeed: 1, // Rotation multiplier
        
        // Trigger point
        scrollTrigger: 1      // How many viewport heights to complete the effect
    };

    // 5. Mouse interaction (matching test.html)
    const mouse = new THREE.Vector2();
    const targetRotation = { x: 0, y: 0 };
    const targetPosition = { x: -2, y: 0 };
    let targetScale = 1;
    let scrollRotation = 0;

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        targetRotation.x = mouse.y * 0.3;
        targetRotation.y = mouse.x * 0.3;
        targetPosition.x = -2 + mouse.x * 0.5;
        targetPosition.y = mouse.y * 0.5;
    });

    // Variables for smooth animation
    let currentZOffset = 0;
    let targetZOffset = 0;
    let currentXOffset = 0; // New variable for right shift
    let targetXOffset = 0;  // New variable for right shift

    // Scroll-based effects
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Calculate scroll progress (0 to 1)
        const scrollProgress = Math.min(Math.max(scrollY / (windowHeight * scrollConfig.scrollTrigger), 0), 1);
        
        // Scale effect
        targetScale = scrollConfig.maxScale - (scrollProgress * (scrollConfig.maxScale - scrollConfig.minScale));
        
        // Position effect
        if (scrollConfig.moveBackward) {
            targetZOffset = scrollProgress * scrollConfig.maxZOffset;
        }
        
        // New right shift effect
        if (scrollConfig.moveRight) {
            targetXOffset = scrollProgress * scrollConfig.maxXOffset;
        }
        
        // Material effects for each cube
        if (scrollConfig.fadeOnScroll) {
            cubes.forEach(cube => {
                const userData = cube.userData;
                const material = cube.material;
                
                // Calculate target values
                const targetOpacity = 1 - (scrollProgress * (1 - scrollConfig.minOpacity));
                const targetTransmission = userData.originalTransmission * (1 - scrollProgress * 0.7);
                const targetClearcoat = userData.originalClearcoat * (1 - scrollProgress * 0.5);
                const targetEnvMapIntensity = userData.originalEnvMapIntensity * (1 - scrollProgress * 0.5);
                
                // Apply values
                material.opacity = targetOpacity;
                material.transmission = targetTransmission;
                material.clearcoat = targetClearcoat;
                material.envMapIntensity = targetEnvMapIntensity;
                
                // Force update
                material.needsUpdate = true;
            });
        }
        
        // Rotation effect
        if (scrollConfig.rotateOnScroll) {
            scrollRotation = scrollProgress * scrollConfig.scrollRotationSpeed;
        }
    });

    // 6. Animation loop (matching test.html structure)
function animate() {
    requestAnimationFrame(animate);

    // Smooth interpolation for grid container
    gridContainer.rotation.x += (targetRotation.x + scrollRotation - gridContainer.rotation.x) * 0.1;
    gridContainer.rotation.y += (targetRotation.y + scrollRotation - gridContainer.rotation.y) * 0.1;
    gridContainer.position.x += ((targetPosition.x + currentXOffset) - gridContainer.position.x) * 0.1; // Fixed line
    gridContainer.position.y += (targetPosition.y - gridContainer.position.y) * 0.1;
    
    // Smooth Z position interpolation
    currentZOffset += (targetZOffset - currentZOffset) * scrollConfig.scaleSpeed;
    gridContainer.position.z = -currentZOffset;
    
    // Smooth X position interpolation for right shift
    currentXOffset += (targetXOffset - currentXOffset) * scrollConfig.scaleSpeed;
    
    // Smooth scale interpolation
    const currentScale = gridContainer.scale.x;
    const scaleChange = (targetScale - currentScale) * scrollConfig.scaleSpeed;
    gridContainer.scale.set(
        currentScale + scaleChange,
        currentScale + scaleChange,
        currentScale + scaleChange
    );

    // Animate stars and point light
    stars.rotation.x += starfieldConfig.animationSpeed.x;
    stars.rotation.y += starfieldConfig.animationSpeed.y;
    pointLight.position.x = Math.sin(Date.now() * 0.001) * 3;
    pointLight.position.z = Math.cos(Date.now() * 0.001) * 3;

    renderer.render(scene, camera);

    }
    animate();

    // 7. Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});