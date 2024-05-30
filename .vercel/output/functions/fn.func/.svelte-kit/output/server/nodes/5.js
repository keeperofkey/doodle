import * as server from '../entries/pages/joya/_page.server.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/joya/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/joya/+page.server.js";
export const imports = ["_app/immutable/nodes/5.BgVuk9SG.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.ijGnfrI7.js","_app/immutable/chunks/index.DmJdn_-f.js"];
export const stylesheets = ["_app/immutable/assets/5.CiuOLwca.css"];
export const fonts = [];
