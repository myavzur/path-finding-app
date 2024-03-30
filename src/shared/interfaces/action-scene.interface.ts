import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper } from "three";
import { CSS2DRenderer, OrbitControls } from "three/examples/jsm/Addons.js";
import { Ground } from "../Ground";

export interface IActionScene {
	readonly scene: Scene;
	readonly camera: PerspectiveCamera;
	readonly renderer: WebGLRenderer;
	readonly renderer2D: CSS2DRenderer;
	readonly ground: Ground;
	readonly orbitControls: OrbitControls;
	readonly axesHelper: AxesHelper;

	start(): Promise<void>;
}
