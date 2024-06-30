<script lang="ts">
    import welcome from "$lib/images/svg/welcome-home.svg";
</script>

<svelte:head>
    <title>Liam Dodd - Welcome!</title>
    <meta name="description" content="Welcome to my website!" />
</svelte:head>

<div class="flex flex-col items-center justify-center h-screen">
    <object
        class="p-5 w-dvw h-dvw"
        title="Welcome"
        type="image/svg+xml"
        data={welcome}
    />
</div>
