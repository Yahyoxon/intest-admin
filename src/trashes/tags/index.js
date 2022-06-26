import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";

import { Table, Pagination, Modal, Header } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";
import { helpers } from "services";

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
				entity: "tags",
				name: `all`,
				id: id,
				url: `/tags/${id}`,
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
				entity="tags"
				name={`all`}
				url="/tags"
				primaryKey="id"
				params={{
					filter: { name: params.q },
					sort: `name`,
					limit: params["page-limit"] ? params["page-limit"] : 30,
					page
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header btnName="Добавить" title="Теги" btnClick={() => setCreateModal(true)} meta={meta} />
							<Table
								isFetched={isFetched}
								items={items}
								rowKey="id"
								className="mt-5"
								hasMenuModal={true}
								deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => onEdit(value)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4 text-center",
										render: value => <>{value}</>
									},
									{
										title: t("Название"),
										dataIndex: "name",
										render: value => <>{value}</>
									},
									{
										title: "Созданный в",
										dataIndex: "created_at",
										className: "w-32",
										render: value => <>{helpers.formatDate(value, "DD-MM-YYYY")}</>
									}
								]}
							/>
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
