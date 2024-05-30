import { c as create_ssr_component, d as add_attribute } from "../../chunks/ssr.js";
const css = {
  code: ".container.svelte-k01cpj{display:grid;place-items:center;height:100dvh}.warning.svelte-k01cpj{position:absolute;color:red;bottom:0;right:0}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="container svelte-k01cpj" data-svelte-h="svelte-151atin"><object title="Welcome" type="image/svg+xml"${add_attribute("data", "welcome.svg", 0)}></object></div> <div class="warning svelte-k01cpj" data-svelte-h="svelte-1838p9x"><span>This site is in active development</span> </div>`;
});
export {
  Page as default
};
