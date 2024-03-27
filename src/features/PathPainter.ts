import { SceneConnector } from "@/entities/SceneConnector";
import { Graph, Node } from "@/shared/Graph";
import { House } from "@/shared/House";
import { PathLine } from "@/shared/PathLine";
import { Vector2 } from "three";
import { HouseTableColumns, IndexDB } from "../../IndexDB";
import { PathLinesMap } from "@/entities/PathLinesMap";

export class PathPainter {
	private pathLineFrom: PathLine | null = null;
	private houseFrom: House | null = null;
	private indexDB = new IndexDB();

	pathLinesMap = new PathLinesMap();
	housesPathsGraph = new Graph();

	constructor(private sceneConnector: SceneConnector) {
		window.addEventListener("dblclick", this.handleWindowDoubleClick);

		this.mountPathsFromIndexDb();
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

		this.sceneConnector.addMeshToScene?.(this.pathLineFrom);
	}

	private savePathToGraph(houseFrom: House, houseTo: House) {
		const nodeMap = this.housesPathsGraph.map;

		const nodeFrom = nodeMap.get(houseFrom.id) || new Node(houseFrom.id);
		const nodeTo = nodeMap.get(houseTo.id) || new Node(houseTo.id);

		this.housesPathsGraph.addChildren(nodeFrom, nodeTo);
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
		this.pathLineFrom.setFromTo(fromPoint, toPoint);

		// Сохраняем связь домиков в виде графа.
		const houseFrom = this.houseFrom;
		const houseTo = house;

		/** Граф у нас двунаправленный. Поэтому для избежания
		 * дубликатов линий между домиками на сцене - удаляем линию и создаем по новой.*/
		if (this.pathLinesMap.hasPathLine(houseFrom.id, houseTo.id)) {
			this.sceneConnector.removeMeshFromScene?.(this.pathLineFrom);
			return;
		}

		this.pathLinesMap.setPathLine(houseFrom.id, houseTo.id, this.pathLineFrom);
		this.savePathToGraph(houseFrom, houseTo);
		this.indexDB.saveHousesGraph(this.housesPathsGraph);

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

	private async mountPathsFromIndexDb() {
		const housesGraph = await this.indexDB.getHousesGraph();
		const allHousesOnScene = await this.indexDB.getAllHousesInfo();

		/** Создаем объект `Map` из массива `allHousesOnScene` для того, чтобы обращаться к домикам напрямую.
		 * - Сложность алгоритма в такой реализации будет O(1)
		 *
		 * Почему не искать через `allHousesOnScene.find` по `house.id`?
		 * - Потому что в кейсе, где мы имеем 100 домов, нам придется каждый раз перебирать массив из 100 эл-мов.
		 * - - Сложность алгоритма в таком кейсе будет O(n) = O(100) */
		const housesMap = new Map<string, HouseTableColumns>();
		allHousesOnScene.forEach(house => housesMap.set(house.id, house));

		if (!housesGraph) return;

		this.housesPathsGraph = new Graph(housesGraph.map);
		const graphNodesMap = this.housesPathsGraph.map;

		const queue = [...graphNodesMap.values()];
		const visitedNodes = new Set<string>();

		while (queue.length) {
			const node = queue.pop();
			if (node === undefined) break;

			if (visitedNodes.has(node.id)) continue;
			visitedNodes.add(node.id);

			// Домик, к которому привязана нода.
			const parentHouse = housesMap.get(node.id);
			if (!parentHouse) continue;

			for (const childNode of node.children) {
				const childHouse = housesMap.get(childNode.id);
				if (!childHouse || visitedNodes.has(childNode.id)) continue;

				const pathLine = new PathLine();
				pathLine.setFromTo(
					[parentHouse.positionX, 0, parentHouse.positionZ],
					[childHouse.positionX, 0, childHouse.positionZ]
				);

				this.pathLinesMap.setPathLine(parentHouse.id, childHouse.id, pathLine);

				this.sceneConnector.addMeshToScene?.(pathLine);
			}
		}
	}
}
