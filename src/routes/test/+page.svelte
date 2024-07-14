<script lang="ts">
    import ScrollOrbit from "$lib/scroll-orbit.svelte";
    import Gall from "$lib/gall.svelte";
    import images from "$lib/images";
    let data = images.senior.data;
</script>

<Gall images={data} />
<ScrollOrbit modelName="senior.glb" splatName="senior.splat" />
