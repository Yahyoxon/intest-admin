import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import cx from "classnames";

import "./style.scss";

const TextInput = ({
	error,
	size,
	className,
	containerClassName,
	placeholder,
	isCheck,
	isRequired,
	disabled,
	type,
	inputClassName,
	field,
	label,
	extra,
	hasBorder,
	form: { touched, errors },
	tooltip,
	...props
}) => {
	const { t } = useTranslation();
	const classes = cx(
		"login-input",
		size && `login-input__${size}`,
		hasBorder && `login-input__bordered`,
		className
	);
	const classOfContainer = cx(
		"login-inputarea",
		touched[field.name] && errors[field.name] && "error"
	);
	const classesWrap = cx(
		"login-group",
		containerClassName,
		disabled && "is-disable"
	);

	return (
		<div className={classesWrap}>
			{label && <label className="login-label">{label}</label>}
			<div className={classOfContainer}>
				<input
					className={classes}
					{...{ placeholder, type }}
					{...props}
					{...field}
					autoComplete={"off"}
					disabled={disabled}
				/>
				{extra && <span className="login-extra">{extra}</span>}
			</div>

			{touched[field.name] && errors[field.name] && (
				<small className="login-error">{t(errors[field.name])}</small>
			)}
		</div>
	);
};

TextInput.propTypes = {
	label: PropTypes.string,
	type: PropTypes.oneOf(["text", "password", "email", "number", "tel"]),
	className: PropTypes.string,
	placeholder: PropTypes.string,
	extra: PropTypes.node,
	isRequired: PropTypes.bool,
	size: PropTypes.oneOf(["big", "small"]),
	hasBorder: PropTypes.bool,
	error: PropTypes.string
};

TextInput.defaultProps = {
	label: "",
	placeholder: "",
	type: "text",
	className: null,
	isCheck: false,
	isRequired: false,
	size: "big",
	hasBorder: false,
	error: "Please, fill the input"
};

export default TextInput;
