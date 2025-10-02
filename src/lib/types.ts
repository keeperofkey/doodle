export type RenderMode = 'combined' | 'wireframe' | 'splat' | 'points';

export interface SceneComponents {
	scene: any;
	camera: any;
	mixer: any;
	camAction: any;
	lookAt: any;
	controls: any;
	renderer: any;
	splat: any;
	spark: any;
	mesh: any;
	cleanup: () => void;
	setRenderMode: (mode: RenderMode) => void;
}
