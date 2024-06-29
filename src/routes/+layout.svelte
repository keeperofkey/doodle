<script lang="ts">
    let isOpen = false;
    let icon = "\u{1d303}";
    let moreIcon = "\u{1F783}";
    let more = false;
    function toggleMore() {
        more = !more;
        moreIcon = more ? "\u{1F781}" : "\u{1F783}";
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
                    <a href="/joya">Joya: AiR</a>
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
        white-space: nowrap;
    }

    .dropdown-content {
        display: flex;
        position: absolute;
        background-color: #f9f9f9;
        right: 0;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
        z-index: 1;
        border-radius: 0.5rem;
    }

    /* .dropdown-content a { */
    /*     color: #333333; */
    /*     display: block; */
    /*     text-decoration: none; */
    /*     font-family: monospace; */
    /*     font-size: 1rem; */
    /*     font-weight: bold; */
    /*     text-align: center; */
    /*     padding: 0.5rem; */
    /*     margin: 0.5rem; */
    /* } */
    /**/
    /* .dropdown-content a:hover { */
    /*     background-color: #f1f1f1; */
    /* } */
    /**/
    /* .dropdown:hover .dropdown-content { */
    /*     display: flex; */
    /*     border-radius: 0rem 0rem 0.5rem 0.5rem; */
    /* } */

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
