export { setScene };

import { normalizeScroll } from "./maths";
import {
        Scene, ACESFilmicToneMapping, WebGLRenderer, PerspectiveCamera, Object3D,
        Mesh, AnimationClip, AnimationMixer, KeyframeTrack, AnimationAction, Color,
        AmbientLight, MeshBasicMaterial, Clock
} from "three";
import { Viewer, RenderMode } from "@mkkellogg/gaussian-splats-3d";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// clock from animation scrubbing
let clock = new Clock();

/////////
//
// GLTF
//
/////////

async function loadGLTF(modelName: string) {
        const loader = new GLTFLoader();
        let cameras: any[] = [];
        let lookAt = new Object3D();
        let scene = new Scene();
        let mesh = new Mesh();
        let camera = new PerspectiveCamera(
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
                                        const mat = new MeshBasicMaterial({
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

//////////////
//
// RENDERING
//
//////////////

async function setViewer(
        scene: Scene,
        renderer: WebGLRenderer,
        camera: PerspectiveCamera,
) {
        let viewer = new Viewer({
                useBuiltInControls: false,
                camera: camera,
                threeScene: scene,
                renderer: renderer,
                selfDrivenMode: false,
                sharedMemoryForWorkers: false,
                // logLevel: GSPLAT.LogLevel.Debug,
                renderMode: RenderMode.OnChange,
        });
        return viewer;
}


function setRender(renderer: WebGLRenderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;

        // TODO: this is required for splats to render into scene
        // canvas is not getting splat updates for somereason otherwise
        document.body.appendChild(renderer.domElement);
}

/////////////////////////////////////////////////
//
// Set up orbitControls and camera animations
//
////////////////////////////////////////////////

async function setCtrl(camera: PerspectiveCamera, renderer: WebGLRenderer, lookAt: Object3D) {
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enabled = false;
        controls.target = lookAt.position;
        return controls;

}

// TODO: it works ok. but its not very elegent

async function setAnim(scene: Scene, camera: PerspectiveCamera, lookAt: Object3D) {
        const mixer = new AnimationMixer(scene);
        let lookTracks: KeyframeTrack[] = [];
        let camTracks: KeyframeTrack[] = [];
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

        const lookClip = new AnimationClip("lookAt", -1, lookTracks);
        const lookAction = mixer.clipAction(lookClip, lookAt);
        const camClip = new AnimationClip("cam1", -1, camTracks);
        const camAction = mixer.clipAction(camClip, camera);


        lookAction.play();
        lookAction.paused = true;
        camAction.play();
        camAction.paused = true;
        return { mixer, camAction, lookAction };
}


///////////////
//
// HANDLERS
//
// adjusts animation time to match scroll position

function handleScroll(
        camAction: AnimationAction,
        stageElement: HTMLElement,
        lookAction: AnimationAction,
        renderer: WebGLRenderer,
        camera: PerspectiveCamera,
        mixer: AnimationMixer,
        viewer: any,
        scene: Scene,
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
        animate(scene, camera, viewer, mixer, renderer);
}
function handleResize(
        camera: PerspectiveCamera,
        renderer: WebGLRenderer,
        mixer: AnimationMixer,
        viewer: any,
        scene: Scene,
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
        animate(scene, camera, viewer, mixer, renderer);
}


////////////////////////////////////
//
// Setup the scene main entry point
//
////////////////////////////////////

async function setScene(
        modelName: string,
        splatName: string,
        renderer: WebGLRenderer,
        stageElement: HTMLElement,
) {
        // Initialize the scene
        let { scene, cameras, lookAt } = await loadGLTF(modelName);
        // Add lights and set camera
        let light = new AmbientLight(0xffffff);
        scene.add(light);
        scene.background = new Color(0xe8edee);

        // TODO: handle multiple cameras, possibly a drop down

        let camera = cameras[0];
        if (cameras.length > 1) {
                console.log("Multiple cameras found, using the first one.");
        }


        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        setRender(renderer);

        let controls = await setCtrl(camera, renderer, lookAt);
        controls.addEventListener("change", () => { render(viewer) });

        let { mixer, camAction, lookAction } = await setAnim(scene, camera, lookAt);
        const stageHeight = 24 * 400;
        stageElement.style.height = `${stageHeight}px`;

        let viewer = await setViewer(scene, renderer, camera);
        viewer
                .addSplatScene(`models/${splatName}`, {
                        showLoadingUI: false,
                        progressiveLoading: true,
                })
                .then(() => {
                        animate(scene, camera, viewer, mixer, renderer);
                });

        window.addEventListener("scroll", () => {
                handleScroll(camAction, stageElement, lookAction, renderer, camera, mixer, viewer, scene);
        });
        window.addEventListener("resize", () => { handleResize(camera, renderer, mixer, viewer, scene); });
        return { scene, camera, mixer, camAction, lookAt, viewer, controls, renderer };
}

//////////////////
//
// Animation loop
//
//////////////////

function render(viewer: any) {
        requestAnimationFrame(render);
        viewer.update();
        viewer.render();
}

function animate(scene: Scene, camera: PerspectiveCamera, viewer: any, mixer: AnimationMixer, renderer: WebGLRenderer) {
        renderer.render(scene, camera);
        mixer.update(clock.getDelta());
        viewer.update();
        viewer.render();
}

