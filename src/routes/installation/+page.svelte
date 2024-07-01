<script lang="ts">
    import WireScrollView from "$lib/wire-scroll-view.svelte";
    import Gallery from "$lib/gallery.svelte";

    // import blob from "$lib/images/blob.json";
    // const images = blob.install;

    const images = import.meta.glob("$lib/images/install/*.avif", {
        eager: true,
        query: { enhanced: true },
    });
</script>

<svelte:head>
    <title>Liam Dodd - Mind Your Head</title>
    <meta name="description" content="Art and code installation" />
</svelte:head>

<div id="stage">
    <WireScrollView modelName="install-tetra.glb" splatName="install.splat" />
</div>
<main class="px-2 max-w-prose m-6 bg-slate-100 bg-opacity-75 rounded-2xl">
    <h1>Mind Your Head</h1>
    <p>
        "Mind Your Head" is an art installation that invites you to explore the
        interplay of natural forms and architecture. Made from rough-cut pine,
        it starts as planks against the wall, gradually evolving into an organic
        structure filling the space.
    </p>

    <p>
        At first, it seems like a simple arrangement of wooden planks. But as
        you move through, you're enveloped by a wave-like form that undulates
        and branches out, reminiscent of patterns in nature. The rough texture
        invites you to trace the grain and connect with the raw, earthy essence
        of the material.
    </p>

    <p>
        As it expands, it takes on a tree-like quality, with branches reaching
        upwards and outwards, creating a canopy that filters the surrounding
        light.
    </p>

    <p>
        "Mind Your Head" encourages you to slow down, breathe deeply, and
        immerse yourself in the meditative space. The undulating forms and
        organic shapes invite contemplation, prompting you to reflect on your
        connection to the natural world and the rhythms that govern our lives.
    </p>

    <p>
        Through this fusion of art, architecture, and nature, "Mind Your Head"
        offers a sanctuary for introspection and a reminder to be mindful of the
        present moment, to embrace the beauty that surrounds us.
    </p>
</main>

<Gallery {images} />

<style>
    #stage {
        height: 600dvh;
        scroll-behavior: smooth;
        scroll-snap-type: y mandatory;
        pointer-events: auto;
    }
</style>
