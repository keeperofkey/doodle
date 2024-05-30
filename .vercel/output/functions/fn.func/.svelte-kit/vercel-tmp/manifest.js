export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","images/cans-1.webp","images/cans-2.webp","images/cans-3.webp","images/cans-5.webp","images/cans-7.webp","loading.svg","loopmtn.svg","models/can-cam.glb","models/cans.splat","models/mesh-one-anim-24.glb","models/senior-anim-24.glb","models/splat.splat","models/twogs.ply","svfavicon.png","welcome.svg"]),
	mimeTypes: {".png":"image/png",".webp":"image/webp",".svg":"image/svg+xml",".glb":"model/gltf-binary"},
	_: {
		client: {"start":"_app/immutable/entry/start.CFuGFf1u.js","app":"_app/immutable/entry/app.D-mjHrDd.js","imports":["_app/immutable/entry/start.CFuGFf1u.js","_app/immutable/chunks/entry.CCRLnD3s.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/entry/app.D-mjHrDd.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.ijGnfrI7.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/installation",
				pattern: /^\/installation\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/interior",
				pattern: /^\/interior\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/joya",
				pattern: /^\/joya\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/module",
				pattern: /^\/module\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/nomenclature",
				pattern: /^\/nomenclature\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
