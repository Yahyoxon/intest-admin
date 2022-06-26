import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Nestable from "react-nestable";
import qs from "query-string";
import get from "lodash/get";

import { Modal, Header, NoData, Icon, Tag } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";

import CreateItem from "./components/createItem";
import UpdateItem from "./components/updateItem";

const List = ({ location, match }) => {
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);

	const [updateModal, setUpdateModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [selected, setSelected] = useState();
	const [canUpdate, setCanUpdate] = useState(false);

	const { id } = match.params;
	const query = qs.parse(location.search);
	const { alias } = query;

	const updateMenuItems = items => {
		dispatch(
			Actions.FormDefault.request({
				method: "put",
				url: `/menu-items/sort`,
				values: {
					nestable: items
				},
				cb: {
					success: () => {
						notification("Успешно изменено", {
							type: "success"
						});
						setCanUpdate(!canUpdate);
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					},
					finally: () => {}
				}
			})
		);
	};

	const deleteAction = () => {
		const menuId = selected.id;
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "menuItems",
				name: `menuItems-${id}`,
				id: menuId,
				url: `/menu-items/${menuId}`,
				deleteData: true,
				primaryKey: "id",
				cb: {
					success: () => {
						notification("Успешно удалена", {
							type: "success"
						});
						setModal(false);
						setCanUpdate(!canUpdate);
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
			<Modal.Default header="Добавить меню" toggle={createModal} setToggle={setCreateModal}>
				<CreateItem menuId={id} {...{ setCreateModal }} />
			</Modal.Default>
			<Modal.Default header="Изменить меню" toggle={updateModal} setToggle={setUpdateModal}>
				<UpdateItem menuId={id} {...{ selected, setUpdateModal }} />
			</Modal.Default>
			<EntityContainer.All
				entity="menuItems"
				name={`menuItems-${id}`}
				url="/menu-items"
				primaryKey="id"
				canUpdate={canUpdate}
				params={{
					limit: 50,
					sort: "sort",
					filter: { menu_id: id }
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header
								buttonName="Добавить"
								btnClick={() => setCreateModal(true)}
								backBtn={true}
								title={alias}
								hasSearch={false}
								hasFilter={false}
							/>
							{items.length > 0 ? (
								<div className="mt-5 intro-y">
									<Nestable
										maxDepth={2}
										items={items}
										childrenProp="menu_items"
										collapsed={true}
										renderItem={({ item, collapseIcon }) => (
											<div className={`mx-subdivision--item dark:bg-dark-3`}>
												<div className="sub-menu_list">
													<div className="mx-title">
														{collapseIcon} {get(item, "title")}
													</div>
												</div>

												<div className="flex">
													<div className="mr-10">
														{get(item, 'status') === 1 ? (
															<Tag color={"green"}>
																Активный
															</Tag>
														) : (
															<Tag color={"red"}>
																Неактивный
															</Tag>
														)}
													</div>
													<div
														className="flex items-center mr-3 cursor-pointer"
														onClick={() => {
															setSelected(item);
															setUpdateModal(true);
														}}>
														<Icon name="edit" className="w-5 h-5 mr-1" />
													</div>
													<div
														className="flex items-center text-theme-24 cursor-pointer"
														onClick={() => {
															setSelected(item);
															setModal(true);
														}}>
														<Icon name="trash-2" className="w-5 h-5 mr-1" />
													</div>
												</div>
											</div>
										)}
										onChange={items => {
											updateMenuItems(items);
										}}
									/>
								</div>
							) : (
								<NoData text="Этого алиасе нет меню" />
							)}
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
