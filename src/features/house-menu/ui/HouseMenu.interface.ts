import { AssetTitle } from "@/shared/constants/assets-config";

export interface HouseMenuProps {
	scene: {
		mountDraftHouseOnScene: (assetTitle: AssetTitle) => void;
	};
}
