import React from "react";
import cx from "classnames";
import { Icon } from "components";

// buttonType: "reset" | "button" | "submit";
// 	type?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark";
// 	size?: "sm" | "md" | "lg";

const IconButtonComponent = ({
	title = "",
	buttonType = "button",
	type = "primary",
	size = "md",
	className = "",
	rounded = false,
	iconName,
	children,
	...otherProps
}) => {
	const classNames = cx(
		"btn mr-2 mb-2",
		size === "md" ? "" : `btn-${size}`,
		rounded && `btn-rounded-${type}`,
		type && `btn-${type}`,
		className ? className : ""
	);

	return (
		<button type={buttonType} className={classNames} {...otherProps}>
			<Icon name={iconName} strokeWidth={3} className={`${size === "lg" ? "w-5 h-5" : "w-4 h-4 "}`} /> {title && <>{title}</>}{" "}
			{children && <>{children}</>}
		</button>
	);
};

export default IconButtonComponent;
