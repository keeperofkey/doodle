<script lang="ts">
    // import blob from "$lib/images/blob.json";
    import WireScrollView from "$lib/wire-scroll-view.svelte";
    import Gallery from "$lib/gallery.svelte";
    import Return from "$lib/return.svelte";

    // const images = blob.joya;

    const images = import.meta.glob("$lib/images/cans/*.webp", {
        eager: true,
        query: { enhanced: true },
    });
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
<div id="stage">
    <WireScrollView modelName="joya.glb" splatName="joya.splat" />
</div>
<main class="texts">
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
<Return />

<!-- <Overlay {images} {text} /> -->

<style>
    #stage {
        height: 600dvh;
    }
    .texts {
        margin: 1rem;
        padding: 0.3rem 1rem;
        background-color: #ffffffcc;
        border-radius: 1rem;
        /* max-width: 30%; */
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    }
</style>
