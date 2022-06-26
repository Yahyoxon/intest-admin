import React, { useEffect, useState } from "react";
import cx from "classnames";
import { Icon } from "components";

// type?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark";

const AlertComponent = ({
	children,
	header,
	toggle = false,
	className,
	duration = 3000,
	icon,
	type = "primary",
	outlined = false,
	closable = false,
	softColor = false,
	bodyClass = "px-10",
	...otherProps
}) => {
	const [show, setShow] = useState(toggle);

	useEffect(() => {
		const toggleAlert = () =>
			setInterval(() => {
				setShow(false);
			}, duration);
		if (!closable) {
			toggleAlert();
		}

		return () => {
			toggleAlert();
		};
	}, [closable, duration]);

	const classNames = cx(
		`alert mt-2 relative alert-${outlined ? `outline-` : ""}${type}${softColor ? "-soft" : ""}`,
		show ? "show" : "",
		closable ? "alert-dismissible" : "",
		className && className
	);

	return (
		<div className={classNames} {...otherProps}>
			<div className="flex align-center">
				<div className="">{icon && (typeof icon === "string" ? <Icon name={icon} className="w-6 h-6 mr-2" /> : <>{icon}</>)}</div>
				{header && header}
			</div>
			<div className={bodyClass}>{children}</div>
			{closable && (
				<button className="btn-close" onClick={() => setShow(false)}>
					<Icon name="x" className="w-4 h-4" />
				</button>
			)}
		</div>
	);
};

export default AlertComponent;
