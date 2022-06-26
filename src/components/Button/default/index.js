import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

import { Icon } from "components";

const DefaultButtonComponent = ({
	title,
	buttonType,
	type,
	size,
	className,
	rounded,
	loading,
	loadingIcon,
	hasIcon,
	iconName,
	prepend,
	append,
	tooltip,
	disabled,
	children,
	...otherProps
}) => {
	const classNames = cx("btn mr-2", size === "md" ? "" : `btn-${size}`, rounded && `btn-rounded-${type}`, type && `btn-${type}`, className ? className : "");

	return (
		<button type={buttonType} className={classNames} {...otherProps} disabled={loading || disabled} title={tooltip}>
			{hasIcon && <Icon name={iconName} />}
			{prepend && prepend}
			{title ? <>{title}</> : <>{children}</>}{" "}
			{loading && <Icon name={loadingIcon} spinner={loading} fill="#fff" className={`ml-2 ${size === "lg" ? "w-5 h-5" : "w-4 h-4 "}`} />}
			{append && append}
		</button>
	);
};

DefaultButtonComponent.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	rounded: PropTypes.bool,
	loading: PropTypes.bool,
	hasIcon: PropTypes.bool,
	buttonType: PropTypes.oneOf(["reset", "button", "submit"]),
	type: PropTypes.oneOf(["primary", "secondary", "success", "warning", "danger", "dark", "blue"]),
	size: PropTypes.oneOf(["sm", "md", "lg"]),
	loadingIcon: PropTypes.oneOf(["oval", "spinning-circles", "three-dots", "puff"])
};

DefaultButtonComponent.defaultProps = {
	hasIcon: false,
	loading: false,
	rounded: false,
	buttonType: "button",
	type: "blue",
	size: "md",
	loadingIcon: "oval",
	iconName: "plus-circle"
};

export default DefaultButtonComponent;
