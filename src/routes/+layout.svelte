<script lang="ts">
    import "../app.css";
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let isOpen: Boolean;

    onMount(() => {
        const handleResize = () => {
            isOpen = window.innerWidth >= 768; // Adjust the breakpoint as needed
        };

        handleResize(); // Set initial value
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    });
    let icon = "\u{1d303}";
    let moreIcon = "\u{2BC6}";
    let more = false;
    function toggleMore() {
        more = !more;
        moreIcon = more ? "\u{2BC8}" : "\u{2BC6}";
    }

    function toggleMenu() {
        isOpen = !isOpen;
        icon = isOpen ? "\u{1d303}" : "\u{1D301}";
    }
</script>

<svelte:head>
    <title>{page.data.title}</title>
</svelte:head>
<nav class="grid grid-flow-row sm:grid-flow-col">
    <button on:click={toggleMenu}>{icon}</button>
    <div class="{isOpen ? '' : 'hidden'} grid grid-flow-row sm:grid-flow-col">
        <a href="/">Home</a>
        <a href="/installation">Mind your head</a>
        <!-- <a href="/joya">Joya: AiR</a> -->
        <a href="/nomenclature">Nomenclature</a>
        <a href="/interior">Interior</a>
        <!-- <a href="/about">About</a> -->
        <button on:click={toggleMore}>{moreIcon}</button>
        <div class="{more ? '' : 'hidden'} grid grid-flow-row sm:grid-flow-col">
            <a href="/joya">Joya: AiR</a>
            <a href="/about">About</a>
        </div>
    </div>
</nav>

<slot />
