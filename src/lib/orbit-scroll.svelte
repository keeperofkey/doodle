<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as THREE from "three";
    import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

    export let modelName: string;
    export let splatName: string;

    let scene: THREE.Scene;
    let orbitCamera: THREE.PerspectiveCamera;
    let camera: THREE.PerspectiveCamera;
    let mixer: THREE.AnimationMixer;
    let action: any;
    let lookAction: any;
    let orbitControls: any;
    let controlsActive = false;
    let clock = new THREE.Clock();
    let stageElement: HTMLElement;
    let shouldRender = false;
    let lookAt = new THREE.Object3D();
    let loaded = false;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const delta = clock.getDelta();
    const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        vertexColors: true,
        wireframeLinewidth: 1,
    });
    const viewer = new GaussianSplats3D.Viewer({
        useBuiltInControls: false,
        renderer: renderer,
        selfDrivenMode: false,
        sharedMemoryForWorkers: false,
        renderMode: GaussianSplats3D.RenderMode.OnChange,
    });

    $: if (loaded) {
        orbitControls = new GaussianSplats3D.OrbitControls(
            camera,
            renderer.domElement,
        );
        orbitControls.target = lookAt.position;
        orbitControls.enabled = false;
        if (!controlsActive) {
            orbitControls.domElement.style.touchAction = "auto";
        }
    }
    // // Set temp camera probably important
    // orbitCamera = viewer.camera;

    /**
     * Interpolates the position and rotation of the `from` camera towards the `to` camera.
     * @param from The camera to interpolate from.
     * @param to The target camera to interpolate towards.
     * @param t The interpolation factor between 0 and 1.
     */

    function lerpCameras(from: THREE.Camera, to: THREE.Camera, t: number) {
        from.position.lerp(to.position, t);
        from.quaternion.slerp(to.quaternion, t);
    }
    /**
     * Normalizes the scroll position to a value between 0 and 1.
     * @param scrollY The current scroll position.
     * @param scrollHeight The total scrollable height.
     * @param outerHeight The viewport height.
     * @returns The normalized scroll position between 0 and 1.
     */
    function normalizeScroll(
        scrollY: number,
        scrollHeight: number,
        outerHeight: number,
    ): number {
        const scroll = scrollY / (scrollHeight - outerHeight);
        return clamp(scroll, 0, 0.99);
    }

    /**
     * Clamps a value between a minimum and maximum value.
     * @param num The value to clamp.
     * @param min The minimum value.
     * @param max The maximum value.
     * @returns The clamped value.
     */
    function clamp(num: number, min: number, max: number): number {
        return Math.min(Math.max(num, min), max);
    }

    function init() {
        // Initialize the scene
        scene = new THREE.Scene();

        // Load the GLTF model
        new GLTFLoader()
            .setPath("models/")
            .setMeshoptDecoder(MeshoptDecoder)
            .load(modelName, (gltf: any) => {
                const anim = gltf.animations;
                camera = gltf.cameras[0];
                mixer = new THREE.AnimationMixer(gltf);
                // const model = gltf.scene.children[0];
                gltf.scene.traverse((child: any) => {
                    if (child.isMesh) {
                        child.material = mat;
                    }
                    if (child.name === "Look_At") {
                        lookAt = child;
                    }
                    // if (child.isCamera) {
                    //     camera = child;
                    // }
                });
                // model.material = mat;
                action = mixer.clipAction(anim[0], camera);
                lookAction = mixer.clipAction(anim[0], lookAt);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                action.play();
                lookAction.play();
                lookAction.paused = true;
                action.paused = true;
                scene.add(gltf.scene);
                viewer.camera = camera;
                viewer.threeScene = scene;
                loaded = true;
            });

        // Initialize the renderer
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.position = "fixed";
        renderer.domElement.style.top = "0";
        document.body.appendChild(renderer.domElement);

        // Set up lighting and environment
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const light = new THREE.AmbientLight();
        light.position.set(0, 0, 0);
        scene.add(light);

        scene.background = new THREE.Color(0xf5f5f5f5);
        scene.environment = pmremGenerator.fromScene(scene).texture;

        // Set renderer properties
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.outerWidth, window.outerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        // Initialize splats
        viewer
            .addSplatScene(`models/${splatName}`, {
                showLoadingUI: true,
                progressiveLoading: true,
            })
            .then(() => {
                requestAnimationFrame(animate);
            });
    }
    function toggleCamera() {
        controlsActive = !controlsActive;
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

    function handleScroll() {
        if (stageElement) {
            const scroll = normalizeScroll(
                window.scrollY,
                stageElement.scrollHeight,
                window.outerHeight,
            );
            action.time = scroll * action._clip.duration;
            lookAction.time = scroll * action._clip.duration;
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

        if (controlsActive) {
            orbitControls.update();
            // renderer.render(scene, orbitCamera);
            // shouldRender = false;
        } else {
            mixer.update(delta);
        }
        if (shouldRender) {
            renderer.render(scene, camera);
            shouldRender = false;
        }
        viewer.update();
        viewer.render();
    }

    onMount(() => {
        init();
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
    });

    onDestroy(() => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        renderer.domElement.remove();
        viewer.dispose();
    });
</script>

<main>
    <div
        class="flex flex-col place-content-start"
        style="height: 600dvh;"
        bind:this={stageElement}
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
</main>
