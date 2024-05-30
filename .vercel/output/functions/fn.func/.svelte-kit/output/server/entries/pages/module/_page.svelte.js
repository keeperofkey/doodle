import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
const Scroll_view = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { modelName } = $$props;
  if ($$props.modelName === void 0 && $$bindings.modelName && modelName !== void 0)
    $$bindings.modelName(modelName);
  return ``;
});
const css = {
  code: ".container.svelte-5oaak8{height:800dvh}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="container svelte-5oaak8">${validate_component(Scroll_view, "ScrollView").$$render($$result, { modelName: "mesh-one-anim-24.glb" }, {}, {})} </div>`;
});
export {
  Page as default
};
