/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

// Assets that should always be cached
const ASSETS = [
	...build, // the app itself
	...files  // everything in `static`
];

// Install event - cache core assets
sw.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		// Cache core app files, but not large 3D assets yet
		const coreAssets = ASSETS.filter(url =>
			!url.includes('.splat') &&
			!url.includes('.gltf') &&
			!url.includes('.glb')
		);
		await cache.addAll(coreAssets);
	}

	event.waitUntil(addFilesToCache());
});

// Activate event - clean up old caches
sw.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		const keys = await caches.keys();
		for (const key of keys) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

// Fetch event - serve from cache when available
sw.addEventListener('fetch', (event) => {
	// Ignore non-GET requests
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// Check if this is a 3D asset (splat, gltf, glb)
		const is3DAsset = url.pathname.includes('.splat') ||
		                  url.pathname.includes('.gltf') ||
		                  url.pathname.includes('.glb');

		if (is3DAsset) {
			// For 3D assets: Cache-first strategy with range request support
			const cachedResponse = await cache.match(event.request);

			if (cachedResponse) {
				console.log(`[SW] Serving 3D asset from cache: ${url.pathname}`);
				return cachedResponse;
			}

			// Fetch and cache for next time
			try {
				console.log(`[SW] Fetching and caching 3D asset: ${url.pathname}`);
				const response = await fetch(event.request);

				// Only cache successful responses
				if (response.status === 200) {
					// Clone the response before caching
					cache.put(event.request, response.clone());
				}

				return response;
			} catch (err) {
				console.error(`[SW] Failed to fetch 3D asset: ${url.pathname}`, err);
				throw err;
			}
		}

		// For app assets: Try cache first, fallback to network
		if (ASSETS.includes(url.pathname)) {
			const cachedResponse = await cache.match(event.request);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		// For everything else: Network first, fallback to cache
		try {
			const response = await fetch(event.request);

			// Cache successful responses for same-origin requests
			if (response.status === 200 && url.origin === location.origin) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const cachedResponse = await cache.match(event.request);
			if (cachedResponse) {
				return cachedResponse;
			}
			throw err;
		}
	}

	event.respondWith(respond());
});
