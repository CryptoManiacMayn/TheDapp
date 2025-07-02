function createServiceObject(config) {
  const {
    containerId,
    objectType = "icosahedron",
    color = 0x888888,
    rotationSpeed = { x: 0.005, y: 0.008, z: 0.003 },
  } = config;

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }

  // Get container dimensions
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(3, 3, 3);
  scene.add(directionalLight);

  const pointLight1 = new THREE.PointLight(0xff4444, 0.5, 50);
  pointLight1.position.set(-5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x4444ff, 0.5, 50);
  pointLight2.position.set(5, -5, 5);
  scene.add(pointLight2);

  // Iridescent material
  const createIridescentMaterial = (baseColor) => {
    return new THREE.MeshPhysicalMaterial({
      color: baseColor,
      metalness: 0.1,
      roughness: 0.0,
      transmission: 0.1,
      transparent: false,
      opacity: 1.0,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      ior: 1.5,
      thickness: 1.0,
      side: THREE.DoubleSide, // Kept - ensures both sides are rendered
      envMapIntensity: 1.0, // NEW - enhances reflections
      sheen: 0.5, // NEW - adds crystal-like sheen
      sheenRoughness: 0.0, // NEW - smooth sheen
      sheenColor: new THREE.Color(baseColor).multiplyScalar(0.1), // NEW - subtle sheen color
    });
  };

  // Create geometry based on objectType
  let geometry;
  switch (objectType) {
    case "icosahedron":
      geometry = new THREE.IcosahedronGeometry(2, 0);
      break;
    case "torusKnot":
      geometry = new THREE.TorusKnotGeometry(2, 0.25, 64, 16);
      break;
    case "dodecahedron":
      geometry = new THREE.DodecahedronGeometry(0.9, 0);
      break;
    case "octahedron":
      geometry = new THREE.OctahedronGeometry(2, 0);
      break;
    case "tetrahedron":
      geometry = new THREE.TetrahedronGeometry(1.2, 0);
      break;
    case "torus":
      geometry = new THREE.TorusGeometry(0.8, 0.3, 16, 64);
      break;
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
  }

  const material = createIridescentMaterial(color);
  const object = new THREE.Mesh(geometry, material);
  scene.add(object);

  // Camera position
  camera.position.z = 3;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    object.rotation.x += rotationSpeed.x;
    object.rotation.y += rotationSpeed.y;
    object.rotation.z += rotationSpeed.z;

    // Animate lights
    const time = Date.now() * 0.001;
    pointLight1.position.x = Math.cos(time * 2) * 2;
    pointLight1.position.z = Math.sin(time * 2) * 2;

    pointLight2.position.x = Math.cos(time * 2 + Math.PI) * 2;
    pointLight2.position.z = Math.sin(time * 2 + Math.PI) * 2;

    renderer.render(scene, camera);
  }

  animate();

  // Store scene and camera for external manipulation
  const serviceObject = {
    scene,
    camera,

    cleanup: () => {
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };

  return serviceObject;

}

// Service configurations with meaningful object types and colors
const serviceConfigs = [
  {
    containerId: "service-security-icon",
    objectType: "octahedron", // Sharp, protective form
    color: 0xff6b9d, // Green for security
    rotationSpeed: { x: 0.004, y: 0.006, z: 0.003 },
  },
  {
    containerId: "service-speed-icon",
    objectType: "icosahedron", // Dynamic multi-faceted form
    color: 0xff6b9d, // Cyan for speed
    rotationSpeed: { x: 0.008, y: 0.012, z: 0.005 }, // Faster rotation
  },
  {
    containerId: "service-fees-icon",
    objectType: "tetrahedron", // Simple, efficient form
    color: 0xffd700, // Gold for value
    rotationSpeed: { x: 0.003, y: 0.005, z: 0.002 },
  },
  {
    containerId: "service-reliability-icon",
    objectType: "dodecahedron", // Stable, well-balanced form
    color: 0x8a2be2, // Purple for reliability
    rotationSpeed: { x: 0.002, y: 0.004, z: 0.003 }, // Steady rotation
  },
  {
    containerId: "service-innovation-icon",
    objectType: "torusKnot", // Complex, innovative form
    color: 0xff6b9d, // Pink for innovation
    rotationSpeed: { x: 0.006, y: 0.009, z: 0.007 },
  },
  {
    containerId: "service-support-icon",
    objectType: "torus", // Continuous, supportive form
    color: 0x32cd32, // Lime green for support
    rotationSpeed: { x: 0.005, y: 0.007, z: 0.004 },
  },
];

// Initialize all service 3D objects
document.addEventListener("DOMContentLoaded", function () {
  const serviceObjects = [];
  const featuresSection = document.getElementById("features");

  // Create a single set of lights to be shared
  const sharedLights = new THREE.Group();
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(5, 5, 10);
  const fillLight = new THREE.PointLight(0x00aaff, 3, 100);
  fillLight.position.set(-10, -5, 5);
  sharedLights.add(keyLight, fillLight);

  // Small delay to ensure containers are properly sized
  setTimeout(() => {
    serviceConfigs.forEach((config) => {
      const serviceObject = createServiceObject(config);
      if (serviceObject) {
        serviceObjects.push(serviceObject);
      }
    });
  }, 100);

  // Intersection Observer to toggle lights
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add lights to all scenes
          serviceObjects.forEach(({ scene }) => {
            scene.add(sharedLights);
          });
        } else {
          // Remove lights from all scenes
          serviceObjects.forEach(({ scene }) => {
            scene.remove(sharedLights);
          });
        }
      });
    },
    {
      root: null, // viewport
      threshold: 0.1, // 10% of the element is visible
    }
  );

  if (featuresSection) {
    observer.observe(featuresSection);
  }
});
