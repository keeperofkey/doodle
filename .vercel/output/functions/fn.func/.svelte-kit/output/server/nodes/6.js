import * as server from '../entries/pages/module/_page.server.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/module/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/module/+page.server.js";
export const imports = ["_app/immutable/nodes/6.Ce9NudUB.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.ijGnfrI7.js","_app/immutable/chunks/meshopt_decoder.module.B4E2A3GH.js"];
export const stylesheets = ["_app/immutable/assets/3.lz8YxKtu.css"];
export const fonts = [];
