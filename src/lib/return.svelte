<script lang="ts">
</script>

<div class="end">
    <button on:click={() => (window.location.href = "#")}>&uarr;</button>
</div>

<style>
    .end {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 2fr 1fr;
        bottom: 0;
        margin: auto;
        height: 100dvh;
        place-items: center;
        justify-content: center;
        z-index: 1;
    }
    .end button {
        font-size: 1.5rem;
        align-self: center;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background-color: #ffffffcc;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }
    .end button:hover {
        background-color: #ffffff;
    }
</style>
