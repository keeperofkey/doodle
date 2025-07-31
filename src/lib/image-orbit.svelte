<script lang="ts">
import { onMount, onDestroy } from "svelte";
import { normalizeScroll } from "./maths";
import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	TextureLoader,
	PlaneGeometry,
	MeshBasicMaterial,
	Mesh,
	Group,
	Clock,
	MathUtils,
} from "three";

export let images: { description: string; url: string; name: string }[] = [];
export let radius = 6;
export let activeIndex = 0;

let canvas: HTMLCanvasElement;
let scene: Scene;
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;
let imageGroup: Group;
let imageMeshes: Mesh[] = [];
let clock = new Clock();
let animationId: number;
let targetIndex = 0;
let isAnimating = false;
let animationProgress = 0;
let isMaximized = false;
let maximizedImageIndex = -1;

// Ellipse parameters - in XY plane with specified ratio and rotation
const ellipseA = radius * 1.0; // semi-major axis (Y direction)
const ellipseB = radius * 0.5; // semi-minor axis (X direction) - ratio 0.5:1
const rotationY = MathUtils.degToRad(-60); // -60 degrees Y rotation
const rotationZ = MathUtils.degToRad(-60); // -60 degrees Z rotation

// Card dimensions - even larger base size for better resolution
const cardWidth = 12;
const cardHeight = 9;

onMount(async () => {
	initScene();
	await loadImages();
	animate();
	setupControls();
});

onDestroy(() => {
	if (animationId) {
		cancelAnimationFrame(animationId);
	}

	// Remove event listeners
	window.removeEventListener("scroll", handleScroll);
	window.removeEventListener("resize", handleResize);
	canvas.removeEventListener("wheel", handleWheel);
	canvas.removeEventListener("click", handleClick);

	// Cleanup Three.js objects
	imageMeshes.forEach((mesh) => {
		if (mesh.material instanceof MeshBasicMaterial && mesh.material.map) {
			mesh.material.map.dispose();
		}
		mesh.material.dispose();
		mesh.geometry.dispose();
	});

	if (renderer) {
		renderer.dispose();
	}
});

function initScene() {
	// Scene setup
	scene = new Scene();

	// Camera positioned to view the orbit
	camera = new PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);
	camera.position.set(0, 0, 10);
	camera.lookAt(0, 0, 0);

	// Renderer setup
	renderer = new WebGLRenderer({
		canvas,
		antialias: true,
		alpha: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	// Create group for images - no rotation here, we'll handle it in positioning
	imageGroup = new Group();
	scene.add(imageGroup);

	// Handle window resize
	window.addEventListener("resize", handleResize);
}

function handleResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

async function loadImages() {
	const textureLoader = new TextureLoader();
	const geometry = new PlaneGeometry(cardWidth, cardHeight);

	for (let i = 0; i < images.length; i++) {
		try {
			const texture = await new Promise<any>((resolve, reject) => {
				textureLoader.load(images[i].url, resolve, undefined, reject);
			});

			const material = new MeshBasicMaterial({
				map: texture,
				transparent: true,
			});

			const mesh = new Mesh(geometry, material);

			// Position on ellipse in XY plane
			const angle = (i / images.length) * Math.PI * 2;
			const ellipseX = ellipseB * Math.cos(angle); // X uses semi-minor axis
			const ellipseY = ellipseA * Math.sin(angle); // Y uses semi-major axis
			const ellipseZ = 0; // Initially in XY plane

			// Apply Y rotation (-80 degrees)
			const xAfterY =
				ellipseX * Math.cos(rotationY) + ellipseZ * Math.sin(rotationY);
			const zAfterY =
				-ellipseX * Math.sin(rotationY) + ellipseZ * Math.cos(rotationY);
			const yAfterY = ellipseY;

			// Apply Z rotation (-60 degrees)
			const x = xAfterY * Math.cos(rotationZ) - yAfterY * Math.sin(rotationZ);
			const y = xAfterY * Math.sin(rotationZ) + yAfterY * Math.cos(rotationZ);
			const z = zAfterY;

			mesh.position.set(x, y, z);
			mesh.userData = {
				index: i,
				originalPosition: { x, y, z },
				targetPosition: { x, y, z },
			};

			imageMeshes.push(mesh);
			imageGroup.add(mesh);
		} catch (error) {
			console.warn(`Failed to load image ${i}:`, error);
		}
	}

	// Set initial active image
	updateImagePositions();
}

function setupControls() {
	window.addEventListener("scroll", handleScroll, { passive: true });
	canvas.addEventListener("wheel", handleWheel, { passive: false });
	canvas.addEventListener("click", handleClick, { passive: false });
}

function handleScroll() {
	if (isAnimating) return;

	const scrollY = window.scrollY;
	const maxScroll = document.body.scrollHeight - window.innerHeight;
	const scrollProgress = scrollY / Math.max(maxScroll, 1);

	// Calculate target index from scroll
	const newTargetIndex = Math.floor(scrollProgress * images.length);
	const clampedIndex = Math.max(0, Math.min(newTargetIndex, images.length - 1));

	if (clampedIndex !== targetIndex) {
		targetIndex = clampedIndex;
		startAnimation();
	}
}

function handleWheel(event: WheelEvent) {
	event.preventDefault();

	if (isAnimating) return;

	// Wheel controls individual image navigation with looping
	const delta = event.deltaY > 0 ? 1 : -1;
	let newIndex = targetIndex + delta;
	
	// Loop back to beginning/end
	if (newIndex >= images.length) {
		newIndex = 0;
	} else if (newIndex < 0) {
		newIndex = images.length - 1;
	}

	if (newIndex !== targetIndex) {
		targetIndex = newIndex;
		startAnimation();
	}
}

function handleClick(event: MouseEvent) {
	if (isAnimating) return;
	
	// Simple approach: maximize the currently active image
	if (!isMaximized) {
		isMaximized = true;
		maximizedImageIndex = activeIndex;
	} else {
		isMaximized = false;
		maximizedImageIndex = -1;
	}
}

function closeMaximized() {
	isMaximized = false;
	maximizedImageIndex = -1;
}

function startAnimation() {
	if (isAnimating) return;

	isAnimating = true;
	animationProgress = 0;
	activeIndex = targetIndex;

	updateImagePositions();
}

function updateImagePositions() {
	imageMeshes.forEach((mesh, index) => {
		const relativeIndex = (index - activeIndex + images.length) % images.length;

		// Calculate position on ellipse in XY plane
		const angle = (relativeIndex / images.length) * Math.PI * 2;
		const ellipseX = ellipseB * Math.cos(angle); // X uses semi-minor axis
		const ellipseY = ellipseA * Math.sin(angle); // Y uses semi-major axis
		const ellipseZ = 0; // Initially in XY plane

		// Apply Y rotation (-80 degrees)
		const xAfterY =
			ellipseX * Math.cos(rotationY) + ellipseZ * Math.sin(rotationY);
		const zAfterY =
			-ellipseX * Math.sin(rotationY) + ellipseZ * Math.cos(rotationY);
		const yAfterY = ellipseY;

		// Apply Z rotation (-60 degrees)
		const x = xAfterY * Math.cos(rotationZ) - yAfterY * Math.sin(rotationZ);
		const y = xAfterY * Math.sin(rotationZ) + yAfterY * Math.cos(rotationZ);
		const z = zAfterY;

		mesh.userData.targetPosition = { x, y, z };
	});
}

function animate() {
	animationId = requestAnimationFrame(animate);

	// Handle animation
	if (isAnimating) {
		animationProgress += 0.03; // Animation speed (slower)

		if (animationProgress >= 1) {
			animationProgress = 1;
			isAnimating = false;
		}

		updateImageAnimations();
	}

	// Keep images flat and aligned to viewport (no billboard effect)

	renderer.render(scene, camera);
}

function updateImageAnimations() {
	// Easing function for smooth animation
	const easeInOutCubic = (t: number) =>
		t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	const easedProgress = easeInOutCubic(animationProgress);

	imageMeshes.forEach((mesh, index) => {
		const currentPos = mesh.position;
		const targetPos = mesh.userData.targetPosition;
		const relativeIndex = (index - activeIndex + images.length) % images.length;

		// Interpolate position
		const newX = MathUtils.lerp(currentPos.x, targetPos.x, easedProgress);
		const newY = MathUtils.lerp(currentPos.y, targetPos.y, easedProgress);
		const newZ = MathUtils.lerp(currentPos.z, targetPos.z, easedProgress);

		mesh.position.set(newX, newY, newZ);

		// Keep images flat and aligned to viewport

		// Update opacity based on z position - FIXED: closer = less transparent (more opaque)
		if (mesh.material instanceof MeshBasicMaterial) {
			if (relativeIndex === 0) {
				// Active image - full opacity
				mesh.material.opacity = 1;
			} else {
				// Other images - opacity based on z position relative to ellipse
				const zDepth = mesh.position.z;
				// Map z position to opacity: closer to camera (higher z) = more opaque
				// Since camera is at z=4, need to calculate z range for rotated ellipse
				const maxZ = Math.max(ellipseA, ellipseB) * 2; // Approximate max z after rotation
				const minZ = -maxZ; // Approximate min z after rotation
				const normalizedZ = (zDepth - minZ) / (maxZ - minZ); // 0 to 1, where 1 = closest to camera
				const opacity = Math.max(0.2, 0.3 + normalizedZ * 0.5); // 0.2 to 0.8 opacity range
				mesh.material.opacity = opacity;
			}

			// Scale based on ellipse position - front images larger, back images smaller
			const angle = (relativeIndex / images.length) * Math.PI * 2;
			
			// Create depth curve: images at front (angle ~0) are larger, back (angle ~π) are smaller
			const depthFactor = (Math.cos(angle) + 1) / 2; // 0 to 1, where 1 = front, 0 = back
			const baseScale = 0.4 + depthFactor * 0.5; // Scale from 0.4 to 0.9
			const activeBonus = relativeIndex === 0 ? 0.2 : 0; // Active image gets smaller bonus
			const targetScale = baseScale + activeBonus;
			
			const currentScale = mesh.scale.x;
			const newScale = MathUtils.lerp(currentScale, targetScale, easedProgress);
			mesh.scale.setScalar(newScale);
		}
	});
}

// Export function to change active image
export function setActiveImage(index: number) {
	if (index !== targetIndex && !isAnimating) {
		targetIndex = Math.max(0, Math.min(images.length - 1, index));
		startAnimation();
	}
}
</script>

<div class="relative w-full h-screen overflow-hidden">
    <canvas 
        bind:this={canvas} 
        class="w-full h-full cursor-grab"
        style="touch-action: none;"
    />
    
    <!-- Image counter -->
    <div class="absolute top-8 right-8 text-white">
        <div class="bg-black bg-opacity-50 px-3 py-2 rounded-lg">
            <span class="text-sm">
                {activeIndex + 1} / {images.length}
            </span>
        </div>
    </div>
    
    <!-- Image info overlay -->
    {#if images[activeIndex]}
        <div class="absolute bottom-8 left-8 text-white max-w-md">
            <div class="bg-black bg-opacity-50 px-4 py-3 rounded-lg">
                <h3 class="font-bold text-lg mb-1">{images[activeIndex].name}</h3>
                <p class="text-sm opacity-90">{images[activeIndex].description}</p>
            </div>
        </div>
    {/if}
    
    <!-- Navigation controls -->
    <div class="absolute bottom-8 right-8 flex gap-2">
        <button 
            on:click={() => setActiveImage(activeIndex - 1)}
            disabled={activeIndex === 0}
            class="bg-white bg-opacity-80 hover:bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full shadow-lg transition-opacity"
            aria-label="Previous image"
        >
            <span class="fa-solid fa-chevron-left text-black"></span>
        </button>
        <button 
            on:click={() => setActiveImage(activeIndex + 1)}
            disabled={activeIndex === images.length - 1}
            class="bg-white bg-opacity-80 hover:bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full shadow-lg transition-opacity"
            aria-label="Next image"
        >
            <span class="fa-solid fa-chevron-right text-black"></span>
        </button>
    </div>
    
    <!-- Maximized image overlay -->
    {#if isMaximized && images[maximizedImageIndex]}
        <div 
            class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            on:click={closeMaximized}
            role="dialog"
            aria-modal="true"
        >
            <div class="relative max-w-[90vw] max-h-[90vh]">
                <img 
                    src={images[maximizedImageIndex].url} 
                    alt={images[maximizedImageIndex].description}
                    class="max-w-full max-h-full object-contain"
                />
                
                <!-- Close button -->
                <button 
                    on:click={closeMaximized}
                    class="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-opacity"
                    aria-label="Close maximized view"
                >
                    <span class="fa-solid fa-times text-black"></span>
                </button>
                
                <!-- Image info -->
                <div class="absolute bottom-4 left-4 text-white max-w-md">
                    <div class="bg-black bg-opacity-50 px-4 py-3 rounded-lg">
                        <h3 class="font-bold text-lg mb-1">{images[maximizedImageIndex].name}</h3>
                        <p class="text-sm opacity-90">{images[maximizedImageIndex].description}</p>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
canvas {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}
</style>
