import * as server from '../entries/pages/interior/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/interior/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/interior/+page.server.js";
export const imports = ["_app/immutable/nodes/4.C4cxpFtP.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.ijGnfrI7.js","_app/immutable/chunks/index.DmJdn_-f.js"];
export const stylesheets = [];
export const fonts = [];
