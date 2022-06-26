import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field } from "formik";
import { get } from "lodash";

import EntityActions from "modules/entity/actions";
import storageActions from "store/actions/storage";
import { Grid, Fields, Button, Icon, Typography } from "components";
import { useNotification, useAccess } from "hooks";
import { helpers } from "services";

const Form1Component = ({
	values,
	setFieldValue,
	isUpdate,
	setFormStep,
	step,
	setTicketRoad,
	ticketRoad,
	selectedRoad,
	setSelectedRoad,
	disabled,
	activeRegion,
	data
}) => {
	const region_id = useSelector(state => get(state, "auth.data.region_id"));
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const isRegionIspMap = useAccess({ roles: ["region_isp_map"] });

	const [isLoading, setLoading] = useState(false);

	const ticketRoadID = get(ticketRoad, "id");

	const distance = selectedRoad ? get(selectedRoad, "properties.km_") : data ? get(data, "km_") : null;
	const from_distance = selectedRoad ? get(selectedRoad, "from_distance") : data ? get(data, "from_distance") : null;
	const to_distance = selectedRoad ? get(selectedRoad, "to_distance") : data ? get(data, "to_distance") : null;
	const isTicket = selectedRoad ? get(selectedRoad, "type_id") === 2 : data ? get(data, "location.type_id") === 2 : null;

	const loadTicketRoad = () => {
		setLoading(true);
		dispatch(
			EntityActions.FormDefault.request({
				method: ticketRoadID ? "put" : "post",
				url: ticketRoadID ? `/locations/distance/${ticketRoadID}` : "/locations/distance",
				params: {
					include: "properties"
				},
				values: {
					locationId: selectedRoad ? get(selectedRoad, "id") : ticketRoadID,
					from_distance: get(values, "from_distance"),
					to_distance: get(values, "to_distance"),
					type_id: 2
				},
				cb: {
					success: data => {
						setLoading(false);
						setTicketRoad(data);
					},
					error: error => {
						setLoading(false);
						notification(error ? error : "Something went wrong", { type: "danger" });
					},
					finally: () => {
						setLoading(false);
					}
				}
			})
		);
	};

	return (
		<Grid.Row>
			<Grid.Column xs={12}>
				<Field
					component={Fields.AsyncSelect}
					name="locationId"
					placeholder="Выберите дорогу"
					label="Дорога"
					loadOptionsUrl="/properties"
					optionLabel="address"
					optionValue="id"
					isSearchable={true}
					isClearable={true}
					isDisabled={disabled}
					loadOptionsParams={search => ({
						include: "location",
						extra: {
							nomi_: search,
							region_id: isRegionIspMap && region_id ? region_id : activeRegion.id ? get(activeRegion, "id") : null
						}
					})}
					onChange={option => {
						setSelectedRoad(get(option, "location"));
					}}
				/>
				{values.locationId && (
					<div className="flex flex-col">
						<Typography.Heading type={from_distance ? 5 : 4} className="mb-2">
							Местоположение(км): {distance}
						</Typography.Heading>
						{(from_distance && to_distance) | (!isUpdate && !isTicket) ? (
							<div className="location-inputs">
								<div className="location-inputs__icons" />
								<div className="ml-8 w-full">
									<Field
										component={Fields.Input}
										type="number"
										name="from_distance"
										disabled={disabled || isUpdate}
										min={0}
										placeholder="Введите начальное местоположение"
										append={<Icon name="map-pin" className="w-4 h-4" strokeColor="#000" />}
									/>
									<Field
										component={Fields.Input}
										name="to_distance"
										type="number"
										max={1000}
										disabled={disabled || isUpdate}
										placeholder="Введите конечное местоположение"
										append={<Icon name="map-pin" className="w-4 h-4" strokeColor="#000" />}
									/>
								</div>
							</div>
						) : null}
						{!disabled && !isUpdate && !isTicket && (
							<div className="d-flex align-center justify-content-end">
								<Button.Default
									buttonType="button"
									type="primary"
									className="px-5"
									loading={isLoading}
									disabled={disabled}
									onClick={loadTicketRoad}>
									Рисовать
								</Button.Default>
							</div>
						)}
					</div>
				)}
				<Field
					component={Fields.Select}
					name="repair_type"
					label="Тип ремонта"
					optionValue="value"
					optionLabel="label"
					options={[
						{ value: 1, label: "Реконструкция" },
						{ value: 2, label: "Капитальный ремонт" },
						{ value: 3, label: "Текуший ремонт" }
					]}
					isDisabled={disabled}
				/>
				<Field
					component={Fields.Select}
					name="type"
					label="Статус"
					optionValue="value"
					optionLabel="label"
					options={helpers.ticketTypes}
					// isDisabled={disabled}
				/>
				<div className="d-flex">
					<Field component={Fields.DatePicker} name="start_date" disabled={disabled} label="Дата начала" placeholder="dd/mm/yyyy" />
					<Field component={Fields.DatePicker} name="end_date" disabled={disabled} label="Дата окончания" placeholder="dd/mm/yyyy" className="ml-5" />
				</div>
				<Field
					component={Fields.InputSelect}
					name="amount"
					type="number"
					label="Стоимость"
					optionValue="value"
					optionLabel="label"
					optionFieldName="amount_currency"
					options={helpers.currencies}
					values={values}
					disabled={disabled}
					// onChange={value => {
					// 	setFieldValue("financing", Number(value.value));
					// 	setFieldValue("process", 100);
					// }}
				/>
				<Field
					component={Fields.AsyncSelect}
					name="general_contractor_id"
					label="Главный строитель"
					placeholder="Выберите строитель"
					isSearchable={true}
					isClearable={true}
					loadOptionsUrl="/company-rates"
					optionLabel="name"
					loadOptionsParams={search => {
						return {
							extra: { name: search },
							sort: "-id",
							filter: {
								type: 1
							}
						};
					}}
					isDisabled={disabled}
				/>
				<Field
					component={Fields.AsyncSelect}
					name="general_scheduler_id"
					label="Главный планировщик"
					placeholder="Выберите планировщик"
					isSearchable={true}
					isClearable={true}
					loadOptionsUrl="/company-rates"
					optionLabel={`name`}
					loadOptionsParams={search => {
						return {
							extra: { name: search },
							sort: "-id",
							filter: {
								type: 2
							}
						};
					}}
					isDisabled={disabled}
				/>
				<Field component={Fields.Input} name="customer" disabled={disabled} label="Заявитель" placeholder="Введите имя" />
				<div className="d-flex align-center justify-content-end mt-5">
					<Button.Outline
						className="px-10"
						onClick={() => {
							dispatch(storageActions.SAVE_TEMPRORY_DATA.success(values));
							setFormStep(step);
						}}>
						Далее
					</Button.Outline>
				</div>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form1Component;
