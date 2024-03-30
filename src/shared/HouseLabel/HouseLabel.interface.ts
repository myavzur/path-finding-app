import { House } from "../House";

export interface HouseLabelProps {
	defaultAddress?: string;
	isMounted?: boolean;
	onSave: () => void;
	onChangeAddress: (address: House["address"]) => void;
}
