<script lang="ts">
    import { marked } from "marked";
    import ScrollView from "$lib/scroll-view.svelte";
    import mdContent from "$lib/texts/install.md?raw";
    import Gallery from "$lib/gallery.svelte";

    const images = import.meta.glob("$lib/images/install/*.webp", {
        query: { enhanced: true },
    });
    // const imageSources = imagesArray.map((image) => image.name);
</script>

<div class="texts">
    {@html marked.parse(mdContent)}
</div>

<div class="container">
    <ScrollView modelName="mesh-one-anim-24.glb" />
</div>

<Gallery {images} />

<style>
    .container {
        height: 600dvh;
        scroll-behavior: smooth;
        scroll-snap-type: y mandatory;
        pointer-events: auto;
    }
    .texts {
        position: absolute;
        bottom: 0;
        margin: 1rem;
        padding: 1rem;
        background-color: #ffffffcc;
        border-radius: 1rem;
        max-width: 25%;
    }
    /* :global(img) { */
    /*     opacity: 0.9; */
    /*     transition: all 0.2s; */
    /* } */
    /* :global(img):hover { */
    /*     opacity: 1; */
    /*     transform: scale(1.04); */
    /* } */
</style>
