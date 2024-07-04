<script lang="ts">
    export let images: Object;

    import "@appnest/masonry-layout";

    let expandedImage: string | null = null;

    function toggleExpand(event: MouseEvent) {
        const target = event.target as HTMLImageElement;
        expandedImage = expandedImage === target.src ? null : target.src;
    }

    const imagesArray = Object.values(images);
</script>

<masonry-layout class="m-4 z-10 relative" gap="1rem" maxcolwidth="1024">
    {#each imagesArray as image, i}
        <button
            class="bg-transparent border-none cursor-pointer pointer-events-auto"
            type="button"
            on:click={toggleExpand}
        >
            <enhanced:img
                src={image.default}
                alt={"image" + i}
                class="rounded-3xl max-h-full max-w-full h-auto p-2"
            />
        </button>
    {/each}
    {#if expandedImage}
        <div
            class="fixed h-full top-0 left-0 bg-black bg-opacity-50 z-50 flex items-center justify-center cursor-pointer"
            role="button"
            tabindex="0"
            on:click={() => (expandedImage = null)}
            on:keydown={() => (expandedImage = null)}
        >
            <img
                class="rounded-xl max-h-[80dvh] p-2 mt-16 border-none"
                src={expandedImage}
                alt="expanded"
            />
        </div>
    {/if}
</masonry-layout>
