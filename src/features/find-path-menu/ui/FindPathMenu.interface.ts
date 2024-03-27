import { Graph } from "@/shared/Graph";
import { IndexDB } from "../../../../IndexDB";

export interface FindPathMenuProps {
	pathPainter: {
		housesPathsGraph: Graph;
	} | null;
	database: IndexDB;
}
