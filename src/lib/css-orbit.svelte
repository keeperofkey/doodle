<script lang="ts">
import { onDestroy } from "svelte";

export let images: { description: string; url: string; name: string }[] = [];
export let radius = 6;
export let activeIndex = 0;

// Simple state
let enlargedImageIndex = -1; // Track which image is enlarged (-1 = none)
let imageDimensions = new Map(); // Store loaded image dimensions

// Ellipse parameters - in XY plane with ratio and rotation
const ellipseA = radius * 1.0; // semi-major axis (Y direction)
const ellipseB = radius * 0.5; // semi-minor axis (X direction) - ratio 0.5:1
const rotationY = -60; // -60 degrees Y rotation
const rotationZ = -60; // -60 degrees Z rotation

// Debug reactive updates
$: console.log("activeIndex changed to:", activeIndex);
$: console.log("enlargedImageIndex changed to:", enlargedImageIndex);

// Create reactive computed transforms for all images
$: imageTransforms = images.map((image, index) => {
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
	console.log(
		`Image ${index}: relativeIndex=${relativeIndex}, angle=${angle.toFixed(2)}, depthFactor=${depthFactor.toFixed(2)}`,
	);

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
	const highResWidth = 1200;
	const highResHeight = highResWidth / aspectRatio;

	// Fix opacity logic - front images should be more opaque
	// The front of the orbit (closest to camera) should be most visible
	let opacity;

	// Use depthFactor for opacity - higher depthFactor = closer to front = more opaque
	if (depthFactor > 0.8) {
		opacity = 1.0; // Very front: full opacity
	} else if (depthFactor > 0.6) {
		opacity = 0.8; // Front area: mostly opaque
	} else if (depthFactor > 0.4) {
		opacity = 0.6; // Middle: medium opacity
	} else if (depthFactor > 0.2) {
		opacity = 0.4; // Back area: more transparent
	} else {
		opacity = 0.2; // Very back: very transparent
	}

	// Active image gets full opacity
	if (relativeIndex === 0) {
		opacity = 1.0;
	}

	console.log(
		`Image ${index}: relativeIndex=${relativeIndex}, depthFactor=${depthFactor.toFixed(2)}, opacity=${opacity}`,
	);

	// Calculate dramatic scaling for testing
	let scale;
	if (index === enlargedImageIndex) {
		scale = 0.8; // Enlarged images: very big
	} else if (relativeIndex === 0) {
		scale = 0.4; // Active image: big
	} else {
		// Depth-based scaling: front images bigger, back images smaller
		scale = 0.1 + depthFactor * 0.3; // Range: 0.1 to 0.4
	}

	console.log(`Image ${index}: scale=${scale.toFixed(2)}`);

	return {
		transform: `translate3d(${finalX}px, ${finalY}px, ${cssZ}px) scale(${scale})`,
		opacity,
		width: `${highResWidth}px`,
		height: `${highResHeight}px`,
		aspectRatio,
		isEnlarged: index === enlargedImageIndex,
		isActive: relativeIndex === 0,
		depthFactor, // For CSS to use if needed
	};
});

function handleWheel(event: WheelEvent) {
	console.log(
		"Wheel event triggered!",
		event.deltaY,
		"Current activeIndex:",
		activeIndex,
	);
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

	console.log("Setting activeIndex to:", newIndex);
	activeIndex = newIndex;
}

function handleImageClick(index: number) {
	console.log(
		"Image clicked:",
		index,
		"Current enlargedImageIndex:",
		enlargedImageIndex,
	);
	if (enlargedImageIndex === index) {
		// Clicking the already enlarged image shrinks it back
		console.log("Shrinking image");
		enlargedImageIndex = -1;
	} else {
		// Enlarge the clicked image
		console.log("Enlarging image to index:", index);
		enlargedImageIndex = index;
	}
}

function handleImageLoad(event: Event, index: number) {
	const img = event.target as HTMLImageElement;
	imageDimensions.set(index, {
		width: img.naturalWidth,
		height: img.naturalHeight,
	});
	// Trigger reactivity
	imageDimensions = imageDimensions;
}
</script>

<div class="orbit-container" on:wheel={handleWheel}>
	<div class="orbit-scene">
		{#each images as image, index}
			<div 
				class="orbit-image {imageTransforms[index]?.isEnlarged ? 'enlarged' : ''} {imageTransforms[index]?.isActive ? 'active' : ''}"
				style="
					transform: {imageTransforms[index]?.transform || 'none'};
					opacity: {imageTransforms[index]?.opacity || 1};
					width: {imageTransforms[index]?.width || '1200px'};
					height: {imageTransforms[index]?.height || '900px'};
					--aspect-ratio: {imageTransforms[index]?.aspectRatio || 1};
					--depth-factor: {imageTransforms[index]?.depthFactor || 0.5};
					--width: {imageTransforms[index]?.width || '1200px'};
					--height: {imageTransforms[index]?.height || '900px'};
				"
				on:click={() => handleImageClick(index)}
				role="button"
				tabindex="0"
			>
				<img 
					src={image.url} 
					alt={image.description}
					draggable="false"
					on:load={(e) => handleImageLoad(e, index)}
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
	background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
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
	/* Ensure proper scaling behavior */
	transform-origin: center center;
}

.orbit-image {
	position: absolute;
	cursor: pointer;
	transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, scale 0.3s ease;
	transform-style: preserve-3d;
	backface-visibility: hidden;
	z-index: 1;
	transform-origin: center center;
	
	/* High-res images scaled down via CSS for quality */
	/* Try transform scale instead of scale property */
	/* Base scale: 20% of viewport */
	width: var(--width, 1200px);
	height: var(--height, 900px);
	transform-origin: center center;
	/* Scale applied via transform in addition to translate3d */
	/* This will be overridden by the style attribute transform */
}

.orbit-image.active {
	/* Active images - scaling handled in JavaScript transform */
	/* This selector is kept for other potential styling */
	z-index: 2;
}

.orbit-image.enlarged {
	z-index: 10;
	/* Enlarged images - scaling handled in JavaScript transform */
	opacity: 1 !important;
}

.orbit-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 8px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	user-select: none;
	pointer-events: none;
	/* Optimize for high-res images */
	image-rendering: -webkit-optimize-contrast;
	image-rendering: optimize-contrast;
	will-change: transform; /* Hint for GPU acceleration */
}

.orbit-image:hover {
	transform: scale(1.05);
}
</style>
