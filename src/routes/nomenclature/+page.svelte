<script lang="ts">
    import WireScrollView from "$lib/wire-scroll-view.svelte";
    import { marked } from "marked";
    import mdContent from "$lib/texts/senior.md?raw";
    import Gallery from "$lib/gallery.svelte";
    import Return from "$lib/return.svelte";
    import blob from "$lib/images/blob.json";

    const images = blob.senior;

    // const images = import.meta.glob("$lib/images/senior/*.webp", {
    //     eager: true,
    //     query: { enhanced: true },
    // });
</script>

<svelte:head>
    <title>Liam Dodd - Nomenclature</title>
    <meta
        name="description"
        content="Thesis Installation reconstructed with Houdini and Light Fields"
    />
</svelte:head>
<div id="stage">
    <WireScrollView modelName="senior-tetra.glb" splatName="senior.splat" />
</div>

<div class="texts">
    <!-- {@html marked.parse(mdContent)} -->

    <h1>Nomenclature</h1>

    <h2>Seeing Is Forgetting the Name</h2>

    <h3>Senior Thesis Show</h3>

    <h3>2018</h3>
    <p>
        Language shapes how we see the world. The words we use to describe
        things affect our understanding of them. Robert Irwin's work "Seeing Is
        Forgetting the Name of the Thing One Sees" explored this connection
        between language and visual perception.
    </p>
    <p>
        "Nomenclature" is an installation that confronts the relationship
        between seeing and naming. As you move through the space, you encounter
        sights, sounds, and words that challenge how you use language.
    </p>
    <p>
        Sometimes, the installation shows familiar objects and environments, but
        removes their labels. Other times, you see abstract forms and textures
        that test the limits of your vocabulary.
    </p>
    <p>
        This disorienting experience encourages you to question assumptions and
        biases in language. It prompts you to consider how words can both
        clarify and obscure your understanding of the world.
    </p>
    <p>
        Embrace the fluidity of perception and the flexibility of language. Let
        go of rigid definitions and appreciate the beauty of the indescribable.
    </p>
    <p>
        Scroll through Nomenclature, a digital adaptation, and change your
        relationship with the words that shape your reality.
    </p>
</div>
<Gallery {images} />
<Return />

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
