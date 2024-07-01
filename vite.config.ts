import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';


export default defineConfig({
        plugins: [
                enhancedImages(),
                sveltekit(),
                {
                        name: "configure-response-headers",
                        configureServer: (server) => {
                                server.middlewares.use((_req, res, next) => {
                                        res.setHeader("Access-Control-Allow-Origin", "ldbzzhbnngpreksj.public.blob.vercel-storage.com");
                                        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                                        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                                        next();
                                });
                        },
                },
        ]
});
