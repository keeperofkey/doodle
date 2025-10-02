<script lang="ts">
    import welcome from "$lib/images/svg/welcome-home.svg";
    import { onMount } from "svelte";

    let scrollY = 0;
    let svgScale = 1;
    let svgOpacity = 1;

    onMount(() => {
        const handleScroll = () => {
            scrollY = window.scrollY;
            const maxScroll = 400;
            const progress = Math.min(scrollY / maxScroll, 1);

            // SVG scales down and fades as you scroll
            svgScale = 1 + (progress * 0.3);
            svgOpacity = 1 - (progress * 0.7);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

<svelte:head>
    <title>Liam Dodd - Welcome!</title>
    <meta name="description" content="Welcome to my website!" />
</svelte:head>

<div class="relative">
    <!-- Hero section with SVG -->
    <div class="grid grid-cols-1 justify-items-center items-center h-dvh sticky top-0">
        <div
            class="transition-all duration-100"
            style="
                transform: scale({svgScale});
                opacity: {svgOpacity};
            "
        >
            <object
                class="p-5 w-dvw dark:stroke-white max-w-3xl"
                title="Welcome"
                type="image/svg+xml"
                data={welcome}
            />
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-8 flex flex-col items-center gap-2 animate-bounce">
            <span class="text-sm font-mono text-gray-600">Scroll to explore</span>
            <span class="text-2xl">↓</span>
        </div>
    </div>

    <!-- Content that reveals on scroll -->
    <div class="relative h-[50vh] z-10">
        <div class="max-w-2xl mx-auto px-8 py-12 bg-slate-100 bg-opacity-30 backdrop-blur-md rounded-lg shadow-xl m-6">
            <h2 class="text-4xl font-mono font-bold mb-6 text-slate-800">
                Navigate by Scrolling
            </h2>
            <div class="space-y-4 text-lg text-slate-700 leading-relaxed">
                <p>
                    This portfolio uses <strong>scroll as the primary interaction</strong>.
                    As you move through each page, the camera animates through 3D scenes.
                </p>
                <p>
                    <strong>Tips for exploring:</strong>
                </p>
                <ul class="list-disc list-inside space-y-2 ml-4">
                    <li>Scroll slowly to watch the camera movements unfold</li>
                    <li>Use the 🎥 button to unlock free camera control</li>
                    <li>Toggle between render modes to see different views</li>
                    <li>Works best on desktop, but mobile is supported</li>
                </ul>
            </div>
        </div>
    </div>
</div>
