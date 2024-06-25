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
        height: 100dvh;
        justify-content: center;
        margin: 0 1rem;
    }
    .container object {
        align-self: center;
        width: 100%;
    }
</style>
