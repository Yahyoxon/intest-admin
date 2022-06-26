import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import cx from "classnames";
import "../style.scss";
import { useSelector } from "react-redux";

const SimpleValue = ({ options, value, optionValue, children, ...rest }) => {
	value = value ? options.find(option => typeof optionValue === "string" && option[optionValue] === value) : value;
	return children({ options, value, ...rest });
};

const SelectComponent = props => {
	const { t } = useTranslation();
	const {
		isClearable = false,
		isDisabled = false,
		isMulti = false,
		isSearchable = false,
		disableOptions,
		className,
		label,
		placeholder,
		options,
		field,
		optionLabel,
		optionValue = "id",
		form: { touched, errors, setFieldValue, setFieldTouched },
		menuPlacement,
		initialValue,
		menuPortalTarget,
		handleChange = () => {},
		...otherProps
	} = props;
	const theme = useSelector(state => state.system.theme);
	const classes = cx(
		"form-field-select mb-5",
		touched[field.name] && errors[field.name] && "form-field-select--error",
		field.value && "form-field-select--active",
		className ? className : ""
	);

	const customStyle = {
		container: provided => ({
			...provided,
			minWidth: 100
		}),
		control: provided => ({
			...provided,
			cursor: "pointer",
			borderColor: "rgba(0,0,0,.1)",
			border: touched[field.name] && errors[field.name] ? "1px solid rgba(206, 49, 49, 1)" : "1px solid #e1e2e6",
			backgroundColor: theme === "dark" ? "rgba(35, 42, 59, 1)" : "",

			minHeight: 35,
			height: 37
		}),
		indicatorSeparator: provided => ({
			...provided,
			display: "none"
		}),
		option: provided => {
			return {
				...provided,
				fontSize: "14px",
				color: theme === "dark" ? "rgba(113, 128, 150, 1)" : "",
				backgroundColor: "initial",
				cursor: "pointer",
				"&:hover": {
					backgroundColor: theme === "dark" ? "#3f4865" : "#B2D4FF"
				}
			};
		},
		menuPortal: provided => ({
			...provided
		}),
		menu: provided => ({
			...provided,
			backgroundColor: theme === "dark" ? "rgba(35, 42, 59, 1)" : "#fff",
			zIndex: "999"
		}),
		placeholder: provided => ({
			...provided,
			fontSize: "14px",
			fontFamily: "Roboto",
			whiteSpace: "nowrap",
			color: theme === "dark" ? "rgba(74, 85, 104, 1)" : "rgba(160, 174, 192, 1)",
			overflow: "hidden",
			textOverflow: "ellipsis"
		}),
		singleValue: provided => {
			return {
				...provided,
				color: theme === "dark" ? "rgba(113, 128, 150, 1)" : "#000"
				// backgroundColor: "initial"
			};
		}
	};

	useEffect(() => {
		if (initialValue) {
			setFieldValue(field.name, initialValue);
		}
	}, [field, initialValue, setFieldValue]);

	return (
		<div className={classes}>
			{label && <div className="form-field-select__label">{t(label)}</div>}
			<SimpleValue
				id={field.name}
				name={field.name}
				onChange={(option, action) => {
					setFieldValue(field.name, option ? option[optionValue] : null);
					handleChange(option);
				}}
				onBlur={() => setFieldTouched(field.name, true)}
				options={options}
				optionValue={optionValue}
				getValue={option => typeof optionValue === "string" && option[optionValue]}
				getOptionLabel={option => (typeof optionLabel === "function" ? optionLabel(option) : option[optionLabel])}
				getOptionValue={option => (typeof optionValue === "function" ? optionValue(option) : option[optionValue])}
				placeholder={placeholder}
				styles={customStyle}
				menuPortalTarget={menuPortalTarget}
				value={field.value}
				isDisabled={isDisabled}
				isMulti={isMulti}
				isSearchable={isSearchable}
				isClearable={isClearable}
				menuPlacement={menuPlacement}
				{...otherProps}>
				{simpleProps => <Select {...simpleProps} />}
			</SimpleValue>
			{touched[field.name] && errors[field.name] && (
				<div className="text-theme-24 absolute left-0">
					<span>{t(errors[field.name])}</span>
				</div>
			)}
		</div>
	);
};

export default SelectComponent;
