<script lang="ts">
    import { onMount } from "svelte";
    import { onNavigate } from "$app/navigation";
    import * as SPLAT from "gsplat";
    import { onDestroy } from "svelte";

    export let modelUrl: string;
    export let camStart = new SPLAT.Vector3(0, 0, 0);
    export let camTarget = new SPLAT.Vector3(0, 0, 0);

    let scene = new SPLAT.Scene();
    let camera = new SPLAT.Camera();
    let renderer = new SPLAT.WebGLRenderer();
    let canvas = renderer.canvas;
    let controls = new SPLAT.OrbitControls(camera, canvas);

    const color = new SPLAT.Color32(50, 50, 50, 0);

    function createScene() {
        canvas.style.display = "block";
        canvas.style.zIndex = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = "fixed";
        canvas.style.top = "0px";
        renderer.backgroundColor = color;

        camera.position = camStart;
        controls.setCameraTarget(camTarget);
        controls.orbitSpeed = 0.5;
    }

    function destroyScene() {
        if (scene) {
            scene.reset();
        }
        if (renderer) {
            renderer.dispose();
        }
        if (controls) {
            controls.dispose();
        }
    }

    async function main() {
        createScene();

        const handleResize = () => {
            if (renderer) {
                renderer.setSize(
                    renderer.canvas.clientWidth,
                    renderer.canvas.clientHeight,
                );
            }
        };

        const url = modelUrl;
        await SPLAT.Loader.LoadAsync(url, scene, () => {});

        const frame = () => {
            if (controls && renderer && scene && camera) {
                controls.update();
                renderer.render(scene, camera);
                requestAnimationFrame(frame);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        requestAnimationFrame(frame);
    }
    onMount(() => {
        main();
    });

    // main();

    // onNavigate(() => {
    //     destroyScene();
    // });

    onDestroy(() => {
        destroyScene();
        canvas.remove();
    });
</script>
