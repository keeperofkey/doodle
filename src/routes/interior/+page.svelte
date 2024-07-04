<script lang="ts">
    import OrbitScroll from "$lib/orbit-scroll.svelte";
    import Gallery from "$lib/gallery.svelte";
    // import blob from "$lib/images/blob.json";
    // const images = blob.interior;

    const images = import.meta.glob("$lib/images/interior/*.avif", {
        eager: false,
        query: { enhanced: true },
    });
</script>

<svelte:head>
    <title>Liam Dodd - Interior</title>
    <meta name="description" content="Gaussian Splatting" />
</svelte:head>

<OrbitScroll modelName="interior.glb" splatName="interior.splat" />

<Gallery {images} />
