<script lang="ts">
    import "../app.css";
    import { onMount } from "svelte";
    import { onNavigate } from "$app/navigation";
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
    let icon = "\u{1d303}";
    let moreIcon = "\u{25BC}";
    let more = false;
    function toggleMore() {
        more = !more;
        moreIcon = more ? "\u{25B6}" : "\u{25BC}";
    }

    function toggleMenu() {
        isOpen = !isOpen;
        icon = isOpen ? "\u{1d303}" : "\u{1D301}";
    }
</script>

<nav
    class="bg-white rounded-lg shadow-md fixed max-w-fit pointer-events-auto z-50 items-center m-4 grid grid-flow-row sm:grid-flow-col p-1"
>
    <button
        class="font-medium bg-transparent border-none p-2 hover:shadow-inner hover:bg-slate-100 rounded"
        on:click={toggleMenu}>{icon}</button
    >
    <div
        class="{isOpen
            ? ''
            : 'hidden'} grid grid-flow-row sm:grid-flow-col items-center"
    >
        <a
            class="no-underline p-2 font-bold hover:shadow-inner hover:bg-slate-100 rounded"
            href="/">Home</a
        >
        <a
            class="no-underline p-2 font-bold hover:shadow-inner hover:bg-slate-100 rounded"
            href="/installation">Mind your head</a
        >
        <a
            class="no-underline p-2 font-bold hover:shadow-inner hover:bg-slate-100 rounded"
            href="/nomenclature">Nomenclature</a
        >
        <a
            class="no-underline p-2 font-bold hover:shadow-inner hover:bg-slate-100 rounded"
            href="/interior">Interior</a
        >
        <button
            class="font-medium bg-transparent border-none p-2 hover:shadow-inner hover:bg-slate-100 rounded"
            on:click={toggleMore}>{moreIcon}</button
        >
        <div class="{more ? '' : 'hidden'} grid grid-flow-row sm:grid-flow-col">
            <a
                class="no-underline p-2 font-bold hover:shadow-inner hover:bg-slate-100 rounded"
                href="/joya">Joya: AiR</a
            >
            <a
                class="no-underline p-2 font-bold hover:shadow-inner hover:bg-slate-100 rounded"
                href="/about">About</a
            >
        </div>
    </div>
</nav>

<slot />
