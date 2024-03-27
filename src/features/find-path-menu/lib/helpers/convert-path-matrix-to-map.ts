import { Node } from "@/shared/Graph";

export const convertPathMatrixToMap = (pathMatrix: Node[][]) => {
	return pathMatrix.reduce((map: Map<string, Node[]>, path) => {
		const pathId = path.map(node => node.id).join();
		map.set(pathId, path);
		return map;
	}, new Map<string, Node[]>());
};
