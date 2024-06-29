<script lang="ts">
    function scrollWindow(): void {
        window.scrollBy({
            top: window.innerHeight,
            behavior: "smooth",
        });
    }
</script>

<div class="start">
    <button on:click={scrollWindow}>&darr;</button>
</div>

<style>
    .start {
        width: 100%;
        height: 100vh;
        display: grid;
        place-items: center;
    }
    button {
        width: 6rem;
        font-size: 4rem;
        height: 6rem;
        border: none;
        border-radius: 50%;
        padding-bottom: 1rem;
        background-color: #ffffff;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
        cursor: pointer;
        margin-top: 90dvh;
    }
</style>
