import React from "react";

const ProgressBarComponent = ({ downloadProgress }) => {
	const loadedPercent = downloadProgress ? Math.round((downloadProgress.loaded * 100) / downloadProgress.total) : 0;
	return (
		<div className="progress-bar">
			<div className="progress-bar__loaded" style={{ width: `${loadedPercent}%` }}>
				<div className="progress-bar__loaded__percent">{loadedPercent}%</div>
			</div>
			<div className="progress-bar__shadow" />
		</div>
	);
};

export default ProgressBarComponent;
