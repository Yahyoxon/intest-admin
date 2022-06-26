import React from "react";
import cx from "classnames";
import "./style.scss";

const TagComponent = props => {
	const { children, className, color } = props;
	const classNames = cx("d-tag", className, `d-tag--${color}`);

	return <div className={classNames} style={{color: color}}>{children}</div>;
};

export default TagComponent;
