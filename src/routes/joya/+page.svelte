<script lang="ts">
    import Gsplat from "$lib/gsplat.svelte";
    import { Vector3 } from "gsplat";
    import Overlay from "$lib/overlay.svelte";

    const images = import.meta.glob("$lib/images/cans/*.webp", {
        eager: true,
        query: { enhanced: true },
    });
    // console.log(images);
    const text = [
        "Images from an artist residency in Spain",
        "Castings made from varying mixtures of earth and cement using cans and debris",
        "Exploring the relationship between the natural and artificial",
        "Imaginary artifacts",
    ];
</script>

<Gsplat
    modelUrl="models/cans.splat"
    camStart={new Vector3(0, 0, 15)}
    camTarget={new Vector3(0, 0, 0)}
/>

<Overlay {images} {text} />

<style>
</style>
