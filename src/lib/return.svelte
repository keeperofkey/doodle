<script lang="ts">
</script>

<div class="end">
    <button on:click={() => (window.location.href = "#")}>&uarr;</button>
</div>

<style>
    .end {
        display: grid;
        bottom: 0;
        margin: auto;
        height: 100dvh;
        justify-content: center;
        align-items: center;
        z-index: 1;
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
        margin: 90dvh;
    }
</style>
