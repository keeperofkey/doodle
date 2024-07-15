<script lang="ts">
    import "../app.css";
    import { onMount } from "svelte";
    import { onNavigate } from "$app/navigation";
    import { slide, fly, draw } from "svelte/transition";

    // import { page } from "$app/stores";
    // import Return from "$lib/return.svelte";
    import { dev } from "$app/environment";
    import { inject } from "@vercel/analytics";

    inject({ mode: dev ? "development" : "production" });

    let isOpen: Boolean;
    // let home = false;
    // const home = $page;

    // console.log(home);

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
    onNavigate(() => {
        isOpen = false;
    });
    let icon = "\u{1D301}";
    let moreIcon = "\u{25BC}";
    let more = false;
    function toggleMore() {
        more = !more;
    }

    function toggleMenu() {
        isOpen = !isOpen;
    }
</script>

<nav
    class="font-mono font-bold subpixel-antialiased text-md whitespace-nowrap bg-slate-100 hover:bg-opacity-100 bg-opacity-90 rounded-lg shadow-xl fixed max-w-fit max-h-12 pointer-events-auto z-50 items-center m-4 grid grid-flow-row sm:grid-flow-col p-1"
>
    <button
        class="{isOpen
            ? ''
            : 'rotate-180'} font-medium bg-transparent border-none p-2 hover:shadow-inner rounded-lg"
        on:click={toggleMenu}>{icon}</button
    >
    {#if isOpen}
        <div
            transition:slide={{ duration: 200, axis: "x" }}
            class="overflow-hidden grid grid-flow-row sm:grid-flow-col items-center max-h-10"
        >
            <a
                class="no-underline p-2 font-bold hover:shadow-inner rounded-lg"
                href="/">Home</a
            >
            <a
                class="no-underline p-2 font-bold hover:shadow-inner rounded-lg"
                href="/installation">Mind your head</a
            >
            <a
                class="no-underline p-2 font-bold hover:shadow-inner rounded-lg"
                href="/nomenclature">Nomenclature</a
            >
            <a
                class="no-underline p-2 font-bold hover:shadow-inner rounded-lg"
                href="/interior">Interior</a
            >
            <button
                class="font-medium bg-transparent border-none p-2 hover:shadow-inner rounded-lg"
                on:click={toggleMore}
            >
                <span
                    class="fa-solid"
                    class:fa-caret-down={!more}
                    class:fa-caret-right={more}
                ></span>
            </button>
            {#if more}
                <div
                    transition:slide={{ duration: 200, axis: "x" }}
                    class="grid grid-flow-row sm:grid-flow-col"
                >
                    <a
                        class="no-underline p-2 font-bold hover:shadow-inner rounded-lg"
                        href="/joya">Joya: AiR</a
                    >
                    <a
                        class="no-underline p-2 font-bold hover:shadow-inner rounded-"
                        href="/about">About</a
                    >
                </div>
            {/if}
        </div>
    {/if}
</nav>

<slot />
