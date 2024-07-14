<script lang="ts">
    import Gallery from "$lib/gallery.svelte";
    import ScrollOrbit from "$lib/scroll-orbit.svelte";
    import info from "$lib/images";

    const details = info.install.data;
    let desc: string[] = [];
    details.forEach((element) => {
        desc.push(element.description);
    });

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
<ScrollOrbit modelName="joya.glb" splatName="joya.splat" />
<main
    class="grid items-center place-self-center grid-cols-1 md:grid-cols-2 md:grid-rows-3 grid-flow-row z-10 bottom-0 p-6 w-auto m-4 bg-slate-100 bg-opacity-85 rounded-2xl"
>
    <h1>Joya: Artist in Residence</h1>
    <p class="max-w-prose p-2">
        In Vélez-Blanco, a region known for its fertile soil and historical
        significance, a natural phenomenon has emerged due to increased
        torrential rainfall caused by global warming. A crevasse has formed,
        sculpted by the force of the water, revealing an unusual sight within
        its depths.
    </p>
    <p class="max-w-prose p-2">
        Castings of discarded cans have been reshaped by the relentless flow,
        their forms twisted and contorted into intricate shapes by the very soil
        that gives Vélez-Blanco its name. These unexpected works of art serve as
        a reminder of the delicate balance between human activity and the
        natural world.
    </p>
    <p class="max-w-prose p-2">
        The crevasse and its can castings stand as a stark warning of the
        consequences of our actions on the environment, while simultaneously
        showcasing nature's resilience and ability to adapt and transform even
        the most mundane objects into something remarkable.
    </p>
</main>

<Gallery {images} {desc} />
