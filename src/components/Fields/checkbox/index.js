import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import "./style.scss";

const CheckboxComponent = ({ className = null, label = null, checked = false, field, form: { touched, errors, setFieldValue }, ...props }) => {
	const { t } = useTranslation();

	const [isChecked, setChecked] = useState(false);

	useEffect(() => {
		if (field.value) {
			setChecked(Boolean(field.value));
		}
	}, [field]);

	const handleChange = e => {
		setChecked(e.target.checked);
		setFieldValue(field.name, e.target.checked);
	};
	const classes = cx("relative", className ? className : "");
	return (
		<div className={classes}>
			<div className="form-check">
				<input
					id={field.name}
					{...props}
					type="checkbox"
					className="form-check-input"
					checked={isChecked ? isChecked : checked}
					name={field.name}
					onChange={handleChange}
				/>
				<label htmlFor={field.name} className="form-check-label font-semibold">
					{t(label)}
				</label>
			</div>
			{touched[field.name] && errors[field.name] && (
				<div className="text-theme-24 absolute left-0">
					<span>{t(errors[field.name])}</span>
				</div>
			)}
		</div>
	);
};

export default CheckboxComponent;
