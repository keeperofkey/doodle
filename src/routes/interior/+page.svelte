<script lang="ts">
    import WireScrollView from "$lib/wire-scroll-view.svelte";
    import GalleryBlob from "$lib/gallery-blob.svelte";
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

<GalleryBlob {images} />
<Return />

<style>
    #stage {
        height: 600vh;
    }
</style>
