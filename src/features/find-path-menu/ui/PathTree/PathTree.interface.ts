import { Node } from "@/shared/Graph";

export interface PathTreeProps {
	housesMap: Map<string, Node>;
	path: Node[];
}
