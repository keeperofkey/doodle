<script lang="ts">
    // import Gsplat from "$lib/gsplat.svelte";
    // import { Vector3 } from "gsplat";
    import WireScrollView from "$lib/wire-scroll-view.svelte";
    import Gallery from "$lib/gallery.svelte";
    import Return from "$lib/return.svelte";
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

<div id="stage">
    <WireScrollView
        modelName="interior-tera-pack.glb"
        splatName="interior.splat"
    />
</div>
<!-- <Gsplat -->
<!--     modelUrl="models/interior.splat" -->
<!--     camStart={new Vector3(-8, 0, -2)} -->
<!--     camTarget={new Vector3(0, 0, -1)} -->
<!-- /> -->

<Gallery {images} />
<Return />

<!-- <div class="stage"></div> -->

<style>
    #stage {
        height: 600vh;
    }
</style>
