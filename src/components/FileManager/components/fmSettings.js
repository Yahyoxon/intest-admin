import React, { useEffect, useState } from "react";
import { Button } from "components";
import get from "lodash/get";
import EntityActions from "modules/entity/actions";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNotification } from "hooks";
import Select from "react-select";

const FmSettings = ({ size, setSize, selected, filterType, setFilterType }) => {
	const [fileTitle, setFileTitle] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setFileTitle(get(selected, "title"));
	}, [selected]);

	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const theme = useSelector(state => state.system.theme);

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
			backgroundColor: theme === "dark" ? "rgba(35, 42, 59, 1)" : "",
			padding: "2px 10px 2px 0",
			minHeight: "20px"
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
			color:
				theme === "dark"
					? "rgba(74, 85, 104, 1)"
					: "rgba(160, 174, 192, 1)",
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

	const changeFileName = () => {
		dispatch(
			EntityActions.Form.request({
				method: "put",
				entity: "files",
				name: `allFiles-${filterType}`,
				url: `/filemanager/${selected.id}`,
				primaryKey: "id",
				id: selected.id,
				values: { title: fileTitle },
				updateData: true,
				normalizeData: data => data,
				cb: {
					success: () => {
						notification("Успешно", {
							type: "success"
						});
					},
					error: () => {
						notification("", {
							type: "danger"
						});
					},
					finally: () => {
						// this.setState({ loading: false });
					}
				}
			})
		);
	};

	const deleteFile = () => {
		setLoading(true);
		dispatch(
			EntityActions.Form.request({
				method: "delete",
				entity: "files",
				name: `allFiles-${filterType}`,
				url: `/filemanager/${selected.id}`,
				primaryKey: "id",
				id: selected.id,
				deleteData: true,
				cb: {
					success: () => {
						notification("Успешно удалено", {
							type: "success"
						});
					},
					error: () => {
						notification("", {
							type: "danger"
						});
					},
					finally: () => {
						setLoading(false);
					}
				}
			})
		);
	};

	const onEnter = event => {
		if (event.keyCode === 13) {
			changeFileName();
		}
	};

	const onBlur = value => {
		if (get(selected, "title") !== value) {
			changeFileName();
		}
	};

	const filterOptions = [
		{ value: "images", label: "Картинки" },
		{ value: "documents", label: "Документы" }
	];
	const sizeOptions = [
		{ value: "normal", label: "Большой" },
		{ value: "low", label: "Средный" },
		{ value: "small", label: "Маленький" }
	];
	const valueFilter = filterOptions.find(f => f.value === filterType);
	const valueSize = sizeOptions.find(s => s.value === size);
	return (
		<div className="fm-settings">
			<div style={{ marginBottom: "20px" }}>
				<div className="label text-black">Фильтр</div>
				<Select
					className="basic-single"
					classNamePrefix="select"
					value={valueFilter}
					isSearchable={true}
					name="color"
					options={filterOptions}
					styles={customStyle}
					onChange={option => setFilterType(option.value)}
				/>
			</div>
			<div style={{ marginBottom: "20px" }}>
				<div className="label text-black">Размер картинки</div>
				<Select
					className="basic-single"
					classNamePrefix="select"
					value={valueSize}
					isSearchable={true}
					name="color"
					options={sizeOptions}
					styles={customStyle}
					onChange={option => setSize(option.value)}
				/>
			</div>
			{selected && (
				<>
					<div style={{ marginBottom: "30px" }}>
						<div className="label">Переименовать названия</div>
						<input
							name="alt"
							className={`form-control`}
							value={fileTitle}
							placeholder="текст"
							onChange={e => setFileTitle(e.target.value)}
							onBlur={e => onBlur(e.target.value)}
							onKeyDown={e => onEnter(e)}
						/>
					</div>
					<div className="delete-image">
						<div className="label">
							{t("Так же можете удалить картинку")}.
						</div>
						<Button.Default
							type="danger"
							buttonType="html"
							loading={loading}
							onClick={() => deleteFile()}>
							{t("Удалить")}
						</Button.Default>
					</div>
				</>
			)}
		</div>
	);
};

export default FmSettings;
