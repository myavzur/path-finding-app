export interface HouseLabelProps {
	defaultAddress?: string;
	isMounted?: boolean;
	onSave: () => void;
	onChangeAddress?: (address: string) => void;
}
