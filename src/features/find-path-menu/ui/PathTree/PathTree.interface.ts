import { Node } from "@/shared/Graph";
import { House } from "@/shared/House";

export interface PathTreeProps {
	housesMap: Map<House["id"], House>;
	path: Node[];
}
