import React, { useState } from "react";
import { Table, Pagination, Modal, Header, Tag } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { get } from "lodash";
import qs from "query-string";
import "./style.scss";
import { useAccess, useNotification } from "hooks";
import { helpers } from "services";
import { useTranslation } from "react-i18next";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();
	const { page } = params;
	const is_moderator = useAccess({ roles: ["moderator"] });
	const {t} = useTranslation();

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};
	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "company-rates",
				name: `company-rates`,
				id: id,
				url: `/company-rates/${id}`,
				deleteData: true,
				primaryKey: "id",
				cb: {
					success: () => {
						notification("Успешно удалена", {
							type: "success"
						});
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					},
					finally: () => {
						setModal(false);
					}
				}
			})
		);
	};

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	return (
		<>
			<Modal.Confirm
				title="Вы действительно хотите удалить?"
				toggle={modal}
				setToggle={setModal}
				closable
				cancelText="нет"
				okText="да"
				onOk={() => deleteAction(selected)}
			/>
			<EntityContainer.All
				entity="company-rates"
				name={`company-rates`}
				url="/company-rates"
				primaryKey="id"
				params={{
					sort: "-id",
					limit: params["page-limit"] ? params["page-limit"] : 20,
					page,
					include: "reject,logs.user",
					filter: { type: 1, name: params.q }
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="page-container">
							<div className="pt-10">
								<Header
									title="Рейтинг"
									btnName="Добавить"
									hasButton={is_moderator ? false : true}
									btnClick={() => history.push(`/contractor/create`)}
								/>
								<div className="tableColor-tr">
									<Table
										items={items}
										rowKey="id"
										className="mt-5"
										deleteAction={value => onDeleteHandler(value.id)}
										isFetched={isFetched}
										editAction={value => history.push(`/contractor/edit/${value.id}`)}
										hasMenuModal={is_moderator ? false : true}
										onRowClick={value => is_moderator && history.push(`/contractor/edit/${value.id}`)}
										columns={[
											{
												title: "Имя компании",
												dataIndex: "name",
												render: value => <>{value}</>
											},
											{
												title: "INN",
												dataIndex: "inn",
												render: value => <>{value}</>
											},
											{
												title: "Рейтинг",
												dataIndex: "rate",
												className: "text-center",
												render: value => {
													if (value === "A") {
														return <span className="rate-a">{value}</span>;
													} else if (value === "C") {
														return <span className="rate-c">{value}</span>;
													} else if (value === "B") {
														return <span className="rate-b">{value}</span>;
													} else if (value === "D") {
														return <span className="rate-d">{value}</span>;
													}
												}
											},
											{
												title: t("Исполнитель"),
												dataIndex: "logs",
												render: value => {
													const republic_isp_contractor = value.find(i => i.role === 'republic_isp_contractor');
													return(
														<div>{republic_isp_contractor ? get(republic_isp_contractor, 'user.name') : '-'}</div>
													)
												}
											},
											{
												title: t("Модератор"),
												dataIndex: "logs",
												render: value => {
													const moderator = value.find(i => i.role === 'moderator');
													return(
														<div>{moderator ? get(moderator, 'user.name') : '-'}</div>
													)
												}
											},
											{
												title: "Статус",
												dataIndex: "status",
												className: "text-center",
												render: value => {
													return <Tag color={helpers.contentStatus(value).color}>{helpers.contentStatus(value).label}</Tag>;
												}
											}
										]}
									/>
								</div>

								{get(meta, "pageCount", 1) > 1 && (
									<Pagination
										pageCount={get(meta, "pageCount", 1)}
										currentPage={page ? Number(page) : 1}
										handlePageClick={onChange}
										limit={20}
									/>
								)}
							</div>
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
