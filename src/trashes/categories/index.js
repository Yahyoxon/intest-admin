import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { get, truncate } from "lodash";
import qs from "query-string";

import { Table, Pagination, Modal, Header, Tag } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";

import Create from "./create";
import Update from "./update";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page } = params;
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [updateModal, setUpdateModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
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
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "categories",
				name: `all`,
				id: id,
				url: `/categories/${id}`,
				deleteData: true,
				primaryKey: "id",
				cb: {
					success: () => {
						notification("Успешно удалена", { type: "success" });
					},
					error: () => {
						notification("Что-то пошло не так", { type: "danger" });
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
			<Modal.Default header="Добавить категорию" toggle={createModal} setToggle={setCreateModal}>
				<Create {...{ setCreateModal }} />
			</Modal.Default>
			<Modal.Default header="Изменить категорию" toggle={updateModal} setToggle={setUpdateModal}>
				<Update {...{ selected, setUpdateModal }} />
			</Modal.Default>
			
			<EntityContainer.All
				entity="categories"
				name={`all`}
				url="/categories"
				primaryKey="id"
				params={{
					extra: { title: params.q },
					sort: "-id",
					limit: params["page-limit"] ? params["page-limit"] : 30,
					page
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header btnName="Добавить" title="Kатегорий" btnClick={() => setCreateModal(true)} meta={meta} hasFilter={false} />
							<Table
								items={items}
								rowKey="id"
								className="mt-5"
								deleteAction={value => onDeleteHandler(value.id)}
								isFetched={isFetched}
								editAction={value => onEdit(value)}
								hasMenuModal={true}
								hasEdit={true}
								hasDelete={true}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-10 text-center",
										render: value => <>{value}</>
									},
									{
										title: t("Название(uz)"),
										dataIndex: "title_uz",
										render: value => <>{truncate(value, { length: 50, separator: "" })}</>
									},
									{
										title: t("Название(ru)"),
										dataIndex: "title_ru",
										render: value => <>{truncate(value, { length: 50, separator: "" })}</>
									},
									{
										title: t("Название(en)"),
										dataIndex: "title_en",
										render: value => <>{truncate(value, { length: 50, separator: "" })}</>
									},

									{
										title: t("Статус"),
										dataIndex: "status",
										className: "w-32 text-center",
										render: value => (
											<div className="lowercase w-32">
												<Tag color={value === 1 ? "green" : "red"}>{value === 1 ? "Активный" : "Неактивный"}</Tag>
											</div>
										)
									}
								]}
							/>
							{get(meta, "pageCount", 1) > 1 && (
								<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} limit={30} />
							)}
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
