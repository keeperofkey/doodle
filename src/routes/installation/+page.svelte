<script lang="ts">
    import CssOrbit from "$lib/css-orbit.svelte";
    import ScrollOrbit from "$lib/scroll-orbit.svelte";
    import { install } from "$lib/images.json";
    import { browser } from "$app/environment";

    const images = install.data;
    
    // Mobile-friendly ellipse rotations
    let isMobile = false;
    if (browser) {
        isMobile = window.innerWidth < 768;
    }
    
    const rotationY = isMobile ? -30 : -60;  // Less aggressive Y rotation on mobile
    const rotationZ = isMobile ? -30 : -60;  // Less aggressive Z rotation on mobile

    // import blob from "$lib/blob.json";
    // const images = blob.install;

    // const images = import.meta.glob("$lib/images/install/*.avif", {
    //     eager: true,
    //     query: { enhanced: true },
    // });
    // const images = import.meta.glob("$lib/images/install/*.avif");
</script>

<svelte:head>
    <title>Liam Dodd - Mind Your Head</title>
    <meta name="description" content="Art and code installation" />
</svelte:head>

<ScrollOrbit modelName="install.glb" splatName="install.splat" />
<main
    class="grid items-center place-self-center grid-cols-1 md:grid-cols-2 md:grid-rows-3 grid-flow-row z-10 bottom-0 p-6 w-auto m-4 bg-slate-100 bg-opacity-85 rounded-2xl"
>
    <h1 class="text-center">Mind Your Head</h1>
    <p class="max-w-prose p-2">
        "Mind Your Head" is an art installation that invites you to explore the
        interplay of natural forms and architecture. Made from rough-cut pine,
        it starts as planks against the wall, gradually evolving into an organic
        structure filling the space.
    </p>

    <p class="max-w-prose p-2">
        At first, it seems like a simple arrangement of wooden planks. But as
        you move through, you're enveloped by a wave-like form that undulates
        and branches out, reminiscent of patterns in nature. The rough texture
        invites you to trace the grain and connect with the raw, earthy essence
        of the material.
    </p>

    <p class="max-w-prose p-2">
        As it expands, it takes on a tree-like quality, with branches reaching
        upwards and outwards, creating a canopy that filters the surrounding
        light.
    </p>

    <p class="max-w-prose p-2">
        "Mind Your Head" encourages you to slow down, breathe deeply, and
        immerse yourself in the meditative space. The undulating forms and
        organic shapes invite contemplation, prompting you to reflect on your
        connection to the natural world and the rhythms that govern our lives.
    </p>

    <p class="max-w-prose p-2">
        Through this fusion of art, architecture, and nature, "Mind Your Head"
        offers a sanctuary for introspection and a reminder to be mindful of the
        present moment, to embrace the beauty that surrounds us.
    </p>
</main>

<CssOrbit {images} {rotationY} {rotationZ} />
