import React from "react";
import { useTranslation } from "react-i18next";
import cx from 'classnames'
import "./style.scss";

// borderColor: "white" | "gray" | "black" | "blue" | "dark-gray",

const RadioButton = ({
	id,
	name,
	value,
	checked,
	disabled,
	label,
	className,
	borderColor="gray",
	children,
	onChange
}) => {
	const { t } = useTranslation();

	const classNames = cx("form-check mt-2", className ? className : '')

	return (
		<div className={classNames}>
			<input
				id={id}
				type="radio"
				className={`form-check-input border-${borderColor}`}
				name={name}
				value={value}
				onChange={onChange}
				checked={checked}
				disabled={disabled}
			/>
			<label className="form-check-label" htmlFor={id}>
				{label ? t(label) : t(children)}
			</label>
		</div>
	);
};

export default RadioButton;
