<script lang="ts">
    import Gsplat from "$lib/gsplat.svelte";
    import { Vector3 } from "gsplat";
</script>

<div class="container">
    <Gsplat
        modelUrl="models/splat.splat"
        camStart={new Vector3(-8, 0, -2)}
        camTarget={new Vector3(0, 0, -1)}
    />
</div>

<style>
</style>
