import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

const ColumnComponent = ({ children, className, xs, sm, md, lg, xl, xxl, ...otherProps }) => {
	const containerClasses = cx(
		`col-span-${xs}`,
		sm ? `sm:col-span-${sm}` : "", // 640px
		md ? `md:col-span-${md}` : "", // 768px
		lg ? `lg:col-span-${lg}` : "", // 1024px
		xl ? `xl:col-span-${xl}` : "", // 1280px
		xxl ? `xxl:col-span-${xxl}` : "", // 1600px
		className ? className : ""
	);

	return (
		<div className={containerClasses} {...otherProps}>
			{children}
		</div>
	);
};

ColumnComponent.propTypes = {
	className: PropTypes.string,
	xs: PropTypes.number,
	sm: PropTypes.number,
	md: PropTypes.number,
	lg: PropTypes.number,
	xl: PropTypes.number,
	xxl: PropTypes.number
};

ColumnComponent.defaultProps = {
	xs: 12
};

export default ColumnComponent;
