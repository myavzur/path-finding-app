import { PathLine } from "@/shared/PathLine";

export class PathsMap {
	private pathsMap = new Map<string, PathLine>();

	setPathLine(houseIdFrom: string, houseIdTo: string, pathLine: PathLine) {
		if (this.hasPathLine(houseIdFrom, houseIdTo)) return;

		const fromToId = `${houseIdFrom}-${houseIdTo}`;
		this.pathsMap.set(fromToId, pathLine);
	}

	hasPathLine(houseIdFrom: string, houseIdTo: string) {
		const { fromToId, toFromId } = this.getPathIds(houseIdFrom, houseIdTo);
		return this.pathsMap.has(fromToId) || this.pathsMap.has(toFromId);
	}

	getPathLine(houseIdFrom: string, houseIdTo: string) {
		const { fromToId, toFromId } = this.getPathIds(houseIdFrom, houseIdTo);
		return this.pathsMap.get(fromToId) || this.pathsMap.get(toFromId);
	}

	private getPathIds(houseIdFrom: string, houseIdTo: string) {
		const fromToId = `${houseIdFrom}-${houseIdTo}`;
		const toFromId = `${houseIdTo}-${houseIdFrom}`;

		return { fromToId, toFromId };
	}
}
