<script lang="ts">
    import welcome from "$lib/images/svg/welcome-home.svg";
</script>

<svelte:head>
    <title>Liam Dodd - Welcome!</title>
    <meta name="description" content="Welcome to my website!" />
</svelte:head>

<div class="container">
    <object title="Welcome" type="image/svg+xml" data={welcome} />
</div>

<style>
    .container {
        display: grid;
        place-items: center;
        height: 100dvh;
    }
</style>
