<script lang="ts">
    import { marked } from "marked";
    import ScrollView from "$lib/scroll-view.svelte";
    import mdContent from "$lib/texts/install.md?raw";
    import Gallery from "$lib/gallery.svelte";

    const images = import.meta.glob("$lib/images/install/*.webp", {
        eager: true,
        query: { enhanced: true },
    });
    // const imageSources = imagesArray.map((image) => image.name);
</script>

<div class="texts">
    {@html marked.parse(mdContent)}
</div>

<div id="stage">
    <ScrollView modelName="mesh-one-anim-24.glb" />
</div>

<Gallery {images} />

<style>
    #stage {
        height: 600dvh;
        scroll-behavior: smooth;
        scroll-snap-type: y mandatory;
        pointer-events: auto;
    }
    .texts {
        position: absolute;
        top: 4rem;
        margin: 1rem;
        padding: 0.3rem 1rem;
        background-color: #ffffffcc;
        border-radius: 1rem;
        max-width: 25%;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    }
</style>
