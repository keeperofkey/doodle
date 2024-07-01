<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";
    import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
    import { onDestroy } from "svelte";

    export let modelName: string;
    export let splatName: string;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let mixer: any;
    let anim: any;
    let action: any;
    let clock: THREE.Clock;
    let renderer: THREE.WebGLRenderer;
    let viewer: GaussianSplats3D.Viewer;
    let shouldRender = false;

    $: if (action) {
        document.addEventListener("scroll", onScroll);
    }

    const splatUrl = `models/${splatName}`;
    const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        vertexColors: true,
        wireframeLinewidth: 1,
    });

    function init() {
        scene = new THREE.Scene();
        clock = new THREE.Clock();

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.position = "fixed";
        renderer.domElement.style.top = "0";
        renderer.domElement.style.zIndex = "-1";
        document.body.appendChild(renderer.domElement);

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const light = new THREE.AmbientLight();
        light.position.set(0, 0, 0);
        scene.add(light);
        scene.background = new THREE.Color(0xf5f5f5f5);
        scene.environment = pmremGenerator.fromScene(scene).texture;

        viewer = new GaussianSplats3D.Viewer({
            useBuiltInControls: false,
            renderer,
            threeScene: scene,
            selfDrivenMode: false,
            sharedMemoryForWorkers: true,
        });

        new GLTFLoader()
            .setPath("models/")
            .setMeshoptDecoder(MeshoptDecoder)
            .load(modelName, (gltf) => {
                anim = gltf.animations;
                camera = gltf.cameras[0];
                viewer.camera = camera;
                mixer = new THREE.AnimationMixer(gltf);
                action = mixer.clipAction(anim[0], camera);
                gltf.scene.traverse((model) => {
                    if (model.isMesh) {
                        model.material = mat;
                    }
                });
                // model.material = mat;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                action.play();
                action.paused = false;
                scene.add(gltf.scene);
                animate();
            });

        viewer
            .addSplatScene(splatUrl, {
                showLoadingUI: false,
                progressiveLoading: true,
            })
            .then(() => {
                requestAnimationFrame(animate);
            });

        window.addEventListener("resize", onWindowResize);
        document.addEventListener("scroll", onScroll);
    }
    function onScroll() {
        const stageElement = document.getElementById("stage");
        if (stageElement) {
            console.log(stageElement.scrollHeight);
            const scroll =
                window.scrollY /
                (stageElement.scrollHeight - window.innerHeight);
            const clampedScroll = Math.min(Math.max(scroll, 0), 0.99);
            action.time = clampedScroll * action.getClip().duration;
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
        const delta = clock.getDelta();
        if (mixer) {
            mixer.update(delta);
        }
        if (shouldRender) {
            render();
            shouldRender = false;
        }
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
        viewer.dispose();
    });
</script>
