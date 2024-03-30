import { Mesh, MeshPhongMaterial, PlaneGeometry } from "three";

export const groundGeometryConfig = {
	width: 100,
	height: 100
};

export class Ground extends Mesh {
	constructor() {
		const geometry = new PlaneGeometry(
			groundGeometryConfig.width,
			groundGeometryConfig.height
		);
		const material = new MeshPhongMaterial({
			color: 0xbbbbbb,
			depthWrite: false
		});

		super(geometry, material);

		this.rotation.x = -Math.PI / 2;
	}
}
