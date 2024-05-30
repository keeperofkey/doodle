import * as server from '../entries/pages/nomenclature/_page.server.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/nomenclature/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/nomenclature/+page.server.js";
export const imports = ["_app/immutable/nodes/7.BV0hxQMp.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.ijGnfrI7.js","_app/immutable/chunks/meshopt_decoder.module.B4E2A3GH.js"];
export const stylesheets = ["_app/immutable/assets/7.BFygPxP_.css"];
export const fonts = [];
