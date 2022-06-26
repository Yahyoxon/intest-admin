import React, { useState } from "react";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";

import { Table, Pagination, Modal, Header, Button } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";
import { helpers, storage } from "services";
import "./style.scss";
import Create from "./create";
import Update from "./update";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const dispatch = useDispatch();
	const { page } = params;
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [updateModal, setUpdateModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
	const [selected, setSelected] = useState();
	const [successModal, setSuccessModal] = useState(false);

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		setSubmitting(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "inner-roads",
				name: `all`,
				id: id,
				url: `/inner-roads/${id}`,
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
				<Create {...{ setCreateModal, setSuccessModal, successModal }} />
			</Modal.Default>
			<Modal.Default header="Изменить тег" toggle={updateModal} setToggle={setUpdateModal}>
				<Update {...{ selected, setUpdateModal }} />
			</Modal.Default>
			<EntityContainer.All
				entity="inner-roads"
				name={`all`}
				url="/inner-roads"
				primaryKey="id"
				params={{
					limit: params["page-limit"] ? params["page-limit"] : 30,
					page,
					filter: {
						name_uz: params.q
					}
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header btnName="Добавить" title="Файл" hasButton={false} />
							<div className="text-right mt-5">
								<Button.Default
									size={"lg"}
									onClick={() => {
										setCreateModal(!createModal);
										storage.set("lang", "uz");
									}}>
									ADD UZ
								</Button.Default>
								<Button.Default
									size={"lg"}
									onClick={() => {
										storage.set("lang", "ru");
										setCreateModal(!createModal);
									}}>
									ADD RU
								</Button.Default>
								<Button.Default
									size={"lg"}
									onClick={() => {
										storage.set("lang", "en");
										setCreateModal(!createModal);
									}}>
									ADD EN
								</Button.Default>
							</div>

							<div className="documentHover">
								<Table
									isFetched={isFetched}
									items={items}
									rowKey="id"
									className="mt-5"
									hasEdit={false}
									hasMenuModal={true}
									deleteAction={value => onDeleteHandler(value.id)}
									columns={[
										{
											title: "Название",
											dataIndex: "makhallakh_name",
											render: value => <>{value ? value : "-"}</>
										},
										{
											title: "Дата публикации",
											dataIndex: "created_at",
											className: "text-center",
											render: value => <div className="text-center">{helpers.formatDate(value)}</div>
										}
									]}
								/>
							</div>
							{get(meta, "pageCount", 1) > 1 && (
								<Pagination
									pageCount={get(meta, "pageCount", 1)}
									currentPage={page ? Number(page) : 1}
									handlePageClick={onChange}
									limit={30}
								/>
							)}
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
