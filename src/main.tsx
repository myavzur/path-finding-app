// import React from 'react';
// import ReactDOM from 'react-dom/client';
import { createRoot } from "react-dom/client";
import { HouseMenu } from "./features/house-menu";
import "./index.css";
import { InitScene } from "./widgets/scene/InitScene";
import { LoadAssetsScene } from "./widgets/scene/LoadAssetsScene";
import { MainFlowScene } from "./widgets/scene/MainFlowScene";

const scene = new InitScene();
scene.start();

// @ts-ignore
window.scene = scene;

const assetScene = new LoadAssetsScene();
assetScene.start();

const mainFlowScene = new MainFlowScene(scene, assetScene.assetMap);
mainFlowScene.start();

const root = createRoot(document.getElementById("root")!);
root.render(
  <>
    <HouseMenu scene={mainFlowScene} />
  </>
);
