import { HousePainter } from "@/features/HousePainter";
import { PathPainter } from "@/features/PathPainter";

export interface FindPathMenuProps {
	housePainter: {
		housesMap: HousePainter["housesMap"];
	} | null;
	pathPainter: {
		pathsGraph: PathPainter["pathsGraph"];
		highlightPath: PathPainter["highlightPath"];
	} | null;
}
