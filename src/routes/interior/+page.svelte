<script lang="ts">
    import Gsplat from "$lib/gsplat.svelte";
    import { Vector3 } from "gsplat";
    import Gallery from "$lib/gallery.svelte";
    import blob from "$lib/images/blob.json";
    const images = blob.interior;
    // const images = import.meta.glob("$lib/images/interior/*.webp", {
    //     eager: true,
    //     query: { enhanced: true },
    // });
</script>

<svelte:head>
    <title>Liam Dodd - Interior</title>
    <meta name="description" content="Gaussian Splatting" />
</svelte:head>

<div class="container"></div>
<Gsplat
    modelUrl="models/splat.splat"
    camStart={new Vector3(-8, 0, -2)}
    camTarget={new Vector3(0, 0, -1)}
/>

<Gallery {images} />
<div class="stage"></div>

<style>
    .container {
        height: 80vh;
    }
    .stage {
        height: 100vh;
    }
</style>
