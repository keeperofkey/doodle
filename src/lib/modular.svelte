<script lang="ts">
    export let modelName: string;
    export let splatName: string;

    import {
        loadModel,
        setupScene,
        normalizeScroll,
        setupViewer,
    } from "./utils";
    import {
        Clock,
        WebGLRenderer,
        ACESFilmicToneMapping,
        Scene,
        PerspectiveCamera,
        AnimationMixer,
        AnimationAction,
        Object3D,
        Color,
        PMREMGenerator,
    } from "three";
    import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
    import { onMount, onDestroy } from "svelte";

    let canvas: HTMLCanvasElement;
    let stageElement: HTMLElement;
    let controlsActive = false;
    let shouldRender = false;
    let renderer: WebGLRenderer;
    let orbitControls: any;
    let viewer: any;
    let scene: Scene;
    let camera: PerspectiveCamera;
    let mixer: AnimationMixer;
    let lookAt: Object3D;
    let action: AnimationAction;

    const clock = new Clock();
    $: if (viewer) {
    }

    onMount(() => {
        shouldRender = true;
        loadModel(modelName).then((gltf) => {
            ({ scene, camera, action, mixer, lookAt } = setupScene(gltf));
            ({ viewer, orbitControls } = setupViewer(
                scene,
                renderer,
                camera,
                lookAt,
                canvas,
            ));
            viewer
                .addSplatScene(`models/${splatName}`, {
                    showLoadingUI: true,
                    progressiveLoading: true,
                })
                .then(() => {
                    // viewer.start();
                    requestAnimationFrame(animate);
                });
            console.log(scene);
            // return { scene, camera, action, mixer, lookAt };
            // const pmremGenerator = new PMREMGenerator(renderer);
            scene.background = new Color(0xf5f5f5f5);
            // scene.environment = pmremGenerator.fromScene(scene).texture;
            window.addEventListener("scroll", handleScroll);
            window.addEventListener("resize", handleResize);
            renderer = new WebGLRenderer({ canvas: canvas, antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.outerWidth, window.outerHeight);
            renderer.toneMapping = ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            // viewer = new GaussianSplats3D.Viewer({
            //     useBuiltInControls: false,
            //     camera: camera,
            //     threeScene: scene,
            //     renderer: renderer,
            //     selfDrivenMode: false,
            //     sharedMemoryForWorkers: false,
            //     // renderMode: GaussianSplats3D.RenderMode.OnChange,
            // });
            //
            // orbitControls = new GaussianSplats3D.OrbitControls(
            //     camera,
            //     renderer.domElement,
            // );
            // orbitControls.target = lookAt.position;
            // orbitControls.enabled = false;
            if (!controlsActive) {
                orbitControls.domElement.style.touchAction = "auto";
            }
            // ...
            // ...
            action.play();
            action.paused = true;
            // ...
            // ...
            // ...
            // ...

            // animate();\
        });
    });

    function toggleCamera() {
        controlsActive = !controlsActive;
        if (orbitControls && renderer) {
            if (controlsActive) {
                orbitControls.enabled = true;
                renderer.domElement.style.zIndex = "0";
            } else {
                orbitControls.enabled = false;
                renderer.domElement.style.zIndex = "-1";
                window.scrollBy(0, 1);
            }
            shouldRender = true;
        }
    }
    function handleScroll() {
        if (stageElement) {
            const scroll = normalizeScroll(
                window.scrollY,
                stageElement.scrollHeight,
                window.outerHeight,
            );
            action.time = scroll * action.getClip().duration;
            // lookAction.time = scroll * action._clip.duration;
            shouldRender = true;
        }
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.outerHeight);
        shouldRender = true;
    }
    function animate() {
        requestAnimationFrame(animate);
        if (viewer) {
            viewer.update();
            viewer.render();
        }
        if (controlsActive) {
            orbitControls.update();
            // renderer.render(scene, orbitCamera);
            // shouldRender = false;
        } else {
            mixer.update(clock.getDelta());
        }
        if (shouldRender) {
            renderer.render(scene, camera);
            shouldRender = false;
        }
    }
    onDestroy(() => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        // renderer.dispose();
        // renderer.domElement.remove();
    });
</script>

<canvas bind:this={canvas} class="block fixed top-0 w-full h-full" />
<div
    bind:this={stageElement}
    style="height: 600dvh;"
    class="flex flex-col place-content-center"
    id="stage"
>
    <button
        class="fixed top-4 right-4 font-bold text-xl p-2 w-24 h-12 z-10 self-center bg-slate-100 border-2 rounded-lg hover:bg-slate-100 hover:shadow-inner shadow-lg"
        class:border-black={!controlsActive}
        class:border-dashed={controlsActive}
        on:click={toggleCamera}
    >
        {controlsActive ? "\u{1F4F9} \u{1F513}" : "\u{1F4F9}  \u{1F512}"}
    </button>
</div>
