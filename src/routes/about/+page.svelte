<script lang="ts">
    import { marked } from "marked";
    import mdContent from "$lib/texts/about.md?raw";
</script>

<svelte:head>
    <title>Liam Dodd - About</title>
    <meta name="description" content="About me!" />
</svelte:head>
<div class="texts">
    {@html marked.parse(mdContent)}
</div>

<style>
    .texts {
        position: absolute;
        top: 4rem;
        margin: 1rem;
        padding: 0.3rem 1rem;
        font-size: rem;
        background-color: #ffffffcc;
        border-radius: 1rem;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    }
</style>
