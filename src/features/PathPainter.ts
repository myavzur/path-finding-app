import { SceneConnector } from "@/entities/SceneConnector";
import { Graph, Node } from "@/shared/Graph";
import { House } from "@/shared/House";
import { PathLine } from "@/shared/PathLine";
import { Vector2 } from "three";

export class PathPainter {
	private pathLineFrom: PathLine | null = null;
	private houseFrom: House | null = null;

	housePathGraph = new Graph();

	constructor(private sceneConnector: SceneConnector) {
		window.addEventListener("dblclick", this.handleWindowDoubleClick);
	}

	/** Removes started line from scene if `Escape` button was pressed. */
	private handleWindowKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && this.pathLineFrom) {
			this.sceneConnector.removeMeshFromScene?.(this.pathLineFrom);
			this.pathLineFrom = null;
		}
		window.removeEventListener("keydown", this.handleWindowKeyDown);
	};

	private handleWindowMouseMove = (e: MouseEvent) => {
		const pointer = this.sceneConnector.getPointerPosition?.(e);
		if (!pointer) return;

		this.aimPathLine(pointer);
	};

	private handleWindowDoubleClick = (e: PointerEvent | MouseEvent) => {
		const pointer = this.sceneConnector.getPointerPosition?.(e);
		if (!pointer) return;

		// Получаем первое пересечение
		const pickedMesh = this.sceneConnector.getIntersectWithScene?.(pointer)[0];

		// Проверяем является ли pickedMesh домиком
		const house = pickedMesh?.object.userData;
		const isHouse = house instanceof House;
		if (!isHouse) return;

		const isPathLineStarted = this.pathLineFrom !== null;
		if (!isPathLineStarted) {
			this.startMountPathLine(house);
			window.addEventListener("keydown", this.handleWindowKeyDown);
			window.addEventListener("pointermove", this.handleWindowMouseMove);
			return;
		}

		// Завершаем линию, сбрасываем слушатели событий.
		this.finishMountPathLine(house);
		window.removeEventListener("keydown", this.handleWindowKeyDown);
		window.removeEventListener("pointermove", this.handleWindowMouseMove);
		console.log("house :>> ", house);
	};

	private startMountPathLine(house: House) {
		this.pathLineFrom = new PathLine();

		// `userData.fromPoint` указывает из какой точки начинается линия.
		this.pathLineFrom.userData.fromPoint = [
			house.mesh.position.x,
			0,
			house.mesh.position.z
		];
		this.houseFrom = house;

		this.pathLineFrom.setFromTo(
			[house.mesh.position.x, 0, house.mesh.position.z],
			[house.mesh.position.x, 0, house.mesh.position.z]
		);

		console.log("startMountPathLine...");

		this.sceneConnector.addMeshToScene?.(this.pathLineFrom);
	}

	private savePathToGraph(houseFrom: House, houseTo: House) {
		const nodeMap = this.housePathGraph.map;

		const nodeFrom = nodeMap.get(houseFrom.id) || new Node(houseFrom.id);
		const nodeTo = nodeMap.get(houseTo.id) || new Node(houseTo.id);

		this.housePathGraph.addChildren(nodeFrom, nodeTo);
	}

	private finishMountPathLine(house: House) {
		if (!this.pathLineFrom || !this.houseFrom) {
			throw new Error("From Path or House wasn't specified.");
		}

		// TODO: fix types with pathLineFrom.userData.fromPoint
		const fromPoint = this.pathLineFrom.userData.fromPoint as [
			number,
			number,
			number
		];
		const toPoint = [house.mesh.position.x, 0, house.mesh.position.z] as [
			number,
			number,
			number
		];

		// Сохраняем связь домиков в виде графа.
		const houseFrom = this.houseFrom;
		const houseTo = house;
		this.savePathToGraph(houseFrom, houseTo);

		this.pathLineFrom.setFromTo(fromPoint, toPoint);
		this.pathLineFrom = null;
		this.houseFrom = null;
	}

	private aimPathLine(pointer: Vector2) {
		if (!this.pathLineFrom) throw new Error("Path didn't started");

		const intersect = this.sceneConnector.getIntersectWithGround?.(pointer);
		if (!intersect) return;

		const fromPoint = this.pathLineFrom.userData.fromPoint as [
			number,
			number,
			number
		];

		this.pathLineFrom?.setFromTo(fromPoint, [
			intersect.point.x,
			0,
			intersect.point.z
		]);
	}
}
