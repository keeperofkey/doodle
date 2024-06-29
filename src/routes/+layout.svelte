<script lang="ts">
    import "../app.css";
    let isOpen = true;
    let icon = "\u{1d303}";
    let moreIcon = "\u{1F783}";
    let more = false;
    function toggleMore() {
        more = !more;
        moreIcon = more ? "\u{1F781}" : "\u{1F783}";
    }

    function toggleMenu() {
        isOpen = !isOpen;
        icon = isOpen ? "\u{1d303}" : "\u{1D301}";
    }
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
                    <a href="/joya">Joya: AiR</a>
                    <a href="/about">About</a>
                </div>
            {/if}
        </div>
    {/if}
</nav>

<slot />
