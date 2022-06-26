import React from "react";
import cx from "classnames";

const SeparatorComponent = ({ border = "solid" }) => {
	const classNames = cx("w-full border-t border-gray-200 dark:border-dark-5 mt-5", border === "dashed" ? "border-dashed" : "");

	return <div className={classNames}></div>;
};

export default SeparatorComponent;
