import {
	Vector2,
	Intersection,
	Object3D,
	Object3DEventMap,
	Group,
	Mesh
} from "three";

type GetPointerPosition = (event: PointerEvent | MouseEvent) => Vector2;

type GetIntersectWithGround = (
	pointer: Vector2
) => Intersection<Object3D<Object3DEventMap>>;

type GetIntersectWithScene = (
	pointer: Vector2
) => Intersection<Object3D<Object3DEventMap>>[];

type GetIntersectWithSprite = (
	pointer: Vector2,
	sprite: Object3D | Group | Mesh
) => Intersection<Object3D<Object3DEventMap>>;

type AddMeshToScene = (mesh: Object3D | Group | Mesh) => void;

type RemoveMeshFromScene = (mesh: Object3D | Group | Mesh) => void;

export class SceneConnector {
	getPointerPosition: GetPointerPosition | null = null;
	getIntersectWithGround: GetIntersectWithGround | null = null;
	getIntersectWithScene: GetIntersectWithScene | null = null;
	getIntersectWithSprite: GetIntersectWithSprite | null = null;
	addMeshToScene: AddMeshToScene | null = null;
	removeMeshFromScene: RemoveMeshFromScene | null = null;
	enableOrbitControls: () => void = () => null;
	disableOrbitControls: () => void = () => null;
}
