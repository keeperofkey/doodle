<script lang="ts">
    let isOpen = false;
    let icon = "\u{1d303}";
    let moreIcon = "";
    let more = false;
    function toggleMore() {
        more = !more;
        moreIcon = more ? "" : "";
    }

    function toggleMenu() {
        isOpen = !isOpen;
        icon = isOpen ? "\u{1D301}" : "\u{1d303}";
    }
    // function handlePageChange(event: any) {
    //     const selectedPage = event.target.value;
    //     if (selectedPage) {
    //         document.location.href = selectedPage;
    //     }
    // }
</script>

<nav>
    <button on:click={toggleMenu}>{icon}</button>
    {#if isOpen}
        <a href="/">Home</a>
        <a href="/installation">Mind your head</a>
        <!-- <a href="/joya">Joya: AiR</a> -->
        <a href="/nomenclature">Nomenclature</a>
        <a href="/interior">Interior</a>
        <!-- <a href="/about">About</a> -->
        <div class="dropdown">
            <button on:click={toggleMore}>{moreIcon}</button>
            {#if more}
                <div class="dropdown-content">
                    <!-- <a href="/">Home</a> -->
                    <!-- <a href="/installation">Mind your head</a> -->
                    <!-- <a href="/joya">Joya: AiR</a> -->
                    <!-- <a href="/nomenclature">Nomenclature</a> -->
                    <!-- <a href="/interior">Interior</a> -->
                    <a href="/about">About</a>
                </div>
            {/if}
        </div>
    {/if}
</nav>

<slot />

<style>
    .dropdown {
        position: relative;
        display: inline-block;
        border-radius: 0.5rem;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        border-radius: 0.5rem;
    }

    .dropdown-content a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        border-radius: 0.5rem;
    }

    .dropdown-content a:hover {
        background-color: #f1f1f1;
        border-radius: 0.5rem;
    }

    .dropdown:hover .dropdown-content {
        display: block;
        border-radius: 0.5rem;
    }

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
        padding: 1rem;
    }

    nav a {
        color: #333333;
        text-decoration: none;
        font-family: monospace;
        font-size: 1rem;
        font-weight: bold;
        padding: 0.5rem;
        margin: 0.5rem;
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
        }
    }
</style>
