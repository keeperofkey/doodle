<script lang="ts">
import { WebGLRenderer } from "three";
import { setScene } from "./utils";
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

onMount(async() => {
	renderer = new WebGLRenderer({
		antialias: false,
		canvas: canvas,
	});
	const sceneData = await setScene(modelName, splatName, renderer, stageElement);
	controls = sceneData.controls;
	splat = sceneData.splat;
	spark = sceneData.spark;
});
onDestroy(() => {
	renderer.dispose();
	if (splat) splat.dispose();
	canvas.remove();
	controls.dispose();
});
</script>

<canvas bind:this={canvas} class="fixed top-0 w-full h-full"></canvas>

<div bind:this={stageElement} class="h-dvh">
    <button
        class="grid grid-col-2 place-items-center grid-flow-col bg-opacity-50 fixed top-4 right-4 font-bold text-xl p-2 w-24 h-12 z-10 self-center bg-slate-100 border-2 rounded-lg hover:bg-opacity-90 active:shadow-inner shadow-lg"
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
    <div class="fixed bottom-0 grid place-items-center grid-cols-3 w-full">
        <button on:click={scroll} class="hover:text-orange-500 p-2 col-start-2 fa-solid fa-angles-down" aria-label='Scroll Down'></button>
    </div>
</div>
