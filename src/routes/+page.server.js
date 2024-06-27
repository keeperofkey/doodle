export function load({ setHeaders }) {
	setHeaders({
		"Cross-Origin-Embedder-Policy": "*",
		"Cross-Origin-Opener-Policy": "same-origin",
	});
}
