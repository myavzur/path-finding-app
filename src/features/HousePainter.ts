import { SceneConnector } from "@/entities/SceneConnector";
import { House } from "@/shared/House";
import { GLTF } from "three/examples/jsm/Addons.js";

export class HousePainter {
	private draftHouse: House | null = null;

	constructor(
		private sceneConnector: SceneConnector,
		private assetMap: Map<string, GLTF>
	) {
		this.assetMap = assetMap;

		window.addEventListener("dblclick", this.handleDoubleClick);
	}

	private handleDoubleClick = (e: PointerEvent | MouseEvent) => {
		const pointer = this.sceneConnector.getPointerPosition?.(e);
		if (!pointer) return;

		const intersect = this.sceneConnector.getIntersectWithGround?.(pointer);
		if (!intersect) return;

		this.draftHouse?.moveHouseTo(intersect.point);
	};

	private handleSaveHouse = () => {
		if (!this.draftHouse) return;
		this.draftHouse.setOpacity(1);
		this.draftHouse = null;
	};

	mountDraftHouseOnScene(title: string) {
		console.log("title :>> ", title);

		const houseGLTF = this.assetMap.get(title);
		if (!houseGLTF) return;

		const houseMesh = houseGLTF.scene.clone(true);
		const house = new House(houseMesh);
		house.setOpacity(0.5);
		house.onSaveHouse = this.handleSaveHouse;

		this.draftHouse = house;

		this.sceneConnector.addMeshToScene?.(house.mesh);
	}
}
