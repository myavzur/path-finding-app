export enum AssetTitle {
	CASTLE = "castle",
	PIZZA_SHOP = "pizzashop",
	SHACK = "shack",
	WOOD_HOUSE = "woodhouse"
}

interface IAssetConfig {
	title: AssetTitle;
	path: string;
}

export const assetsConfig: IAssetConfig[] = [
	{
		title: AssetTitle.CASTLE,
		path: "/castle.glb"
	},
	{
		title: AssetTitle.PIZZA_SHOP,
		path: "/pizzashop.glb"
	},
	{
		title: AssetTitle.SHACK,
		path: "/shack.glb"
	},
	{
		title: AssetTitle.WOOD_HOUSE,
		path: "/woodhouse.glb"
	}
];
