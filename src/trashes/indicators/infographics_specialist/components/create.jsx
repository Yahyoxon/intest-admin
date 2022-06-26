import React, { useRef, useState } from "react";
import EntityForm from "modules/entity/forms";
import { Fields, Modal } from "components";
import { Field } from "formik";
import styled, { css } from "styled-components";
import { get, groupBy } from "lodash";
import {helpers} from "services"

const Create = ({ id, options, setCreateModal, statistic_id, statistic_type, selected, setSelected }) => {

	const [visibleYearModal, showYearModal] = useState(false)
	const [isVisible, setVisible] = useState(true);
	const inputRef = useRef(null);

	const openYearModal = () => {
		showYearModal(true);
		setTimeout(() => {
			inputRef.current.focus()
		}, 100)
	}


	const a = get(selected, "values", []).reduce((prev, curr) => [...prev, {
		option_id: curr.option_id,
		value:curr.value,
		value_type: curr.value_type,
		year: curr.year
	}], []);

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
				setCreateModal(false);
				setTimeout(() => {
					setSelected(null)
				}, 300)
			}}
			onError={() => {

			}}
			params={{
				include: 'values.option,user'
			}}
			fields={[
				{
					name: "statistics_id",
					value: statistic_id
				},
				{
					name: 'selectedYear',
					value: '2021',
					disabled: true
				},
				{
					name: 'years',
					value: selected ? Object.keys(groupByValues) : ["2021"],
					type: 'array',
					disabled: true
				},
				{
					name: "options",
					value: selected ? groupByValues : {
						2021: options.reduce((prev, curr) => [...prev, { option_id: curr.id, value: "", value_type: 1 }], []),
					},
					type: "object"
				}
			]}>
			{({ isSubmitting, values, setFieldValue, errors }) => {
				const selectedYear = values.selectedYear;
				return (
					<div>

						<Modal.Default
							toggle={visibleYearModal}
							setToggle={() => showYearModal(false)}
						>
							<div>
								{statistic_type === 3 ? (
									<input
										ref={inputRef}
										type="text"
										className="form-control"
										placeholder={"Введите год"}
										autoFocus={visibleYearModal}
										onKeyPress={(event) => {
											const value = event.target.value;
											if(event.key === 'Enter'){
												setFieldValue("years", [...values.years, value]);
												showYearModal(false)
												setFieldValue('selectedYear', value)
												setFieldValue('options', {
													...values.options,
													[`${value}`]: options.reduce((prev, curr) => [...prev, { option_id: curr.id, value: "", value_type: 1 }], [])
												})
											}
										}}
									/>
								) : (
									<input
										ref={inputRef}
										type="number"
										className="form-control"
										placeholder={"Введите год"}
										autoFocus={visibleYearModal}
										onKeyPress={(event) => {
											const value = event.target.value;
											if(event.key === 'Enter' && value.length === 4){
												setFieldValue("years", [...values.years, value]);
												showYearModal(false)
												setFieldValue('selectedYear', value)
												setFieldValue('options', {
													...values.options,
													[`${value}`]: options.reduce((prev, curr) => [...prev, { option_id: curr.id, value: "", value_type: 1 }], [])
												})
											}
										}}
									/>
								)}
							</div>
						</Modal.Default>

						<YearsRowWrap>
							<YearsRow>
								{values.years.map(y => (
									<YearsItem active={selectedYear === y} onClick={() => {
										setFieldValue("selectedYear", y);
										setVisible(false);
										setTimeout(() => setVisible(true), 100)
									}}>{y}</YearsItem>
								))}
								<YearsItem onClick={() => openYearModal()}>+</YearsItem>
							</YearsRow>
						</YearsRowWrap>
						<div className="">
							{statistic_type === 5 ? (
								<div className="row">
									{options.map((option, index) => {
										const a = values.options[selectedYear][index].value;
										const b = a ? a.split('/')[0] : '';
										const c = a ? a.split('/')[1] : '';
										return(
											<>
												<div className="col-6" key={option.id}>
													<div className="mb-5">
														<div className="form-label">{option.title} - TOTAL</div>
														<input
															type="number"
															className="form-control"
															onChange={e => {
																const value = e.target.value;
																setFieldValue(`options[${selectedYear}][${index}].value`, value+'/'+c)
															}}
															value={b}
														/>
													</div>
												</div>
												<div className="col-6" key={option.id}>

													<div className="mb-5">
														<div className="form-label">{option.title} - CURRENT</div>
														<input
															type="number"
															className="form-control"
															value={c}
															disabled={!values.options[selectedYear][index].value}
															onChange={e => {
																const value = e.target.value;
																setFieldValue(`options[${selectedYear}][${index}].value`, b+'/'+value)
															}}
														/>
													</div>
												</div>
											</>
										)
									})}
								</div>
							) : (
								<div className="row">
									{options.map((option, index) => (
										<div className="col-4" key={option.id}>
											{isVisible && (
												<Field
													component={Fields.InputSelect2}
													name={`options[${selectedYear}][${index}].value`}
													type="number"
													label={option.title}
													optionValue="value"
													optionLabel="label"
													options={helpers.valueTypeList}
													values={values}
													placeholder="123 456 789"
													selectValue={get(values, `options[${selectedYear}][${index}].value_type`)}
													onChangeSelect={option => {
														if(index === 0){
															options.forEach((o,i) => {
																setFieldValue(`options[${selectedYear}][${i}].value_type`, Number(option))
															})
														}else{
															setFieldValue(`options[${selectedYear}][${index}].value_type`, Number(option))
														}
													}}
												/>
											)}
										</div>
									))}
								</div>
							)}
						</div>
						<div className="d-flex justify-content-end">
							<button className="btn btn-blue" type={"submit"}>В модерацию</button>
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
  &:hover{
	background-color: #d8d8db;
  }
  ${props => props.active && css`
    background: #407bff!important;
    color: #FFFFFF;
  `}
`;

export default Create;