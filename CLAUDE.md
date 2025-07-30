# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run Svelte type checking
- `npm run check:watch` - Run Svelte type checking in watch mode

## Project Architecture

This is a personal portfolio website built with SvelteKit that showcases 3D art installations using Gaussian Splatting technology. The site combines traditional web technologies with advanced 3D rendering.

### Core Technologies Stack

- **SvelteKit** - Full-stack framework with SSR/SSG capabilities
- **Three.js** - 3D graphics rendering engine
- **Gaussian Splatting** - Advanced 3D visualization using `@sparkjsdev/spark` library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety throughout the codebase

### Key Components and Architecture

#### 3D Scene Management (`src/lib/utils.ts`)
The main 3D scene setup is centralized in `utils.ts` with these key functions:
- `setScene()` - Main entry point for initializing 3D scenes
- `loadGLTF()` - Handles GLTF model loading with camera animations
- `loadSpark()` - Loads Gaussian Splat (.splat) files using Spark library
- Animation system uses scroll-based camera movement with keyframe animations

#### Interactive 3D Component (`src/lib/scroll-orbit.svelte`)
- Combines scroll-driven animations with optional orbit controls
- Toggle between scroll mode and interactive camera control
- Handles responsive canvas sizing and mobile viewport adjustments
- Props: `modelName` (GLTF file) and `splatName` (splat file)

#### Gallery System (`src/lib/gallery.svelte`)
- Uses `@appnest/masonry-layout` for responsive image grids
- Modal expansion for image viewing
- Optimized loading with lazy loading and WebP/AVIF formats

#### Navigation (`src/routes/+layout.svelte`)
- Responsive collapsible navigation with smooth transitions
- Mobile-first design with desktop adaptations
- Vercel Analytics integration

### File Structure Patterns

- **Models**: Static 3D assets stored in `/static/models/` (GLTF and splat files)
- **Images**: Organized by project in `/src/lib/images/` with JSON metadata
- **Routes**: Each project has its own route with server-side data loading
- **Components**: Reusable Svelte components in `/src/lib/`

### 3D Asset Pipeline

The site uses a dual-format approach:
1. **GLTF models** - For wireframe geometry and camera animations
2. **Gaussian Splats** - For photorealistic 3D reconstructions

Models should include:
- Camera keyframe animations for scroll-based movement
- "Look_At" object for camera targeting
- Proper naming conventions for animation tracks

### Performance Considerations

- Gaussian Splat files can be large; consider compression
- Three.js renderer uses ACES filmic tone mapping
- Mobile-specific viewport handling for better performance
- Lazy loading for images and progressive loading for 3D assets

### Deployment

- Configured for Vercel deployment with `@sveltejs/adapter-vercel`
- CORS headers configured in Vite for WebGL requirements
- Static assets served from `/static/` directory