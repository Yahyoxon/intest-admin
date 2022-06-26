import React, { useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { get } from "lodash";
import moment from "moment";

import EntityForm from "modules/entity/forms";
import { Panel } from "components";
import { useNotification, useAccess } from "hooks";

import Form1 from "./form1";
import Form2 from "./form2";
import Steps from "./steps";
import Modal from "../modal";
import "./style.scss";

const steps = [
	{ value: 1, label: "Местоположение" },
	{ value: 2, label: "Информация" }
];

const MapLocationFormPanel = ({ location, history, match, data, ticketRoad, setTicketRoad, setSelectedRoad, selectedRoad, activeRegion }) => {
	const temproryStorage = useSelector(state => state.storage);
	const [formStep, setFormStep] = useState(steps[0]);
	const [successModal, setSuccessModal] = useState(false);

	const { notification } = useNotification();
	const hasData = Boolean(data);
	const id = get(data, "id") ?? null;
	const disabled = useAccess({ roles: ["moderator", "admin"] });

	return (
		<>
			<Modal toggle={successModal} setToggle={setSuccessModal} closable size="sm" hasData={hasData} />
			<EntityForm.Main
				method="put"
				entity="ticket"
				name="all"
				url={data?.id ? `/properties/${id}` : get(temproryStorage, "id") ? `/properties/${temproryStorage?.id}` : ""}
				params={{
					include: "contractor,scheduler,location",
					extra: {
						append: "gallery0"
					}
				}}
				id={data?.id}
				updateData={true}
				onSuccess={(data, resetForm) => {
					setSuccessModal(true);
				}}
				onError={error => {
					notification("Что-то пошло не так", {
						type: "danger"
					});
				}}
				fields={[
					{
						name: "locationId",
						type: "object",
						value: data?.location ?? selectedRoad ?? temproryStorage?.locationId ?? null,
						onSubmitValue: value => (value ? value.id : null)
					},
					{
						name: "type",
						value: hasData ? get(data, "type") : temproryStorage ? get(temproryStorage, "type") : 1
					},
					{
						name: "repair_type",
						value: hasData ? get(data, "repair_type") : temproryStorage ? get(temproryStorage, "repair_type") : 1
					},
					{
						name: "from_distance",
						value: hasData
							? get(data, "from_distance")
							: ticketRoad
							? get(ticketRoad, "from_distance")
							: temproryStorage
							? get(temproryStorage, "from_distance")
							: ""
					},
					{
						name: "to_distance",
						value: hasData
							? get(data, "to_distance")
							: ticketRoad
							? get(ticketRoad, "to_distance")
							: temproryStorage
							? get(temproryStorage, "to_distance")
							: ""
					},
					{
						name: "general_contractor_id",
						type: "object",
						value: hasData ? get(data, "contractor") : temproryStorage ? get(temproryStorage, "general_contractor_id") : null,
						onSubmitValue: value => (value ? value.id : null)
					},
					{
						name: "general_scheduler_id",
						type: "object",
						value: hasData ? get(data, "scheduler") : temproryStorage ? get(temproryStorage, "general_scheduler_id") : null,
						onSubmitValue: value => (value ? value.id : null)
					},
					{
						name: "amount",
						value: get(data, "amount") ? get(data, "amount") : temproryStorage ? get(temproryStorage, "amount") : 1,
						onSubmitValue: values => values && String(values).replace(new RegExp(",", "g"), "")
					},
					{
						name: "amount_currency",
						value: get(data, "amount_currency") ? get(data, "amount_currency") : temproryStorage ? get(temproryStorage, "amount_currency") : "1"
					},
					{
						name: "financing",
						value: get(data, "financing") ? get(data, "financing") : get(temproryStorage, "financing") ? get(temproryStorage, "financing") : 1
					},
					{
						name: "customer",
						value: get(data, "customer") ? get(data, "customer") : temproryStorage ? get(temproryStorage, "customer") : ""
					},
					{
						name: "gallery",
						type: "array",
						value: get(data, "gallery0") ? get(data, "gallery0") : get(temproryStorage, "gallery") ? get(temproryStorage, "gallery") : [],
						onSubmitValue: values => (values.length > 0 ? values.reduce((prev, curr) => [...prev, curr.id], []).join(",") : [])
					},
					{
						name: "start_date",
						value: get(data, "start_date")
							? moment.unix(get(data, "start_date"))
							: temproryStorage
							? get(temproryStorage, "start_date")
							: new Date(),
						onSubmitValue: value => moment(value).unix() ?? null
					},
					{
						name: "end_date",
						value: get(data, "end_date") ? moment.unix(get(data, "end_date")) : temproryStorage ? get(temproryStorage, "end_date") : new Date(),
						onSubmitValue: value => moment(value).unix() ?? null
					},
					{
						name: "process",
						value: get(data, "process") ? get(data, "process") : get(temproryStorage, "process") ? get(temproryStorage, "process") : 1
					},
					{
						name: "id",
						value: ticketRoad ? get(ticketRoad, "properties.id") : get(selectedRoad, "properties.id")
					}
				]}>
				{({ values, isSubmitting, setFieldValue }) => {
					return (
						<Panel rounded className="shadow map-form z-index-top">
							<Steps {...{ values, steps, setFormStep, formStep }} />
							{formStep.value === 1 && (
								<Form1
									{...{
										values,
										isSubmitting,
										setFieldValue,
										isUpdate: hasData,
										setFormStep,
										step: steps[1],
										setTicketRoad,
										ticketRoad,
										selectedRoad,
										setSelectedRoad,
										disabled,
										activeRegion,
										data
									}}
								/>
							)}
							{formStep.value === 2 && (
								<Form2
									{...{
										values,
										isSubmitting,
										setFieldValue,
										isUpdate: hasData,
										setFormStep,
										step: steps[0],
										disabled,
										data
									}}
								/>
							)}
						</Panel>
					);
				}}
			</EntityForm.Main>
		</>
	);
};

export default withRouter(MapLocationFormPanel);
