import { DirectLight } from "@/shared/DirectLight";
import { Grid } from "@/shared/Grid";
import { Ground, groundGeometryConfig } from "@/shared/Ground";
import { HemiLight } from "@/shared/HemiLight";
import { IActionScene } from "@/shared/interfaces";
import debounce from "lodash.debounce";
import { AxesHelper, Color, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { CSS2DRenderer, OrbitControls } from "three/examples/jsm/Addons.js";

/** Занимается инициализацией базовой сцены.
 * - Задает изначальную позицию для камеры, соотношение сторон.
 * - Рендер сцены с базовыми мешами (ground, grid, lights)
 * - Вспомогательные инструменты (axisHelper, orbitControls)
 */
export class InitScene implements IActionScene {
	readonly scene: Scene;
	readonly camera: PerspectiveCamera;
	readonly renderer: WebGLRenderer;
	readonly renderer2D: CSS2DRenderer;
	readonly ground: Ground;
	readonly orbitControls: OrbitControls;
	readonly axesHelper: AxesHelper;

	onChangeCamera = debounce(() => {
		localStorage.setItem(
			"camera",
			JSON.stringify({
				position: this.camera.position
			})
		);
	}, 100);

	constructor() {
		this.scene = new Scene();
		this.scene.background = new Color(0xffffff);

		// Scene - Ground
		this.ground = new Ground();
		this.scene.add(this.ground);

		// Scene - Grid
		this.scene.add(new Grid());

		// Scene - Lights
		this.scene.add(new DirectLight());
		this.scene.add(new HemiLight());

		// Camera
		const aspect = window.innerWidth / window.innerHeight;
		this.camera = new PerspectiveCamera(45, aspect, 0.1, 500);
		this.camera.position.set(...this.getSafeCameraPosition());

		// Renderer - WebGL
		this.renderer = new WebGLRenderer({ alpha: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);

		// Renderer - CSS2D
		this.renderer2D = new CSS2DRenderer();
		this.renderer2D.domElement.style.position = "absolute";
		this.renderer2D.domElement.style.top = "0px";
		document.body.append(this.renderer.domElement, this.renderer2D.domElement);

		// Orbit Controls
		this.orbitControls = new OrbitControls(this.camera, this.renderer2D.domElement);
		this.orbitControls.maxPolarAngle = Math.PI / 2;
		this.orbitControls.addEventListener("change", this.onChangeCamera);

		// Axes Helper
		this.axesHelper = new AxesHelper(groundGeometryConfig.width / 2);

		this.onWindowResize();
		window.addEventListener("resize", this.onWindowResize);
	}

	private animate = () => {
		requestAnimationFrame(this.animate);
		this.renderer.render(this.scene, this.camera);
		this.renderer2D.render(this.scene, this.camera);
	};

	private onWindowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer2D.setSize(window.innerWidth, window.innerHeight);
	};

	private getSafeCameraPosition(): [number, number, number] {
		const cameraData = localStorage.getItem("camera");
		if (!cameraData)
			return [11.355728920849053, 50.57971647550468, 100.31142433676645];
		const position = JSON.parse(cameraData).position;
		return [position.x, position.y, position.z];
	}

	async start() {
		this.animate();
	}
}
