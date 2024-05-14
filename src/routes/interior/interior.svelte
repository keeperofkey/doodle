<script lang="ts">
    import * as SPLAT from "gsplat";

    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    const renderer = new SPLAT.WebGLRenderer();
    const controls = new SPLAT.OrbitControls(camera, renderer.canvas);

    renderer.backgroundColor = new SPLAT.Color32(255, 255, 255, 255);
    renderer.setSize(window.innerWidth, window.innerHeight);

    async function main() {
        const url = "models/twogs.ply";
        await SPLAT.PLYLoader.LoadAsync(url, scene, () => {});
        const frame = () => {
            controls.update();
            // console.log(camera.position, camera.rotation);
            renderer.render(scene, camera);
            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }

    main();
</script>

<style>
</style>
