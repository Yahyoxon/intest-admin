import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import qs from "query-string";

import { Table, Pagination, Modal, Header, Tabs } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";
import config from "config";
import { useAccess } from "hooks";
import Create from "./create";
import Update from "./update";

const List = ({ history, location }) => {
	const langCode = useSelector(state => state.system.currentLangCode);
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const isModerator = useAccess({ roles: ["moderator"] });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { lang, page } = params;
	const { notification } = useNotification();
	const [canUpdate, setCanUpdate] = useState(false);
	const tabLang = lang || langCode;
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
				entity: "menus",
				name: `all`,
				id: id,
				url: `/menus/${id}`,
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

			<Modal.Default header="Добавить меню" toggle={createModal} setToggle={setCreateModal}>
				<Create {...{ setCreateModal, tabLang }} />
			</Modal.Default>
			
			<Modal.Default header="Изменить меню" toggle={updateModal} setToggle={setUpdateModal}>
				<Update {...{ selected, setUpdateModal, tabLang }} />
			</Modal.Default>

			<EntityContainer.All
				entity="menus"
				name={`all`}
				url="/menus"
				primaryKey="id"
				params={{
					limit: params["page-limit"] ? params["page-limit"] : 30,
					page,
					extra: { _l: tabLang },
					filter: {
						title: params.q
					}
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header btnName={t("Добавить")} btnClick={() => setCreateModal(true)} meta={meta} title="Menu" hasSearch={true} hasFilter={false} />
							<Tabs
								items={config.API_LANGUAGES}
								onTabChange={value => {
									const search = { ...params, lang: value };
									history.push({ search: qs.stringify(search) });
									// setTabLang(value);
								}}
								activeItem={tabLang}
								className={"mt-5 mb-5 intro-y"}
							/>

							<Table
								isFetched={isFetched}
								items={items}
								rowKey="id"
								hasEdit={false}
								hasDelete={false}
								hasSave={isModerator}
								deleteAction={value => onDeleteHandler(value.id)}
								className="mt-5"
								hasMenuModal={true}
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
										dataIndex: "title",
										render: (value, row) => (
											<div>
												<Link to={`/menus/${row.id}?alias=${row.title}`}>{value}</Link>
											</div>
										)
									}
									// {
									// 	title: "status",
									// 	dataIndex: "status",
									// 	render: value => {
									// 		return <>{value === 10 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</>;
									// 	}
									// },
									// {
									// 	className: "w-5",
									// 	render: (_, row) => {
									// 		const status = get(row, "status");

									// 		if (status === 3) {
									// 			return (
									// 				<Button.Outline
									// 					className="status-btn"
									// 					type="success"
									// 					tooltip={t("Активный")}
									// 					onClick={() => console.log("hello")}>
									// 					<Icon name="power" />
									// 				</Button.Outline>
									// 			);
									// 		} else if (status === 10) {
									// 			return (
									// 				<Button.Outline
									// 					className="status-btn"
									// 					type="danger"
									// 					tooltip={t("Бан")}
									// 					onClick={() => console.log("hello")}>
									// 					<Icon name="power" />
									// 				</Button.Outline>
									// 			);
									// 		} else if (status === 1) {
									// 			return (
									// 				<Button.Outline
									// 					className="status-btn"
									// 					type="success"
									// 					tooltip={t("Активный")}
									// 					onClick={() => console.log("hello")}>
									// 					{/* updateAction(get(row, "id"), "deactivate") */}
									// 					<Icon name="power" />
									// 				</Button.Outline>
									// 			);
									// 		}
									// 	}
									// }
								]}
							/>
							{/* <DropdownNew items={items} menuDropdown={true} /> */}
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
