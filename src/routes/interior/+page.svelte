<script lang="ts">
    import Gsplat from "$lib/gsplat.svelte";
    import { Vector3 } from "gsplat";
    import Gallery from "$lib/gallery.svelte";

    const images = import.meta.glob("$lib/images/interior/*.webp", {
        eager: true,
        query: { enhanced: true },
    });
</script>

<svelte:head>
    <title>Liam Dodd - Interior</title>
    <meta name="description" content="Gaussian Splatting" />
</svelte:head>

<div class="container">
    <Gsplat
        modelUrl="models/splat.splat"
        camStart={new Vector3(-8, 0, -2)}
        camTarget={new Vector3(0, 0, -1)}
    />
</div>

<Gallery {images} />

<style>
    .container {
        height: 100vh;
    }
</style>
