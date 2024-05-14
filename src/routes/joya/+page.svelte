<script lang="ts">
    import Joya from "./joya.svelte";
    import Overlay from "./overlay.svelte";
    import Splat from "./splat.svelte";
</script>

<body>
    <div class="frame">
        <Splat />
    </div>
    <div class="container">
        <Joya />
    </div>
    <Overlay />
</body>

<style>
    .container {
        height: 800dvh;
    }
    .frame {
        padding-top: 50rem;
    }
</style>
