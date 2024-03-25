import { Color } from "three";
import { Line2, LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";

export class PathLine extends Line2 {
	constructor(color?: number) {
		const lineGeometry = new LineGeometry();
		lineGeometry.setPositions([1, 1, 1, 5, 5, 5]);
		lineGeometry.setColors([1, 1, 1, 1, 1, 1]);

		const lineMaterial = new LineMaterial({
			color: color || 0x635c5a,
			linewidth: 0.005,
			vertexColors: true
		});

		super(lineGeometry, lineMaterial);
	}

	setFromTo(fromPoint: [number, number, number], toPoint: [number, number, number]) {
		this.geometry.setPositions([...fromPoint, ...toPoint]);
	}

	setColor(color: number) {
		this.material.color = new Color(color);
	}
}
