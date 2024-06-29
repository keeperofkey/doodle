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
        width: 32px;
        display: grid;
        place-items: center;
        justify-items: center;
        height: 32px;
        font-size: 1.5rem;
        grid-column-start: 2;
        grid-row-start: 3;
        border: 2px solid #000000cc;
        border-radius: 50%;
        background-color: #ffffffcc;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
        cursor: pointer;
        padding: 0 0 0.25rem 0;
        margin: 0;
    }
    .end button:hover {
        background-color: #ffffff;
        border: 2px solid #ff0000;
    }
</style>
