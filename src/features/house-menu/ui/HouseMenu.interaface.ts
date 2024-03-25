export interface HouseMenuProps {
	scene: {
		// `mouseDraftHouseOnScene` method is required in scene!
		mountDraftHouseOnScene: (title: string) => void;
	};
}