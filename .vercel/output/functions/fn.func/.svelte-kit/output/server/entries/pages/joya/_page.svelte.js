import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import * as SPLAT from "gsplat";
const css = {
  code: ".overlay.svelte-1wcyyjm{display:grid;padding-top:4rem;grid-template-columns:repeat(3, 1fr);grid-template-rows:repeat(5, 1fr);max-width:100dvw}.space.svelte-1wcyyjm{pointer-events:none}img.svelte-1wcyyjm{width:100%;border-radius:0.5rem;box-shadow:0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)}.text.svelte-1wcyyjm{font-size:1.5rem;font-weight:600;text-shadow:0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);text-align:center;align-self:center}",
  map: null
};
const Overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="overlay svelte-1wcyyjm" data-svelte-h="svelte-z2xvjt"><img src="images/cans-1.webp" alt="from artist residency" class="svelte-1wcyyjm"> <div class="space svelte-1wcyyjm"></div> <div class="text svelte-1wcyyjm">Images from an artist residency in Spain</div> <div class="text svelte-1wcyyjm">Exploring the cravases cut into the landscape by monumental floods</div> <div class="space svelte-1wcyyjm"></div> <img src="images/cans-2.webp" alt="from artist residency" class="svelte-1wcyyjm"> <img src="images/cans-3.webp" alt="from artist residency" class="svelte-1wcyyjm"> <div class="space svelte-1wcyyjm"></div> <div class="text svelte-1wcyyjm">Castings made from varying mixtures of earth and cement using cans and
        debris</div> <div class="text svelte-1wcyyjm">Meant to erode</div> <div class="space svelte-1wcyyjm"></div> <img src="images/cans-5.webp" alt="from artist residency" class="svelte-1wcyyjm"> <img src="images/cans-7.webp" alt="from artist residency" class="svelte-1wcyyjm"> <div class="space svelte-1wcyyjm"></div> <div class="text svelte-1wcyyjm">left to disperse</div> </div>`;
});
const Splat = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const scene = new SPLAT.Scene();
  const camera = new SPLAT.Camera();
  const canvas = document.getElementById("splat");
  const three = document.getElementById("three");
  const renderer = new SPLAT.WebGLRenderer(canvas);
  const controls = new SPLAT.OrbitControls(camera, canvas);
  const color = new SPLAT.Color32(50, 50, 50, 0);
  three.style.display = "none";
  canvas.style.display = "block";
  canvas.style.zIndex = "-1";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.position = "fixed";
  canvas.style.top = "0px";
  renderer.backgroundColor = color;
  camera.position = new SPLAT.Vector3(0, 0, 15);
  controls.setCameraTarget(new SPLAT.Vector3(0, 0, 0));
  controls.orbitSpeed = 0.5;
  async function main() {
    function handlePointerDown(event) {
      console.log("pointer down");
      canvas.setPointerCapture(event.pointerId);
    }
    function handlePointerUp(event) {
      canvas.releasePointerCapture(event.pointerId);
    }
    const handleResize = () => {
      renderer.setSize(renderer.canvas.clientWidth, renderer.canvas.clientHeight);
    };
    const url = "models/cans.splat";
    await SPLAT.Loader.LoadAsync(url, scene, () => {
    });
    const frame = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    };
    handleResize();
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("resize", handleResize);
    renderer.dispose();
    requestAnimationFrame(frame);
  }
  main();
  return ``;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ` ${validate_component(Splat, "Splat").$$render($$result, {}, {}, {})}   ${validate_component(Overlay, "Overlay").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
