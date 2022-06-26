import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import cx from "classnames";
import PropTypes from "prop-types";
import ReactInputMask from "react-input-mask";
import { range } from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Button } from "components";

import "react-datepicker/dist/react-datepicker.css";
import "./style.scss";

const DatePickerComponent = ({
	label,
	isRequired,
	form: { touched, errors, setFieldValue, setFieldTouched },
	field,
	variant = "small",
	inputClassname,
	containerClassName,
	size = "normal",
	format = "yyyy-MM-dd",
	popperPlacement = "bottom-end",
	calendarStartDay = 1,
	placeholder,
	popperClassName,
	today,
	minDate,
	...props
}) => {
	const { t } = useTranslation();
	const selected = field.value ? moment(field.value).toDate() : new Date();

	const years = range(selected.getFullYear() - 20, selected.getFullYear() + 20, 1);
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	useEffect(() => {
		if (!field.value) {
			setFieldValue(field.name, new Date());
		}
	}, [field, setFieldValue]);

	const getMask = () => {
		return format
			.replaceAll("y", "9")
			.replaceAll("M", "9")
			.replaceAll("d", "9");
	};

	return (
		<div className={`${containerClassName} form-group day-picker day-picker-${size}`}>
			{label && (
				<label className="form-label">
					{label}
					{isRequired && <span className="form-require">*</span>}
				</label>
			)}
			<div className="day-picker__container">
				<DatePicker
					minDate={minDate}
					showFullMonthYearPicker
					placeholder={placeholder}
					calendarStartDay={calendarStartDay}
					popperPlacement={popperPlacement}
					dateFormat={format}
					selected={selected}
					customInput={<ReactInputMask mask={getMask()} />}
					className={cx(inputClassname, variant)}
					popperClassName={cx("z-index-99 border-r-5", popperClassName)}
					portalId="main-content"
					todayButton={
						today && (
							<Button.Outline size="md" styles="outline" type="secondary" style={{ margin: "0 auto", borderRadius: "5px", minWidth: "120px" }}>
								{t("Today")}
							</Button.Outline>
						)
					}
					onChange={date => setFieldValue(field.name, date)}
					onBlur={() => setFieldTouched(field.name, true)}
					renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
						<div style={{ margin: 10, display: "flex", justifyContent: "center" }}>
							<button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="react-datepicker__prev">
								{"<"}
							</button>
							<select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(value)}>
								{years.map(option => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>

							<select value={months[date.getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
								{months.map(option => (
									<option key={option} value={option}>
										{t(option)}
									</option>
								))}
							</select>

							<button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="react-datepicker__next">
								{">"}
							</button>
						</div>
					)}
					{...props}
				/>
				<img className="day-picker__img" src={require("assets/images/icons/calendar.svg")} alt="Choose date" />
			</div>

			{touched[field.name] && errors[field.name] && <span className="simple-select__error">{errors[field.name]}</span>}
		</div>
	);
};

DatePickerComponent.propTypes = {
	label: PropTypes.string,
	isRequired: PropTypes.bool,
	form: PropTypes.shape({
		touched: PropTypes.object,
		errors: PropTypes.object,
		setFieldValue: PropTypes.func,
		setFieldTouched: PropTypes.func,
		setFieldError: PropTypes.func
	}),
	variant: PropTypes.oneOf(["small", "normal"]),
	inputClassname: PropTypes.string,
	containerClassName: PropTypes.string,
	format: PropTypes.string,
	popperPlacement: PropTypes.string,
	calendarStartDay: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7]),
	placeholder: PropTypes.string,
	popperClassName: PropTypes.string,
	today: PropTypes.bool
};

DatePickerComponent.defaultProps = {
	label: "Date",
	isRequired: true,
	variant: "small",
	inputClassname: "",
	containerClassName: "",
	format: "dd.mm.yyyy",
	popperPlacement: "bottom-end",
	calendarStartDay: 1,
	placeholder: "dd.MM.yyyy",
	popperClassName: "",
	today: true
};

export default DatePickerComponent;
