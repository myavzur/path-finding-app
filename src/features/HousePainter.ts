import { IndexDB } from '../../IndexDB';

import { SceneConnector } from "@/entities/SceneConnector";
import { House } from "@/shared/House";
import { AssetTitle, assetsConfig } from '@/shared/constants/assets-config';
import { GLTF } from "three/examples/jsm/Addons.js";

export class HousePainter {
	private indexDB = new IndexDB();
	private draftHouse: House | null = null;

	constructor(
		private sceneConnector: SceneConnector,
		private assetMap: Map<string, GLTF>
	) {
		this.assetMap = assetMap;

		window.addEventListener("dblclick", this.handleDoubleClick);
		this.mountHousesFromIndexDB();
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
		this.saveHouse(this.draftHouse);
		this.draftHouse = null;
	};

	mountDraftHouseOnScene(assetTitle: AssetTitle) {
		console.log("assetTitle :>> ", assetTitle);
		const house = this.createHouseByAssetTitle(assetTitle);
		if (!house) return;

		house.setOpacity(0.5);
		house.onSaveHouse = this.handleSaveHouse;

		this.draftHouse = house;

		this.sceneConnector.addMeshToScene?.(house.mesh);

		house.createHouseLabel();
	}

	saveHouse(house: House) {
		house.setOpacity(1);
		house.isMounted = true;

		console.log("saveHouseInfo HousePainter");
		console.log(this.indexDB);

		this.indexDB.saveHouseInfo({
			id: house.id,
			positionX: house.mesh.position.x,
			positionZ: house.mesh.position.z,
			assetTitle: house.assetConfig.title,
			houseAddress: house.address
		});
	}

	private createHouseByAssetTitle(assetTitle: AssetTitle, id?: string) {
		const houseGLTF = this.assetMap.get(assetTitle);
		const assetConfig = assetsConfig.find(asset => asset.title === assetTitle);
		if (!houseGLTF || !assetConfig) return;

		const houseMesh = houseGLTF.scene.clone(true);

		console.log("houseMesh :>> ", houseMesh);
		return new House(houseMesh, assetConfig, id);
	}

	private async mountHousesFromIndexDB() {
		const houseInfo = await this.indexDB.getAllHousesInfo();
		for (const info of houseInfo) {
			const house = this.createHouseByAssetTitle(info.assetTitle, info.id)!;
			house.address = info.houseAddress;

			this.sceneConnector.addMeshToScene?.(house.mesh);

			house.mesh.position.x = info.positionX;
			house.mesh.position.z = info.positionZ;

			house.isMounted = true;

			house.createHouseLabel();
		}
	}
}
