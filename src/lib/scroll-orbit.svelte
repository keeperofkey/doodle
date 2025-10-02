<script lang="ts">
import { WebGLRenderer } from "three";
import { setScene } from "./utils";
import type { RenderMode } from "./types";
import { onDestroy, onMount } from "svelte";

export let modelName: string;
export let splatName: string;

let stageElement: HTMLElement;
let controlsActive = false;
let renderer: WebGLRenderer;
let canvas: HTMLCanvasElement;
let controls: any;
let splat: any;
let spark: any;
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
	if (setRenderMode) {
		setRenderMode(mode);
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

        <!-- Render Mode Controls -->
        <div class="bg-slate-100 bg-opacity-50 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div class="text-xs font-semibold mb-2 text-gray-700">Render Mode</div>
            <div class="flex flex-col gap-2">
                <button
                    on:click={() => changeRenderMode('combined')}
                    class="px-3 py-1.5 text-sm rounded transition-colors"
                    class:bg-blue-500={currentRenderMode === 'combined'}
                    class:text-white={currentRenderMode === 'combined'}
                    class:bg-white={currentRenderMode !== 'combined'}
                    class:hover:bg-gray-200={currentRenderMode !== 'combined'}
                    aria-label="Combined render mode"
                >
                    Combined
                </button>
                <button
                    on:click={() => changeRenderMode('wireframe')}
                    class="px-3 py-1.5 text-sm rounded transition-colors"
                    class:bg-blue-500={currentRenderMode === 'wireframe'}
                    class:text-white={currentRenderMode === 'wireframe'}
                    class:bg-white={currentRenderMode !== 'wireframe'}
                    class:hover:bg-gray-200={currentRenderMode !== 'wireframe'}
                    aria-label="Wireframe render mode"
                >
                    Wireframe
                </button>
                <button
                    on:click={() => changeRenderMode('splat')}
                    class="px-3 py-1.5 text-sm rounded transition-colors"
                    class:bg-blue-500={currentRenderMode === 'splat'}
                    class:text-white={currentRenderMode === 'splat'}
                    class:bg-white={currentRenderMode !== 'splat'}
                    class:hover:bg-gray-200={currentRenderMode !== 'splat'}
                    aria-label="Splat render mode"
                >
                    Splat
                </button>
                <button
                    on:click={() => changeRenderMode('points')}
                    class="px-3 py-1.5 text-sm rounded transition-colors"
                    class:bg-blue-500={currentRenderMode === 'points'}
                    class:text-white={currentRenderMode === 'points'}
                    class:bg-white={currentRenderMode !== 'points'}
                    class:hover:bg-gray-200={currentRenderMode !== 'points'}
                    aria-label="Points render mode"
                >
                    Points
                </button>
            </div>
        </div>
    </div>

    <div class="fixed bottom-0 grid place-items-center grid-cols-3 w-full">
        <button on:click={scroll} class="hover:text-orange-500 p-2 col-start-2 fa-solid fa-angles-down" aria-label='Scroll Down'></button>
    </div>
</div>
