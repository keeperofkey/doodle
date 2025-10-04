<script lang="ts">
import { WebGLRenderer } from "three";
import { setScene, captureHighResScreenshot } from "./utils";
import type { RenderMode } from "./types";
import { onDestroy, onMount } from "svelte";

export let modelName: string;
export let splatName: string;

let stageElement: HTMLElement;
let controlsActive = false;
let renderModeDropdownOpen = false;
let renderer: WebGLRenderer;
let canvas: HTMLCanvasElement;
let controls: any;
let splat: any;
let spark: any;
let scene: any;
let camera: any;
let cleanup: (() => void) | null = null;
let setRenderMode: ((mode: RenderMode) => void) | null = null;
let currentRenderMode: RenderMode = 'combined';

function scroll() {
	window.scrollBy(0, window.innerHeight * 2);
}

function toggle() {
	controlsActive = !controlsActive;
	if (controlsActive) {
		controls.enabled = true;
		renderer.domElement.style.touchAction = "none";
		renderer.domElement.style.zIndex = "0";
	} else {
		controls.enabled = false;
		renderer.domElement.style.touchAction = "auto";
		renderer.domElement.style.zIndex = "-1";
		window.scrollBy(0, 1);
	}
}

function changeRenderMode(mode: RenderMode) {
	currentRenderMode = mode;
	renderModeDropdownOpen = false;
	if (setRenderMode) {
		setRenderMode(mode);
	}
}

function toggleRenderModeDropdown() {
	renderModeDropdownOpen = !renderModeDropdownOpen;
}

function capturePhoto() {
	if (scene && camera && renderer) {
		captureHighResScreenshot(scene, camera, renderer, 2); // 2x resolution
	}
}

onMount(async() => {
	renderer = new WebGLRenderer({
		antialias: false,
		canvas: canvas,
	});
	const sceneData = await setScene(modelName, splatName, renderer, stageElement);
	controls = sceneData.controls;
	splat = sceneData.splat;
	spark = sceneData.spark;
	scene = sceneData.scene;
	camera = sceneData.camera;
	cleanup = sceneData.cleanup;
	setRenderMode = sceneData.setRenderMode;
});
onDestroy(() => {
	// Call cleanup function for event listeners and timeouts
	if (cleanup) cleanup();
	
	// Dispose Three.js objects with null checks
	if (renderer) {
		renderer.dispose();
	}
	if (splat && typeof splat.dispose === 'function') {
		splat.dispose();
	}
	if (canvas && canvas.parentNode) {
		canvas.remove();
	}
	if (controls && typeof controls.dispose === 'function') {
		controls.dispose();
	}
});
</script>

<canvas bind:this={canvas} class="fixed top-0 w-full h-full"></canvas>

<div bind:this={stageElement} class="h-dvh">
    <!-- Controls container -->
    <div class="fixed top-4 right-4 z-10 flex flex-col gap-3">
        <!-- Camera lock/unlock button -->
        <button
            class="grid grid-col-2 place-items-center grid-flow-col bg-opacity-50 backdrop-blur-sm font-bold text-xl p-2 w-24 h-12 self-center bg-slate-100 border-2 rounded-lg hover:bg-opacity-90 active:shadow-inner shadow-lg"
            class:border-neutral-500={!controlsActive}
            class:border-dashed={controlsActive}
            on:click={toggle}
            aria-label="Lock and Unlock Camera"
        >
            <span>&#x1F4F9;</span>
            {#if controlsActive}
                <span class="fa-solid fa-unlock"></span>
            {:else}
                <span class="fa-solid fa-lock"></span>
            {/if}
        </button>

        <!-- Photo Capture & Render Mode Buttons -->
        <div class="relative flex gap-3">
            <!-- Photo Capture Button -->
            <button
                class="grid place-items-center bg-opacity-50 backdrop-blur-sm font-bold text-xl p-2 w-12 h-12 bg-slate-100 border-2 border-neutral-500 rounded-lg hover:bg-opacity-90 active:shadow-inner shadow-lg"
                on:click={capturePhoto}
                aria-label="Capture High-Resolution Screenshot"
            >
                <span class="fa-solid fa-camera"></span>
            </button>

            <!-- Render Mode Button -->
            <button
                class="grid place-items-center bg-opacity-50 backdrop-blur-sm font-bold text-xl p-2 w-12 h-12 bg-slate-100 border-2 border-neutral-500 rounded-lg hover:bg-opacity-90 active:shadow-inner shadow-lg"
                class:border-dashed={renderModeDropdownOpen}
                on:click={toggleRenderModeDropdown}
                aria-label="Render Mode Selector"
            >
                {#if currentRenderMode === 'combined'}
                    <span class="fa-solid fa-eye"></span>
                {:else if currentRenderMode === 'wireframe'}
                    <span>󰆧</span>
                {:else if currentRenderMode === 'splat'}
                    <span class="fa-solid fa-burst"></span>
                {:else if currentRenderMode === 'points'}
                    <span>⦿</span>
                {/if}
            </button>

            {#if renderModeDropdownOpen}
                <div class="absolute top-14 right-0 bg-slate-100 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden min-w-[8rem] z-20">
                    <button
                        on:click={() => changeRenderMode('combined')}
                        class="w-full px-4 py-2 text-sm text-left transition-colors hover:bg-blue-500 hover:text-white flex items-center gap-2"
                        class:bg-blue-500={currentRenderMode === 'combined'}
                        class:text-white={currentRenderMode === 'combined'}
                        aria-label="Combined render mode"
                    >
                        <span class="fa-solid fa-eye"></span>
                        <span>Combined</span>
                    </button>
                    <button
                        on:click={() => changeRenderMode('wireframe')}
                        class="w-full px-4 py-2 text-sm text-left transition-colors hover:bg-blue-500 hover:text-white flex items-center gap-2"
                        class:bg-blue-500={currentRenderMode === 'wireframe'}
                        class:text-white={currentRenderMode === 'wireframe'}
                        aria-label="Wireframe render mode"
                    >
                        <span>󰆧</span>
                        <span>Wireframe</span>
                    </button>
                    <button
                        on:click={() => changeRenderMode('splat')}
                        class="w-full px-4 py-2 text-sm text-left transition-colors hover:bg-blue-500 hover:text-white flex items-center gap-2"
                        class:bg-blue-500={currentRenderMode === 'splat'}
                        class:text-white={currentRenderMode === 'splat'}
                        aria-label="Splat render mode"
                    >
                        <span class="fa-solid fa-burst"></span>
                        <span>Splat</span>
                    </button>
                    <button
                        on:click={() => changeRenderMode('points')}
                        class="w-full px-4 py-2 text-sm text-left transition-colors hover:bg-blue-500 hover:text-white flex items-center gap-2"
                        class:bg-blue-500={currentRenderMode === 'points'}
                        class:text-white={currentRenderMode === 'points'}
                        aria-label="Points render mode"
                    >
                        <span>⦿</span>
                        <span>Points</span>
                    </button>
                </div>
            {/if}
        </div>
    </div>

    <div class="fixed bottom-0 grid place-items-center grid-cols-3 w-full">
        <button on:click={scroll} class="hover:text-orange-500 p-2 col-start-2 fa-solid fa-angles-down" aria-label='Scroll Down'></button>
    </div>
</div>
