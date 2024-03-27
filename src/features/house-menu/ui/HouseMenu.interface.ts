import { AssetTitle } from "@/shared/constants/assets-config";

export interface HouseMenuProps {
	scene: {
		// `mouseDraftHouseOnScene` method is required in scene!
		mountDraftHouseOnScene: (assetTitle: AssetTitle) => void;
	};
}
