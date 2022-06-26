import React, { useState } from "react";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";

import { Table, Pagination, Modal, Header, Tag, File } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useAccess, useNotification } from "hooks";
import { helpers } from "services";
import "./style.scss";
import Create from "./create";
import Update from "./update";
import { useTranslation } from "react-i18next";

const List = ({ history, location }) => {
	const { t } = useTranslation();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const dispatch = useDispatch();
	const { page } = params;
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [updateModal, setUpdateModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
	const [selected, setSelected] = useState();

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const onEdit = selected => {
		setSelected(selected);
		setUpdateModal(true);
	};

	const deleteAction = id => {
		setSubmitting(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "documents",
				name: `all`,
				id: id,
				url: `/documents/${id}`,
				deleteData: true,
				primaryKey: "id",
				cb: {
					success: () => {
						notification("Успешно удалена", {
							type: "success"
						});
						setModal(false);
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
						setModal(false);
					},
					finally: () => {
						setSubmitting(false);
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

	const is_moderator = useAccess({ roles: ["moderator"] });

	return (
		<>
			<Modal.Confirm
				isSubmitting={isSubmitting}
				title="Вы действительно хотите удалить?"
				toggle={modal}
				setToggle={setModal}
				closable
				cancelText="нет"
				okText="да"
				onOk={() => deleteAction(selected)}
			/>
			<Modal.Default header="Добавить тег" toggle={createModal} setToggle={setCreateModal}>
				<Create {...{ setCreateModal }} />
			</Modal.Default>
			<Modal.Default header="Изменить тег" toggle={updateModal} setToggle={setUpdateModal}>
				<Update {...{ selected, setUpdateModal }} />
			</Modal.Default>
			<EntityContainer.All
				entity="documents"
				name={`all`}
				url="/documents"
				primaryKey="id"
				params={{
					include: "logs.user,reject",
					limit: params["page-limit"] ? params["page-limit"] : 30,
					page,
					filter: {
						name_uz: params.q
					}
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header btnName="Добавить" title="Документы" btnClick={() => setCreateModal(true)} meta={meta} />
							<div className="documentHover">
								<Table
									isFetched={isFetched}
									items={items}
									rowKey="id"
									className="mt-5"
									hasMenuModal={!is_moderator}
									deleteAction={value => onDeleteHandler(value.id)}
									editAction={value => onEdit(value)}
									onRowClick={value => onEdit(value)}
									columns={[
										{
											title: "Тип",
											dataIndex: "file",
											className: "text-center",
											render: value => (
												<>
													<File mediaType="doc" item={value} />
												</>
											)
										},
										{
											title: "Название",
											dataIndex: "name_uz",
											render: value => <>{value}</>
										},
										{
											title: "Размер",
											dataIndex: "file",
											render: value => (
												<div>
													<span className="documentSize">{value ? helpers.formatBytes(value.size) : "-"}</span>
												</div>
											)
										},

										{
											title: "Дата публикации",
											dataIndex: "created_at",
											className: "text-center",
											render: value => <div className="text-center">{helpers.formatDate(value)}</div>
										},
										{
											title: t("Исполнитель"),
											dataIndex: "logs",
											render: value => {
												const republic_isp_content_manager = value.find(i => i.role === "republic_isp_content_manager");
												return <div>{republic_isp_content_manager ? get(republic_isp_content_manager, "user.name") : "-"}</div>;
											}
										},
										{
											title: t("Модератор"),
											dataIndex: "logs",
											render: value => {
												const moderator = value.find(i => i.role === "moderator");
												return <div>{moderator ? get(moderator, "user.name") : "-"}</div>;
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
								<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} />
							)}
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
