export class Node {
	/** В рамках данного приложения Node.id === House.id */
	readonly id: string;
	readonly children: Set<Node>;

	constructor(id: string) {
		this.id = id;
		this.children = new Set();
	}
}

export class Graph {
	readonly map: Map<string, Node> = new Map();

	constructor(houseMap?: Graph["map"]) {
		if (houseMap) this.map = houseMap;
	}

	/** Добавляет Ноде под-ноды, сохраняя двунаправленную связь между Нодами */
	addChildren(node1: Node, node2: Node) {
		node1.children.add(node2);
		node2.children.add(node1);

		this.map.set(node1.id, node1);
		this.map.set(node2.id, node2);
	}

	getAllPaths(fromNode: Node, toNode: Node) {
		const record: Node[][] = [];
		this.findPathsDFS(fromNode, toNode, new Set([fromNode]), record);
		return record;
	}

	findPathsDFS(
		fromNode: Node,
		toNode: Node,
		visitedNodes: Set<Node>,
		recordPaths: Node[][]
	) {
		if (fromNode === toNode) {
			recordPaths.push([...visitedNodes]);
			visitedNodes.delete(fromNode);
			return;
		}

		const children = fromNode.children;
		for (const child of children) {
			const isChildNodeVisited = visitedNodes.has(child);
			if (isChildNodeVisited) continue;

			visitedNodes.add(child);

			this.findPathsDFS(child, toNode, visitedNodes, recordPaths);
		}

		visitedNodes.delete(fromNode);
	}
}
