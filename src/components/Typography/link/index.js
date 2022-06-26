import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

function getColor(color) {
	switch (color) {
		case "dark-grey":
			return "text-gray-700 dark:text-gray-600";
		case "grey":
			return "text-gray-600";
		case "yellow":
			return "text-theme-23";
		case "red":
			return "text-theme-24";
		case "green":
			return "text-theme-10";
		case "blue":
			return "text-theme-17";
		case "black":
		default:
			return "";
	}
}

const LinkComponent = ({ type = "link", url, weight = "normal", color = "", children, className }) => {
	const classNames = cx(`font-${weight} block`, getColor(color), className && className);

	if (type.toLowerCase() === "anchor")
		return (
			<a href={url} className={classNames}>
				{children}
			</a>
		);

	return (
		<Link to={url} className={classNames}>
			{children}
		</Link>
	);
};

export default LinkComponent;
