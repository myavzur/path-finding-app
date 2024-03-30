export enum AssetTitle {
	CASTLE = "castle",
	PIZZA_SHOP = "pizzashop",
	SHACK = "shack",
	WOOD_HOUSE = "woodhouse"
}

interface IAssetConfig {
	title: AssetTitle;
	defaultLabel: string;
	path: string;
	positions?: {
		/* Использую тип [number, number, number] поскольку использование класса THREE.Vector3
		 * будет избыточным в данном контексте. */
		label: [number, number, number];
		controller: [number, number, number];
	};
}

export const assetsConfig: IAssetConfig[] = [
	{
		title: AssetTitle.CASTLE,
		defaultLabel: "Замок",
		path: "/castle.glb",
		positions: {
			label: [-2, 21, 3],
			controller: [0, 14, 0]
		}
	},
	{
		title: AssetTitle.PIZZA_SHOP,
		defaultLabel: "Пиццерия",
		path: "/pizzashop.glb",
		positions: {
			label: [0, 12, 0], // [0, 17, 0]
			controller: [0, 17, 0] // [0, 11, 0]
		}
	},
	{
		title: AssetTitle.SHACK,
		defaultLabel: "Лачуга",
		path: "/shack.glb",
		positions: {
			label: [0, 12, 0],
			controller: [0, 6, 0]
		}
	},
	{
		title: AssetTitle.WOOD_HOUSE,
		defaultLabel: "Изба",
		path: "/woodhouse.glb",
		positions: {
			label: [0, 12, 0],
			controller: [0, 5, 0]
		}
	}
];
