<script lang="ts">
import { WebGLRenderer, PerspectiveCamera, Scene, PlaneGeometry, MeshBasicMaterial, Mesh, TextureLoader, Group, Vector3, MathUtils } from "three";
import { onDestroy, onMount } from "svelte";

export let images: Array<{name: string, url: string, description: string}>;

let canvas: HTMLCanvasElement;
let renderer: WebGLRenderer;
let camera: PerspectiveCamera;
let scene: Scene;
let stackGroup: Group;
let imagePlanes: Mesh[] = [];

// Stack parameters
const cardWidth = 4;
const cardHeight = 3;
let currentIndex = 0;
let targetIndex = 0;
let isScrolling = false;
let animationFrameId: number | null = null;

// Animation parameters
let animationProgress = 0;
let isAnimating = false;

// Mouse interaction
let isDragging = false;
let previousMouseX = 0;
let dragVelocity = 0;

onMount(async () => {
    initThreeJS();
    await loadImages();
    animate();
    
    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
});

function initThreeJS() {
    // Create scene
    scene = new Scene();
    
    // Create camera positioned to view the stack
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 3); // Centered to view both active card and stack
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    renderer = new WebGLRenderer({ 
        canvas, 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create stack group
    stackGroup = new Group();
    scene.add(stackGroup);
    
    // Handle resize
    window.addEventListener('resize', handleResize);
}

async function loadImages() {
    const textureLoader = new TextureLoader();
    const geometry = new PlaneGeometry(cardWidth, cardHeight);
    
    for (let i = 0; i < images.length; i++) {
        try {
            const texture = await new Promise((resolve, reject) => {
                textureLoader.load(
                    images[i].url,
                    resolve,
                    undefined,
                    reject
                );
            });
            
            const material = new MeshBasicMaterial({ 
                map: texture,
                transparent: true
            });
            
            const mesh = new Mesh(geometry, material);
            
            // Initialize cards in stack formation
            // Bottom left cascade positioning
            const stackIndex = i;
            const x = -2 - (stackIndex * 0.15); // Cascade to bottom left
            const y = -1 - (stackIndex * 0.1); // Slight vertical cascade
            const z = -0.5 - (stackIndex * 0.05); // Depth stacking
            
            mesh.position.set(x, y, z);
            mesh.userData = { 
                index: i,
                stackIndex: i,
                originalPosition: { x, y, z },
                targetPosition: { x, y, z }
            };
            
            imagePlanes.push(mesh);
            stackGroup.add(mesh);
            
        } catch (error) {
            console.warn(`Failed to load image ${i}:`, error);
        }
    }
    
    // Position the first image at the front
    if (imagePlanes.length > 0) {
        const frontCard = imagePlanes[0];
        frontCard.position.set(0, 0, 0.5); // Centered front position
        frontCard.userData.targetPosition = { x: 0, y: 0, z: 0.5 };
    }
}

function handleScroll() {
    if (isScrolling || isAnimating) return;
    isScrolling = true;
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / Math.max(maxScroll, 1);
        
        // Calculate target index with looping - multiply by a factor to allow multiple loops
        const loopFactor = 3; // Allow 3 full loops through the images
        const totalProgress = (scrollProgress * loopFactor) % 1; // Keep within 0-1 range
        const newTargetIndex = Math.floor(totalProgress * images.length);
        const clampedIndex = Math.max(0, Math.min(newTargetIndex, images.length - 1));
        
        if (clampedIndex !== targetIndex) {
            targetIndex = clampedIndex;
            startStackAnimation();
        }
        
        isScrolling = false;
    });
}

function handleWheel(event: WheelEvent) {
    event.preventDefault();
    
    if (isAnimating) return;
    
    // Wheel controls individual card navigation
    const delta = event.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(images.length - 1, targetIndex + delta));
    
    if (newIndex !== targetIndex) {
        targetIndex = newIndex;
        startStackAnimation();
    }
}

function onMouseDown(event: MouseEvent) {
    isDragging = true;
    previousMouseX = event.clientX;
    dragVelocity = 0;
    canvas.style.cursor = 'grabbing';
}

function onMouseMove(event: MouseEvent) {
    if (!isDragging || isAnimating) return;
    
    const deltaX = event.clientX - previousMouseX;
    dragVelocity = deltaX * 0.01;
    
    // Convert drag to discrete index changes
    if (Math.abs(dragVelocity) > 0.5) {
        const direction = dragVelocity > 0 ? -1 : 1; // Reverse for natural feel
        const newIndex = Math.max(0, Math.min(images.length - 1, targetIndex + direction));
        
        if (newIndex !== targetIndex) {
            targetIndex = newIndex;
            startStackAnimation();
        }
        dragVelocity = 0;
    }
    
    previousMouseX = event.clientX;
}

function onMouseUp() {
    isDragging = false;
    canvas.style.cursor = 'grab';
    dragVelocity = 0;
}

function startStackAnimation() {
    if (isAnimating) return;
    
    isAnimating = true;
    animationProgress = 0;
    
    // Update currentIndex to targetIndex
    const oldIndex = currentIndex;
    currentIndex = targetIndex;
    
    // Calculate new positions for all cards
    updateStackPositions();
}

function updateStackPositions() {
    imagePlanes.forEach((plane, index) => {
        const relativeIndex = (index - currentIndex + images.length) % images.length;
        
        if (relativeIndex === 0) {
            // Active card - centered front position
            plane.userData.targetPosition = { x: 0, y: 0, z: 0.5 };
        } else {
            // Stack cards - cascade to bottom left
            const stackIndex = relativeIndex - 1;
            const x = -2 - (stackIndex * 0.15);
            const y = -1 - (stackIndex * 0.1);
            const z = -0.5 - (stackIndex * 0.05);
            plane.userData.targetPosition = { x, y, z };
        }
    });
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Handle stack animation
    if (isAnimating) {
        animationProgress += 0.05; // Animation speed
        
        if (animationProgress >= 1) {
            animationProgress = 1;
            isAnimating = false;
        }
        
        updateCardAnimations();
    }
    
    renderer.render(scene, camera);
}

function updateCardAnimations() {
    // Easing function for smooth animation
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easedProgress = easeInOutCubic(animationProgress);
    
    imagePlanes.forEach((plane, index) => {
        const currentPos = plane.position;
        const targetPos = plane.userData.targetPosition;
        const relativeIndex = (index - currentIndex + images.length) % images.length;
        
        // Interpolate position
        const newX = MathUtils.lerp(currentPos.x, targetPos.x, easedProgress);
        const newY = MathUtils.lerp(currentPos.y, targetPos.y, easedProgress);
        const newZ = MathUtils.lerp(currentPos.z, targetPos.z, easedProgress);
        
        plane.position.set(newX, newY, newZ);
        
        // Update opacity based on position in stack
        if (plane.material instanceof MeshBasicMaterial) {
            if (relativeIndex === 0) {
                // Active card - full opacity
                plane.material.opacity = 1;
            } else {
                // Stack cards - fade based on depth and animation progress
                const baseOpacity = Math.max(0.3, 1 - (relativeIndex - 1) * 0.15);
                const animatedOpacity = MathUtils.lerp(plane.material.opacity, baseOpacity, easedProgress);
                plane.material.opacity = animatedOpacity;
            }
        }
    });
}


onDestroy(() => {
    // Cleanup
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('wheel', handleWheel);
    
    // Dispose Three.js objects
    imagePlanes.forEach(plane => {
        if (plane.material instanceof MeshBasicMaterial && plane.material.map) {
            plane.material.map.dispose();
        }
        plane.material.dispose();
        plane.geometry.dispose();
    });
    
    if (renderer) {
        renderer.dispose();
    }
});
</script>

<div class="relative w-full h-screen overflow-hidden">
    <canvas 
        bind:this={canvas} 
        class="w-full h-full cursor-grab"
        style="touch-action: none;"
    />
    
    <!-- Card counter -->
    <div class="absolute top-8 right-8 text-white">
        <div class="bg-black bg-opacity-50 px-3 py-2 rounded-lg">
            <span class="text-sm">
                {currentIndex + 1} / {images.length}
            </span>
        </div>
    </div>
</div>

<style>
    canvas {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    }
</style> 