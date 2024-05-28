<script lang="ts">
    import * as SPLAT from "gsplat";
    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    const renderer = new SPLAT.WebGLRenderer();
    const controls = new SPLAT.OrbitControls(camera, renderer.canvas);
    const color = new SPLAT.Color32(50, 50, 50, 0);

    renderer.canvas.style.position = "fixed";
    renderer.backgroundColor = color;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position = new SPLAT.Vector3(
        -6.51976989357603,
        -1.144404726108678,
        -3.43753809993422,
    );
    camera.rotation = new SPLAT.Quaternion(
        -0.07613025951148068,
        0.5638710731365932,
        0.05230734433708954,
        0.8206811428288715,
    );

    async function main() {
        const url = "models/splat.splat";

        await SPLAT.Loader.LoadAsync(url, scene, () => {});

        const frame = () => {
            controls.update();
            renderer.render(scene, camera);
            console.log(camera.position, camera.rotation);

            requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
    }

    main();
</script>

<style>
</style>
