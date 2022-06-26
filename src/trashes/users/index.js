import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import qs from "query-string";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useAccess, useNotification } from "hooks";
import { Table, Pagination, Header, Modal, Avatar } from "components";
import Filter from "./filter";
import "./style.scss";
const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { page, status, role } = params;
	const { notification } = useNotification();

	const isAdmin = useAccess({ roles: ["admin"] });
	const [filter, setFilter] = useState(false);
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "user",
				name: `all`,
				id: id,
				url: `/user/${id}`,
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
				entity="user"
				name={`all`}
				url="/user"
				primaryKey="id"
				params={{
					include: "photo",
					limit: params["page-limit"] ? params["page-limit"] : 50,
					page,
					sort: "-users.id",
					filter: {
						status,
						full_name: params.q
					},
					extra: {
						role
					}
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header
								title="Исполнители"
								btnClick={() => history.push("/users/create")}
								hasButton={true}
								hasSearch={true}
								hasFilter={true}
								setFilter={setFilter}
								filter={filter}>
								<Filter {...{ setFilter }} />
							</Header>
							<Table
								items={items}
								rowKey="id"
								className="mt-5"
								hasEdit={isAdmin}
								hasMenuModal={true}
								editAction={value => history.push(`/users/update/${value.id}`)}
								deleteAction={value => onDeleteHandler(value.id)}
								isFetched={isFetched}
								columns={[
									{
										dataIndex: "photo",
										className: "w-10 text-center",
										render: value => {
											return <Avatar className="avatar-circle" isProduct src={get(value, "thumbnails.small.src")} />;
										}
									},
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-10 text-center",
										render: value => <>{value}</>
									},

									{
										title: t("Имя"),
										dataIndex: "name",
										render: value => <>{value}</>
									},
									{
										title: t("Логин"),
										dataIndex: "login",
										className: "w-60",
										render: value => <>{value}</>
									},
									{
										title: t("Номер"),
										dataIndex: "phone",
										render: value => <>{value}</>
									},
									{
										title: t("Роле"),
										dataIndex: "role",
										render: value => <>{value}</>
									}
								]}
							/>
							{get(meta, "pageCount", 1) > 1 && (
								<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} limit={50} />
							)}
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
