<script lang="ts">
    import WireScrollView from "$lib/wire-scroll-view.svelte";
    import { marked } from "marked";
    import mdContent from "$lib/texts/senior.md?raw";
    import Gallery from "$lib/gallery.svelte";
    import blob from "$lib/images/blob.json";

    const images = blob.senior;

    // const images = import.meta.glob("$lib/images/senior/*.webp", {
    //     eager: true,
    //     query: { enhanced: true },
    // });
</script>

<svelte:head>
    <title>Liam Dodd - Nomenclature</title>
    <meta
        name="description"
        content="Thesis Installation reconstructed with Houdini and Light Fields"
    />
</svelte:head>
<div class="texts">
    {@html marked.parse(mdContent)}
</div>

<div id="stage">
    <WireScrollView modelName="senior-tetra.glb" splatName="senior.splat" />
</div>

<Gallery {images} />

<style>
    #stage {
        height: 600dvh;
    }
    .texts {
        position: absolute;
        top: 4rem;
        right: 0;
        margin: 1rem;
        padding: 0.3rem 1rem;
        background-color: #ffffffcc;
        border-radius: 1rem;
        max-width: 30%;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    }
</style>
