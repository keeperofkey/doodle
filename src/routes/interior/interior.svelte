<script lang="ts">
    import * as SPLAT from "gsplat";
    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    const three = document.getElementById("three") as HTMLCanvasElement;
    const canvas = document.getElementById("splat") as HTMLCanvasElement;
    const renderer = new SPLAT.WebGLRenderer(canvas);
    const controls = new SPLAT.OrbitControls(camera, canvas);
    const color = new SPLAT.Color32(50, 50, 50, 0);
    three.style.display = "none";
    canvas.style.position = "fixed";
    canvas.style.zIndex = "-1";
    canvas.style.top = "0px";
    canvas.style.display = "block";
    renderer.backgroundColor = color;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position = new SPLAT.Vector3(-8, 0, -2);
    controls.setCameraTarget(new SPLAT.Vector3(0, 0, -1));

    async function main() {
        const handleResize = () => {
            renderer.setSize(
                renderer.canvas.clientWidth,
                renderer.canvas.clientHeight,
            );
        };
        // const url = "models/twogs.ply";
        const url = "models/splat.splat";

        await SPLAT.Loader.LoadAsync(url, scene, () => {});
        // await SPLAT.PLYLoader.LoadAsync(url, scene, () => {});

        const frame = () => {
            controls.update();
            renderer.render(scene, camera);

            requestAnimationFrame(frame);
        };

        renderer.dispose();
        handleResize();
        window.addEventListener("resize", handleResize);
        requestAnimationFrame(frame);
    }

    main();
</script>

<style>
</style>
