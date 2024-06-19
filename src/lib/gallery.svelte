<script lang="ts">
    export let images: Object;

    import "@appnest/masonry-layout";

    const imagesArray = Object.values(images);
</script>

<masonry-layout id="gallery" gap="12px">
    {#each imagesArray as image, i}
        <enhanced:img class="images" src={image.default} alt={`image-${i}`} />
    {/each}
</masonry-layout>

<style>
    #gallery {
        margin: 1rem;
    }
    .images {
        border-radius: 0.5rem;
        max-width: 100%;
        height: auto;
    }
</style>
