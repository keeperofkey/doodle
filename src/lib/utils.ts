export { setScene, loadGLTF };

import { normalizeScroll } from "./maths";
import * as THREE from "three";
import * as GSPLAT from "@mkkellogg/gaussian-splats-3d";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

// clock from animation scrubbing
let clock = new THREE.Clock();

//
// GLTF
//

async function loadGLTF(modelName: string) {
        const loader = new GLTFLoader();
        let cameras: any[] = [];
        let lookAt = new THREE.Object3D();
        let scene = new THREE.Scene();
        let mesh = new THREE.Mesh();
        let camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000,
        );

        await loader
                .setPath("models/")
                .setMeshoptDecoder(MeshoptDecoder)
                .loadAsync(modelName)
                .then((gltf) => {
                        cameras = gltf.cameras;
                        scene.animations = gltf.animations;
                        gltf.scene.traverse((child: any) => {
                                if (child.isMesh) {
                                        const mat = new THREE.MeshBasicMaterial({
                                                color: 0xffffff,
                                                wireframe: true,
                                                vertexColors: true,
                                                wireframeLinewidth: 1,
                                        });
                                        child.material = mat;
                                        mesh = child;
                                }
                                if (child.name === "Look_At") {
                                        lookAt = child;
                                }
                                if (child.isCamera) {
                                        camera = child;
                                }
                        });
                })
                .catch((error) => {
                        console.error(error);
                });
        scene.add(lookAt);
        scene.add(camera);
        scene.add(mesh);
        return { scene, cameras, lookAt };
}

//
//
// RENDERING
//
//

async function setViewer(
        scene: THREE.Scene,
        renderer: THREE.WebGLRenderer,
        camera: THREE.PerspectiveCamera,
) {
        let viewer = new GSPLAT.Viewer({
                useBuiltInControls: false,
                camera: camera,
                threeScene: scene,
                renderer: renderer,
                selfDrivenMode: false,
                sharedMemoryForWorkers: false,
                // logLevel: GSPLAT.LogLevel.Debug,
                renderMode: GSPLAT.RenderMode.OnChange,
        });
        return viewer;
}


function setRender(renderer: THREE.WebGLRenderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.domElement.style.position = "fixed";
        renderer.domElement.style.top = "0";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.zIndex = "-1";
        document.body.appendChild(renderer.domElement);
}

//
//
// Set up orbitControls and camera animations
//
//

async function setCtrl(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, lookAt: THREE.Object3D) {
        let controls = new GSPLAT.OrbitControls(camera, renderer.domElement);
        controls.enabled = true;
        controls.target = lookAt.position;
        return controls;

}

async function setAnim(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        const mixer = new THREE.AnimationMixer(scene);
        const action = mixer.clipAction(scene.animations[0], camera);
        action.play();
        action.paused = true;
        return { mixer, action };
}

//
//
// set up scroll and resize handlers
//
// adjusts animation time to match scroll position

function handleScroll(
        action: THREE.AnimationAction,
        stageElement: HTMLElement,
) {
        if (stageElement) {
                const scroll = normalizeScroll(
                        window.scrollY,
                        stageElement.scrollHeight,
                        window.outerHeight,
                );
                action.time = scroll * action.getClip().duration;
        }
}
function handleResize(
        camera: THREE.PerspectiveCamera,
        renderer: THREE.WebGLRenderer
) {
        const isDesktop = window.innerWidth > 768;
        let width, height;

        if (isDesktop) {
                width = window.innerWidth;
                height = window.innerHeight;
        } else {
                const visualViewport = window.visualViewport;
                width = visualViewport ? visualViewport.width : window.innerWidth;
                height = visualViewport ? visualViewport.height : window.innerHeight;
        }

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
}


//
//
// Setup the scene main entry point
//
//

async function setScene(
        modelName: string,
        splatName: string,
        renderer: THREE.WebGLRenderer,
        stageElement: HTMLElement,
) {
        // Initialize the scene
        let { scene, cameras, lookAt } = await loadGLTF(modelName);
        // Add lights and set camera
        let light = new THREE.AmbientLight(0xffffff);
        scene.add(light);
        scene.background = new THREE.Color(0xf0f0f0);

        // TODO: handle multiple cameras, possibly a drop down

        let camera = cameras[0];
        if (cameras.length > 1) {
                console.log("Multiple cameras found, using the first one.");
        }


        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        setRender(renderer);
        let controls = await setCtrl(camera, renderer, lookAt);

        let { mixer, action } = await setAnim(scene, camera);
        const stageHeight = action.getClip().duration * 400;
        stageElement.style.height = `${stageHeight}px`;

        let viewer = await setViewer(scene, renderer, camera);
        viewer
                .addSplatScene(`models/${splatName}`, {
                        showLoadingUI: true,
                        progressiveLoading: true,
                })
                .then(() => {
                        requestAnimationFrame(() => {
                                animate(viewer, mixer);
                        });
                });

        window.addEventListener("scroll", () => {
                handleScroll(action, stageElement);
        });
        window.addEventListener("resize", () => { handleResize(camera, renderer); });
        return { scene, camera, mixer, action, lookAt, viewer, controls, renderer };
}

//
//
// Animation loop
//
//

function animate(viewer: GSPLAT.Viewer, mixer: THREE.AnimationMixer) {
        requestAnimationFrame(() => animate(viewer, mixer));
        mixer.update(clock.getDelta());
        viewer.update();
        viewer.render();
}

