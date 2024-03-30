import { groundGeometryConfig } from "@/shared/Ground";
import { IndexDB } from "../../IndexDB";

import { SceneConnector } from "@/entities/SceneConnector";
import { House } from "@/shared/House";
import { AssetTitle, assetsConfig } from "@/shared/constants/assets-config";
import {
	Mesh,
	MeshLambertMaterial,
	MeshMatcapMaterial,
	PlaneGeometry,
	Vector2
} from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { HousePositionControllerColor } from "@/shared/constants";

export class HousePainter {
	private indexDB = new IndexDB();

	private draftHouse: House | null = null;
	private positionControllerHelperPlane: Mesh | null = null;

	housesMap: Map<House["id"], House> = new Map();

	constructor(
		private sceneConnector: SceneConnector,
		private assetMap: Map<string, GLTF>
	) {
		this.assetMap = assetMap;

		window.addEventListener("dblclick", this.handleDoubleClick);
		window.addEventListener("pointerdown", this.handlePointerDown);

		this.mountHousesFromIndexDB();
	}

	/** Removes draft house from scene if `Esc` button was pressed. */
	private handleWindowKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && this.draftHouse) {
			this.sceneConnector.removeMeshFromScene?.(this.draftHouse.mesh);
			this.sceneConnector.enableOrbitControls();

			this.draftHouse.removeHouseLabel();
			this.draftHouse.removeHousePositionController();
			this.draftHouse = null;

			// Удаляем вспомогательную плоскость.
			if (this.positionControllerHelperPlane) {
				this.sceneConnector.removeMeshFromScene?.(
					this.positionControllerHelperPlane
				);
				this.positionControllerHelperPlane = null;
			}

			window.removeEventListener("pointermove", this.handlePointerMove);
			window.removeEventListener("pointerup", this.handlePointerUp);
		}

		window.removeEventListener("keydown", this.handleWindowKeyDown);
	};

	private handleHousePositionControllerClick = () => {
		const housePositionController = this.draftHouse?.housePositionController;
		if (!this.draftHouse || !housePositionController) return;

		const geometry = new PlaneGeometry(
			groundGeometryConfig.width,
			groundGeometryConfig.height
		);
		const material = new MeshMatcapMaterial({ opacity: 0, transparent: true });

		this.positionControllerHelperPlane = new Mesh(geometry, material);
		this.positionControllerHelperPlane.position.y =
			housePositionController.position.y;
		this.positionControllerHelperPlane.rotateX(-Math.PI / 2);
		this.positionControllerHelperPlane.renderOrder = 1;

		this.sceneConnector.disableOrbitControls();
		this.sceneConnector.addMeshToScene?.(this.positionControllerHelperPlane);

		const housePositionControllerMaterial =
			housePositionController.material as MeshLambertMaterial;

		housePositionControllerMaterial.color.set(HousePositionControllerColor.ACTIVE);

		window.addEventListener("pointerup", this.handlePointerUp);
		window.addEventListener("pointermove", this.handlePointerMove);
	};

	private handlePointerMove = (e: PointerEvent) => {
		const pointer = this.sceneConnector.getPointerPosition?.(e);
		if (!pointer || !this.draftHouse) return;

		this.moveHouseAlongGround(pointer, this.draftHouse);
	};

	private handlePointerUp = () => {
		const housePositionController = this.draftHouse?.housePositionController;
		if (!housePositionController) return;

		const housePositionControllerMaterial =
			housePositionController.material as MeshLambertMaterial;
		housePositionControllerMaterial.color.set(HousePositionControllerColor.DEFAULT);

		this.sceneConnector.enableOrbitControls();

		if (this.positionControllerHelperPlane) {
			this.sceneConnector.removeMeshFromScene?.(this.positionControllerHelperPlane);
		}

		window.removeEventListener("pointermove", this.handlePointerMove);
		window.removeEventListener("pointerup", this.handlePointerUp);
	};

	private handlePointerDown = (e: PointerEvent) => {
		const housePositionController = this.draftHouse?.housePositionController;
		if (!this.draftHouse || !housePositionController) return;

		const pointer = this.sceneConnector.getPointerPosition?.(e);
		if (!pointer) return;

		const intersect = this.sceneConnector.getIntersectWithSprite?.(
			pointer,
			this.draftHouse.mesh
		);

		const hasClickedOnHousePositionController =
			intersect?.object === housePositionController;

		if (!hasClickedOnHousePositionController) return;

		this.handleHousePositionControllerClick();
	};

	private handleDoubleClick = (e: PointerEvent | MouseEvent) => {
		const pointer = this.sceneConnector.getPointerPosition?.(e);
		if (!pointer) return;

		const intersect = this.sceneConnector.getIntersectWithGround?.(pointer);
		if (!intersect) return;

		this.draftHouse?.moveHouseTo(intersect.point);
	};

	private handleSaveHouse = () => {
		if (!this.draftHouse) return;
		this.saveHouse(this.draftHouse);
		this.draftHouse = null;
	};

	// Не стал заморачиваться...
	private getUniqueAddress = async (address: string) => {
		const existingHouses = await this.indexDB.getAllHousesInfo();
		const existingHouse = existingHouses.find(house => house.address === address);

		if (existingHouse) {
			return `${address} ул. ${Math.floor(Math.random() * 101)}`;
		}

		return address;
	};

	mountDraftHouseOnScene = async (assetTitle: AssetTitle) => {
		// TODO: Вынести в метод?
		if (this.draftHouse) {
			this.sceneConnector.removeMeshFromScene?.(this.draftHouse.mesh);
			this.draftHouse.removeHouseLabel();
			this.draftHouse.removeHousePositionController();
			this.draftHouse = null;
		}

		const house = this.createHouseByAssetTitle(assetTitle);
		if (!house) return;

		house.setOpacity(0.5);

		house.address = await this.getUniqueAddress(house.assetConfig.defaultLabel); // Устанавливаем значение по умолчанию.

		house.onSaveHouse = this.handleSaveHouse;

		this.draftHouse = house;

		this.sceneConnector.addMeshToScene?.(house.mesh);

		house.createHouseLabel(house.address);
		house.createHousePositionController();

		window.addEventListener("keydown", this.handleWindowKeyDown);
	};

	saveHouse(house: House) {
		house.setOpacity(1);
		house.isMounted = true;

		house.removeHousePositionController();

		this.indexDB.saveHouseInfo({
			id: house.id,
			address: house.address,
			assetConfig: house.assetConfig,
			position: {
				x: house.mesh.position.x,
				z: house.mesh.position.z
			}
		});

		this.housesMap.set(house.id, house);
	}

	private moveHouseAlongGround(pointer: Vector2, house: House) {
		const housePositionController = house.housePositionController;
		if (!housePositionController || !this.positionControllerHelperPlane) return;

		const intersect = this.sceneConnector.getIntersectWithSprite?.(
			pointer,
			this.positionControllerHelperPlane
		);
		if (!intersect) return;

		house.mesh.position.x = intersect.point.x;
		house.mesh.position.z = intersect.point.z;
	}

	private createHouseByAssetTitle(assetTitle: AssetTitle, id?: string) {
		const houseGLTF = this.assetMap.get(assetTitle);
		const assetConfig = assetsConfig.find(asset => asset.title === assetTitle);
		if (!houseGLTF || !assetConfig) return;

		const houseMesh = houseGLTF.scene.clone(true);
		return new House(houseMesh, assetConfig, id);
	}

	private async mountHousesFromIndexDB() {
		const houses = await this.indexDB.getAllHousesInfo();

		for (const houseData of houses) {
			const house = this.createHouseByAssetTitle(
				houseData.assetConfig.title,
				houseData.id
			)!;

			house.address = houseData.address;

			this.sceneConnector.addMeshToScene?.(house.mesh);
			house.mesh.position.set(houseData.position.x, 0, houseData.position.z);

			house.isMounted = true;

			house.createHouseLabel(house.address);

			this.housesMap.set(house.id, house);
		}
	}
}
