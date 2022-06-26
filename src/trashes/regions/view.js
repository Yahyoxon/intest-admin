import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import { get } from "lodash";
import { useDispatch } from "react-redux";
import { useNotification } from "hooks";

import EntityContainer from "modules/entity/containers";
import { Table, Header, Pagination, Modal } from "../../components";
import Actions from "modules/entity/actions";
import Update from "./components/updateItem";
import Create from "./components/createItem";

const List = ({ history, location, match }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { id } = match.params;
	const { t } = useTranslation();
	const { page } = params;
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const [updateModal, setUpdateModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [selected, setSelected] = useState();
	const [modal, setModal] = useState(false);

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	const onEdit = selected => {
		setSelected(selected);
		setUpdateModal(true);
	};

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "districts",
				name: `all`,
				id: id,
				url: `/district/${id}`,
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
					finally: () => {}
				}
			})
		);
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
			<Modal.Default header="Добавить регион" toggle={createModal} setToggle={setCreateModal}>
				{createModal && <Create {...{ setCreateModal, regionId: id }} />}
			</Modal.Default>
			<Modal.Default header="Измените регион" toggle={updateModal} setToggle={setUpdateModal}>
				{updateModal && <Update {...{ selected, setUpdateModal, regionId: id }} />}
			</Modal.Default>
			<EntityContainer.All
				entity="districts"
				name={`all`}
				url="/district"
				primaryKey="id"
				params={{
					extra: { q: params.q },
					limit: params["page-limit"] ? params["page-limit"] : 20,
					filter: {
						region_id: id
					},
					page,
					sort: "-id"
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="page-container">
							<div className="pt-10">
								<Header title="Список районов" hasFilter={false} buttonName="Добавить" buttonClick={() => setCreateModal(true)} />
								<Table
									items={items}
									rowKey="id"
									className="lg:mt-5"
									hasEdit={true}
									hasDelete={false}
									isFetched={isFetched}
									editAction={value => onEdit(value)}
									deleteAction={value => onDeleteHandler(get(value, "id"))}
									columns={[
										{
											title: t("ID"),
											dataIndex: "id",
											className: "w-4 text-center",
											render: value => <>{value}</>
										},
										{
											title: t("Название(узбекский)"),
											dataIndex: "name_uz",
											render: value => <>{value}</>
										},
										{
											title: t("Название(русский)"),
											dataIndex: "name_ru",
											render: value => <>{value}</>
										},
										{
											title: t("Название(английский)"),
											dataIndex: "name_en",
											render: value => <>{value}</>
										}
									]}
								/>
								{get(meta, "pageCount", 1) > 1 && (
									<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} />
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
