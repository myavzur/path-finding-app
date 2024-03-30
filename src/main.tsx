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
import { AssetsLoader } from "./shared/AssetsLoader";

const indexDB = new IndexDB();

indexDB.onSuccessOpened = async () => {
	const root = createRoot(document.getElementById("root")!);

	const assetScene = new LoadAssetsScene();
	assetScene.onAssetsLoading = percent => {
		root.render(<AssetsLoader percent={percent} />);
	};
	await assetScene.start(); // Дожидаемся загрузки асетов

	const scene = new InitScene();
	scene.start();

	const mainFlowScene = new MainFlowScene(scene, assetScene.assetMap);
	mainFlowScene.start();

	root.render(
		<>
			<HouseMenu scene={mainFlowScene} />
			<FindPathMenu
				pathPainter={mainFlowScene.pathPainter}
				housePainter={mainFlowScene.housePainter}
			/>
		</>
	);
};
