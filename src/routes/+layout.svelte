<script lang="ts">
    let isOpen = false;

    function toggleMenu() {
        isOpen = !isOpen;
        if (isOpen) {
            icon = "\u{1D301}";
        } else {
            icon = "\u{1d303}";
        }
    }
    let icon = "\u{2630}";
</script>

<nav>
    <button on:click={toggleMenu}>{icon}</button>
    {#if isOpen}
        <a href="/">Home</a>
        <a href="/installation">Mind your head</a>
        <a href="/joya">Joya: AiR</a>
        <a href="/nomenclature">Nomenclature</a>
        <a href="/interior">Interior</a>
        <a href="/about">About</a>
    {/if}
</nav>

<slot />

<style>
    nav {
        background: #ffffff;
        border-radius: 0.5rem;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
        position: fixed;
        pointer-events: auto;
        z-index: 999;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 1rem;
    }

    nav button {
        font-size: 1rem;
        cursor: pointer;
        border: none;
        background: none;
        /* justify-self: center; */
        /* align-self: center; */
        padding: 1rem;
    }

    nav a {
        color: #333333;
        text-decoration: none;
        font-family: monospace;
        font-size: 1rem;
        font-weight: bold;
        justify-self: center;
        padding: 1rem;
        align-self: center;
    }

    nav a:hover {
        background: #eeeeee;
        border-radius: 0.25rem;
    }
    nav button:hover {
        background: #eeeeee;
        border-radius: 0.25rem;
    }
    @media screen and (min-width: 769px) {
        nav {
            flex-direction: row;
            align-items: center;
            /* height: 3rem; */
        }
    }
</style>
