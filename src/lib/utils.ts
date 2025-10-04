export { setScene, captureHighResScreenshot };
export type { RenderMode };

import { normalizeScroll } from "./maths";
import type { RenderMode } from "./types";
import {
	Scene,
	ACESFilmicToneMapping,
	WebGLRenderer,
	PerspectiveCamera,
	Object3D,
	Mesh,
	AnimationClip,
	AnimationMixer,
	KeyframeTrack,
	AnimationAction,
	Color,
	AmbientLight,
	MeshBasicMaterial,
	PointsMaterial,
	Points,
	Clock,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { SplatMesh, SparkRenderer } from "@sparkjsdev/spark";
// clock from animation scrubbing
let clock = new Clock();

// Performance optimization variables
let animationFrameId: number | null = null;
let isScrolling = false;
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

// Cached material for reuse
let cachedWireframeMaterial: MeshBasicMaterial | null = null;

/////////
//
// GLTF
//
/////////

async function loadGLTF(modelName: string) {
	const loader = new GLTFLoader();
	let cameras: any[] = [];
	let lookAt = new Object3D();
	let scene = new Scene();
	let mesh = new Mesh();
	let camera = new PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);

	await loader
		.setPath("models/")
		.setMeshoptDecoder(MeshoptDecoder)
		.loadAsync(modelName)
		.then((gltf) => {
			cameras = gltf.cameras;
			scene.animations = gltf.animations;
			gltf.scene.traverse((child: any) => {
				if (child.isMesh) {
					// Reuse cached material for better performance
					if (!cachedWireframeMaterial) {
						cachedWireframeMaterial = new MeshBasicMaterial({
							color: 0xffffff,
							wireframe: true,
							vertexColors: true,
							wireframeLinewidth: 1,
						});
					}
					child.material = cachedWireframeMaterial;
					mesh = child;
				}
				if (child.name === "Look_At") {
					lookAt = child;
				}
				if (child.isCamera) {
					camera = child;
				}
			});
		})
		.catch((error) => {
			console.error(error);
		});
	scene.add(lookAt);
	scene.add(camera);
	scene.add(mesh);
	return { scene, cameras, lookAt, mesh };
}

////////////////
//
//Splat Loader
//
///////////////
async function loadSpark(splatName: string) {
	try {
		return new Promise<SplatMesh>((resolve, reject) => {
			const splat = new SplatMesh({
				url: `/models/${splatName}`,
				onLoad: (mesh) => {
					resolve(mesh);
				}
			});

			// Add a timeout to prevent hanging
			setTimeout(() => {
				reject(new Error(`Splat loading timeout for ${splatName}`));
			}, 30000); // 30 second timeout
		});
	} catch (error) {
		console.error("Failed to load splat:", error);
		throw error;
	}
}

//////////////
//
// RENDERING
//
//////////////

function setRender(renderer: WebGLRenderer) {
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.toneMapping = ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.domElement.style.zIndex = "-1";
}

/////////////////////////////////////////////////
//
// Set up orbitControls and camera animations
//
////////////////////////////////////////////////

async function setCtrl(
	camera: PerspectiveCamera,
	renderer: WebGLRenderer,
	lookAt: Object3D,
) {
	let controls = new OrbitControls(camera, renderer.domElement);
	controls.enabled = false;
	controls.target = lookAt.position;
	return controls;
}

// TODO: it works ok. but its not very elegent

async function setAnim(
	scene: Scene,
	camera: PerspectiveCamera,
	lookAt: Object3D,
) {
	const mixer = new AnimationMixer(scene);
	let lookTracks: KeyframeTrack[] = [];
	let camTracks: KeyframeTrack[] = [];
	const tracks = scene.animations[0].tracks;
	tracks.forEach((track) => {
		if (track.name.includes("Look_At")) {
			lookTracks.push(track);
		} else if (track.name.includes("cam1")) {
			camTracks.push(track);
		} else {
			console.log("track not detected cause im lazy try naming it better");
		}
	});

	const lookClip = new AnimationClip("lookAt", -1, lookTracks);
	const lookAction = mixer.clipAction(lookClip, lookAt);
	const camClip = new AnimationClip("cam1", -1, camTracks);
	const camAction = mixer.clipAction(camClip, camera);

	lookAction.play();
	lookAction.paused = true;
	camAction.play();
	camAction.paused = true;
	return { mixer, camAction, lookAction };
}

///////////////
//
// HANDLERS
//
// adjusts animation time to match scroll position with throttling

function handleScroll(
	camAction: AnimationAction,
	stageElement: HTMLElement,
	lookAction: AnimationAction,
	renderer: WebGLRenderer,
	camera: PerspectiveCamera,
	mixer: AnimationMixer,
	scene: Scene,
) {
	// Throttle scroll events using requestAnimationFrame
	if (isScrolling) return;
	isScrolling = true;

	if (animationFrameId) {
		cancelAnimationFrame(animationFrameId);
	}

	animationFrameId = requestAnimationFrame(() => {
		if (stageElement) {
			const scroll = normalizeScroll(
				window.scrollY,
				stageElement.scrollHeight,
				window.outerHeight,
			);
			camAction.time = scroll * camAction.getClip().duration;
			lookAction.time = scroll * lookAction.getClip().duration;
		}
		animate(scene, camera, mixer, renderer);
		isScrolling = false;
	});
}
// debounced resize handler to improve performance
function handleResize(
	camera: PerspectiveCamera,
	renderer: WebGLRenderer,
	mixer: AnimationMixer,
	scene: Scene,
) {
	// Debounce resize events
	if (resizeTimeout) {
		clearTimeout(resizeTimeout);
	}

	resizeTimeout = setTimeout(() => {
		const isDesktop = window.innerWidth > 768;
		let width, height;

		if (isDesktop) {
			width = window.innerWidth;
			height = window.innerHeight;
		} else {
			const visualViewport = window.visualViewport;
			width = visualViewport ? visualViewport.width : window.innerWidth;
			height = visualViewport ? visualViewport.height : window.innerHeight;
		}

		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		animate(scene, camera, mixer, renderer);
	}, 100); // 100ms debounce
}

////////////////////////////////////
//
// Setup the scene main entry point
//
////////////////////////////////////

async function setScene(
	modelName: string,
	splatName: string,
	renderer: WebGLRenderer,
	stageElement: HTMLElement,
) {
	// Initialize the scene
	let { scene, cameras, lookAt, mesh } = await loadGLTF(modelName);

	// Create SparkRenderer for splat rendering with autoUpdate enabled
	const spark = new SparkRenderer({ renderer, autoUpdate: true });
	scene.add(spark);

	// Camera setup will be done later, keep reference
	let camera: PerspectiveCamera;
	let mixer: AnimationMixer;

	let splat;
	try {
		splat = await loadSpark(splatName);
		if (splat) {
			scene.add(splat);
			// Wait for the initialized promise to resolve
			await (splat as any).initialized;
		}
	} catch (error) {
		console.warn("Splat loading failed, continuing without splat:", error);
		splat = null;
	}

	// Create points version of the mesh
	let pointsObj: Points | null = null;
	if (mesh && mesh.geometry) {
		const pointsMaterial = new PointsMaterial({
			color: 0xffffff,
			size: 0.05,
			vertexColors: true,
		});
		pointsObj = new Points(mesh.geometry, pointsMaterial);
		pointsObj.visible = false;
		scene.add(pointsObj);
	}

	//   Add lights and set camera
	let light = new AmbientLight(0xffffff);
	scene.add(light);
	scene.background = new Color(0xe8edee);

	// TODO: handle multiple cameras, possibly a drop down

	camera = cameras[0];
	if (cameras.length > 1) {
		console.log("Multiple cameras found, using the first one.");
	}

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	setRender(renderer);

	let controls = await setCtrl(camera, renderer, lookAt);
	controls.addEventListener("change", () => {
		animate(scene, camera, mixer, renderer);
	});

	let { mixer: mixerInstance, camAction, lookAction } = await setAnim(scene, camera, lookAt);
	mixer = mixerInstance;
	const stageHeight = 24 * 400; // fps * view height
	stageElement.style.height = `${stageHeight}px`;

	// Initialize camera and animation to starting position
	const initialScroll = normalizeScroll(
		window.scrollY,
		stageElement.scrollHeight,
		window.outerHeight,
	);
	camAction.time = initialScroll * camAction.getClip().duration;
	lookAction.time = initialScroll * lookAction.getClip().duration;

	// Apply the initial animation state by updating the mixer
	mixer.update(0.001);

	// Update matrices before first render
	camera.updateMatrixWorld(true);
	scene.updateMatrixWorld(true);

	// SparkRenderer processes splats asynchronously in a background worker
	// Render continuously for the first second to give it time to process
	let renderCount = 0;
	const maxRenders = 60; // ~1 second at 60fps

	function initialRenderLoop() {
		animate(scene, camera, mixer, renderer);
		renderCount++;
		if (renderCount < maxRenders) {
			requestAnimationFrame(initialRenderLoop);
		}
	}

	// Start rendering immediately
	initialRenderLoop();

	// Function to change render modes
	const setRenderMode = (mode: RenderMode) => {
		switch (mode) {
			case 'combined':
				if (mesh) mesh.visible = true;
				if (splat) splat.visible = true;
				if (pointsObj) pointsObj.visible = false;
				break;
			case 'wireframe':
				if (mesh) mesh.visible = true;
				if (splat) splat.visible = false;
				if (pointsObj) pointsObj.visible = false;
				break;
			case 'splat':
				if (mesh) mesh.visible = false;
				if (splat) splat.visible = true;
				if (pointsObj) pointsObj.visible = false;
				break;
			case 'points':
				if (mesh) mesh.visible = false;
				if (splat) splat.visible = false;
				if (pointsObj) pointsObj.visible = true;
				break;
		}
		// SparkRenderer needs multiple frames to update after visibility changes
		// Render continuously for a short period
		let modeChangeRenders = 0;
		const maxModeChangeRenders = 10; // ~160ms at 60fps

		function modeChangeRenderLoop() {
			animate(scene, camera, mixer, renderer);
			modeChangeRenders++;
			if (modeChangeRenders < maxModeChangeRenders) {
				requestAnimationFrame(modeChangeRenderLoop);
			}
		}

		modeChangeRenderLoop();
	};

	// Store event handlers for cleanup
	const scrollHandler = () => {
		handleScroll(
			camAction,
			stageElement,
			lookAction,
			renderer,
			camera,
			mixer,
			scene,
		);
	};

	const resizeHandler = () => {
		handleResize(camera, renderer, mixer, scene);
	};

	window.addEventListener("scroll", scrollHandler, { passive: true });
	window.addEventListener("resize", resizeHandler);

	return {
		scene,
		camera,
		mixer,
		camAction,
		lookAt,
		controls,
		renderer,
		splat,
		spark,
		mesh,
		setRenderMode,
		// Return cleanup function for event listeners
		cleanup: () => {
			window.removeEventListener("scroll", scrollHandler);
			window.removeEventListener("resize", resizeHandler);
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
				animationFrameId = null;
			}
			if (resizeTimeout) {
				clearTimeout(resizeTimeout);
				resizeTimeout = null;
			}
		},
	};
}

//////////////////
//
// Animation loop
//
//////////////////

function animate(
	scene: Scene,
	camera: PerspectiveCamera,
	mixer: AnimationMixer,
	renderer: WebGLRenderer,
) {
	// Update mixer only if clock delta is reasonable (not paused animations)
	const delta = clock.getDelta();
	if (delta < 0.1) { // Prevent large jumps when tab was inactive
		mixer.update(delta);
	}
	// SparkRenderer with autoUpdate handles updates automatically during render
	renderer.render(scene, camera);
}

///////////////////////////////
//
// High-Res Screenshot Capture
//
///////////////////////////////

function captureHighResScreenshot(
	scene: Scene,
	camera: PerspectiveCamera,
	renderer: WebGLRenderer,
	scale: number = 2, // Default 2x upscale
) {
	// Save current renderer size
	const originalWidth = renderer.domElement.width;
	const originalHeight = renderer.domElement.height;
	const originalPixelRatio = renderer.getPixelRatio();

	// Calculate new dimensions
	const newWidth = originalWidth * scale;
	const newHeight = originalHeight * scale;

	// Temporarily set higher resolution
	renderer.setSize(newWidth, newHeight, false);
	renderer.setPixelRatio(1); // Use 1 to avoid double-scaling

	// Update camera aspect ratio
	const originalAspect = camera.aspect;
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();

	// Render a single frame at high resolution
	renderer.render(scene, camera);

	// Get the image data
	const dataURL = renderer.domElement.toDataURL('image/png');

	// Restore original settings
	renderer.setSize(originalWidth, originalHeight, false);
	renderer.setPixelRatio(originalPixelRatio);
	camera.aspect = originalAspect;
	camera.updateProjectionMatrix();

	// Re-render at normal resolution to prevent blank screen
	renderer.render(scene, camera);

	// Trigger download
	const link = document.createElement('a');
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
	link.download = `render-${timestamp}.png`;
	link.href = dataURL;
	link.click();
}
