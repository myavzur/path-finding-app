import { createRoot } from "react-dom/client";
import { Group, Mesh, Vector3 } from "three";
import { v4 as uuidv4 } from "uuid";
import { HouseLabel } from "./HouseLabel/HouseLabel";
import { CSS2DObject } from "three/examples/jsm/Addons.js";

export class House {
	readonly id: string;
	readonly mesh: Group;
	isMounted: boolean = false;

	onSaveHouse: () => void = () => null;

	constructor(mesh: Group) {
		this.id = uuidv4();
		this.mesh = mesh;

		this.attachMeshes();
		this.createHouseLabel();
	}

	saveHouse = () => {
		this.isMounted = true;
		this.onSaveHouse();
	};

	/** Sets opacity for children in mesh */
	setOpacity(opacity: number) {
		this.mesh.traverse(child => {
			if (child instanceof Mesh) {
				// Может быть прозрачным
				child.material.transparent = true;
				child.material.opacity = opacity;
			}
		});
	}

	moveHouseTo(vector: Vector3) {
		this.mesh.position.copy(vector);
	}

	private createHouseLabel() {
		const labelContainerEl = document.createElement("div");

		const root = createRoot(labelContainerEl);
		root.render(
			<HouseLabel
				isMounted={this.isMounted}
				onSave={this.saveHouse}
			/>
		);

		const labelEl = new CSS2DObject(labelContainerEl);
		this.mesh.add(labelEl);
	}

	private attachMeshes() {
		this.mesh.traverse(child => {
			if (child instanceof Mesh) {
				// Может быть прозрачным
				child.material = child.material.clone();
				child.userData = this;
			}
		});
	}
}
