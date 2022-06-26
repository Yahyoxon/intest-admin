import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import qs from "query-string";
import Statistics from "./components/statistics";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useAccess, useNotification } from "hooks";
import { Table, Pagination, Header, Modal, Button, Panel, Tag, Icon } from "components";
import Filter from "./components/filter";
import { helpers } from "services";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { page } = params;
	const textareaRef = useRef(null);
	const { notification } = useNotification();

	const [acceptModal, showAcceptModal] = useState(false);
	const [approveModal, showApproveModal] = useState(false);
	const [rejectModal, showRejectModal] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);

	const [selected, setSelected] = useState(null);
	const [activeRegion, setActiveRegion] = useState(null);
	const [filter, setFilter] = useState(false);
	const [btnResult, setBtnResult] = useState();

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	const is_moderator = useAccess({ roles: ["moderator"] });
	const is_region_isp_feedback = useAccess({ roles: ["region_isp_feedback"] });
	const is_government_isp_feedback = useAccess({ roles: ["government_isp_feedback"] });

	const acceptedHandler = () => {
		setSubmitting(true);
		dispatch(
			Actions.FormDefault.request({
				url: `/feedback/approve/${selected.id}`,
				method: "post",
				cb: {
					success: () => {
						history.push(`/statements/update/${selected.id}`);
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
				id: selected.id,
				updateData: true,
				normalizeData: data => data,
				url: `/feedback/approve/${selected.id}`,
				params: {
					include: "district,region,overdue,logs.user"
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
				id: selected.id,
				updateData: true,
				normalizeData: data => data,
				url: `/feedback/reject/${selected.id}`,
				params: {
					include: "district,region,overdue,logs.user"
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

	function display(a){
		if(a > 1440){
			let days = Math.trunc(a/1440);
			let extraMinutes = (a - days*1440);

			let hours = Math.trunc(extraMinutes/60);
			let minutes = extraMinutes % 60;

			return `${days} день ${hours} час ${minutes} минут`
		}else{
			let hours = Math.trunc(a/60);
			let minutes = a % 60;

			return `${hours} час ${minutes} минут`
		}
	}

	const getLastExecutorName = (region,government) => {
	  if(region && !government){
		  return get(region, 'user.name')
	  }else if(!region && government){
		  return get(government, 'user.name')
	  }else if(region && government){
		  const regId = get(region, 'id');
		  const govId = get(government, 'id');
		return (
			<div>
				<span className={regId > govId ? 'd-block' : 'd-none'}>{get(region, 'user.name')}</span>
				<span className={regId < govId ? 'd-block' : 'd-none'}>{get(government, 'user.name')}</span>
			</div>
		)
	  }else{
		  return ''
	  }
	}

	return (
		<>
			<Modal.Confirm
				type="success"
				title="Вы действительно хотите завершить?"
				toggle={acceptModal}
				setToggle={showAcceptModal}
				closable
				cancelText="нет"
				okText="да"
				isSubmitting={isSubmitting}
				onOk={() => acceptedHandler()}
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
			<EntityContainer.All
				entity="feedback"
				name={`all`}
				url="/feedback"
				primaryKey="id"
				params={{
					limit: params["page-limit"] ? params["page-limit"] : 50,
					page,
					filter: {
						status: btnResult,
						name: params.q
					},
					extra: {
						append: 'overdue_hours',
						r_id: activeRegion ? activeRegion : null
					},
					include: "district,region,overdue,logs.user"
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<>
								<Header
									title={null}
									extraFilter={
										<div className="d-flex justify-content-start">
											<Button.Outline onClick={() => setBtnResult()}>Все</Button.Outline>

											<Button.Outline className={btnResult === 0 ? `new active` : "new "} onClick={() => setBtnResult(0)}>
												Новый
											</Button.Outline>
											<Button.Outline className={btnResult === 1 ? `in_progress active` : "in_progress "} onClick={() => setBtnResult(1)}>
												В процессе
											</Button.Outline>
											<Button.Outline className={btnResult === 2 ? `moderation active` : "moderation "} onClick={() => setBtnResult(2)}>
												В модерации
											</Button.Outline>
											<Button.Outline className={btnResult === 3 ? `accepted active` : "accepted "} onClick={() => setBtnResult(3)}>
												Принятый
											</Button.Outline>
											<Button.Outline className={btnResult === 4 ? `reject active` : "reject "} onClick={() => setBtnResult(4)}>
												Отклоненный
											</Button.Outline>
										</div>
									}
									btnName="Добавить"
									hasSearch={true}
									setFilter={setFilter}
									hasButton={false}
									filter={filter}>
									<Filter {...{ setFilter }} />
								</Header>
								<Panel className="mt-4">
									<Statistics {...{ setActiveRegion }} />
									<div className="regionInfo">
										<Table
											items={items}
											rowKey="id"
											className="mt-3"
											hasSave={true}
											editIcon={<Icon name="eye" className="w-5 h-5 mr-1" />}
											editAction={value => history.push(`/statements/update/${value.id}`)}
											isFetched={isFetched}
											onRowClass={item => {
												if (item.status === 4) {
													return "--rejected";
												} else return "";
											}}
											columns={[
												{
													title: t("№"),
													dataIndex: "id",
													className: "w-10 text-center",
													render: value => <>{value}</>
												},
												{
													title: t("Имя"),
													dataIndex: "name",
													render: (value, row) => (
														<div className="text-left">
															<div className="statMentsName">{value}</div>
															<div className="statMentsPhone">{row.phone}</div>
														</div>
													)
												},
												{
													title: t("Регион"),
													dataIndex: "region",
													render: value => <>{value.name_uz}</>
												},
												{
													title: t("Дата"),
													dataIndex: "created_at",
													render: value => <div>{helpers.formatDate(value)}</div>
												},
												{
													title: t("Просрочка"),
													dataIndex: "overdue_hours",
													render: (value,row) => <div className="d-flex justify-content-center">
														{((row.status === 0 || row.status === 1) && (is_region_isp_feedback || is_government_isp_feedback)) && (
															<>
																{value < 0 ? (
																	<div className="expired-notification">
																		<span className="expired-notification__tooltip">
																			{display(value*(-1))}
																		</span>
																		<span className="expired-notification__ball"/>
																	</div>
																) : (
																	<div className="expired-notification">
																		<span className="expired-notification__tooltip">
																			{display(value)}
																		</span>
																		<span className="expired-notification__ball --green"/>
																	</div>
																)}
															</>
														)}
														{((row.status === 2) && is_moderator) && (
															<>
																{value < 0 ? (
																	<div className="expired-notification">
																		<span className="expired-notification__tooltip">
																			{display(value*(-1))}
																		</span>
																		<span className="expired-notification__ball"/>
																	</div>
																) : (
																	<div className="expired-notification">
																		<span className="expired-notification__tooltip">
																			{display(value)}
																		</span>
																		<span className="expired-notification__ball --green"/>
																	</div>
																)}
															</>
														)}
													</div>
												},
												{
													title: t("Исполнитель"),
													dataIndex: "logs",
													render: value => {
														const region_isp_feedback = value.find(i => i.role === "region_isp_feedback");
														const government_isp_feedback = value.find(i => i.role === "government_isp_feedback");
														return <div>
															{getLastExecutorName(region_isp_feedback,government_isp_feedback)}
														</div>;
													}
												},
												{
													title: t("Модератор"),
													dataIndex: "logs",
													render: value => {
														const region_isp_feedback = value.find(i => i.role === "moderator");
														return <div>{region_isp_feedback ? get(region_isp_feedback, "user.name") : "-"}</div>;
													}
												},
												{
													title: t("Действие"),
													render: (value, row) => {
														const status = row.status;
														return (
															<div className={"d-flex"}>
																{is_moderator && status === 2 && (
																	<>
																		<Button.Default
																			type="success"
																			buttonType="button"
																			onClick={() => {
																				showApproveModal(true);
																				setSelected(row);
																			}}
																			className="ml-2">
																			Принять
																		</Button.Default>
																		<Button.Default
																			type="danger"
																			buttonType="button"
																			onClick={() => {
																				showRejectModal(true);
																				setSelected(row);
																			}}>
																			Отказать
																		</Button.Default>
																	</>
																)}
																{(is_region_isp_feedback || is_government_isp_feedback) && status === 0 && (
																	<Button.Default
																		type="primary"
																		buttonType="button"
																		onClick={() => {
																			showAcceptModal(true);
																			setSelected(row);
																		}}>
																		Принять
																	</Button.Default>
																)}
															</div>
														);
													}
												},
												{
													title: "Статус",
													dataIndex: "status",
													render: value => {
														return <Tag color={helpers.feedbackStatus(value).color}>{helpers.feedbackStatus(value).label}</Tag>;
													}
												}
											]}
										/>
									</div>
								</Panel>

								{get(meta, "pageCount", 1) > 1 && (
									<Pagination
										pageCount={get(meta, "pageCount", 1)}
										currentPage={page ? Number(page) : 1}
										handlePageClick={onChange}
										limit={50}
									/>
								)}
							</>
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
