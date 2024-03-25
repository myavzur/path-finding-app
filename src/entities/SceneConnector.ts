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

type AddMeshToScene = (element: Object3D | Group | Mesh) => void;
type RemoveMeshFromScene = (element: Object3D | Group | Mesh) => void;

export class SceneConnector {
	getPointerPosition: GetPointerPosition | null = null;
	getIntersectWithGround: GetIntersectWithGround | null = null;
	getIntersectWithScene: GetIntersectWithScene | null = null;
	addMeshToScene: AddMeshToScene | null = null;
	removeMeshFromScene: RemoveMeshFromScene | null = null;
}
