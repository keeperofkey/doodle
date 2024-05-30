<script lang="ts">
    import Gsplat from "$lib/gsplat.svelte";
    import { Vector3 } from "gsplat";
    import Overlay from "./overlay.svelte";
</script>

<Gsplat
    modelUrl="models/cans.splat"
    camStart={new Vector3(0, 0, 15)}
    camTarget={new Vector3(0, 0, 0)}
/> >
<Overlay />

<style>
</style>
