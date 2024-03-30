import { Form, Button, Input, Spin, Typography } from "antd";
import { HouseLabelProps } from "./HouseLabel.interface";
import { ChangeEvent, useState } from "react";

import "./HouseLabel.css";
import { House } from "../House";
import { IndexDB } from "../../../IndexDB";
import { useDebouncedFunction } from "../hooks";

export const HouseLabel: React.FC<HouseLabelProps> = ({
	defaultAddress = "",
	isMounted: defaultMounted = false,
	onSave,
	onChangeAddress
}) => {
	const [isMounted, setMounted] = useState(defaultMounted);
	const [isLoading, setLoading] = useState(false);
	const [address, setAddress] = useState(defaultAddress);
	const [error, setError] = useState<string | null>(null);

	const checkIsAddressUnique = useDebouncedFunction(
		async (address: House["address"]) => {
			const database = new IndexDB();

			const houses = await database.getAllHousesInfo();

			const isAddressTaken = houses.some(house => house.address === address);

			if (isAddressTaken) {
				setError("Адрес уже занят");
				setLoading(false);
				return;
			}

			setError(null);
			setLoading(false);
		},
		300
	);

	const handleSaveHouse = () => {
		if (error) return;

		if (!address.trim()) {
			setError("Адрес не может быть пустым");
			return;
		}

		onSave();
		setMounted(true);
	};

	const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
		setLoading(true);

		const address = e.target.value;

		setAddress(address);
		checkIsAddressUnique(address);
		onChangeAddress(address);
	};

	return isMounted ? (
		<Typography.Paragraph className="house-label">{address}</Typography.Paragraph>
	) : (
		<Form
			className="form"
			onFinish={handleSaveHouse}
		>
			<Form.Item
				className="input-house-address-container"
				rules={[{ required: true }]}
			>
				<Input
					className={"input-house-address"}
					placeholder="Адрес"
					value={address}
					status={error ? "error" : ""}
					onChange={handleChangeAddress}
					suffix={isLoading ? <Spin size="small" /> : <></>}
				/>
				{error && <div className="ant-form-item-explain-error">{error}</div>}
			</Form.Item>

			<Button
				block={true}
				disabled={isLoading || Boolean(error)}
				htmlType="submit"
				onPointerDown={handleSaveHouse}
				type="primary"
			>
				Сохранить
			</Button>
		</Form>
	);
};
