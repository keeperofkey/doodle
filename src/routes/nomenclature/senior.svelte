<script lang="ts">
    import * as THREE from "three";

    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

    let camera: THREE.PerspectiveCamera,
        scene: THREE.Scene,
        renderer: THREE.WebGLRenderer;
    let model: THREE.Object3D;
    let mat: THREE.MeshBasicMaterial;
    let anim: THREE.AnimationClip[];
    let mixer: THREE.AnimationMixer;
    let action: THREE.AnimationAction;
    const Clock = new THREE.Clock();
    init();
    // animate();
    function init(this: any) {
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.zIndex = "-1";
        // container.style.width = "100%";
        // container.style.overflow = "auto";
        document.body.appendChild(container);

        scene = new THREE.Scene();

        // model
        new GLTFLoader()
            .setPath("models/")
            .setMeshoptDecoder(MeshoptDecoder)
            .load("senior-anim-24.glb", function (gltf: any) {
                anim = gltf.animations;
                camera = gltf.cameras[0];
                mixer = new THREE.AnimationMixer(gltf);
                action = mixer.clipAction(anim[0], camera);

                model = gltf.scene.children[0].children[0];
                mat = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    wireframe: true,
                    vertexColors: true,
                    wireframeLinewidth: 5,
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

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        container.appendChild(renderer.domElement);

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
            window.scrollY / (document.body.scrollHeight - window.innerHeight);
        // Clamp scroll position (0-1) insures you dont go out of animation bounds
        const clamp = (num: number, min: number, max: number) =>
            Math.min(Math.max(num, min), max);
        scroll = clamp(scroll, 0, 0.99);
        // Set the animation time to the scroll position mapped to the animation duration
        action.time = scroll * action.getClip().duration;
        //  console.log(action.time)
        //  console.log(scroll)
    }

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
</script>
