import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';


export default defineConfig({
        server: {
                headers: {
                        "Cross-Origin-Embedder-Policy": "require-corp",
                        "Cross-Origin-Opener-Policy": "same-origin"
                },
        },
        plugins: [
                enhancedImages(),
                sveltekit(),
        ]
});
