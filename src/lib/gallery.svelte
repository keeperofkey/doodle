<script lang="ts">
    export let images: Object;

    const imagesArray = Object.values(images);
</script>

<div class="gallery">
    {#each imagesArray as image, i}
        <!-- <enhanced:img src={image.default} alt={`image-${i}`} /> -->
        <img src={image} alt={`image-${i}`} />
    {/each}
</div>

<style>
    .gallery {
        display: flex;
        position: relative;
        z-index: 2;
        padding-top: 4rem;
    }
</style>
