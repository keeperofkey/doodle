import * as server from '../entries/pages/installation/_page.server.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/installation/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/installation/+page.server.js";
export const imports = ["_app/immutable/nodes/3.BtBpT-Bo.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.ijGnfrI7.js","_app/immutable/chunks/meshopt_decoder.module.B4E2A3GH.js"];
export const stylesheets = ["_app/immutable/assets/3.lz8YxKtu.css"];
export const fonts = [];
