<script lang="ts">
    import ScrollOrbit from "$lib/scroll-orbit.svelte";
    import Gallery from "$lib/gallery.svelte";
    import { senior } from "$lib/images.json";
    const images = senior.data;
    // import info from "$lib/images";
    //
    // const details = info.install.data;
    // let desc: string[] = [];
    // details.forEach((element) => {
    //     desc.push(element.description);
    // });
    // import blob from "$lib/images/blob.json";
    // const images = blob.senior;

    // const images = import.meta.glob("$lib/images/senior/*.webp");
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
<ScrollOrbit modelName="senior.glb" splatName="senior.splat" />

<main
    class="grid items-center place-self-center grid-cols-1 md:grid-cols-2 md:grid-rows-3 grid-flow-row z-10 bottom-0 p-6 w-auto m-4 bg-slate-100 bg-opacity-85 rounded-2xl"
>
    <h1 class="text-center">Nomenclature</h1>

    <h2 class="text-center">Seeing Is Forgetting the Name</h2>

    <p class="max-w-prose p-2">
        Language shapes how we see the world. The words we use to describe
        things affect our understanding of them. Robert Irwin's work "Seeing Is
        Forgetting the Name of the Thing One Sees" explored this connection
        between language and visual perception.
    </p>
    <p class="max-w-prose p-2">
        "Nomenclature" is an installation that confronts the relationship
        between seeing and naming. As you move through the space, you encounter
        sights, sounds, and words that challenge how you use language.
    </p>
    <p class="max-w-prose p-2">
        Sometimes, the installation shows familiar objects and environments, but
        removes their labels. Other times, you see abstract forms and textures
        that test the limits of your vocabulary.
    </p>
    <p class="max-w-prose p-2">
        This disorienting experience encourages you to question assumptions and
        biases in language. It prompts you to consider how words can both
        clarify and obscure your understanding of the world.
    </p>
    <p class="max-w-prose p-2">
        Embrace the fluidity of perception and the flexibility of language. Let
        go of rigid definitions and appreciate the beauty of the indescribable.
    </p>
    <p class="max-w-prose p-2">
        Scroll through Nomenclature, a digital adaptation, and change your
        relationship with the words that shape your reality.
    </p>
</main>
<Gallery {images} />
