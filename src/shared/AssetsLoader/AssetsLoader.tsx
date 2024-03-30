import React from "react";

import { AssetsLoaderProps } from "./AssetsLoader.interface";
import { Flex, Progress, Spin } from "antd";
import "./AssetsLoader.css";

export const AssetsLoader: React.FC<AssetsLoaderProps> = ({ percent }) => {
	return (
		<div className="loader">
			<Flex
				className="loader-content"
				gap="small"
				vertical={true}
			>
				<Spin
					size="large"
					className="loader-spinner"
				/>
				<Progress
					percent={percent}
					showInfo={false}
				/>
			</Flex>
		</div>
	);
};
