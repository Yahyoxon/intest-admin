import React from "react";
import cx from "classnames";

// type?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark";
// 	size?: "sm" | "md" | "lg";

const LinkButtonComponent = ({ title = "", type = "primary", url, size = "md", className = "", rounded = false, children, tooltip, ...otherProps }) => {
	const classNames = cx(
		"btn mr-2 mb-2",
		type && `btn-${type}`,
		size === "md" ? "" : `btn-${size}`,
		rounded && ` btn-rounded-${type}`,
		className && className
	);

	return (
		<a href={url} className={classNames} target="_blank" rel="noopener noreferrer" {...otherProps} title={tooltip}>
			{title && <>{title}</>} {children && <>{children}</>}
		</a>
	);
};

export default LinkButtonComponent;
