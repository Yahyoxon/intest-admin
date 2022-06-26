import React from "react";
import cx from "classnames";

// width?:
// 		| "w-32"
// 		| "w-56"
// 		| "w-48"
// 		| "w-44"
// 		| "w-64"
// 		| "w-72"
// 		| "w-52"
// 		| "w-40";

const DropdownComponent = ({
	className,
	header,
	footer,
	children,
	toggle = false,
	width = "w-40",
	// position = "bottom-end",
	...otherProps
}) => {
	const classNames = cx("dropdown-menu", className && className, toggle ? "show" : "", width && width);

	return (
		<div
			className={classNames}
			style={{
				inset: `100% 0 auto auto`
			}}
			{...otherProps}>
			<div className="dropdown-menu__content box dark:bg-dark-1">
				{header && <div className="p-3 border-b border-gray-200 dark:border-dark-5 font-medium flex">{header}</div>}
				<div className="p-2">{children}</div>
				{footer && <div className="p-3 border-t border-gray-200 dark:border-dark-5 font-medium flex">{footer}</div>}
			</div>
		</div>
	);
};

export default DropdownComponent;
