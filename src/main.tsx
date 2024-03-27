// import React from 'react';
// import ReactDOM from 'react-dom/client';
import { createRoot } from "react-dom/client";
import { HouseMenu } from "./features/house-menu";
import "./index.css";
import { InitScene } from "./widgets/scene/InitScene";
import { LoadAssetsScene } from "./widgets/scene/LoadAssetsScene";
import { MainFlowScene } from "./widgets/scene/MainFlowScene";
import { IndexDB } from "../IndexDB";
import { FindPathMenu } from "./features/find-path-menu";

const indexDB = new IndexDB();

indexDB.onSuccessOpened = async () => {
	const scene = new InitScene();
	scene.start();

	// @ts-expect-error - Just for debug. No errors. Just to shut typescript for a moment
	window.scene = scene;

	const assetScene = new LoadAssetsScene();
	await assetScene.start(); // Дожидаемся загрузки асетов

	const mainFlowScene = new MainFlowScene(scene, assetScene.assetMap);
	mainFlowScene.start();

	const root = createRoot(document.getElementById("root")!);
	root.render(
		<>
			<HouseMenu scene={mainFlowScene} />
			<FindPathMenu
				database={indexDB}
				pathPainter={mainFlowScene.pathPainter}
			/>
		</>
	);
};
