import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import * as SPLAT from "gsplat";
const Interior = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const scene = new SPLAT.Scene();
  const camera = new SPLAT.Camera();
  const three = document.getElementById("three");
  const canvas = document.getElementById("splat");
  const renderer = new SPLAT.WebGLRenderer(canvas);
  const controls = new SPLAT.OrbitControls(camera, canvas);
  const color = new SPLAT.Color32(50, 50, 50, 0);
  three.style.display = "none";
  canvas.style.position = "fixed";
  canvas.style.zIndex = "-1";
  canvas.style.top = "0px";
  canvas.style.display = "block";
  renderer.backgroundColor = color;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position = new SPLAT.Vector3(-8, 0, -2);
  controls.setCameraTarget(new SPLAT.Vector3(0, 0, -1));
  async function main() {
    const handleResize = () => {
      renderer.setSize(renderer.canvas.clientWidth, renderer.canvas.clientHeight);
    };
    const url = "models/splat.splat";
    await SPLAT.Loader.LoadAsync(url, scene, () => {
    });
    const frame = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    };
    renderer.dispose();
    handleResize();
    window.addEventListener("resize", handleResize);
    requestAnimationFrame(frame);
  }
  main();
  return ``;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="container">${validate_component(Interior, "Interior").$$render($$result, {}, {}, {})} </div>`;
});
export {
  Page as default
};
