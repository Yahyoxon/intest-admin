import React from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import "./style.scss";

const SwitchComponent = ({ className = null, label = null, checked = false, field, onChange, ...props }) => {
	const { t } = useTranslation();
	const classes = cx("form-check mb-5", className);
	return (
		<div className={classes}>
			<label className="form-check-label mr-2" htmlFor={field.name}>
				{t(label)}
			</label>
			<input
				id={field.name}
				className="form-check-switch"
				type="checkbox"
				checked={Boolean(field.value)}
				name={field.name}
				onChange={onChange}
				{...props}
			/>
		</div>
	);
};

export default SwitchComponent;
