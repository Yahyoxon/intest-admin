import React from "react";
import { useTranslation } from "react-i18next";

import "./style.scss";
import { Icon } from "..";

const SpinnerComponent = ({ name = "puff", color = "rgba(20, 46, 113, 1)", className = "w-12 h-12", children, tips, ...otherProps }) => {
	const { t } = useTranslation();
	return (
		<div className={`spinner-container`} {...otherProps}>
			<div className="spinner-position">
				<Icon spinner={true} name={name} fill={color} className={className} />
				{tips && (
					<div className="tips" style={{ color: color }}>
						{t(tips)}
					</div>
				)}
			</div>
		</div>
	);
};

export default SpinnerComponent;
