import React from "react";
import cx from "classnames";

// height?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const BoardComponent = ({ className, rounded = true, children, ...otherProps }) => {
	const containerClasses = cx("intro-y box", rounded ? "rounded" : "");
	const boxClasses = cx(`h-full preview`, className ? className : "");
	return (
		<div className={containerClasses} {...otherProps}>
			<div className={boxClasses}>{children}</div>
		</div>
	);
};

export default BoardComponent;
