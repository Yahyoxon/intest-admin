import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

import { Icon } from "components";

const OutlineButtonComponent = ({ title, buttonType, type, size, className, rounded, loading, loadingIcon, disabled, children, tooltip, ...otherProps }) => {
	const classNames = cx(
		"btn mr-2 dark:bg-dark-3",
		rounded && ` btn-rounded btn-${type}-soft`,
		size === "md" ? "" : `btn-${size}`,
		type && `btn-outline-${type}`,
		className ? className : ""
	);

	return (
		<button type={buttonType} className={classNames} disabled={disabled} {...otherProps} title={tooltip}>
			{title && <>{title}</>} {children && <>{children}</>}
			{loading && <Icon name={loadingIcon} spinner={loading} fill="#fff" className={`ml-2 ${size === "lg" ? "w-5 h-5" : "w-4 h-4 "}`} />}
		</button>
	);
};

OutlineButtonComponent.propTypes = {
	className: PropTypes.string,
	rounded: PropTypes.bool,
	loading: PropTypes.bool,
	disabled: PropTypes.bool,
	buttonType: PropTypes.oneOf(["reset", "button", "submit"]),
	type: PropTypes.oneOf(["primary", "secondary", "success", "warning", "danger", "dark", "blue"]),
	size: PropTypes.oneOf(["sm", "md", "lg"]),
	loadingIcon: PropTypes.oneOf(["oval", "spinning-circles", "three-dots", "puff"])
};

OutlineButtonComponent.defaultProps = {
	rounded: false,
	loading: false,
	disabled: false,
	buttonType: "button",
	type: "primary",
	size: "md",
	loadingIcon: "oval"
};

export default OutlineButtonComponent;
