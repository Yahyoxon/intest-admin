import React, { Component } from "react";
import PropTypes from "prop-types";
import AsyncPaginate from "react-select-async-paginate";
import { get, isEqual } from "lodash";
import { connect } from "react-redux";
import cx from "classnames";

import { api, queryBuilder } from "services";

class AsyncSelectComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false
		};
	}

	static propTypes = {
		isDisabled: PropTypes.bool,
		type: PropTypes.oneOf(["normal", "small"]),
		title: PropTypes.string.isRequired,
		className: PropTypes.string,
		optionValue: PropTypes.string,
		optionLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
		isSearchable: PropTypes.bool,
		menuPlacement: PropTypes.string,
		filterParams: PropTypes.object,
		extraOptions: PropTypes.array,
		onChange: PropTypes.func,
		loadOptionsKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
		loadOptionsParams: PropTypes.func,
		optionRenderer: PropTypes.func,
		isRequired: PropTypes.bool,
		isClearable: PropTypes.bool
	};

	static defaultProps = {
		title: "",
		className: null,
		optionValue: "id",
		optionLabel: "title",
		isSearchable: false,
		menuPlacement: "bottom",
		disableOptions: [],
		loadOptionsKey: "data",
		extraOptions: [],
		filterParams: {},
		loadOptionsParams: () => {},
		optionRenderer: () => {},
		onChange: () => {},
		type: "normal",
		isRequired: false,
		isClearable: false
	};

	load = async (search, prevOptions, { page }, url, filterParams, loadOptionsParams, loadOptionsKey, extraOptions, options) => {
		if (!options) {
			const { data } = await api.request.get(
				queryBuilder(url, {
					page,
					filter: filterParams,
					...loadOptionsParams(search)
				})
			);

			return {
				options: loadOptionsKey
					? typeof loadOptionsKey === "function"
						? [...extraOptions, ...loadOptionsKey(data)]
						: [...extraOptions, ...get(data, loadOptionsKey, [])]
					: data,
				hasMore: get(data, "current_page", 1) < get(data, "last_page", 1),
				additional: { page: get(data, "current_page", 1) + 1 }
			};
		}
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.loadOptionsUrl && prevProps.loadOptionsUrl !== this.props.loadOptionsUrl) {
			this.setState({ isLoading: true }, () => this.setState({ isLoading: false }));
		}
		if (!isEqual(prevProps.filterParams, this.props.filterParams)) {
			this.setState({ isLoading: true }, () => this.setState({ isLoading: false }));
		}

		if (prevProps.canUpdate !== this.props.canUpdate) {
			this.setState({ isLoading: true }, () => this.setState({ isLoading: false }));
		}
	}

	render() {
		const {
			disableOptions,
			label,
			isMulti,
			loadOptionsKey,
			placeholder,
			options,
			field,
			optionLabel,
			optionValue,
			form: { errors, setFieldValue, setFieldTouched, touched },
			isSearchable,
			menuPlacement,
			loadOptionsUrl,
			extraOptions,
			filterParams,
			onChange,
			isClearable,
			loadOptionsParams,
			isDisabled,
			isRequired,
			className,
			theme
		} = this.props;

		const classes = cx("form-field-select mb-5", touched[field.name] && errors[field.name] && "form-field-select--error", className ? className : "");

		const customStyle = {
			container: provided => ({
				...provided,
				minHeight: "20px",
				minWidth: "150px"
			}),
			control: provided => ({
				...provided,
				cursor: "pointer",
				borderColor: "rgba(0,0,0,.1)",
				border: touched[field.name] && errors[field.name] ? "1px solid rgba(206, 49, 49, 1)" : "1px solid #e1e2e6",
				backgroundColor: theme === "dark" ? "rgba(35, 42, 59, 1)" : "",
				padding: "2px 10px 2px 0",
				minHeight: "20px",
				zIndex: 1
			}),
			indicatorSeparator: provided => ({
				...provided,
				display: "none"
			}),

			indicatorsContainer: provided => ({
				...provided,
				height: "30px"
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
				...provided,
				zIndex: 9999
			}),
			menu: provided => ({
				...provided,
				backgroundColor: theme === "dark" ? "rgba(35, 42, 59, 1)" : "#fff",
				zIndex: 9999
			}),
			singleValue: provided => {
				return {
					...provided,
					color: theme === "dark" ? "rgba(113, 128, 150, 1)" : "#000"
					// backgroundColor: "initial"
				};
			},
			placeholder: provided => ({
				...provided,
				fontSize: "14px",
				fontFamily: "Roboto",
				whiteSpace: "nowrap",
				color: theme === "dark" ? "rgba(74, 85, 104, 1)" : "rgba(160, 174, 192, 1)",
				overflow: "hidden",
				textOverflow: "ellipsis"
			})
		};

		const { isLoading } = this.state;

		return (
			<div className={classes}>
				{label && (
					<label className="form-label">
						{label}
						{isRequired && <span className="form-require">*</span>}
					</label>
				)}
				{!isLoading && (
					<AsyncPaginate
						styles={customStyle}
						id={field.name}
						name={field.name}
						debounceTimeout={300}
						onChange={option => {
							onChange(option);
							setFieldValue(field.name, option);
						}}
						onBlur={() => setFieldTouched(field.name, true)}
						getValue={option => option[optionValue]}
						getOptionLabel={option => (typeof optionLabel === "function" ? optionLabel(option) : option[optionLabel])}
						getOptionValue={option => (typeof optionValue === "function" ? optionValue(option) : option[optionValue])}
						value={field.value}
						additional={{ page: 1 }}
						isDisabled={isDisabled}
						isClearable={isClearable}
						theme={themes => ({
							...themes,
							colors: {
								...themes.colors,
								primary50: theme === "dark" ? "rgba(63,72,101,0.84)" : "rgba(38,132,255,0.71)",
								primary: theme === "dark" ? "#3f4865" : "rgba(38,132,255,0.79)",
								neutral10: theme === "dark" ? "#293145" : "#f2f2f2",
								neutral80: theme === "dark" ? "white" : "#3b3a3a"
							}
						})}
						loadOptions={(search, prevOptions, { page }) =>
							this.load(search, prevOptions, { page }, loadOptionsUrl, filterParams, loadOptionsParams, loadOptionsKey, extraOptions, options)
						}
						isOptionDisabled={option => disableOptions.reduce((prev, curr) => [...prev, curr.id], []).includes(option.id)}
						{...{
							isMulti,
							options,
							placeholder,
							isSearchable,
							menuPlacement
						}}
					/>
				)}
				{touched[field.name] && errors[field.name] && <span className="text-theme-24 absolute left-0"> {errors[field.name]} </span>}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	theme: state.system.theme
});

export default connect(mapStateToProps)(AsyncSelectComponent);
