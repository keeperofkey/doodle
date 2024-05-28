<script lang="ts">
    import * as SPLAT from "gsplat";
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    const renderer = new SPLAT.WebGLRenderer(canvas);
    const controls = new SPLAT.OrbitControls(camera, canvas);
    const color = new SPLAT.Color32(50, 50, 50, 0);

    // renderer.canvas.style.position = "fixed";
    renderer.canvas.style.zIndex = "0";
    renderer.backgroundColor = color;
    // renderer.setSize(window.innerWidth, window.innerHeight);

    async function main() {
        const handleResize = () => {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        };
        // ply files use different loader
        // const url = "models/twogs.ply";
        // await SPLAT.PLYLoader.LoadAsync(url, scene, () => {});

        const url = "models/cans.splat";
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
</script>
