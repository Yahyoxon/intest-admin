import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

const RowComponent = ({ children, className, cols = 12, gutter = 4, gutterX, gutterY = 3, ...otherProps }) => {
	const containerClasses = cx(
		"grid",
		cols ? `grid-cols-${cols}` : "",
		gutter ? `gap-${gutter}` : "",
		gutterX ? `gap-x-${gutterX}` : "",
		gutterY ? `gap-y-${gutterY}` : "",
		className ? className : ""
	);

	return (
		<div className={containerClasses} {...otherProps}>
			{children}
		</div>
	);
};

RowComponent.propTypes = {
	className: PropTypes.string,
	cols: PropTypes.number,
	gutter: PropTypes.number,
	gutterY: PropTypes.number,
	gutterX: PropTypes.number
};

RowComponent.defaultProps = {
	cols: 12,
	gutter: 4
};

export default RowComponent;
