import { assetsConfig } from "@/shared/constants/assets-config";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

export class LoadAssetsScene {
	private loader: GLTFLoader = new GLTFLoader();
	readonly assetMap = new Map<string, GLTF>();

	constructor() {

	}

	async start() {
		for (const asset of assetsConfig) {
			const gltf = await this.loadModel(asset.path);
			this.assetMap.set(asset.title, gltf);
		}

		console.log("this.assetMap :>> ", this.assetMap);
	}

	private async loadModel(path: string): Promise<GLTF> {
		return new Promise((resolve, reject) => {
			this.loader.load(path, resolve, () => console.log("Loading..."), reject);
		});
	}
}