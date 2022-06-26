import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

const InputComponent = ({
	className,
	containerClass,
	label,
	placeholder,
	type,
	readOnly,
	disabled,
	isRequired,
	rounded,
	min,
	minLength,
	max,
	maxLength,
	help,
	warning,
	size,
	error,
	append,
	prepend,
	field,
	onChange,
	form: { touched, errors, setFieldValue },
	...otherProps
}) => {
	const containerClasses = cx("mb-5", "relative", containerClass ? containerClass : "");

	const inputClasses = cx(
		`form-control`,
		className ? className : "",
		touched[field.name] && errors[field.name] ? "border-theme-24" : "",
		warning ? "border-theme-23" : "",
		error ? "border-theme-24" : "",
		size ? ` form-control-${size}` : "",
		rounded ? ` form-control-rounded` : ""
	);

	return (
		<div className={containerClasses}>
			{label && (
				<label htmlFor={field.name} className="form-label">
					{label}
					{isRequired && <span title="Обязательное поле">*</span>}
				</label>
			)}

			<div className={`${append || prepend ? " input-group" : ""}`}>
				{prepend && (
					<div id={`input-group-${field.name}`} className="input-group-text">
						{prepend}
					</div>
				)}
				<input
					name={field.name}
					type={type}
					className={inputClasses}
					placeholder={placeholder}
					onKeyDown={evt => type === "number" && (evt.key === "e" || evt.key === "+" || evt.key === "-") && evt.preventDefault()}
					{...field}
					value={field.value || ""}
					min={min}
					minLength={minLength}
					max={max}
					maxLength={maxLength}
					readOnly={readOnly}
					disabled={disabled}
					onChange={e => {
						if (onChange) {
							onChange(e);
						}
						setFieldValue(field.name, e.target.value)
					}}
					{...otherProps}
				/>
				{append && (
					<div id={`input-group-${field.name}`} className="input-group-text">
						{append}
					</div>
				)}
			</div>

			{touched[field.name] && errors[field.name] && (
				<div className="text-theme-24 absolute left-0">
					<span>{errors[field.name]}</span>
				</div>
			)}

			{help && <div className="form-help absolute left-0">{help}</div>}
			{warning && <div className="text-theme-23 absolute left-0">{warning}</div>}
			{error && <div className="text-theme-24 absolute left-0">{error}</div>}
		</div>
	);
};

InputComponent.propTypes = {
	className: PropTypes.string,
	containerClass: PropTypes.string,
	type: PropTypes.oneOf(["text", "password", "number", "email", "tel", "url", "search"]),
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	placeholder: PropTypes.string,
	field: PropTypes.shape({
		name: PropTypes.string,
		value: PropTypes.any
	}),
	append: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	prepend: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	readOnly: PropTypes.bool,
	disabled: PropTypes.bool,
	isRequired: PropTypes.bool,
	rounded: PropTypes.bool,
	min: PropTypes.number,
	minLength: PropTypes.number,
	max: PropTypes.number,
	maxLength: PropTypes.number,
	size: PropTypes.oneOf(["lg", "sm"])
};

InputComponent.defaultProps = {
	placeholder: "Введите значение",
	type: "text",
	help: null,
	warning: null,
	readOnly: false,
	disabled: false,
	isRequired: false,
	rounded: false,
	min: 0,
	minLength: 0
};

export default React.memo(InputComponent);
