import React from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";

const TextareaComponent = ({
	className = null,
	label = null,
	readOnly = false,
	placeholder = "",
	rows = 10,
	cols,
	minLength,
	maxLength,
	disabled = false,
	resizeable = false,
	field,
	form: { touched, errors },
	...props
}) => {
	const { t } = useTranslation();
	const classes = cx("mb-5 relative", className ? className : "");

	return (
		<div className={classes}>
			{label && <label className="form-label w-full flex flex-col sm:flex-row">{t(label)}</label>}
			<textarea
				className={`form-control
                            ${touched[field.name] && errors[field.name] && "border-theme-24"}`}
				readOnly={readOnly}
				placeholder={t(placeholder)}
				rows={rows}
				cols={cols}
				minLength={minLength}
				maxLength={maxLength}
				disabled={disabled}
				style={{ resize: "none" }}
				{...field}
				{...props}
			/>
			{touched[field.name] && errors[field.name] && (
				<div className="text-theme-24 absolute left-0">
					<span>{t(errors[field.name])}</span>
				</div>
			)}
		</div>
	);
};

export default TextareaComponent;
