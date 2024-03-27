import React, { useState } from "react";

import { FindPathMenuProps } from "./FindPathMenu.interface";
import { Alert, Button, Card, Flex, Form, Input } from "antd";
import { convertPathMatrixToMap, getHouseIdsByAddresses } from "../lib/helpers";
import { Node } from "@/shared/Graph";
import "./FindPathMenu.css";

import cn from "classnames";
import { PathTree } from "./PathTree";

export const FindPathMenu: React.FC<FindPathMenuProps> = ({
	pathPainter,
	database
}) => {
	const [pathsMap, setPathsMap] = useState<Map<string, Node[]>>(new Map());
	const [searchPathError, setSearchPathError] = useState("");
	const [activePathId, setActivePathId] = useState("");
	const [activePath, setActivePath] = useState<Node[]>([]);

	if (!pathPainter) {
		return <div>PathPainter is not ready or not defined!</div>;
	}

	console.debug(pathsMap, searchPathError, activePath, setActivePath, setActivePathId);

	const handleSearchPath = async (values: { from: string; to: string }) => {
		const housesPathsGraph = pathPainter.housesPathsGraph;
		if (!housesPathsGraph) return;

		console.log("handleSearchPath");
		const allHousesInfo = await database.getAllHousesInfo();

		const { houseFromId, houseToId } = getHouseIdsByAddresses(
			values.from,
			values.to,
			allHousesInfo
		);

		console.log("fromHouseAddress", values.from, houseFromId);
		console.log("toHouseAddress", values.to, houseToId);

		const nodeFrom = housesPathsGraph.map.get(houseFromId);
		const nodeTo = housesPathsGraph.map.get(houseToId);

		const hasNodes = nodeFrom && nodeTo;
		if (!hasNodes) {
			setSearchPathError("Маршрут не найден, проверьте введённые данные");
			return;
		}

		const possiblePathsMatrix = housesPathsGraph.getAllPaths(nodeFrom, nodeTo);
		if (possiblePathsMatrix.length === 0) {
			setSearchPathError("Маршрут не найден");
			return;
		}

		const pathsMap = convertPathMatrixToMap(possiblePathsMatrix);

		console.log("possiblePathsMatrix :>> ", possiblePathsMatrix);
		console.log("pathsMap :>> ", pathsMap);

		setPathsMap(pathsMap);
		setSearchPathError("");
	};

	return (
		<Card
			rootClassName="find-path-container"
			title="Найти маршрут"
		>
			<Form onFinish={handleSearchPath}>
				<Flex
					gap="middle"
					vertical={true}
				>
					<Form.Item
						name="from"
						style={{ marginBottom: 0 }}
						rules={[{ required: true, message: "Обязательное поле" }]}
					>
						<Input placeholder="Место отправления" />
					</Form.Item>

					<Form.Item
						name="to"
						style={{ marginBottom: 0 }}
						rules={[{ required: true, message: "Обязательное поле" }]}
					>
						<Input placeholder="Место назначения" />
					</Form.Item>

					<Button
						htmlType="submit"
						type="primary"
					>
						Найти
					</Button>
				</Flex>
			</Form>

			{searchPathError ? (
				<Alert
					type="info"
					message={searchPathError}
					style={{ marginTop: "20px" }}
				/>
			) : (
				<div>
					{[...pathsMap.entries()].map(([pathId, path]) => (
						<Alert
							key={pathId}
							onClick={() => null}
							className={cn("path-container", {
								active: pathId === activePathId
							})}
							description={
								<PathTree
									path={path}
									housesMap={pathPainter.housesPathsGraph.map}
								/>
							}
						/>
					))}
				</div>
			)}
		</Card>
	);
};
