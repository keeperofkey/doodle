<script lang="ts">
    const splat = document.getElementById("splat") as HTMLCanvasElement;
    const three = document.getElementById("three") as HTMLCanvasElement;
    three.style.display = "none";
    splat.style.display = "none";
</script>

<div class="container">
    <object title="Welcome" type="image/svg+xml" data={"welcome.svg"} />
</div>
<div class="warning">
    <span>This site is in active development</span>
</div>

<style>
    .container {
        display: grid;
        place-items: center;
        height: 100dvh;
    }
    .warning {
        position: absolute;
        color: red;
        bottom: 0;
        right: 0;
    }
</style>
