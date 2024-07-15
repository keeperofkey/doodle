<script lang="ts">
    import welcome from "$lib/images/svg/welcome-home.svg";
</script>

<svelte:head>
    <title>Liam Dodd - Welcome!</title>
    <meta name="description" content="Welcome to my website!" />
</svelte:head>

<div class="grid grid-cols-1 justify-items-center items-center h-dvh">
    <object
        class="p-5 w-dvw dark:stroke-white"
        title="Welcome"
        type="image/svg+xml"
        data={welcome}
    />
</div>
