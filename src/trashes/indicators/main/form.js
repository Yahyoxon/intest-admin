import React from "react";
import { withRouter } from "react-router-dom";
import { Field } from "formik";

import { Fields, Panel, Button } from "components";
import { helpers } from "services";
import {ReactComponent as CloseIcon} from "assets/images/icons/close-square.svg";

const Form = ({ setFieldValue, values, isSubmitting, isCreate=false }) => {
	function gen4() {
		return Math.random().toString(16).slice(-4)
	}

	const addNewOptionHandler = () => {
		setFieldValue("options", [...values.options, { uid: gen4(), value: '' }])
	}

	const removeOptionHandler = (option) => {
		setFieldValue("options", values.options.filter(o => o.uid !== option.uid))
	}

	const lastOption = values.options[values.options.length - 1]

	return (
		<div>
			<div className="row">

				<div className="col-6 offset-3">
					<Panel className="mt-5">
						<div className="py-4 px-4">
							<Field
								component={Fields.Input}
								name="title_ru"
								type="text"
								placeholder="Введите ваше загаловок"
								label="Загаловок(RU)"
							/>
							<Field
								component={Fields.Textarea}
								rows="5"
								name="description_ru"
								type="text"
								placeholder="Введите вашу описания"
								label="Описания(RU)"
							/>
						</div>
					</Panel>
					<Panel className="mt-5">
						<div className="py-4 px-4">
							<Field component={Fields.Input} name="title_uz" type="text" placeholder="Введите ваше загаловок" label="Загаловок(UZ)" />
							<Field
								component={Fields.Textarea}
								rows="5"
								name="description_uz"
								type="text"
								placeholder="Введите вашу описания"
								label="Описания(UZ)"
							/>
						</div>
					</Panel>
					<Panel className="mt-5">
						<div className="py-4 px-4">
							<Field component={Fields.Input} name="title_en" type="text" placeholder="Введите ваше загаловок" label="Загаловок(EN)" />
							<Field
								component={Fields.Textarea}
								rows="5"
								name="description_en"
								type="text"
								placeholder="Введите вашу описания"
								label="Описания(EN)"
							/>
						</div>
					</Panel>

					<Panel
						className="mt-5 mb-10"
						footer={
							<div className="d-flex align-center justify-content-end">
								<div className="mr-5">
									<Field
										component={Fields.Switch}
										name="is_home"
										label="Показать на глв. стр."
										className="mt-5"
										onChange={() => {
											setFieldValue("is_home", !values.is_home);
										}}
									/>
								</div>
								<div className="mr-5">
									<Field
										component={Fields.Switch}
										name="status"
										label="Статус"
										className="mt-5"
										onChange={() => {
											setFieldValue("status", !values.status);
										}}
									/>
								</div>
								<Button.Default type="primary" buttonType="submit" loading={isSubmitting}>
									Сохранить
								</Button.Default>
							</div>
						}>
						<div className="py-4 px-4">
							<div className="row">
								<div className="col-6">
									<Field
										component={Fields.Select}
										name="chart_type"
										placeholder="Тип диаграмма"
										label="Выберите тип диаграмма"
										optionValue="value"
										optionLabel="label"
										options={[
											{value: 1, label: 'Bar chart'},
											{value: 2, label: 'Line chart'},
											{value: 3, label: 'Pipe chart'},
											{value: 4, label: 'List'},
										]}
									/>
								</div>
								<div className="col-6">
									<Field
										component={Fields.AsyncSelect}
										name="responsible_id"
										placeholder="Выберите ответственного лицо"
										label="Отвественное лицо"
										loadOptionsUrl="/user"
										optionLabel="name"
										optionValue="id"
										loadOptionsParams={search => ({
											extra: {
												role: "republic_isp_indicator_excel"
											}
										})}
									/>
								</div>
								<div className="col-12">
									<Field
										component={Fields.Select}
										name="type"
										placeholder="Тип показатель"
										label="Выберите тип показателя"
										isDisabled={!isCreate}
										optionValue="value"
										optionLabel="label"
										options={helpers.indicatorTypes}
									/>
								</div>

								{(values.type === 3 || values.type === 5) && (
									<div className="col-12">
										<div className={"options-create"}>
											{values.options.map((option,i) => (
												<div className="options-create__row" key={i}>
													<Field
														component={Fields.Input}
														name={`options[${i}].value`}
														type="text"
														placeholder="Введите названия"
														disabled={!isCreate}
													/>
													{(isCreate && values.options.length > 1) && (
														<span className={"options-create__remove"} onClick={() => removeOptionHandler(option)}>
															<CloseIcon/>
														</span>
													)}
												</div>
											))}
											{(isCreate && lastOption.value) && (
												<div className="options-create__add" onClick={() => addNewOptionHandler()}>Добавить</div>
											)}
										</div>
									</div>
								)}
							</div>
						</div>
					</Panel>
				</div>

			</div>
		</div>
	);
};

export default withRouter(Form);
