<script lang="ts">
    export let images: Object;

    export let text: string[];
    let expandedImage: string | null = null;

    function toggleExpand(event: MouseEvent) {
        const target = event.target as HTMLImageElement;
        expandedImage = expandedImage === target.src ? null : target.src;
    }

    const imagesArray = Object.values(images);
</script>

<div class="overlay">
    {#each imagesArray as image, i}
        {#if i % 2 === 0 && text[i]}
            <button type="button" on:click={toggleExpand}>
                <img src={image.name} alt={`image-${i}`} />
                <!-- <img src={image} alt={`image-${i}`} /> -->
            </button>
            <div class="space"></div>
            <div class="text">{text[i]}</div>
        {:else if i % 2 !== 0 && text[i]}
            <div class="text">{text[i]}</div>
            <div class="space"></div>
            <button type="button" on:click={toggleExpand}>
                <img src={image.name} alt={`image-${i}`} />
                <!-- <img src={image} alt={`image-${i}`} /> -->
            </button>
        {/if}
    {/each}
</div>

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

<style>
    button {
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        outline: none;
        pointer-events: auto;
    }
    .overlay {
        display: grid;
        position: relative;
        z-index: 2;
        padding-top: 4rem;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(5, 1fr);
        max-width: 100dvw;
        pointer-events: none;
    }
    .space {
        pointer-events: none;
    }
    img {
        width: 100%;
        border-radius: 0.5rem;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
        pointer-events: auto;
        cursor: pointer;
    }
    .text {
        font-size: 1.5rem;
        font-weight: 600;
        text-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
        text-align: center;
        align-self: center;
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
    }
</style>
