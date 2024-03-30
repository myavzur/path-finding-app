import { createRoot } from "react-dom/client";
import { Group, Mesh, MeshLambertMaterial, SphereGeometry, Vector3 } from "three";
import { v4 as uuidv4 } from "uuid";
import { HouseLabel } from "./HouseLabel/HouseLabel";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { assetsConfig } from "./constants/assets-config";
import { HousePositionControllerColor } from "./constants";

export class House {
	readonly id: string;
	readonly mesh: Group;
	readonly assetConfig: (typeof assetsConfig)[number];

	private houseLabel: CSS2DObject | null = null;
	housePositionController: Mesh | null = null;

	isMounted = false;
	address = "";

	onSaveHouse: () => void = () => null;

	constructor(mesh: Group, assetConfig: (typeof assetsConfig)[number], id?: string) {
		this.id = id || uuidv4();
		this.mesh = mesh;
		this.assetConfig = assetConfig;

		this.attachMeshes();
	}

	handleChangeHouseAddress = (address: string) => {
		this.address = address;
	};

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

	createHouseLabel(label: string) {
		const labelContainerEl = document.createElement("div");
		const position = this.assetConfig.positions?.label || [0, 0, 0];

		createRoot(labelContainerEl).render(
			<HouseLabel
				defaultAddress={label}
				isMounted={this.isMounted}
				onSave={this.saveHouse}
				onChangeAddress={this.handleChangeHouseAddress}
			/>
		);

		this.houseLabel = new CSS2DObject(labelContainerEl);
		this.houseLabel.position.set(...position);

		this.mesh.add(this.houseLabel);
	}

	removeHouseLabel() {
		if (!this.houseLabel) return;
		this.mesh.remove(this.houseLabel);
	}

	createHousePositionController() {
		const geometry = new SphereGeometry(1, 16, 10);
		const material = new MeshLambertMaterial({
			color: HousePositionControllerColor.DEFAULT
		});
		const position = this.assetConfig.positions?.controller || [0, 0, 0];

		this.housePositionController = new Mesh(geometry, material);
		this.housePositionController.position.set(...position);

		this.mesh.add(this.housePositionController);
	}

	removeHousePositionController() {
		if (!this.housePositionController) return;
		this.mesh.remove(this.housePositionController);
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
