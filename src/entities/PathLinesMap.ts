import { PathLine } from "@/shared/PathLine";

export class PathLinesMap {
	private pathLinesMap = new Map<string, PathLine>();

	setPathLine(houseIdFrom: string, houseIdTo: string, pathLine: PathLine) {
		if (this.hasPathLine(houseIdFrom, houseIdTo)) return;

		const fromToId = `${houseIdFrom}-${houseIdTo}`;
		this.pathLinesMap.set(fromToId, pathLine);
	}

	hasPathLine(houseIdFrom: string, houseIdTo: string) {
		const { fromToId, toFromId } = this.getPathIds(houseIdFrom, houseIdTo);
		return this.pathLinesMap.has(fromToId) || this.pathLinesMap.has(toFromId);
	}

	getPathLine(houseIdFrom: string, houseIdTo: string) {
		const { fromToId, toFromId } = this.getPathIds(houseIdFrom, houseIdTo);
		return this.pathLinesMap.get(fromToId) || this.pathLinesMap.get(toFromId);
	}

	private getPathIds(houseIdFrom: string, houseIdTo: string) {
		const fromToId = `${houseIdFrom}-${houseIdTo}`;
		const toFromId = `${houseIdTo}-${houseIdFrom}`;

		return { fromToId, toFromId };
	}
}
