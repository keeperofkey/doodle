import { dev } from '$app/environment';

// Temporarily disabled - uncomment after testing
/*
// Register service worker for production caching
if (!dev && 'serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js')
		.then((registration) => {
			console.log('Service Worker registered successfully:', registration.scope);

			// Check for updates periodically
			setInterval(() => {
				registration.update();
			}, 60000); // Check every minute
		})
		.catch((error) => {
			console.error('Service Worker registration failed:', error);
		});
}
*/
