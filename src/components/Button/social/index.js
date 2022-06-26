import React from "react";
import cx from "classnames";
import Icon from "../../Icon";

// type?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark";
// 	size?: "sm" | "md" | "lg";
// 	social: "facebook" | "twitter" | "instagram" | "linkedin";

const SocialButtonComponent = ({ title = "", type, size = "md", social, className = "", children, tooltip, ...otherProps }) => {
	const classNames = cx("btn mr-2 mb-2", size === "md" ? "" : `btn-${size}`, type && `btn-${type}`, social && `btn-${social}`, className && className);
	return (
		<button className={classNames} {...otherProps} title={tooltip}>
			<Icon name={social} className={`mr-2 ${size === "lg" ? "w-5 h-5" : "w-4 h-4 "}`} /> {title && <>{title}</>} {children && <>{children}</>}
		</button>
	);
};

export default SocialButtonComponent;
