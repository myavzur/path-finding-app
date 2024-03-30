import { assetsConfig } from "@/shared/constants/assets-config";
import { Graph } from "./src/shared/Graph";
import { House } from "@/shared/House";

const HOUSES_TABLE_NAME = "houses";
const GRAPHS_TABLE_NAME = "graphs";

export type IHouseTableCols = {
	id: House["id"];
	address: House["address"];
	assetConfig: (typeof assetsConfig)[number];
	position: {
		x: number;
		z: number;
	};
};

/*
	Используем паттерн Singleton.
	Зачем:
		1. Храним только один экземпляр класса IndexDB в памяти для взаимодействия с IndexedDB.
		2. Нам нужно только одно соединение с БД, не более.
*/
export class IndexDB {
	static _INSTANCE: IndexDB | null = null;

	private DATABASE_NAME = "houses_map";
	private VERSION = 7.3;

	private openRequest!: IDBOpenDBRequest;
	private database: IDBDatabase | null = null;

	onSuccessOpened: (() => void) | null = null;

	constructor() {
		if (IndexDB._INSTANCE === null) {
			this.openRequest = indexedDB.open(this.DATABASE_NAME, this.VERSION);
			this.openRequest.onupgradeneeded = this.handleUpgradeNeeded;
			this.openRequest.onsuccess = this.handleSuccessOpened;

			IndexDB._INSTANCE = this;
			return;
		}

		return IndexDB._INSTANCE;
	}

	private handleUpgradeNeeded = () => {
		const database = this.openRequest.result;

		if (!database.objectStoreNames.contains(HOUSES_TABLE_NAME)) {
			database.createObjectStore(HOUSES_TABLE_NAME, { keyPath: "id" });
		}

		if (!database.objectStoreNames.contains(GRAPHS_TABLE_NAME)) {
			database.createObjectStore(GRAPHS_TABLE_NAME);
		}

		this.database = database;
	};

	private handleSuccessOpened = () => {
		this.database = this.openRequest.result;
		this.onSuccessOpened?.();
	};

	saveHouseInfo(house: IHouseTableCols) {
		if (!this.database) return;

		const transaction = this.database.transaction(HOUSES_TABLE_NAME, "readwrite");
		const housesStore = transaction.objectStore(HOUSES_TABLE_NAME);
		housesStore.add(house);
	}

	getAllHousesInfo(): Promise<IHouseTableCols[]> {
		return new Promise(res => {
			if (!this.database) {
				res([]);
				return;
			}

			const transaction = this.database.transaction(HOUSES_TABLE_NAME, "readwrite");
			const housesStore = transaction.objectStore(HOUSES_TABLE_NAME);

			const request = housesStore.getAll();
			request.onsuccess = e => {
				const target = e.target as unknown as { result: IHouseTableCols[] };
				res(target.result);
				return;
			};

			request.onerror = () => {
				res([]);
			};
		});
	}

	saveHousesGraph(houseGraph: Graph) {
		if (!this.database) return;
		const transaction = this.database.transaction(GRAPHS_TABLE_NAME, "readwrite");
		const store = transaction.objectStore(GRAPHS_TABLE_NAME);
		store.delete("graph");
		store.add(houseGraph, "graph");
	}

	getHousesGraph(): Promise<Graph | undefined> {
		return new Promise(res => {
			if (!this.database) {
				res(undefined);
				return;
			}

			const transaction = this.database.transaction(GRAPHS_TABLE_NAME, "readwrite");
			const housesGraphsStore = transaction.objectStore(GRAPHS_TABLE_NAME);
			const request = housesGraphsStore.getAll();

			request.onsuccess = e => {
				const target = e.target as unknown as { result: Graph[] };
				res(target.result[0]);
				return;
			};

			request.onerror = () => {
				res(undefined);
			};
		});
	}
}
