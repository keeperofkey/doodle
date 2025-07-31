<script lang="ts">
    import RolodexGallery from "$lib/rolodex-gallery.svelte";
    import ImageOrbit from "$lib/image-orbit.svelte";
    import CssOrbit from "$lib/css-orbit.svelte";
    import { joya } from "$lib/images.json";

    const images = joya.data;
    let galleryMode = 'css-orbit'; // 'rolodex', 'threejs-orbit', 'css-orbit'
</script>

<svelte:head>
    <title>Liam Dodd - Rolodex Gallery</title>
    <meta name="description" content="Interactive 3D rolodex gallery showcasing artwork" />
</svelte:head>

<main class="relative">
    <!-- Gallery mode selector -->
    <div class="fixed top-4 left-4 z-50 flex gap-2">
        <button 
            on:click={() => galleryMode = 'rolodex'}
            class="bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all {galleryMode === 'rolodex' ? 'ring-2 ring-blue-500' : ''}"
            aria-label="Rolodex mode"
        >
            📋 Rolodex
        </button>
        <button 
            on:click={() => galleryMode = 'threejs-orbit'}
            class="bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all {galleryMode === 'threejs-orbit' ? 'ring-2 ring-blue-500' : ''}"
            aria-label="Three.js orbit mode"
        >
            🌐 3D Orbit
        </button>
        <button 
            on:click={() => galleryMode = 'css-orbit'}
            class="bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all {galleryMode === 'css-orbit' ? 'ring-2 ring-blue-500' : ''}"
            aria-label="CSS orbit mode"
        >
            ⚡ CSS Orbit
        </button>
    </div>

    {#if galleryMode === 'rolodex'}
        <RolodexGallery {images} />
    {:else if galleryMode === 'threejs-orbit'}
        <ImageOrbit {images} />
    {:else if galleryMode === 'css-orbit'}
        <CssOrbit {images} />
    {/if}
    
    <!-- Content section with extra height for scrolling -->
    <section class="relative z-10 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900 text-white min-h-screen pt-20">
        <div class="container mx-auto px-6 py-12">
            <h1 class="text-4xl font-bold mb-8 text-center">Rolodex Gallery</h1>
            
            <div class="max-w-3xl mx-auto space-y-8">
                <div class="bg-slate-800/50 p-6 rounded-lg backdrop-blur-sm">
                    <h2 class="text-2xl font-semibold mb-4">About This Collection</h2>
                    <p class="text-slate-300 leading-relaxed">
                        A curated selection of digital artwork presented in an interactive 3D rolodex format. 
                        Scroll through the collection to see each piece take center stage, while glimpsing 
                        the next works in the series.
                    </p>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Spacer content for scroll-driven animation -->
    <section class="bg-slate-900 text-white py-40">
        <div class="container mx-auto px-6 text-center">
            <div class="space-y-8">
                <div class="text-4xl">🎨</div>
                <p class="text-slate-400">Scroll to browse the collection</p>
            </div>
        </div>
    </section>
    
    <section class="bg-slate-800 text-white py-40">
        <div class="container mx-auto px-6 text-center">
            <div class="space-y-8">
                <div class="text-4xl">📸</div>
                <p class="text-slate-400">Each piece tells a story</p>
            </div>
        </div>
    </section>
    
    <section class="bg-slate-900 text-white py-40">
        <div class="container mx-auto px-6 text-center">
            <div class="space-y-8">
                <div class="text-4xl">✨</div>
                <p class="text-slate-400">Experience art in motion</p>
            </div>
        </div>
    </section>
</main>