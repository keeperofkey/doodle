<script lang="ts">
interface Props {
	images?: { description: string; url: string; name: string }[];
	radius?: number;
	activeIndex?: number;
}

let {
	images = [],
	radius = 6,
	activeIndex = $bindable(0),
}: Props = $props();

// State using runes
let enlargedImageIndex = $state(-1);
let imageDimensions = $state(new Map());
let isMouseNearImages = $state(false);
let lastWheelTime = $state(0);
let viewportWidth = $state(typeof window !== "undefined" ? window.innerWidth : 1920);
let viewportHeight = $state(typeof window !== "undefined" ? window.innerHeight : 1080);

let lastClickedIndex = $state(-1);

$effect(() => {
	if (activeIndex !== lastClickedIndex) {
		enlargedImageIndex = -1;
	}
});

$effect(() => {
	if (typeof window !== "undefined") {
		const handleResize = () => {
			viewportWidth = window.innerWidth;
			viewportHeight = window.innerHeight;
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}
});

// Responsive rotation - vertical on mobile, diagonal on desktop
const isMobile = $derived(viewportWidth <= 768);
const rotationY = $derived(isMobile ? -90 : -60);
const rotationZ = $derived(isMobile ? 0 : -60);

// Ellipse parameters
const ellipseA = $derived(radius);
const ellipseB = $derived(radius * 0.5);

// Cached trigonometric calculations
const rotationCache = $derived({
	cosY: Math.cos((rotationY * Math.PI) / 180),
	sinY: Math.sin((rotationY * Math.PI) / 180),
	cosZ: Math.cos((rotationZ * Math.PI) / 180),
	sinZ: Math.sin((rotationZ * Math.PI) / 180)
});

// Calculate optimal scale for enlarged images to fit viewport
function calculateEnlargedScale(aspectRatio: number): number {
	// High-resolution base image dimensions
	const baseImageWidth = 1200;
	const baseImageHeight = baseImageWidth / aspectRatio;

	// Target size for enlarged images (percentage of viewport with margin)
	const maxWidth = viewportWidth * 0.8; // 80% of viewport width
	const maxHeight = viewportHeight * 0.75; // 75% of viewport height

	// Calculate required scale to fit enlarged image within target bounds
	const scaleForWidth = maxWidth / baseImageWidth;
	const scaleForHeight = maxHeight / baseImageHeight;

	// Use the smaller scale to ensure complete fit
	const scale = Math.min(scaleForWidth, scaleForHeight);

	// Clamp scale to reasonable bounds (min 0.1, max 1.0 for high-res base)
	return Math.max(0.1, Math.min(1.0, scale));
}

// Calculate orbit scale for high-resolution base images
function calculateOrbitScale(isActive: boolean, depthFactor: number): number {
	// Target orbit sizes (what we want the final display size to be)
	let targetOrbitWidth = 300;
	if (viewportWidth <= 480) {
		targetOrbitWidth = 200;
	} else if (viewportWidth <= 768) {
		targetOrbitWidth = 250;
	}

	// Calculate scale from high-res base (1200px) to target orbit size
	const baseScale = targetOrbitWidth / 1200;

	if (isActive) {
		return baseScale * 0.8; // Active image slightly larger
	} else {
		// Smooth scaling based on depth with gradual falloff
		const minScale = 0.3; // Back images
		const maxScale = 0.7; // Front non-active images
		const depthScale = minScale + depthFactor * (maxScale - minScale);
		return baseScale * depthScale;
	}
}

// Create reactive computed transforms for all images using derived
const imageTransforms = $derived(
	images.map((image, index) => {
		const relativeIndex = (index - activeIndex + images.length) % images.length;

		// Calculate position on ellipse in XY plane
		const angle = (relativeIndex / images.length) * Math.PI * 2;
		const cosAngle = Math.cos(angle);
		const sinAngle = Math.sin(angle);
		const ellipseX = ellipseB * cosAngle;
		const ellipseY = ellipseA * sinAngle;
		const ellipseZ = 0;

		// Apply Y rotation using cached values
		const xAfterY = ellipseX * rotationCache.cosY + ellipseZ * rotationCache.sinY;
		const zAfterY = -ellipseX * rotationCache.sinY + ellipseZ * rotationCache.cosY;
		const yAfterY = ellipseY;

		// Apply Z rotation using cached values
		const x = xAfterY * rotationCache.cosZ - yAfterY * rotationCache.sinZ;
		const y = xAfterY * rotationCache.sinZ + yAfterY * rotationCache.cosZ;
		const z = zAfterY;

		// Convert to CSS transform values (scale up for viewport)
		const cssX = x * 80;
		const cssY = y * 80;
		const cssZ = z * 80;

		// Get aspect ratio for CSS custom properties
		const dimensions = imageDimensions.get(index);
		const aspectRatio = dimensions ? dimensions.width / dimensions.height : 1;

		// Remove all JavaScript scaling - CSS will handle everything
		// Just calculate depth factor for CSS custom properties using cached cosine
		const depthFactor = (cosAngle + 1) / 2;

		// Calculate centering offset for enlarged images
		let centerOffsetX = 0;
		let centerOffsetY = 0;

		if (index === enlargedImageIndex) {
			// Move enlarged image to screen center (offset from its current orbit position)
			centerOffsetX = -cssX; // Offset to move to X center (0)
			centerOffsetY = -cssY; // Offset to move to Y center (0)
		}

		const finalX = cssX + centerOffsetX;
		const finalY = cssY + centerOffsetY;

		// High-resolution dimensions - let CSS scale these down
		// const highResWidth = 1200;
		// const highResHeight = highResWidth / aspectRatio;

		// Calculate smooth transitions based on depth (Z-position in 3D space)
		// depthFactor: 0 = back of orbit, 1 = front of orbit

		// Smooth depth-based opacity - front images more opaque
		let opacity;
		if (index === enlargedImageIndex) {
			opacity = 1.0; // Enlarged image always full opacity
		} else if (relativeIndex === 0) {
			opacity = 1.0; // Active image always full opacity
		} else {
			opacity = 0.2 + depthFactor * 0.6; // Range: 0.2 to 0.8 based on depth
		}

		// Calculate scale based on image state
		let scale;
		if (index === enlargedImageIndex) {
			// Use viewport-aware scaling for enlarged images
			scale = calculateEnlargedScale(aspectRatio);
		} else {
			// Use orbit scaling for normal display
			scale = calculateOrbitScale(relativeIndex === 0, depthFactor);
		}

		return {
			transform: `translate3d(${finalX}px, ${finalY}px, ${cssZ}px) scale(${scale})`,
			opacity,
			// width: `${highResWidth}px`,
			// height: `${highResHeight}px`,
			aspectRatio,
			isEnlarged: index === enlargedImageIndex,
			isActive: relativeIndex === 0,
			depthFactor, // For CSS to use if needed
		};
	}),
);

function handleMouseMove(event: MouseEvent) {
	const container = event.currentTarget as HTMLElement;
	const containerRect = container.getBoundingClientRect();
	const centerX = containerRect.width / 2;
	const centerY = containerRect.height / 2;
	const mouseX = event.clientX;
	const mouseY = event.clientY;

	const distanceSquared = Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2);
	const proximityRadius = Math.min(containerRect.width, containerRect.height) * 0.3;
	
	isMouseNearImages = distanceSquared < proximityRadius * proximityRadius;
}

function handleWheel(event: WheelEvent) {
	if (!isMouseNearImages) return;

	event.preventDefault();

	const now = performance.now();
	if (now - lastWheelTime < 100) return;

	lastWheelTime = now;
	const delta = event.deltaY > 0 ? 1 : -1;
	let newIndex = activeIndex + delta;

	if (newIndex >= images.length) newIndex = 0;
	else if (newIndex < 0) newIndex = images.length - 1;

	activeIndex = newIndex;
}

function handleImageClick(index: number) {
	lastClickedIndex = index;
	
	if (activeIndex === index && enlargedImageIndex === index) {
		// Clicking the same active enlarged image - un-enlarge it
		enlargedImageIndex = -1;
	} else {
		// Different image clicked - make it active and enlarged
		activeIndex = index;
		enlargedImageIndex = index;
	}
}

function handleImageLoad(event: Event, index: number) {
	const img = event.target as HTMLImageElement;
	imageDimensions.set(index, {
		width: img.naturalWidth,
		height: img.naturalHeight,
	});
	// Reactivity is automatic with runes
}
</script>

<div class="orbit-container" onwheel={handleWheel} onmousemove={handleMouseMove} role="application">
	<div class="orbit-scene">
		{#each images as image, index}
			<div 
				class="orbit-image {imageTransforms[index]?.isEnlarged ? 'enlarged' : ''} {imageTransforms[index]?.isActive ? 'active' : ''}"
				style="transform: {imageTransforms[index]?.transform || 'none'}; opacity: {imageTransforms[index]?.opacity || 1}; --aspect-ratio: {imageTransforms[index]?.aspectRatio || 1};"
				onclick={() => handleImageClick(index)}
				onkeydown={(e) => e.key === 'Enter' && handleImageClick(index)}
				role="button"
				tabindex="0"
			>
				<img 
					src={image.url} 
					alt={image.description}
					draggable="false"
					onload={(e) => handleImageLoad(e, index)}
				/>
			</div>
		{/each}
	</div>
	
</div>

<style>
.orbit-container {
	width: 100%;
	height: 100vh;
	overflow: hidden;
	position: relative;
	background: none;
}

.orbit-scene {
	width: 100%;
	height: 100%;
	perspective: 1000px;
	perspective-origin: center center;
	display: flex;
	align-items: center;
	justify-content: center;
	transform-style: preserve-3d;
	transform-origin: center center;
	padding: 1rem;
}

.orbit-image {
	position: absolute;
	cursor: pointer;
	transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;
	transform-style: preserve-3d;
	backface-visibility: hidden;
	z-index: 1;
	transform-origin: center center;
}

.orbit-image.active {
	z-index: 2;
}

.orbit-image.enlarged {
	z-index: 10;
	/* Faster transition for enlarged state */
	transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease;
}

.orbit-image img {
	/* High-resolution base - use intrinsic image size or set high resolution */
	width: 1200px; /* High-res base width */
	height: auto; /* Maintain aspect ratio */
	max-width: none; /* Override default constraints */
	max-height: none;
	object-fit: contain;
	border-radius: 8px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	user-select: none;
	pointer-events: none;
	will-change: transform;
	/* Optimize for lower-end hardware */
	image-rendering: auto;
	transform: translateZ(0); /* Force hardware acceleration */
	backface-visibility: hidden;
}
</style>
