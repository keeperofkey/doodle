import { Scene, AnimationMixer, AnimationClip, MeshBasicMaterial, Object3D, PerspectiveCamera, AmbientLight, WebGLRenderer } from 'three';
import { OrbitControls, Viewer } from "@mkkellogg/gaussian-splats-3d"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
export { loadModel, setupScene, normalizeScroll, setupViewer };

async function loadModel(modelName: string) {
        const loader = new GLTFLoader();
        loader.setPath('models/');
        loader.setMeshoptDecoder(MeshoptDecoder);

        return new Promise((resolve, reject) => {
                loader.load(modelName, resolve, undefined, reject);
        });
}

function setupScene(gltf: any) {
        const scene = new Scene();
        // const camera = gltf.cameras[0];
        const mixer = new AnimationMixer(gltf.scene);
        let lookAt = new Object3D()
        let camera = new PerspectiveCamera()
        const mat = new MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
                vertexColors: true,
                wireframeLinewidth: 1,
        });
        // console.log(gltf.scene);
        gltf.scene.traverse((child: any) => {
                if (child.isMesh) {
                        child.material = mat;
                }
                if (child.isCamera) {
                        camera = child;
                }
                if (child.name === 'Look_At') {
                        lookAt = child;
                }
        });

        const animations = gltf.animations;
        const animationClips = animations.map((anim: any) => new AnimationClip(anim.name, anim.duration, anim.tracks));
        const action = mixer.clipAction(animationClips[0]);
        action.play();
        action.paused = true;

        scene.add(gltf.scene);
        const light = new AmbientLight();
        light.position.set(0, 0, 0);
        scene.add(light);

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        return { scene, camera, mixer, action, lookAt };
}
function setupViewer(scene: Scene, renderer: WebGLRenderer, camera: PerspectiveCamera, lookAt: Object3D, canvas: HTMLCanvasElement) {

        const viewer = new Viewer({
                useBuiltInControls: false,
                camera: camera,
                threeScene: scene,
                renderer: renderer,
                selfDrivenMode: false,
                sharedMemoryForWorkers: false,
                // renderMode: GaussianSplats3D.RenderMode.OnChange,
        });

        const orbitControls = new OrbitControls(
                camera,
                canvas
        );
        orbitControls.target = lookAt.position;
        orbitControls.enabled = false;
        return { viewer, orbitControls };

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

// async function main() {
//         const gltf = await loadModel(modelName);
//         const { scene, camera, mixer, action } = setupScene(gltf);
//
//         // Set up your renderer and animation loop here
//         // ...
//
//         function animate() {
//                 requestAnimationFrame(animate);
//                 const clock = new Clock();
//                 mixer.update(clock.getDelta());
//                 // Render your scene
//         }
//
//         animate();
// }
//
// main();
