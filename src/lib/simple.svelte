<script lang="ts">
    import { WebGLRenderer } from "three";
    import { setScene } from "./utils";
    import { onMount } from "svelte";

    export let modelName: string;
    export let splatName: string;
    let stageElement: HTMLElement;
    let controlsActive = false;
    let renderer = new WebGLRenderer({
        antialias: true,
    });
    function toggle() {
        controlsActive = !controlsActive;
        if (controlsActive) {
            renderer.domElement.style.touchAction = "none";
            renderer.domElement.style.zIndex = "0";
        } else {
            renderer.domElement.style.touchAction = "auto";
            renderer.domElement.style.zIndex = "-1";
            window.scrollBy(0, 1);
        }
    }

    onMount(() => {
        console.log("Mounted");
        setScene(modelName, splatName, renderer, stageElement);
    });
</script>

<div bind:this={stageElement} style="height: 600dvh;">
    <button
        class="fixed top-4 right-4 font-bold text-xl p-2 w-24 h-12 z-10 self-center bg-slate-100 border-2 rounded-lg hover:bg-slate-100 hover:shadow-inner shadow-lg"
        class:border-black={!controlsActive}
        class:border-dashed={controlsActive}
        on:click={toggle}
    >
        {controlsActive ? "\u{1F4F9} \u{1F513}" : "\u{1F4F9}  \u{1F512}"}
    </button>
</div>
