import React from "react";
import cx from "classnames";

import "./style.scss";

const NoDataComponent = ({ hasAnimation = true, text = "Нет данных", rounded = true, className, children, ...otherProps }) => {
	const classNames = cx("text-center p-4 bg-gray-300 dark:bg-dark-2", hasAnimation ? "intro-y" : "", rounded ? "rounded" : "");

	return (
		<div className={classNames} {...otherProps}>
			{text ? text : children}
		</div>
	);
};

export default NoDataComponent;
