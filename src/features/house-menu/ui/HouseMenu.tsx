import React from "react";
import { Button } from "antd";
import { HouseMenuProps } from "./HouseMenu.interface";
import { AssetTitle } from "@/shared/constants/assets-config";
import "./HouseMenu.css";

export const HouseMenu: React.FC<HouseMenuProps> = ({ scene }) => {
	const handleClick = (assetTitle: AssetTitle) => {
		scene.mountDraftHouseOnScene(assetTitle);
	};

	return (
		<ul className="houses-menu">
			<Button onClick={() => handleClick(AssetTitle.CASTLE)}>Замок</Button>
			<Button onClick={() => handleClick(AssetTitle.PIZZA_SHOP)}>Пиццерия</Button>
			<Button onClick={() => handleClick(AssetTitle.SHACK)}>Лачуга</Button>
			<Button onClick={() => handleClick(AssetTitle.WOOD_HOUSE)}>Изба</Button>
		</ul>
	);
};
