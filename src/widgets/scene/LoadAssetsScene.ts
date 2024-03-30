import { assetsConfig } from "@/shared/constants/assets-config";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

export class LoadAssetsScene {
	private loader: GLTFLoader = new GLTFLoader();
	readonly assetMap = new Map<string, GLTF>();

	totalAssetsCount: number = assetsConfig.length;
	loadedAssetsCount: number = 0;
	onAssetsLoading: (percentLoaded: number) => void = () => null;

	constructor() {}

	async start() {
		for (const asset of assetsConfig) {
			const gltf = await this.loadModel(asset.path);
			this.assetMap.set(asset.title, gltf);

			this.loadedAssetsCount += 1;
			const percentLoaded = (this.loadedAssetsCount / this.totalAssetsCount) * 100;
			this.onAssetsLoading(percentLoaded);
		}
	}

	private async loadModel(path: string): Promise<GLTF> {
		return new Promise((resolve, reject) => {
			this.loader.load(path, resolve, undefined, reject);
		});
	}
}
