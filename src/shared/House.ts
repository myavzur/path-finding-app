import { Group, Mesh, Vector3 } from "three";
import { v4 as uuidv4 } from "uuid";

export class House {
	readonly id: string;
	readonly mesh: Group;

	constructor(mesh: Group) {
		this.id = uuidv4();
		this.mesh = mesh;

		this.cloneMaterials();
	}

	/** Sets opacity for children in mesh */
	setOpacity(opacity: number) {
		this.mesh.traverse((child) => {
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

	private cloneMaterials() {
		this.mesh.traverse((child) => {
			if (child instanceof Mesh) {
				// Может быть прозрачным
				child.material = child.material.clone();
			}
		});
	}
}