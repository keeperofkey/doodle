<script lang="ts">
    // import { marked } from "marked";
    import WireScrollView from "$lib/wire-scroll-view.svelte";
    // import mdContent from "$lib/texts/install.md?raw";
    import Gallery from "$lib/gallery.svelte";
    import Return from "$lib/return.svelte";
    import blob from "$lib/images/blob.json";

    const images = blob.install;

    // const images = import.meta.glob("$lib/images/install/*.webp", {
    //     eager: true,
    //     query: { enhanced: true },
    // });
    // const imageSources = imagesArray.map((image) => image.name);
</script>

<svelte:head>
    <title>Liam Dodd - Mind Your Head</title>
    <meta name="description" content="Art and code installation" />
</svelte:head>

<!-- <div class="texts"> -->
<!--     {@html marked.parse(mdContent)} -->
<!-- </div> -->

<main class="texts">
    <h1>Mind Your Head</h1>

    <!-- <p> -->
    <!--     "Mind Your Head" is an immersive art installation that invites visitors -->
    <!--     to embark on a meditative journey through a captivating interplay of -->
    <!--     natural forms and architectural elements. Crafted from rough-cut pine, -->
    <!--     the installation unfolds as a series of planks resting against the wall, -->
    <!--     gradually evolving into a sprawling, organic structure that encompasses -->
    <!--     the entire space. -->
    <!-- </p> -->
    <!---->
    <!-- <p> -->
    <!--     At first glance, the installation appears as a simple arrangement of -->
    <!--     wooden planks, but as visitors move through the space, they are -->
    <!--     enveloped by a wave-like form that undulates and branches out, -->
    <!--     reminiscent of the intricate patterns found in nature. The rough texture -->
    <!--     of the pine adds a tactile dimension, inviting visitors to trace the -->
    <!--     grain with their fingertips and connect with the raw, earthy essence of -->
    <!--     the material. -->
    <!-- </p> -->
    <!---->
    <!-- <p> -->
    <!--     As the installation expands, it takes on a tree-like quality, with -->
    <!--     branches reaching upwards and outwards, creating a canopy that filters -->
    <!--     the surrounding light. -->
    <!-- </p> -->
    <!---->
    <!-- <p> -->
    <!--     "Mind Your Head" encourages visitors to slow down, breathe deeply, and -->
    <!--     immerse themselves in the meditative space created by the installation. -->
    <!--     The undulating forms and organic shapes invite contemplation, prompting -->
    <!--     visitors to reflect on their own connection to the natural world and the -->
    <!--     rhythms that govern our lives. -->
    <!-- </p> -->
    <!---->
    <!-- <p> -->
    <!--     Through this captivating fusion of art, architecture, and nature, "Mind -->
    <!--     Your Head" offers a sanctuary for introspection and a reminder to be -->
    <!--     mindful of the present moment, to embrace the beauty that surrounds us. -->
    <!-- </p> -->
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
    <p style="text-align: center;"></p>
</main>
<div id="stage">
    <WireScrollView modelName="install-tetra.glb" splatName="install.splat" />
</div>

<Gallery {images} />
<Return />

<style>
    #stage {
        height: 600dvh;
        scroll-behavior: smooth;
        scroll-snap-type: y mandatory;
        pointer-events: auto;
    }
    .texts {
        position: absolute;
        top: 4rem;
        margin: 1rem;
        padding: 1rem;
        background-color: #ffffffcc;
        border-radius: 1rem;
        /* max-width: 25%; */
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    }
    h1 {
        font-size: 2rem;
        padding: 0;
        margin: 0;
    }
</style>
