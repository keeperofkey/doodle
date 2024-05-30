import { c as create_ssr_component } from "../../chunks/ssr.js";
const css = {
  code: "nav.svelte-1uj2wu9.svelte-1uj2wu9{background:#ffffff;padding:1rem;border-radius:0.5rem;box-shadow:0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);position:fixed;pointer-events:auto}nav.svelte-1uj2wu9 a.svelte-1uj2wu9{color:#333333;text-decoration:none;font-family:monospace;font-size:1rem;font-weight:bold;padding:0.5rem}nav.svelte-1uj2wu9 a.svelte-1uj2wu9:hover{background:#eeeeee;border-radius:0.25rem}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<nav class="svelte-1uj2wu9" data-svelte-h="svelte-kefeii"><a href="/" class="svelte-1uj2wu9">Home</a> <a href="/installation" class="svelte-1uj2wu9">Mind your head</a> <a href="/joya" class="svelte-1uj2wu9">Joya: AiR</a> <a href="/nomenclature" class="svelte-1uj2wu9">Nomenclature</a> <a href="/interior" class="svelte-1uj2wu9">interior</a> <a href="/module" class="svelte-1uj2wu9">module</a></nav> ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
