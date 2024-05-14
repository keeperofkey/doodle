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
        container.style.width = "100%";
        container.style.overflow = "auto";
        document.body.appendChild(container);

        scene = new THREE.Scene();

        // model
        new GLTFLoader()
            .setPath("models/")
            .setMeshoptDecoder(MeshoptDecoder)
            .load("mesh-one-anim-24.glb", function (gltf: any) {
                gltf.scene.up.set(0, 0, 1);

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
                // model.material = mat;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                console.log(model);
                console.log(camera);
                action.play();
                action.paused = true;
                // console.log(action)
                // console.log(camera)
                // console.log(mixer)
                document.addEventListener("scroll", onScroll);
                // window.addEventListener( 'click', onClick );
                // window.addEventListener("mousedown", onMouseDown);
                // window.addEventListener("mouseup", onMouseUp);
                window.addEventListener("resize", onWindowResize);
                console.log(model);
                scene.add(gltf.scene);
                animate();
            });

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
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
        // controls = new OrbitControls( camera, renderer.domElement );
        // controls.enableDamping = true;
        // controls.minDistance = 1;
        // controls.maxDistance = 10;
        // controls.target.set( 0, 0.35, 0 );
        // controls.update();
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
        // raycaster.setFromCamera( pointer, camera );

        // const intersects = raycaster.intersectObjects( scene.children )

        // for ( let i = 0; i < intersects.length; i ++ ) {
        //     focus = intersects[i].point
        // }
        renderer.render(scene, camera);
    }
</script>
