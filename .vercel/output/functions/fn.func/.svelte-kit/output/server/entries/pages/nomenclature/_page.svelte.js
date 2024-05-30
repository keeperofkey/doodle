import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
const Senior = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let camera, scene, renderer;
  let model;
  let mat;
  let anim;
  let mixer;
  let action;
  const Clock = new THREE.Clock();
  const canvas = document.getElementById("three");
  const splat = document.getElementById("splat");
  splat.style.display = "none";
  canvas.style.display = "block";
  function init() {
    scene = new THREE.Scene();
    new GLTFLoader().setPath("models/").setMeshoptDecoder(MeshoptDecoder).load("senior-anim-24.glb", function(gltf) {
      anim = gltf.animations;
      camera = gltf.cameras[0];
      mixer = new THREE.AnimationMixer(gltf);
      action = mixer.clipAction(anim[0], camera);
      model = gltf.scene.children[0].children[0];
      mat = new THREE.MeshBasicMaterial({
        color: 16777215,
        wireframe: true,
        vertexColors: true,
        wireframeLinewidth: 5
      });
      model.material = mat;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      action.play();
      action.paused = true;
      document.addEventListener("scroll", onScroll);
      window.addEventListener("resize", onWindowResize);
      scene.add(gltf.scene);
      animate();
    });
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.zIndex = "-1";
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const light = new THREE.AmbientLight();
    light.position.set(0, 0, 0);
    scene.add(light);
    scene.background = new THREE.Color(4126537205);
    scene.environment = pmremGenerator.fromScene(scene).texture;
  }
  function onScroll() {
    let scroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    scroll = clamp(scroll, 0, 0.99);
    action.time = scroll * action.getClip().duration;
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  function animate() {
    requestAnimationFrame(animate);
    const delta = Clock.getDelta();
    mixer.update(delta);
    render();
  }
  function render() {
    renderer.clear();
    renderer.render(scene, camera);
  }
  init();
  return ``;
});
const css = {
  code: ".container.svelte-1h9d7wa{height:600dvh}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="container svelte-1h9d7wa">${validate_component(Senior, "Senior").$$render($$result, {}, {}, {})} </div>`;
});
export {
  Page as default
};
