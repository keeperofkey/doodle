export { setScene };

import { normalizeScroll } from "./maths";
import * as THREE from "three";
import * as GSPLAT from "@mkkellogg/gaussian-splats-3d";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { ctrlStore } from "./store";

// clock from animation scrubbing
let clock = new THREE.Clock();
let shouldRender = false;
let ctrlActive: Boolean = false;
ctrlStore.subscribe((value) => {
        ctrlActive = value;
})

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
        // renderer.domElement.style.position = "fixed";
        // renderer.domElement.style.top = "0";
        // renderer.domElement.style.width = "100%";
        // renderer.domElement.style.height = "100%";
        // renderer.domElement.style.zIndex = "-1";
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

async function setAnim(scene: THREE.Scene, camera: THREE.PerspectiveCamera, lookAt: THREE.Object3D) {
        const mixer = new THREE.AnimationMixer(scene);
        let lookTracks: THREE.KeyframeTrack[] = [];
        let camTracks: THREE.KeyframeTrack[] = [];
        const tracks = scene.animations[0].tracks;
        tracks.forEach((track) => {
                if (track.name.includes("Look_At")) {
                        lookTracks.push(track);
                } else if (track.name.includes("cam1")) {
                        camTracks.push(track);
                } else {
                        console.log("track not detected cause im lazy try naming it better");
                }
        })

        const lookClip = new THREE.AnimationClip("lookAt", -1, lookTracks);
        const lookAction = mixer.clipAction(lookClip, lookAt);
        const camClip = new THREE.AnimationClip("cam1", -1, camTracks);
        const camAction = mixer.clipAction(camClip, camera);


        lookAction.play();
        lookAction.paused = true;
        camAction.play();
        camAction.paused = true;
        return { mixer, camAction, lookAction };
}

// it works ok
//
// function setTrack(mixer: THREE.AnimationMixer, scene: THREE.Scene) {
//
//
// }

//
//
// set up scroll and resize handlers
//
// adjusts animation time to match scroll position

function handleScroll(
        camAction: THREE.AnimationAction,
        stageElement: HTMLElement,
        lookAction: THREE.AnimationAction,
) {
        if (stageElement) {
                const scroll = normalizeScroll(
                        window.scrollY,
                        stageElement.scrollHeight,
                        window.outerHeight,
                );
                camAction.time = scroll * camAction.getClip().duration;
                lookAction.time = scroll * lookAction.getClip().duration;
        }
        shouldRender = true;
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
        shouldRender = true;
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

        let { mixer, camAction, lookAction } = await setAnim(scene, camera, lookAt);
        const stageHeight = 24 * 400;
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
        console.log(viewer)

        window.addEventListener("scroll", () => {
                handleScroll(camAction, stageElement, lookAction);
        });
        window.addEventListener("resize", () => { handleResize(camera, renderer); });
        shouldRender = true;
        return { scene, camera, mixer, camAction, lookAt, viewer, controls, renderer };
}

//
//
// Animation loop
//
//

function animate(viewer: GSPLAT.Viewer, mixer: THREE.AnimationMixer) {
        requestAnimationFrame(() => animate(viewer, mixer));
        if (ctrlActive) {
                viewer.update();
                viewer.render();

        } else if (shouldRender) {
                mixer.update(clock.getDelta());
                viewer.update();
                viewer.render();
                shouldRender = false;

        }
}

