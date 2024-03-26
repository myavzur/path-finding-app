import { Button, Input } from "antd";
import { HouseLabelProps } from "./HouseLabel.interface";
import { ChangeEvent, useState } from "react";

export const HouseLabel: React.FC<HouseLabelProps> = ({
	defaultAddress = "",
	isMounted: defaultMounted = false,
	onSave,
	onChangeAddress
}) => {
	const [isMounted, setMounted] = useState(defaultMounted);

	const handleSave = () => {
		setMounted(true);
		onSave();
	};

	const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
		onChangeAddress?.(e.target.value);
	};

	return (
		<div>
			<Input
				defaultValue={defaultAddress}
				placeholder="Адрес"
				disabled={isMounted}
				onChange={handleChangeAddress}
			/>
			<Button
				disabled={isMounted}
				onPointerDown={handleSave}
			>
				Сохранить
			</Button>
		</div>
	);
};
