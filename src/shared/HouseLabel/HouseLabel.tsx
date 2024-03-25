import { Button } from "antd";
import { HouseLabelProps } from "./HouseLabel.interface";
import { useState } from "react";

export const HouseLabel: React.FC<HouseLabelProps> = ({
	onSave,
	isMounted: defaultMounted = false
}) => {
	const [isMounted, setMounted] = useState(defaultMounted);

	const handleSave = () => {
		setMounted(true);
		onSave();
	};

	return (
		<div>
			<h1>House Label</h1>
			<Button
				disabled={isMounted}
				onPointerDown={handleSave}
			>
				Сохранить
			</Button>
		</div>
	);
};
