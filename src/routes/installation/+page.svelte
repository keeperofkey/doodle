<script lang="ts">
    import { marked } from "marked";
    import ScrollView from "$lib/scroll-view.svelte";
    import mdContent from "$lib/texts/install.md?raw";
</script>

<div class="container">
    <!-- <Install /> -->
    <ScrollView modelName="mesh-one-anim-24.glb" />
</div>
<div class="texts">
    {@html marked.parse(mdContent)}
</div>

<style>
    .container {
        height: 800dvh;
        pointer-events: auto;
    }
    .texts {
        height: 800dvh;
        position: relative;
        overflow-y: scroll;
        pointer-events: auto;
    }
</style>
