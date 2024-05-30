<script lang="ts">
    import { onNavigate } from "$app/navigation";
    import * as SPLAT from "gsplat";
    import { onDestroy } from "svelte";

    export let modelUrl: string;
    export let camStart = new SPLAT.Vector3(0, 0, 0);
    export let camTarget = new SPLAT.Vector3(0, 0, 0);

    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    const renderer = new SPLAT.WebGLRenderer();
    const canvas = renderer.canvas;
    const controls = new SPLAT.OrbitControls(camera, canvas);
    const color = new SPLAT.Color32(50, 50, 50, 0);

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
    async function main() {
        const handleResize = () => {
            renderer.setSize(
                renderer.canvas.clientWidth,
                renderer.canvas.clientHeight,
            );
        };
        // ply files use different loader
        // const url = "models/twogs.ply";
        // await SPLAT.PLYLoader.LoadAsync(url, scene, () => {});

        const url = modelUrl;
        await SPLAT.Loader.LoadAsync(url, scene, () => {});

        const frame = () => {
            controls.update();
            renderer.render(scene, camera);

            requestAnimationFrame(frame);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        requestAnimationFrame(frame);
    }

    main();
    onNavigate(() => {
        canvas.remove();
    });
</script>
