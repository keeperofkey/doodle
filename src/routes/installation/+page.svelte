<script lang="ts">
    // import Install from "./install.svelte";
    import ScrollView from "$lib/scroll-view.svelte";
</script>

<div class="container">
    <!-- <Install /> -->
    <ScrollView modelName="mesh-one-anim-24.glb" />
</div>

<style>
    .container {
        height: 800dvh;
        pointer-events: auto;
    }
</style>
