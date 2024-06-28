<script lang="ts">
    export let images: Object;

    import "@appnest/masonry-layout";
    // import { Image } from "@unpic/svelte";

    let expandedImage: string | null = null;

    function toggleExpand(event: MouseEvent) {
        const target = event.target as HTMLImageElement;
        expandedImage = expandedImage === target.src ? null : target.src;
    }

    const imagesArray = Object.values(images);
    // const imagesArray = images.data;
</script>

<masonry-layout id="gallery" gap="5rem" maxcolwidth="1024">
    {#each imagesArray as image, i}
        <button type="button" on:click={toggleExpand}>
            <img src={image.url} alt={image.description} class="images" />
            <!-- <enhanced:img -->
            <!--     src={image.default} -->
            <!--     alt={"image" + i} -->
            <!--     class="images" -->
            <!-- /> -->
        </button>
    {/each}
    {#if expandedImage}
        <div
            class="expanded-overlay"
            role="button"
            tabindex="0"
            on:click={() => (expandedImage = null)}
            on:keydown={() => (expandedImage = null)}
        >
            <img src={expandedImage} alt="expanded" />
        </div>
    {/if}
</masonry-layout>

<style>
    #gallery {
        margin: 1rem;
        z-index: 1;
        position: relative;
    }
    .images {
        border-radius: 0.5rem;
        max-width: 100%;
        height: auto;
    }
    button {
        background: none;
        border: none;
        cursor: pointer;
        pointer-events: auto;
    }
    .expanded-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        cursor: pointer;
    }
    .expanded-overlay img {
        max-width: 90vw;
        max-height: 90vh;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
        border-radius: 0.5rem;
    }
</style>
