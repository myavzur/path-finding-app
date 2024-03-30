import React, { useState } from "react";

import { FindPathMenuProps } from "./FindPathMenu.interface";
import { Alert, Button, Card, Flex, Form, Input } from "antd";
import { convertPathMatrixToMap, getHouseIdsByAddresses } from "../lib/helpers";
import { Node } from "@/shared/Graph";
import "./FindPathMenu.css";

import cn from "classnames";
import { PathTree } from "./PathTree";
import { PathColor } from "@/shared/constants";

export const FindPathMenu: React.FC<FindPathMenuProps> = ({
	pathPainter,
	housePainter
}) => {
	const [pathsMap, setPathsMap] = useState<Map<string, Node[]>>(new Map());
	const [searchPathError, setSearchPathError] = useState("");
	const [activePathId, setActivePathId] = useState("");
	const [activePath, setActivePath] = useState<Node[]>([]);

	if (!pathPainter || !housePainter) {
		return <div>PathPainter or HousePainter is not ready or not defined!</div>;
	}

	const setPathColor = (pathNodes: Node[], color: PathColor) => {
		if (!pathPainter) return;

		for (let i = 0; i < pathNodes.length - 1; i++) {
			const currentNode = pathNodes[i];
			const nextNode = pathNodes[i + 1];

			pathPainter.highlightPath(currentNode.id, nextNode.id, color);
		}
	};

	const handleHighlightPath = (pathNodes: Node[]) => {
		setPathColor(activePath, PathColor.DEFAULT);
		setPathColor(pathNodes, PathColor.ACTIVE);

		setActivePathId(pathNodes.map(node => node.id).join());
		setActivePath(pathNodes);
	};

	const handleSearchPath = async (values: { from: string; to: string }) => {
		const pathsGraph = pathPainter.pathsGraph;
		const housesMap = housePainter.housesMap;
		if (!pathsGraph || !housesMap) return;

		const houses = [...housesMap.values()];

		const { houseFromId, houseToId } = getHouseIdsByAddresses(
			values.from,
			values.to,
			houses
		);

		const nodeFrom = pathsGraph.map.get(houseFromId);
		const nodeTo = pathsGraph.map.get(houseToId);

		const hasNodes = nodeFrom && nodeTo;
		if (!hasNodes) {
			setSearchPathError("Маршрут не найден, проверьте введённые данные");
			return;
		}

		const possiblePathsMatrix = pathsGraph.getAllPaths(nodeFrom, nodeTo);
		if (possiblePathsMatrix.length === 0) {
			setSearchPathError("Маршрут не найден");
			return;
		}

		const pathsMap = convertPathMatrixToMap(possiblePathsMatrix);

		setPathsMap(pathsMap);
		setSearchPathError("");
	};

	return (
		<Card
			rootClassName="find-path-container"
			title="Проложить маршрут"
		>
			<Form
				onFinish={handleSearchPath}
				rootClassName="find-path-form"
			>
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
						Вперёд
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
							onClick={() => handleHighlightPath(path)}
							className={cn("path-container", {
								active: pathId === activePathId
							})}
							description={
								<PathTree
									path={path}
									housesMap={housePainter.housesMap}
								/>
							}
						/>
					))}
				</div>
			)}
		</Card>
	);
};
