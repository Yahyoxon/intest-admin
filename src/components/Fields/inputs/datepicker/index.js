import React from "react";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import cx from "classnames";
import "../input-mask/style.scss";

function limit(val, max, min) {
	if (val.length === 1 && val[0] > max[0]) {
		val = "0" + val;
	}

	if (val.length === 2) {
		if (Number(val) === 0) {
			val = "01";
		} else if (val > max) {
			val = max;
		}
	}

	if (min && min.length === val.length) {
		if (min > val) val = min;
		else if (max < val) val = max;
	}

	return val;
}

function formatDate(val) {
	let date = limit(val.substring(0, 2), "31");
	let month = limit(val.substring(2, 4), "12");
	let year = limit(val.substring(4, 8), "2100", "2000");

	return (date.length ? date : "__") + "." + (month.length ? month : "__") + "." + (year.length ? year : "____");
}

const DatePickerMaskComponent = props => {
	const {
		className,
		containerClass,
		label = "",
		prefix = "",
		format = formatDate,
		mask = ["D", "D", "M", "M", "Y", "Y", "Y", "Y"],
		readOnly = false,
		placeholder = "",
		field,
		disabled,
		append,
		prepend,
		form: { touched, errors },
		...otherProps
	} = props;
	const { t } = useTranslation();
	const classes = cx("relative mb-5", containerClass ? containerClass : "", className);

	return (
		<div className={classes}>
			{label && <label className="form-label">{t(label)}</label>}
			<div className={`${append || prepend ? " input-group" : ""}`}>
				{prepend && (
					<div id={`input-group-${field.name}`} className="input-group-text">
						{prepend}
					</div>
				)}
				<NumberFormat
					className="form-control"
					format={format}
					mask={mask}
					prefix={prefix}
					placeholder={t(placeholder)}
					readOnly={readOnly}
					disabled={disabled}
					allowEmptyFormatting
					{...field}
					{...otherProps}
					name={field.name}
					value={field.value}
				/>
				{append && (
					<div id={`input-group-${field.name}`} className="input-group-text">
						{append}
					</div>
				)}
			</div>
			{touched[field.name] && errors[field.name] && <div className="form-field__error">{t(errors[field.name])}</div>}
		</div>
	);
};

export default DatePickerMaskComponent;
