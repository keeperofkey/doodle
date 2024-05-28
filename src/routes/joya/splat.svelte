<script lang="ts">
    import * as SPLAT from "gsplat";
    // const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    const canvas = document.getElementById("splat") as HTMLCanvasElement;
    const three = document.getElementById("three") as HTMLCanvasElement;
    const renderer = new SPLAT.WebGLRenderer(canvas);
    const controls = new SPLAT.OrbitControls(camera, canvas);
    const color = new SPLAT.Color32(50, 50, 50, 0);

    three.style.display = "none";
    canvas.style.display = "block";
    canvas.style.zIndex = "-1";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.top = "0px";
    renderer.backgroundColor = color;

    camera.position = new SPLAT.Vector3(0, 0, 15);
    controls.setCameraTarget(new SPLAT.Vector3(0, 0, 0));
    controls.orbitSpeed = 0.5;
    async function main() {
        function handlePointerDown(event) {
            console.log("pointer down");
            canvas.setPointerCapture(event.pointerId);
        }

        function handlePointerUp(event) {
            canvas.releasePointerCapture(event.pointerId);
        }
        const handleResize = () => {
            renderer.setSize(
                renderer.canvas.clientWidth,
                renderer.canvas.clientHeight,
            );
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
        canvas.addEventListener("pointerdown", handlePointerDown);
        canvas.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("resize", handleResize);
        // window.addEventListener("pointerdown", handlePointerDown);
        // window.addEventListener("pointerup", handlePointerUp);

        renderer.dispose();
        requestAnimationFrame(frame);
    }

    main();
</script>
