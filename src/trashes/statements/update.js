import React, { useRef, useState } from "react";
import { get, truncate } from "lodash";
import EntityContainer from "modules/entity/containers";
import EntityForm from "modules/entity/forms";
import { useAccess, useNotification } from "hooks";
import { Button, Modal, Panel, File } from "components";
import Form from "./components/form";
import SendForm from "./components/sendForm";

import "./style.scss";
import Actions from "../../modules/entity/actions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const Update = ({ match }) => {
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const textareaRef = useRef(null);
	const history = useHistory();

	const [changeModal, showChangeModal] = useState(false);
	const [sendModal, showSendModal] = useState(false);
	const [acceptModal, showAcceptModal] = useState(false);
	const [approveModal, showApproveModal] = useState(false);
	const [rejectModal, showRejectModal] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);

	const { id } = match.params;

	const is_moderator = useAccess({ roles: ["moderator"] });
	const is_region_isp_feedback = useAccess({ roles: ["region_isp_feedback"] });
	const is_government_isp_feedback = useAccess({ roles: ["government_isp_feedback"] });


	const changeTypeHandler = () => {
		setSubmitting(true);
		dispatch(
			Actions.FormDefault.request({
				method: "put",
				url: `/feedback/change/${id}`,
				cb: {
					success: () => {
						notification("Успешно", {
							type: "success"
						});
						history.push('/statements')
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					},
					finally: () => {
						setSubmitting(false);
					}
				}
			})
		);
	};

	const acceptedHandler = () => {
		setSubmitting(true);
		dispatch(
			Actions.Form.request({
				method: "post",
				updateData: true,
				normalizeData: data => data,
				entity: "feedback",
				name: `/all-${id}`,
				params: {
					include: "district,region"
				},
				primaryKey: "id",
				id: id,
				url: `/feedback/approve/${id}`,
				cb: {
					success: () => {
						showAcceptModal(false);
						notification("Успешно принято", {
							type: "success"
						});
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					},
					finally: () => {
						setSubmitting(false);
					}
				}
			})
		);
	};
	const approveHandler = () => {
		setSubmitting(true);
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "feedback",
				name: `all`,
				primaryKey: "id",
				id: id,
				updateData: true,
				normalizeData: data => data,
				url: `/feedback/approve/${id}`,
				params: {
					include: "district,region,overdue,logs.user,results"
				},
				cb: {
					success: () => {
						showApproveModal(false);
						notification("Успешно принято", {
							type: "success"
						});
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					},
					finally: () => {
						setSubmitting(false);
					}
				}
			})
		);
	};
	const rejectHandler = () => {
		setSubmitting(true);
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "feedback",
				name: `all`,
				primaryKey: "id",
				id: id,
				updateData: true,
				normalizeData: data => data,
				url: `/feedback/reject/${id}`,
				params: {
					include: "district,region,overdue,logs.user,results"
				},
				values: {
					reject_message: textareaRef.current.value
				},
				cb: {
					success: () => {
						showRejectModal(false);
						notification("Успешно принято", {
							type: "success"
						});
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					},
					finally: () => {
						setSubmitting(false);
					}
				}
			})
		);
	};

	return (
		<div>
			<Modal.Default header="Добавить тег" toggle={sendModal} setToggle={showSendModal} size={"lg"}>
				<SendForm {...{ showSendModal, sendModal, id }} />
			</Modal.Default>
			<EntityContainer.One
				entity="feedback"
				name={`all-${id}`}
				url={`/feedback/${id}`}
				primaryKey="id"
				id={id}
				params={{
					include: "district,region,results"
				}}>
				{({ item, isFetched }) => {
					const status = get(item, "status");
					return (
						<>
							<Modal.Confirm
								type="success"
								title="Вы действительно хотите?"
								toggle={changeModal}
								setToggle={showChangeModal}
								closable
								cancelText="нет"
								okText="да"
								isSubmitting={isSubmitting}
								onOk={() => changeTypeHandler(item.id)}
							/>
							<Modal.Confirm
								type="success"
								title="Вы действительно хотите принять?"
								toggle={acceptModal}
								setToggle={showAcceptModal}
								closable
								cancelText="нет"
								okText="да"
								isSubmitting={isSubmitting}
								onOk={() => acceptedHandler(item.id)}
							/>
							<Modal.Confirm
								type="success"
								title="Вы действительно хотите принять?"
								toggle={approveModal}
								setToggle={showApproveModal}
								closable
								cancelText="нет"
								okText="да"
								isSubmitting={isSubmitting}
								onOk={() => approveHandler()}
							/>
							<Modal.Confirm
								title="Вы действительно хотите отказатся?"
								toggle={rejectModal}
								setToggle={showRejectModal}
								closable
								cancelText="нет"
								okText="да"
								isSubmitting={isSubmitting}
								onOk={() => rejectHandler()}>
								<textarea className="form-control" placeholder={"Причина отказа"} name="reject_comment" rows="5" ref={textareaRef} />
							</Modal.Confirm>

							<EntityForm.Main
								method="put"
								entity="feedback"
								name="all"
								url={`/feedback/${id}`}
								primaryKey="id"
								normalizeData={data => data}
								id={id}
								onSuccess={() => {}}
								onError={() => {}}
								fields={[
									{
										name: "name",
										required: true,
										value: get(item, "name", "")
									},
									{
										name: "region_id",
										type: "object",
										value: get(item, "region") && get(item, "region")
									},
									{
										name: "district_id",
										type: "object",
										value: get(item, "district", "")
									},
									{
										name: "email",
										value: get(item, "email", "")
									},
									{
										name: "phone",
										required: true,
										value: get(item, "phone")
									},
									{
										name: "message",
										value: get(item, "message", "")
									},
									{
										name: "file_id",
										value: []
									}
								]}>
								{({ values, setFieldValue, isSubmitting }) => {
									return (
										<div className="pageContainer">
											<Panel>
												<div className="d-flex justify-content-between align-items-center">
													<div className="font-medium text-xl">Детали заявления</div>
													<div>
														{is_moderator && (
															<>
																<Button.Default
																	type="success"
																	buttonType="button"
																	onClick={() => {
																		showApproveModal(true);
																	}}
																	className="ml-2">
																	Принять
																</Button.Default>
																<Button.Default
																	type="danger"
																	buttonType="button"
																	onClick={() => {
																		showRejectModal(true);
																	}}>
																	Отказать
																</Button.Default>
															</>
														)}

														{(is_government_isp_feedback || is_region_isp_feedback) && (
															<Button.Default type="primary" buttonType="button" onClick={() => showChangeModal(true)}>
																{is_government_isp_feedback && 'Направить коммитету'}
																{is_region_isp_feedback && 'Направить районному хокимияту'}
															</Button.Default>
														)}

														{(is_region_isp_feedback || is_government_isp_feedback) && status === 1 && (
															<Button.Default type="primary" buttonType="button" onClick={() => showSendModal(true)}>
																Обработать
															</Button.Default>
														)}
														{(is_region_isp_feedback || is_government_isp_feedback) && status === 4 && (
															<Button.Default type="primary" buttonType="button" onClick={() => showSendModal(true)}>
																Обработать
															</Button.Default>
														)}
														{(is_region_isp_feedback || is_government_isp_feedback) && status === 0 && (
															<Button.Default type="primary" buttonType="button" onClick={() => showAcceptModal(true)}>
																Принять
															</Button.Default>
														)}
													</div>
												</div>
											</Panel>

											<div className="mt-10">
												<Panel>
													{get(item, "results", []).length > 0 &&
														get(item, "results", []).map(result => (
															<div className={`feedback-result-item ${result.status === 0 ? "--rejected" : ""}`}>
																<div className="d-flex justify-content-between">
																	<span>{get(result, "text")}</span>
																	<p>
																		{get(result, "files0")
																			? get(result, "files0").map((item, id) => (
																					<div key={id} className="d-flex justify-between feedback-result-item_doc">
																						<File mediaType="doc" item={item} />
																						<span>{truncate(item.description, { length: 20 })}</span>
																					</div>
																			  ))
																			: ""}
																	</p>
																</div>
																{get(result, "reject_message") && (
																	<div className={"feedback-result-item__reject-message"}>
																		<span>Комментария отказа:</span>
																		<span>{get(result, "reject_message")}</span>
																	</div>
																)}
															</div>
														))}

													<Form
														{...{
															isUpdate: true,
															isFetched,
															values,
															setFieldValue,
															isSubmitting,
															item
														}}
														files={get(item, "file", [])}
													/>
												</Panel>
											</div>
										</div>
									);
								}}
							</EntityForm.Main>
						</>
					);
				}}
			</EntityContainer.One>
		</div>
	);
};

export default Update;
