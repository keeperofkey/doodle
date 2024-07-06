<script lang="ts">
    import OrbitScroll from "$lib/orbit-scroll.svelte";
    import Gallery from "$lib/gallery.svelte";

    // import blob from "$lib/images/blob.json";
    // const images = blob.joya;
    //
    // const images = import.meta.glob("$lib/images/cans/*.webp");
    const images = import.meta.glob("$lib/images/cans/*.webp", {
        eager: true,
        query: { enhanced: true },
    });
</script>

<svelte:head>
    <title>Liam Dodd - Joya: Artist in Residence</title>
    <meta name="description" content="Images and model from Joya:AiR" />
</svelte:head>
<OrbitScroll modelName="joya.glb" splatName="joya.splat" />
<main
    class="relative bottom-0 z-10 px-2 max-w-prose m-6 bg-slate-100 bg-opacity-75 rounded-2xl"
>
    <h1>Joya: Artist in Residence</h1>
    <p>
        In Vélez-Blanco, a region known for its fertile soil and historical
        significance, a natural phenomenon has emerged due to increased
        torrential rainfall caused by global warming. A crevasse has formed,
        sculpted by the force of the water, revealing an unusual sight within
        its depths.
    </p>
    <p>
        Castings of discarded cans have been reshaped by the relentless flow,
        their forms twisted and contorted into intricate shapes by the very soil
        that gives Vélez-Blanco its name. These unexpected works of art serve as
        a reminder of the delicate balance between human activity and the
        natural world.
    </p>
    <p>
        The crevasse and its can castings stand as a stark warning of the
        consequences of our actions on the environment, while simultaneously
        showcasing nature's resilience and ability to adapt and transform even
        the most mundane objects into something remarkable.
    </p>
</main>

<Gallery {images} />
