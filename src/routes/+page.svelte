<script lang="ts">
    import welcome from "$lib/images/svg/welcome-home.svg"
</script>

<div class="container">
    <object
        title="Welcome"
        type="image/svg+xml"
        data="{welcome}"
    />
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
