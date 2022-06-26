import React, { useState, useRef } from "react";
import cx from "classnames";
import { get } from "lodash";
import "./style.scss";

const PanelComponent = ({
	slideFrom = "y",
	rounded = false,
	borderColor = "border-transparent",
	className,
	children,
	header,
	headerClass,
	headerBorder = false,
	footer,
	footerClass,
	footerBorder = false,
	bodyClass,
	hasAccordion = false,
	initialOpen = true,
	...otherProps
}) => {
	const [opened, setOpened] = useState(initialOpen);

	const containerClasses = cx(`intro-${slideFrom} box border ${borderColor}`, className ? className : "", rounded ? "rounded-md" : "");
	const bodyClasses = cx("preview", bodyClass && bodyClass, hasAccordion && (opened ? "--opened" : "--hide"), hasAccordion && "--overflow-y");
	const headerClasses = cx("p-3", headerBorder && `border-b ${borderColor}`, headerClass && headerClass, hasAccordion && "--hasAccordion");

	const accordionRef = useRef(null);
	const height = get(accordionRef, "current.scrollHeight");

	const currentStyle = {
		maxHeight: hasAccordion ? (opened ? height : 0) : "max-content"
	};
	const iconStyles = {
		transform: `rotate(${opened ? "90deg" : "0"})`
	};

	return (
		<div className={containerClasses} {...otherProps}>
			<div className="panel py-3 px-3">
				{header && (
					<div className={headerClasses}>
						{header}
						{hasAccordion && (
							<img
								src={require("assets/images/icons/right-chevron.svg")}
								alt=""
								onClick={() => setOpened(!opened)}
								className="accordion__chevron"
								style={iconStyles}
							/>
						)}
					</div>
				)}
				<div ref={accordionRef} className={bodyClasses} style={currentStyle}>
					{children}
				</div>
				{footer && <div className={`p-3 ${footerBorder ? `border-t ${borderColor}` : ""} ${footerClass ? footerClass : ""}`}>{footer}</div>}
			</div>
		</div>
	);
};

export default PanelComponent;
