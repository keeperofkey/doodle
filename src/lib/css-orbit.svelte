<script lang="ts">
interface Props {
	images?: { description: string; url: string; name: string }[];
	radius?: number;
	activeIndex?: number;
	rotationY?: number;
	rotationZ?: number;
}

let {
	images = [],
	radius = 6,
	activeIndex = $bindable(0),
	rotationY = -60,
	rotationZ = -60,
}: Props = $props();

// Simple state using runes
let enlargedImageIndex = $state(-1); // Track which image is enlarged (-1 = none)
let imageDimensions = $state(new Map()); // Store loaded image dimensions
let mouseX = $state(0);
let mouseY = $state(0);
let isMouseNearImages = $state(false);
let viewportWidth = $state(
	typeof window !== "undefined" ? window.innerWidth : 1920,
);
let viewportHeight = $state(
	typeof window !== "undefined" ? window.innerHeight : 1080,
);

// Reset enlarged image when active index changes (but not from user clicks)
let lastClickedIndex = $state(-1);

$effect(() => {
	if (activeIndex !== undefined && activeIndex !== lastClickedIndex) {
		enlargedImageIndex = -1;
	}
});

// Update viewport dimensions on resize
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

// Ellipse parameters - in XY plane with ratio and rotation
const ellipseA = $derived(radius * 1.0); // semi-major axis (Y direction)
const ellipseB = $derived(radius * 0.5); // semi-minor axis (X direction) - ratio 0.5:1

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
		const ellipseX = ellipseB * Math.cos(angle);
		const ellipseY = ellipseA * Math.sin(angle);
		const ellipseZ = 0;

		// Apply Y rotation (-60 degrees)
		const radY = (rotationY * Math.PI) / 180;
		const xAfterY = ellipseX * Math.cos(radY) + ellipseZ * Math.sin(radY);
		const zAfterY = -ellipseX * Math.sin(radY) + ellipseZ * Math.cos(radY);
		const yAfterY = ellipseY;

		// Apply Z rotation (-60 degrees)
		const radZ = (rotationZ * Math.PI) / 180;
		const x = xAfterY * Math.cos(radZ) - yAfterY * Math.sin(radZ);
		const y = xAfterY * Math.sin(radZ) + yAfterY * Math.cos(radZ);
		const z = zAfterY;

		// Convert to CSS transform values (scale up for viewport)
		const cssX = x * 80;
		const cssY = y * 80;
		const cssZ = z * 80;

		// Get aspect ratio for CSS custom properties
		const dimensions = imageDimensions.get(index);
		const aspectRatio = dimensions ? dimensions.width / dimensions.height : 1;

		// Remove all JavaScript scaling - CSS will handle everything
		// Just calculate depth factor for CSS custom properties
		const depthFactor = (Math.cos(angle) + 1) / 2;

		// Debug all images for better understanding

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
	mouseX = event.clientX;
	mouseY = event.clientY;

	// Check if mouse is near any image
	const container = event.currentTarget as HTMLElement;
	const containerRect = container.getBoundingClientRect();
	const centerX = containerRect.width / 2;
	const centerY = containerRect.height / 2;

	// Calculate distance from center (where images are concentrated)
	const distanceFromCenter = Math.sqrt(
		Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2),
	);

	// Consider mouse "near images" if within a certain radius from center
	const proximityRadius =
		Math.min(containerRect.width, containerRect.height) * 0.3;
	isMouseNearImages = distanceFromCenter < proximityRadius;
}

function handleWheel(event: WheelEvent) {
	// Only prevent default and handle image navigation if mouse is near images
	if (!isMouseNearImages) {
		return; // Let the page scroll normally
	}

	event.preventDefault();

	// Simple wheel navigation - directly update activeIndex
	const delta = event.deltaY > 0 ? 1 : -1;
	let newIndex = activeIndex + delta;

	// Loop back to beginning/end
	if (newIndex >= images.length) {
		newIndex = 0;
	} else if (newIndex < 0) {
		newIndex = images.length - 1;
	}

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
				style="
					transform: {imageTransforms[index]?.transform || 'none'};
					opacity: {imageTransforms[index]?.opacity || 1};
					<!-- width: {imageTransforms[index]?.width || '1200px'}; -->
					<!-- height: {imageTransforms[index]?.height || '900px'}; -->
					--aspect-ratio: {imageTransforms[index]?.aspectRatio || 1};
				"
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
	/* High-quality scaling */
	image-rendering: auto;
}
</style>
