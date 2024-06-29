<script lang="ts">
    // import Gsplat from "$lib/gsplat.svelte";
    import { Vector3 } from "gsplat";
    // import Overlay from "$lib/overlay.svelte";
    import blob from "$lib/images/blob.json";
    import WireScrollView from "$lib/wire-scroll-view.svelte";
    import Gallery from "$lib/gallery.svelte";
    // import Spaced from "$lib/spaced.svelte";

    const images = blob.joya;

    // const images = import.meta.glob("$lib/images/cans/*.webp", {
    //     eager: true,
    //     query: { enhanced: true },
    // });
    // console.log(images);
    const text = [
        "Images from an artist residency in Spain",
        "Castings made from varying mixtures of earth and cement using cans and debris",
        "Exploring the relationship between the natural and artificial",
        "Imaginary artifacts",
    ];
</script>

<svelte:head>
    <title>Liam Dodd - Joya: Artist in Residence</title>
    <meta name="description" content="Images and model from Joya:AiR" />
</svelte:head>
<!-- <Gsplat -->
<!--     modelUrl="models/cans.splat" -->
<!--     camStart={new Vector3(0, 0, 15)} -->
<!--     camTarget={new Vector3(0, 0, 0)} -->
<!-- /> -->
<!-- <Spaced {images} {text} /> -->
<div class="stage">
    <WireScrollView modelName="joya.glb" splatName="joya.splat" />
</div>

<Gallery {images} />

<!-- <Overlay {images} {text} /> -->

<style>
    .stage {
        width: 100%;
        height: 100dvh;
        top: 0;
        left: 0;
    }
</style>
