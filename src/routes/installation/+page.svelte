<script lang="ts">
    import { marked } from "marked";
    import ScrollView from "$lib/scroll-view.svelte";
    import mdContent from "$lib/texts/install.md?raw";
    const images = import.meta.glob("$lib/images/install/*.webp", {
        query: { enhanced: true },
    });
    const imagesArray = Object.values(images);
    // const imageSources = imagesArray.map((image) => image.name);
</script>

<div class="texts">
    {@html marked.parse(mdContent)}
</div>
<div class="container">
    <!-- <Install /> -->
    <ScrollView modelName="mesh-one-anim-24.glb" />
</div>
<div id="gallery">

    {#each imagesArray as image, i}
        <img src={image.name} alt={`image-${i}`} />
    {/each}
</div>

<!-- <Grid {imageSources} let:props gap="10px"> -->
    <!-- <div class="grid-item" style={props.style}> -->
    <!--     <img src={props.item} alt="Installation" /> -->
    <!-- </div> -->
<!-- </Grid> -->

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
    #gallery {
        display: grid;
        grid-gap: 10px;
        /* ; */
        grid-padding: 10px;
        grid-auto-flow: row dense;

    }
    #gallery img {
        max-width: 50%;
        height: auto;
        grid-auto-flow: column dense;
        border-radius: 16px;
        object-fit: contain;
        place-self: center;
    }
</style>
