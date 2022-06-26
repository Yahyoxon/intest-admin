import React, { useRef, useState } from "react";
import EntityForm from "modules/entity/forms";
import { Fields, Modal } from "components";
import { Field } from "formik";
import styled, { css } from "styled-components";
import { get, groupBy } from "lodash";
import "../../style.scss";

const Create = ({ id, setCreateDocumentModal, statistic_id, selected }) => {
	const [visibleYearModal, showYearModal] = useState(false);
	const inputRef = useRef(null);

	function gen4() {
		return Math.random()
			.toString(16)
			.slice(-4);
	}

	const openYearModal = () => {
		showYearModal(true);
		setTimeout(() => {
			inputRef.current.focus();
		}, 100);
	};

	const a = get(selected, "values", []).reduce(
		(prev, curr) => [
			...prev,
			{
				uid: gen4(),
				file_id: get(curr, "file.file_id"),
				file: [get(curr, "file.file")],
				title_uz: get(curr, "file.title_uz"),
				title_ru: get(curr, "file.title_ru"),
				title_en: get(curr, "file.title_en"),
				year: get(curr, "year")
			}
		],
		[]
	);
	const groupByValues = selected ? groupBy(a, "year") : {};

	return (
		<EntityForm.Main
			method="post"
			entity="statisticsTicket"
			name={`all-${id}`}
			url="/statistics-ticket"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				setCreateDocumentModal(false);
			}}
			onError={() => {}}
			params={{
				include: "values.option,values.file.file,user"
			}}
			fields={[
				{
					name: "statistics_id",
					value: statistic_id
				},
				{
					name: "selectedYear",
					value: "2022",
					disabled: true
				},
				{
					name: "years",
					value: selected ? Object.keys(groupByValues) : ["2022"],
					type: "array",
					disabled: true
				},
				{
					name: "options",
					value: selected
						? groupByValues
						: {
								2022: [{ uid: "32as", file_id: "", title_uz: "", title_ru: "", title_en: "" }]
						  },
					type: "object"
				}
			]}>
			{({ isSubmitting, values, setFieldValue, errors }) => {
				const selectedYear = values.selectedYear;

				const addNewOptionHandler = () => {
					setFieldValue(`options[${selectedYear}]`, [
						...values.options[selectedYear],
						{
							uid: gen4(),
							file_id: "",
							title_uz: "",
							title_ru: "",
							title_en: ""
						}
					]);
				};

				const removeOptionHandler = option => {
					setFieldValue(
						`options[${selectedYear}]`,
						values.options[selectedYear].filter(o => o.uid !== option.uid)
					);
				};

				const lastOption = values.options[selectedYear][values.options[selectedYear].length - 1];

				return (
					<div>
						<Modal.Default toggle={visibleYearModal} setToggle={() => showYearModal(false)}>
							<div>
								<input
									ref={inputRef}
									type="number"
									className="form-control"
									placeholder={"Введите год"}
									autoFocus={visibleYearModal}
									onKeyPress={event => {
										const value = event.target.value;
										if (event.key === "Enter" && value.length === 4) {
											setFieldValue("years", [...values.years, value]);
											setFieldValue("selectedYear", value);
											setFieldValue("options", {
												...values.options,
												[`${value}`]: [
													{
														uid: gen4(),
														file_id: "",
														title_uz: "",
														title_ru: "",
														title_en: ""
													}
												]
											});
											showYearModal(false);
										}
									}}
								/>
							</div>
						</Modal.Default>

						<YearsRowWrap>
							<YearsRow>
								{values.years.map(y => (
									<YearsItem active={selectedYear === y} onClick={() => setFieldValue("selectedYear", y)} key={y}>
										{y}
									</YearsItem>
								))}
								<YearsItem onClick={() => openYearModal()}>+</YearsItem>
							</YearsRow>
						</YearsRowWrap>
						<div className="row">
							<div className="col-12">
								{values.options[selectedYear].map((option, index) => (
									<div className="options-create mb-5" key={index}>
										<div className="create-document-option">
											<div className="create-document-option__upload">
												<Field
													component={Fields.FileUpload}
													items={get(values, `options[${selectedYear}][${index}].file`)}
													onChangeHandler={data => {
														setFieldValue(`options[${selectedYear}][${index}].file_id`, data[0].id);
														setFieldValue(`options[${selectedYear}][${index}].file`, data);
														setFieldValue(`options[${selectedYear}][${index}].title_uz`, data[0].title);
														setFieldValue(`options[${selectedYear}][${index}].title_ru`, data[0].title);
														setFieldValue(`options[${selectedYear}][${index}].title_en`, data[0].title);
													}}
													multiple={false}
													isDoc={true}
													limit={1}
												/>
											</div>
											<div className="create-document-option__inputs">
												<Field
													component={Fields.Input}
													name={`options[${selectedYear}][${index}].title_uz`}
													type="text"
													placeholder="Введите названия (УЗ)"
												/>
												<Field
													component={Fields.Input}
													name={`options[${selectedYear}][${index}].title_ru`}
													type="text"
													placeholder="Введите названия (РУ)"
												/>
												<Field
													component={Fields.Input}
													name={`options[${selectedYear}][${index}].title_en`}
													type="text"
													placeholder="Введите названия (EN)"
												/>
											</div>
										</div>
										{get(values, `option[${selectedYear}].length > 1`) && (
											<span className={"options-create__remove"} onClick={() => removeOptionHandler(option)}>
												Удалить
											</span>
										)}
									</div>
								))}
							</div>
						</div>

						{get(lastOption, "file_id") && (
							<div className="options-create__add" onClick={() => addNewOptionHandler()}>
								Добавить
							</div>
						)}

						<div className="d-flex justify-content-end">
							<button className="btn btn-blue" type={"submit"}>
								В модерацию
							</button>
						</div>
					</div>
				);
			}}
		</EntityForm.Main>
	);
};

const YearsRowWrap = styled.div`
	display: flex;
	justify-content: center;
	border-bottom: 1px solid #e2e8f0;
	padding-bottom: 20px;
	margin-bottom: 20px;
`;

const YearsRow = styled.div`
	display: flex;
	background: rgba(118, 118, 128, 0.12);
	border-radius: 8px;
`;
const YearsItem = styled.div`
	font-weight: 600;
	cursor: pointer;
	padding: 8px 30px;
	border-radius: 8px;

	&:hover {
		background-color: #d8d8db;
	}

	${props =>
		props.active &&
		css`
			background: #407bff !important;
			color: #ffffff;
		`}
`;

export default Create;
