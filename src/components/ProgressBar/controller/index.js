import React from "react";

import cx from "classnames";
import PropTypes from "prop-types";

import "./style.scss";

const ProgressControllerComponent = ({ label, className, min, max, disabled, onChange, field, form: { touched, errors, setFieldValue } }) => {
	const classNames = cx("progress-controller-component", className ? className : "");

	return (
		<div className={classNames}>
			<label htmlFor={field.name}>{label}</label>
			<div className="flex align-center">
				<div className="progress-controller">
					<input
						type="range"
						name={field.name}
						min={min}
						max={max}
						disabled={disabled}
						value={field.value || 0}
						onChange={e => {
							if (onChange) {
								onChange(e);
							}
							setFieldValue(field.name, e.target.value);
						}}
					/>
				</div>
				<div className="progress-input">{field.value} %</div>
			</div>
			{touched[field.name] && errors[field.name] && (
				<div className="text-theme-24 absolute left-0">
					<span>{errors[field.name]}</span>
				</div>
			)}
		</div>
	);
};

ProgressControllerComponent.propTypes = {
	label: PropTypes.string,
	className: PropTypes.string,
	min: PropTypes.number,
	max: PropTypes.number,
	disabled: PropTypes.bool,
	field: PropTypes.shape({
		name: PropTypes.string,
		value: PropTypes.any
	}),
	form: PropTypes.shape({
		touched: PropTypes.object,
		errors: PropTypes.object,
		setFieldValue: PropTypes.func
	})
};

ProgressControllerComponent.defaultProps = {
	min: 0,
	max: 100,
	disabled: false
};

export default ProgressControllerComponent;
