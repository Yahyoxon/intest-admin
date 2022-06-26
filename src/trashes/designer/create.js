import React, { useState } from "react";
import EntityForm from "modules/entity/forms";
import { Header, Panel, Grid } from "components";
import StepOneForm from "./components/stepOneForm";
import { useNotification, useAccess } from "hooks";
import Steps from "./components/steps";

const steps = [
	{ value: 1, label: "Step 1" },
	{ value: 2, label: "Step 2" }
];

const Create = ({ history }) => {
	const { notification } = useNotification();
	const republic_isp_contractor = useAccess({ roles: "republic_isp_contractor" });
	const [changeStep, setChangeStep] = useState(false);
	const [formStep, setFormStep] = useState(steps[0]);

	return (
		<EntityForm.Main
			method="post"
			entity="company-rates"
			name={`designers`}
			url="/company-rates"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={data => {
				history.push(`/designer/edit/${data.id}?step=2`);
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			params={{
				include: 'logs.user',
			}}
			fields={[
				{
					name: "name",
					required: true,
					value: ""
				},
				{
					name: "inn",
					required: true,
					onSubmitValue: value => value && String(value)
				},
				{
					name: "type",
					value: 2
				},
				{
					name: "option_1",
					required: true,
					onSubmitValue: value => value && value
				},
				{
					name: "option_2",
					required: true,
					onSubmitValue: value => value && value
				},
				{
					name: "option_3",
					required: true,
					onSubmitValue: value => value && value
				},
				{
					name: "option_4",
					required: true,
					onSubmitValue: value => value && value
				},
				{
					name: "option_5",
					required: true,
					onSubmitValue: value => value && value
				},
				{
					name: "option_6",
					required: true,
					onSubmitValue: value => value && Number(value)
				},
				{
					name: "option_7",
					required: true,
					onSubmitValue: value => value && value
				},
				{
					name: "option_8",
					required: true,
					onSubmitValue: value => value && Number(value)
				},
				{
					name: "option_9",
					required: true,
					onSubmitValue: value => value && Number(value)
				},
				{
					name: "option_10",
					required: true,
					onSubmitValue: value => value && Number(value)
				},
				{
					name: "option_11",
					required: true,
					onSubmitValue: value => value && Number(value)
				},
				{
					name: "option_12",
					required: true,
					onSubmitValue: value => value && Number(value)
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (republic_isp_contractor ? (value ? 2 : 0) : value ? 1 : 0)
				}
			]}>
			{({ isSubmitting, values, errors, setFieldValue }) => {
				return (
					<div className="pageContainer">
						<Header title="Баҳолаш параметрлари" hasButton={false} backBtn={true} hasSearch={false} />
						<Grid.Row gutter={10} gutterX={4} className={"mb-10 mt-5"}>
							<Grid.Column xs={12} xl={8}>
								<Panel className="px-4">
									<Steps {...{ steps, setFormStep, formStep, setChangeStep, changeStep }} />
									{formStep.value === 1 && (
										<StepOneForm
											{...{
												isFetched: true,
												values,
												isUpdate: false,
												errors,
												setFieldValue,
												setFormStep,
												isSubmitting
											}}
										/>
									)}
								</Panel>
							</Grid.Column>
						</Grid.Row>
					</div>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
