import React from "react";
import "./style.scss";

const TooltipComponent = ({ title, content, show, bgColor = "#E84A4A", children }) => {
	return (
		<div className="popover-component">
			{show && (
				<>
					<div className="popover-wrapper" style={{ background: bgColor }}>
						<div className="popover-title">{title ? title : ""}</div>
						<div className="popover-content">{content ? content : ""}</div>
					</div>
					<div className="popover-arrow" style={{ borderTopColor: bgColor }} />
				</>
			)}
			{children}
		</div>
	);
};

export default TooltipComponent;
