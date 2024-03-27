import { SceneConnector } from "@/entities/SceneConnector";
import { HousePainter } from "@/features/HousePainter";
import { PathPainter } from "@/features/PathPainter";
import { AssetTitle } from "@/shared/constants/assets-config";
import { IActionScene } from "@/shared/interfaces";
import { Group, Mesh, Object3D, Raycaster, Vector2 } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

export class MainFlowScene {
	readonly actionScene: IActionScene;
	readonly assetMap: Map<string, GLTF>;
	readonly raycaster: Raycaster = new Raycaster();

	private sceneConnector = new SceneConnector();
	private housePainter: HousePainter | null = null;
	pathPainter: PathPainter | null = null;

	constructor(actionScene: IActionScene, assetMap: Map<string, GLTF>) {
		this.actionScene = actionScene;
		this.assetMap = assetMap;

		this.sceneConnector.getPointerPosition = this.getPointerPosition.bind(this);
		this.sceneConnector.getIntersectWithGround = this.getIntersectWithGround.bind(this);
		this.sceneConnector.getIntersectWithScene = this.getIntersectWithScene.bind(this);
		this.sceneConnector.addMeshToScene = this.addMeshToScene.bind(this);
		this.sceneConnector.removeMeshFromScene = this.removeMeshFromScene.bind(this);
	}

	async start() {
		this.housePainter = new HousePainter(this.sceneConnector, this.assetMap);
		this.pathPainter = new PathPainter(this.sceneConnector);
	}

	mountDraftHouseOnScene(assetTitle: AssetTitle) {
		this.housePainter?.mountDraftHouseOnScene(assetTitle);
	}

	private addMeshToScene(element: Object3D | Group | Mesh) {
		this.actionScene.scene.add(element);
	}

	private removeMeshFromScene(element: Object3D | Group | Mesh) {
		this.actionScene.scene.remove(element);
	}

	private getPointerPosition(event: PointerEvent | MouseEvent) {
		const pointer = new Vector2();

		// From: https://github.com/mrdoob/three.js/blob/ef80ac74e6716a50104a57d8add6c8a950bff8d7/examples/webgl_geometry_terrain_raycast.html#L243
		pointer.x =
			(event.clientX / this.actionScene.renderer.domElement.clientWidth) * 2 - 1;
		pointer.y =
			-(event.clientY / this.actionScene.renderer.domElement.clientHeight) * 2 + 1;

		return pointer;
	}

	private getIntersectWithGround(pointer: Vector2) {
		this.raycaster.setFromCamera(pointer, this.actionScene.camera);
		return this.raycaster.intersectObject(this.actionScene.ground)[0];
	}

	private getIntersectWithScene(pointer: Vector2) {
		this.raycaster.setFromCamera(pointer, this.actionScene.camera);
		return this.raycaster.intersectObjects(this.actionScene.scene.children, true);
	}
}
