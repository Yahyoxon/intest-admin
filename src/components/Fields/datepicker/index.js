import React, { useEffect, useState } from "react";
import DateRangePicker from "react-daterange-picker";
import { withRouter } from "react-router-dom";
import "react-daterange-picker/dist/css/react-calendar.css";
import cx from "classnames";
import moment from "moment";
import { Icon } from "components";
import { useOutsideClick } from "hooks";
import "./style.scss";

const DatePickerComponent = ({
	history,
	location,
	type = "single",
	placeholder,
	className = "",
	format = "DD/MM/YYYY",
	size,
	isClearable = true,
	readOnly = false,
	disabled = false,
	field,
	form: { setFieldValue, touched, errors },
	label,
	position = "left",
	onChange,
	...otherProps
}) => {
	const { isVisible, setIsVisible, ref } = useOutsideClick(false);
	const [newDate, setNewDate] = useState(null);

	const classes = cx("datepicker-component mb-5 relative", className ? className : "");

	const onSelect = date => {
		if (onChange) {
			onChange(date);
		}
		setNewDate(date);
		setFieldValue(field.name, date);
		setIsVisible(!isVisible);
	};

	const handleToday = () => {
		const date = moment(new Date());
		if (onChange) {
			onChange(date);
		}
		setNewDate(date);
		setFieldValue(field.name, date);
		setIsVisible(!isVisible);
	};

	const handleClearDate = () => {
		if (onChange) {
			onChange(null);
		}
		setNewDate(null);
		setFieldValue(field.name, null);
	};

	useEffect(() => {
		setNewDate(field.value);
	}, [field.value]);

	return (
		<div className={classes} ref={ref}>
			{label && <div className="form-label">{label}</div>}
			<div className={`${isClearable ? " relative" : ""}`}>
				<input
					type="text"
					name={field.name}
					className={`form-control pl-3 ${size ? ` form-control-${size}` : ""}`}
					readOnly={readOnly}
					onClick={() => {
						setIsVisible(!isVisible);
					}}
					value={newDate ? moment(newDate).format(format) : placeholder}
					placeholder={placeholder}
					disabled={disabled}
					{...otherProps}
				/>
				{!disabled ? (
					isClearable && newDate ? (
						<div className={`absolute right-0 ${size === "sm" ? "bottom-1" : "bottom-2"} right-3 cursor-pointer`} onClick={handleClearDate}>
							<Icon name="x" className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`} />
						</div>
					) : (
						<div className={`absolute ${size === "sm" ? "bottom-1" : "bottom-3"} right-3 cursor-pointer`} onClick={() => setIsVisible(!isVisible)}>
							<Icon name="calendar" className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} strokeWidth={5} />
						</div>
					)
				) : null}
			</div>

			{isVisible && (
				<>
					<DateRangePicker
						onSelect={onSelect}
						value={newDate}
						className={`datepicker mt-5 absolute
                            ${touched[field.name] && errors[field.name] && "border-theme-24"} ${position === "left" ? "left-0" : "right-0"}`}
						firstOfWeek={1}
						selectionType="single"
					/>
					<div
						className="datepicker-today"
						onClick={handleToday}
						style={{ bottom: touched[field.name] && errors[field.name] ? "-2.6rem" : "-5.3rem" }}>
						Today
					</div>
				</>
			)}

			{touched[field.name] && errors[field.name] && <div className="text-theme-24">{errors[field.name]}</div>}
		</div>
	);
};

export default withRouter(DatePickerComponent);
