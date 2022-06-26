import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import numberToWordsRu from "number-to-words-ru";
import { default as NumberFormat } from "react-number-format";

import "./style.scss";

// type: 'text', 'tel', 'password'

const InputSelectableComponent = ({
	className,
	type = "number",
	containerClass,
	label,
	readOnly = false,
	placeholder = "",
	field,
	disabled = false,
	isRequired = false,
	rounded = false,
	optionFieldName = "",
	options,
	optionLabel = "label",
	optionValue = "value",
	min = 0,
	max,
	numberReadable,
	onChange,
	form: { touched, errors, setFieldValue },
	values,
	...otherProps
}) => {
	const { t } = useTranslation();
	const [currency, setCurrency] = useState(values[optionFieldName]);

	const handleSelect = event => {
		setCurrency(event.target.value);
		setFieldValue(optionFieldName, event.target.value);
	};

	useEffect(() => {
		if (values[optionFieldName]) {
			setCurrency(values[optionFieldName]);
		}
	}, [values, optionFieldName]);

	return (
		<div className={`mb-5 relative ${containerClass ? containerClass : ""}`}>
			{label && (
				<label htmlFor={field.name} className="form-label">
					{t(label)}
				</label>
			)}

			<div className={`input-select ${className ? className : ""}`}>
				<NumberFormat
					className={`form-control ${touched[field.name] && errors[field.name] ? "border-theme-24" : ""}
                            	${rounded ? ` form-control-rounded` : ""}`}
					readOnly={readOnly}
					thousandSeparator={true}
					disabled={disabled}
					placeholder={placeholder}
					min={min}
					max={max}
					allowNegative={false}
					onValueChange={value => {
						setFieldValue(field.name, value.value);
						if (onChange) {
							onChange(value);
						}
					}}
					{...field}
					value={field.value || ""}
					{...otherProps}
				/>

				<div className="input-select__options">
					{options && options.length > 0 && (
						<select value={currency} onChange={handleSelect} disabled={disabled}>
							{options.map(option => (
								<option key={option[optionValue]} value={option[optionValue]}>
									{option[optionLabel]}
								</option>
							))}
						</select>
					)}
				</div>
			</div>

			{touched[field.name] && errors[field.name] && (
				<div className="text-theme-24 absolute left-0">
					<span>{t(errors[field.name])}</span>
				</div>
			)}

			{numberReadable && field.value !== undefined && field.value > 0 && (
				<div className="text-gray-600 mt-2">
					{numberToWordsRu.convert(field.value, {
						currency: "number",
						declension: "nominative",
						roundNumber: -1,
						convertMinusSignToWord: false,
						showNumberParts: {
							integer: true,
							fractional: true
						},
						convertNumbertToWords: {
							integer: true,
							fractional: false
						},
						showCurrency: {
							integer: true,
							fractional: true
						}
					})}
				</div>
			)}
		</div>
	);
};

export default InputSelectableComponent;
