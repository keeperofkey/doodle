<script lang="ts">
    import Gallery from "$lib/gallery.svelte";
    import ScrollOrbit from "$lib/scroll-orbit.svelte";

    import { interior } from "$lib/images.json";

    const images = interior.data;
    // const details = info.install.data;
    // let desc: string[] = [];
    // details.forEach((element) => {
    //     desc.push(element.description);
    // });
    // // import blob from "$lib/images/blob.json";
    // // const images = blob.interior;
    //
    // // const images = import.meta.glob("$lib/images/interior/*.avif");
    // const images = import.meta.glob("$lib/images/interior/*.avif", {
    //     eager: true,
    //     query: { enhanced: true },
    // });
</script>

<svelte:head>
    <title>Liam Dodd - Interior</title>
    <meta name="description" content="Gaussian Splatting" />
</svelte:head>

<ScrollOrbit modelName="interior.glb" splatName="interior.splat" />

<Gallery {images} />
