<script lang="ts">
    import * as THREE from "three";

    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
    import { onNavigate } from "$app/navigation";
    import { onDestroy } from "svelte";

    export let modelName: string;
    let action: THREE.AnimationAction;
    let mixer: THREE.AnimationMixer;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    let canvas = renderer.domElement;

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.zIndex = "-1";

    let Clock = new THREE.Clock();

    function init(this: any) {
        // model
        new GLTFLoader()
            .setPath("models/")
            .setMeshoptDecoder(MeshoptDecoder)
            .load(modelName, function (gltf: any) {
                gltf.scene.up.set(0, 0, 1);

                const anim = gltf.animations;
                camera = gltf.cameras[0];
                mixer = new THREE.AnimationMixer(gltf);
                action = mixer.clipAction(anim[0], camera);

                // const model = gltf.scene.children[0].children[0];
                // const mat = new THREE.MeshBasicMaterial({
                //     color: 0xffffff,
                //     wireframe: true,
                //     vertexColors: true,
                //     wireframeLinewidth: 5,
                // });
                // model.material = mat;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                action.play();
                action.paused = true;
                document.addEventListener("scroll", onScroll);
                window.addEventListener("resize", onWindowResize);
                scene.add(gltf.scene);
                animate();
            });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        document.body.appendChild(canvas);

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const light = new THREE.AmbientLight();
        light.position.set(0, 0, 0);
        scene.add(light);

        scene.background = new THREE.Color(0xf5f5f5f5);
        scene.environment = pmremGenerator.fromScene(scene).texture;
    }

    function onScroll() {
        // Normalize scroll position to 0-1
        let scroll =
            window.scrollY /
            (document.getElementsByClassName("container")[0].scrollHeight -
                window.innerHeight);
        // Clamp scroll position (0-1) insures you dont go out of animation bounds
        const clamp = (num: number, min: number, max: number) =>
            Math.min(Math.max(num, min), max);
        scroll = clamp(scroll, 0, 0.99);
        // Set the animation time to the scroll position mapped to the animation duration
        action.time = scroll * action.getClip().duration;
    }
    // let internalId: number;
    //
    // function onMouseDown() {
    //     // console.log('mouse down')
    //     internalId = setInterval(() => {
    //         if (scene.environment) {
    //         }
    //     }, 25);
    // }
    //
    // function onMouseUp() {
    //     // console.log('mouse up')
    //     model.rotation.set(0, 0, 0);
    //     clearInterval(internalId);
    // }
    //
    // window.addEventListener("mousedown", onMouseDown);
    // window.addEventListener("mouseup", onMouseUp);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //

    function animate() {
        requestAnimationFrame(animate);

        const delta = Clock.getDelta();

        mixer.update(delta);

        // controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

        render();
    }

    function render() {
        renderer.render(scene, camera);
    }
    init();
    onNavigate(() => {
        renderer.clear();
        canvas.remove();
    });
</script>
