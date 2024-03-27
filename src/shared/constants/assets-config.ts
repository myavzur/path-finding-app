export enum AssetTitle {
	CASTLE = "castle",
	PIZZA_SHOP = "pizzashop",
	SHACK = "shack",
	WOOD_HOUSE = "woodhouse"
}

interface IAssetConfig {
	title: AssetTitle;
	speech: string;
	path: string;
}

export const assetsConfig: IAssetConfig[] = [
	{
		title: AssetTitle.CASTLE,
		speech: "Замок",
		path: "/castle.glb"
	},
	{
		title: AssetTitle.PIZZA_SHOP,
		speech: "Пиццерия",
		path: "/pizzashop.glb"
	},
	{
		title: AssetTitle.SHACK,
		speech: "Лачуга",
		path: "/shack.glb"
	},
	{
		title: AssetTitle.WOOD_HOUSE,
		speech: "Изба",
		path: "/woodhouse.glb"
	}
];
