<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";
    import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
    import { onDestroy } from "svelte";

    export let modelName: string;
    export let splatName: string;
    let shouldRender = false;
    const scene = new THREE.Scene();
    let camera: THREE.PerspectiveCamera;
    let mixer: any;
    let anim: any;

    let action: any;
    $: if (action) {
        // Add event listeners when action is assigned
        document.addEventListener("scroll", onScroll);
    }

    const splatUrl = "models/" + splatName;

    // Initialize the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const canvas = renderer.domElement;

    // Set canvas styles
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.zIndex = "-1";

    let Clock = new THREE.Clock();
    const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        vertexColors: true,
        wireframeLinewidth: 1,
    });

    // Initialize the Gaussian Splats viewer
    const viewer = new GaussianSplats3D.Viewer({
        useBuiltInControls: false,
        renderer: renderer,
        threeScene: scene,
        selfDrivenMode: true,
        sharedMemoryForWorkers: false,
    });

    function init() {
        // Load the GLTF model
        new GLTFLoader()
            .setPath("models/")
            .setMeshoptDecoder(MeshoptDecoder)
            .load(modelName, (gltf: any) => {
                // gltf.scene.up.set(0, 1, 0);

                anim = gltf.animations;
                camera = gltf.cameras[0];
                viewer.camera = camera;
                mixer = new THREE.AnimationMixer(gltf);
                action = mixer.clipAction(anim[0], camera);
                const model = gltf.scene.children[0];
                model.material = mat;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                action.play();
                action.paused = true;
                scene.add(gltf.scene);
                animate();
            });

        // Add event listeners for scroll and window resize
        // document.addEventListener("scroll", onScroll);
        // window.addEventListener("resize", onWindowResize);
        window.addEventListener("resize", onWindowResize);

        // Set renderer properties
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        document.body.appendChild(canvas);

        // Set up lighting and environment
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const light = new THREE.AmbientLight();
        light.position.set(0, 0, 0);
        scene.add(light);

        scene.background = new THREE.Color(0xf5f5f5f5);
        scene.environment = pmremGenerator.fromScene(scene).texture;

        // Add Gaussian Splats scene
        viewer
            .addSplatScene(splatUrl, {
                showLoadingUI: false,
                progressiveLoading: true,
            })
            .then(() => {
                requestAnimationFrame(animate);
            });
    }

    function onScroll() {
        const stageElement = document.getElementById("stage");
        if (stageElement) {
            // Normalize scroll position to 0-1
            let scroll =
                window.scrollY /
                (stageElement.scrollHeight - window.innerHeight);
            // Clamp scroll position (0-1) insures you don't go out of animation bounds
            const clamp = (num: number, min: number, max: number) =>
                Math.min(Math.max(num, min), max);
            scroll = clamp(scroll, 0, 0.99);
            // Set the animation time to the scroll position mapped to the animation duration
            action.time = scroll * action.getClip().duration;
            shouldRender = true;
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        shouldRender = true;
    }

    function animate() {
        requestAnimationFrame(animate);

        const delta = Clock.getDelta();

        mixer.update(delta);

        // controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

        if (shouldRender) {
            render();
            shouldRender = false;
        }
        // render();
    }

    function render() {
        renderer.render(scene, camera);
        viewer.update();
        viewer.render();
    }

    onMount(() => {
        init();
        shouldRender = true;
    });

    onDestroy(() => {
        renderer.dispose();
        canvas.remove();
        viewer.dispose();
    });
</script>
