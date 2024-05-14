<nav>
    <a href="/">Home</a>
    <a href="/installation">Mind your head</a>
    <a href="/joya">Joya: AiR</a>
    <a href="/nomenclature">Nomenclature</a>
    <a href="/interior">interior</a>
</nav>

<slot />

<style>
    nav {
        background: #ffffff;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
        position: fixed;
    }

    nav a {
        color: #333333;
        text-decoration: none;
        font-family: monospace;
        font-size: 1rem;
        font-weight: bold;
        padding: 0.5rem;
    }

    nav a:hover {
        background: #eeeeee;
        border-radius: 0.25rem;
    }
</style>
