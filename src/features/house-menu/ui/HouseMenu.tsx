import React from "react";
import { Button } from "antd";
import { HouseMenuProps } from "./HouseMenu.interaface";

export const HouseMenu: React.FC<HouseMenuProps> = ({ scene }) => {
	const handleClick = (title: string) => {
		scene.mountDraftHouseOnScene(title);
	};

	return (
		<ul className="houses-menu">
			<Button onClick={() => handleClick("castle")}>Замок</Button>
			<Button onClick={() => handleClick("pizzashop")}>Пиццерия</Button>
			<Button onClick={() => handleClick("shack")}>Лачуга</Button>
			<Button onClick={() => handleClick("woodhouse")}>Изба</Button>
		</ul>
	);
};
