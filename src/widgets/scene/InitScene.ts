import { DirectLight } from "@/shared/DirectLight";
import { Grid } from "@/shared/Grid";
import { Ground } from "@/shared/Ground";
import { HemiLight } from "@/shared/HemiLight";
import { IActionScene } from "@/shared/interfaces";
import { Color, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export class InitScene implements IActionScene {
	readonly scene: Scene;
	readonly camera: PerspectiveCamera;
	readonly renderer: WebGLRenderer;
	readonly ground: Ground;
	readonly orbitControls: OrbitControls;

	constructor() {
		this.scene = new Scene();
		this.scene.background = new Color(0xffffff);

		// Ground
		this.ground = new Ground();
		this.scene.add(this.ground);

		// Grid
		this.scene.add(new Grid());

		// Lights
		this.scene.add(new DirectLight());
		this.scene.add(new HemiLight());

		const aspect = window.innerWidth / window.innerHeight;
		this.camera = new PerspectiveCamera(45, aspect, 0.1, 500);
		this.camera.position.set(-11.3, 50, 200);

		this.renderer = new WebGLRenderer();
		document.body.appendChild(this.renderer.domElement);

		this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
		this.orbitControls.maxPolarAngle = Math.PI / 2;

		this.onWindowResize();
		window.addEventListener("resize", this.onWindowResize);
	}

	private animate = () => {
		requestAnimationFrame(this.animate);
		this.renderer.render(this.scene, this.camera);
	};

	private onWindowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	async start() {
		this.animate();
	}
}
