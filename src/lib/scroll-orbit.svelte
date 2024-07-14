<script lang="ts">
    import { WebGLRenderer } from "three";
    import { setScene } from "./utils";
    import { onDestroy, onMount } from "svelte";
    import { ctrlStore } from "./store";

    export let modelName: string;
    export let splatName: string;

    let stageElement: HTMLElement;
    let controlsActive = false;
    ctrlStore.subscribe((value: boolean) => (controlsActive = value));
    let renderer: WebGLRenderer;
    let canvas: HTMLCanvasElement;
    let viewer: any;
    function toggle() {
        ctrlStore.update((value: boolean) => !value);
        if (controlsActive) {
            renderer.domElement.style.touchAction = "none";
            renderer.domElement.style.zIndex = "0";
        } else {
            renderer.domElement.style.touchAction = "auto";
            renderer.domElement.style.zIndex = "-1";
        }
        window.scrollBy(0, 1);
    }

    onMount(() => {
        renderer = new WebGLRenderer({
            antialias: true,
            canvas: canvas,
        });
        setScene(modelName, splatName, renderer, stageElement).then(
            (sceneData) => {
                viewer = sceneData.viewer;
            },
        );
    });
    onDestroy(() => {
        renderer.dispose();
        renderer.clear();
        // renderer.domElement.remove();
        viewer.dispose();
    });
</script>

<canvas bind:this={canvas} class="fixed -z-10 top-0 w-full h-full" />

<div bind:this={stageElement}>
    <button
        class="bg-opacity-90 fixed top-4 right-4 font-bold text-xl p-2 w-24 h-12 z-10 self-center bg-slate-200 border-2 rounded-lg hover:bg-slate-100 hover:shadow-inner shadow-lg"
        class:border-black={!controlsActive}
        class:border-dashed={controlsActive}
        on:click={toggle}
    >
        {controlsActive ? "\u{1F4F9} \u{1F513}" : "\u{1F4F9}  \u{1F512}"}
    </button>
</div>
