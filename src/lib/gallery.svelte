<script lang="ts">
    export let images: Object;

    import "@appnest/masonry-layout";

    const imagesArray = Object.values(images);
</script>

<masonry-layout id="gallery" gap="12">
    {#each imagesArray as image, i}
        <img src={image.name} alt={`image-${i}`} />
    {/each}
</masonry-layout>

<style>
    #gallery img {
        border-radius: 16px;
    }
</style>
