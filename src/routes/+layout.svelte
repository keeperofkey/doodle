<script lang="ts">
    import "../app.css";
    let isOpen = true;
    let icon = "\u{1d303}";
    let moreIcon = "\u{2BC6}";
    let more = false;
    function toggleMore() {
        more = !more;
        moreIcon = more ? "\u{2BC6}" : "\u{2BC5}";
    }

    function toggleMenu() {
        isOpen = !isOpen;
        icon = isOpen ? "\u{1d303}" : "\u{1D301}";
    }
</script>

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
