import React, { useEffect, useRef, useState } from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Panel, Grid, Button, Modal } from "components";
import { useNotification } from "hooks";
import { get } from "lodash";
import StepOneForm from "./components/stepOneForm";
import qs from "query-string";
import Steps from "./components/steps";
import StepSecondForm from "./components/stepSecondForm";
import { useAccess } from "hooks";
import "./style.scss";
import { useDispatch } from "react-redux";
import Actions from "modules/entity/actions";

const steps = [
	{ value: 1, label: "Step 1" },
	{ value: 2, label: "Step 2" }
];
const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { id } = match.params;
	const query = qs.parse(location.search);
	const { lang, step } = query;
	const [formStep, setFormStep] = useState(steps[0]);
	const republic_isp_contractor = useAccess({ roles: "republic_isp_contractor" });
	const dispatch = useDispatch();
	const textareaRef = useRef(null);

	const [acceptModal, showAcceptModal] = useState(false);
	const [rejectModal, showRejectModal] = useState(false);
	useEffect(() => {
		if (query.step && Number(step) === 2) {
			setFormStep(steps[1]);
		}
		//eslint-disable-next-line
	}, [query.step]);

	const approveHandler = () => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "company-rates",
				name: `designers`,
				url: `/content/approve/${id}`,
				updateData: true,
				id: id,
				primaryKey: "id",
				values: {
					type: "companyRate"
				},
				cb: {
					success: () => {
						notification("Успешно обновлено", {
							type: "success"
						});
						history.push("/designer");
					},
					error: () => {},
					finally: () => {}
				}
			})
		);
	};

	const rejectHandler = () => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "company-rates",
				name: `designers`,
				url: `/content/reject/${id}`,
				updateData: true,
				id: id,
				primaryKey: "id",
				values: {
					type: "companyRate",
					reject_message: textareaRef.current.value
				},
				cb: {
					success: () => {
						notification("Успешно обновлено", {
							type: "success"
						});
						history.push("/designer");
					},
					error: () => {},
					finally: () => {}
				}
			})
		);
	};
	return (
		<>
			<Modal.Confirm
				title="Вы действительно хотите опубликовать?"
				toggle={acceptModal}
				setToggle={() => showAcceptModal(false)}
				closable
				type={"success"}
				cancelText="нет"
				okText="да"
				onOk={() => approveHandler()}
			/>

			<Modal.Confirm
				title="Вы действительно хотите отменить?"
				toggle={rejectModal}
				setToggle={() => showRejectModal(false)}
				closable
				cancelText="нет"
				okText="да"
				onOk={() => rejectHandler()}>
				<div>
					<textarea className="form-control" placeholder={"Причина отказа"} name="reject_comment" rows="5" ref={textareaRef} />
				</div>
			</Modal.Confirm>

			<EntityContainer.One
				entity="company-rates"
				name={`designers`}
				url={`/company-rates/${id}`}
				primaryKey="id"
				id={id}
				params={{
					include: "reject"
				}}>
				{({ item, isFetched }) => {
					const reject_message = get(item, "reject.message");
					const status = get(item, "status");
					return (
						<EntityForm.Main
							method="put"
							entity="company-rates"
							name={`designers-${lang}`}
							url={`/company-rates/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							normalizeData={data => data}
							id={id}
							params={{
								include: 'logs.user',
							}}
							onSuccess={data => {
								notification("Успешно обновлено", {
									type: "success"
								});
								if (formStep.value === 1) {
									setFormStep(steps[1]);
								} else {
									history.push(`/designer`);
								}
							}}
							onError={(data, resetForm) => {
								resetForm();
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "name",
									value: get(item, "name"),
									required: true
								},
								{
									name: "inn",
									required: true,
									value: get(item, "inn")
								},
								{ name: "type", value: 2 },
								{
									name: "status",
									value: get(item, "status") !== 0,
									onSubmitValue: value => (republic_isp_contractor ? (value ? 2 : 0) : value ? 1 : 0)
								},
								{
									name: "option_1",
									value: get(item, "option_1")
								},
								{
									name: "option_2",
									value: get(item, "option_2")
								},
								{
									name: "option_3",
									value: get(item, "option_3")
								},
								{
									name: "option_4",
									value: get(item, "option_4")
								},
								{
									name: "option_5",
									value: String(get(item, "option_5"))
								},
								{
									name: "option_6",
									value: String(get(item, "option_6"))
								},
								{
									name: "option_7",
									value: String(get(item, "option_7"))
								},
								{
									name: "option_8",
									value: String(get(item, "option_8"))
								},
								{
									name: "option_9",
									value: String(get(item, "option_9"))
								},
								{
									name: "option_10",
									value: String(get(item, "option_10"))
								},
								{
									name: "option_11",
									value: String(get(item, "option_11"))
								},
								{
									name: "option_12",
									value: String(get(item, "option_12"))
								},
								{
									name: "total",
									value: get(item, "total"),
									disabled: true
								},
								{
									name: "rate",
									value: get(item, "rate"),
									disabled: true
								}
							]}>
							{({ isSubmitting, values, setFieldValue }) => {
								return (
									<div className="pageContainer">
										{/* <Header title="Баҳолаш параметрлари" hasButton={false} backBtn={true} hasSearch={false} /> */}

										<Panel>
											<div className="d-flex justify-content-between align-items-center">
												<div className="font-medium text-xl">Детали заявления</div>
												<div>
													<div className="flex flex-wrap justify-end">
														<Button.Default type="danger" buttonType="button" onClick={() => showRejectModal(true)}>
															Отменить
														</Button.Default>
														<Button.Default
															type="success"
															buttonType="button"
															onClick={() => showAcceptModal(true)}
															className="ml-2">
															Опубликовать
														</Button.Default>
													</div>
												</div>
											</div>
										</Panel>
										<Grid.Row gutter={10} gutterX={4} className={"mb-10 mt-5"}>
											<Grid.Column xs={12} xl={8}>
												<Panel className="px-4">
													<Steps {...{ steps, setFormStep, formStep }} changeStep={true} />

													{formStep.value === 1 && (
														<>
															{item.status === 3 && (
																<Panel className="shadow-none mt-5">
																	<div className={`feedback-result-item ${reject_message ? `--rejected` : ""}`}>
																		<span></span>
																		<div className={"feedback-result-item__reject-message"}>
																			<span>Комментария отказа: {reject_message && reject_message}</span>
																			<span></span>
																		</div>
																	</div>
																</Panel>
															)}

															<StepOneForm
																{...{
																	isFetched: true,
																	values,
																	isUpdate: true,
																	setFieldValue,
																	setFormStep,
																	steps,
																	isSubmitting,
																	reject_message,
																	status
																}}
															/>
														</>
													)}

													{formStep.value === 2 && (
														<StepSecondForm
															{...{
																isFetched: true,
																values,
																isUpdate: true,
																setFieldValue,
																isSubmitting,
																setFormStep,
																steps,
																id
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
				}}
			</EntityContainer.One>
		</>
	);
};

export default Update;
