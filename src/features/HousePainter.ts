import { House } from "@/shared/House";
import { Intersection, Object3D, Vector2, Object3DEventMap, Mesh, Group } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

type GetPointerPosition = (event: PointerEvent | MouseEvent) => Vector2;
type GetIntersectWithGround = (pointer: Vector2) => Intersection<Object3D<Object3DEventMap>>;
type AddElementToScene = (element: Object3D | Group | Mesh) => void;

export class HousePainter {
	private assetMap: Map<string, GLTF> = new Map();
	private draftHouse: House | null = null;

	getPointerPosition: GetPointerPosition | null = null;
	getIntersectWithGround: GetIntersectWithGround | null = null;
	addElementToScene: AddElementToScene | null = null;

	constructor(assetMap: Map<string, GLTF>) {
		this.assetMap = assetMap;

		window.addEventListener("dblclick", (e) => {
			const pointer = this.getPointerPosition?.(e);
			if (!pointer) return;

			const intersect = this.getIntersectWithGround?.(pointer);
			if (!intersect) return;

			this.draftHouse?.moveHouseTo(intersect.point);
		});

		window.addEventListener("keydown", (e) => {
			if (e.key === "Enter" && this.draftHouse) {
				this.draftHouse.setOpacity(1);
				this.draftHouse = null;
			}
		});
	}

	mountDraftHouseOnScene(title: string) {
		console.log("title :>> ", title);

		const houseGLTF = this.assetMap.get(title);
		if (!houseGLTF) return;

		const houseMesh = houseGLTF.scene.clone(true);
		const house = new House(houseMesh);
		house.setOpacity(0.5);

		this.draftHouse = house;

		this.addElementToScene?.(house.mesh);
	}
}