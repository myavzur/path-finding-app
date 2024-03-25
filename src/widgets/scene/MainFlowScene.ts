import { HousePainter } from "@/features/HousePainter";
import { IActionScene } from "@/shared/interfaces";
import { Group, Mesh, Object3D, Raycaster, Vector2 } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

export class MainFlowScene {
	readonly actionScene: IActionScene;
	readonly assetMap: Map<string, GLTF>;
	readonly raycaster: Raycaster = new Raycaster();

	private housePainter: HousePainter | null = null;


	constructor(actionScene: IActionScene, assetMap: Map<string, GLTF>) {
		this.actionScene = actionScene;
		this.assetMap = assetMap;
	}

	async start() {
		this.housePainter = new HousePainter(this.assetMap);
		this.housePainter.getPointerPosition = this.getPointerPosition.bind(this);
		this.housePainter.getIntersectWithGround = this.getIntersectWithGround.bind(this);
		this.housePainter.addElementToScene = this.addElementToScene.bind(this);
	}

	mountDraftHouseOnScene(title: string) {
		this.housePainter?.mountDraftHouseOnScene(title);
	}

	private addElementToScene(element: Object3D | Group | Mesh) {
		this.actionScene.scene.add(element);
	}

	private getPointerPosition(event: PointerEvent | MouseEvent) {
		const pointer = new Vector2();

		// From: https://github.com/mrdoob/three.js/blob/ef80ac74e6716a50104a57d8add6c8a950bff8d7/examples/webgl_geometry_terrain_raycast.html#L243
    pointer.x = (event.clientX / this.actionScene.renderer.domElement.clientWidth) * 2 - 1;
    pointer.y = -(event.clientY / this.actionScene.renderer.domElement.clientHeight) * 2 + 1;

    return pointer;
	}

	private getIntersectWithGround(pointer: Vector2) {
		this.raycaster.setFromCamera(pointer, this.actionScene.camera);
		return this.raycaster.intersectObject(this.actionScene.ground)[0];
	}
}