import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import qs from "query-string";

import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import storageActions from "store/actions/storage";
import { Table, Pagination, Modal, Header, Tag, Popover } from "components";
import { useNotification, useAccess } from "hooks";
import { helpers } from "services";
import Filter from "./filter";

const List = ({ history, location }) => {
	const region_id = useSelector(state => state.auth.data.region_id);
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const dispatch = useDispatch();
	const { page } = params;

	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();
	const [loadingDelete, setLoadingDelete] = useState(false);

	const canAddTicket = useAccess({ roles: ["region_isp_map", "republic_isp_map"] });
	const isAdmin = useAccess({ roles: ["admin"] });

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "ticket",
				name: `all`,
				id: id,
				url: `/properties/${id}`,
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
						setLoadingDelete(false);
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

	useEffect(() => {
		dispatch(storageActions.SAVE_TEMPRORY_DATA.success({}));
	}, [dispatch]);


	const getLastExecutorName = (region,republic) => {
		if(region && !republic){
			return get(region, 'user.name')
		}else if(!region && republic){
			return get(republic, 'user.name')
		}else if(region && republic){
			const regId = get(region, 'id');
			const repId = get(republic, 'id');
			return (
				<div>
					<span className={regId > repId ? 'd-block' : 'd-none'}>{get(region, 'user.name')}</span>
					<span className={regId < repId ? 'd-block' : 'd-none'}>{get(republic, 'user.name')}</span>
				</div>
			)
		}else{
			return ''
		}
	}

	const is_region_isp_map = useAccess({ roles: ["region_isp_map"] });

	let extraCols = [];
	if (!is_region_isp_map) {
		extraCols = [
			{
				title: "Исполнитель",
				dataIndex: "logs",
				render: value => {
					const region_isp_map = value.find(i => i.role === "region_isp_map");
					const republic_isp_map = value.find(i => i.role === "republic_isp_map");
					return <div>{getLastExecutorName(region_isp_map, republic_isp_map)}</div>;
				}
			}
		];
	} else extraCols = [];
	return (
		<>
			<Modal.Confirm
				isSubmitting={loadingDelete}
				title="Вы действительно хотите удалить?"
				toggle={modal}
				setToggle={setModal}
				closable
				cancelText="нет"
				okText="да"
				onOk={() => deleteAction(selected)}
			/>
			<EntityContainer.All
				entity="ticket"
				name={`all`}
				url="/properties"
				primaryKey="id"
				params={{
					sort: "-id",
					limit: params["page-limit"] ? params["page-limit"] : 50,
					include: "contractor,scheduler,location,logs.user",
					extra: {
						nomi_: params.q,
						region_id: is_region_isp_map ? region_id : null,
						root: 2
					},
					page
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header
								title="Билеты"
								btnName="Добавить"
								btnClick={() => history.push(`/tickets/view`)}
								meta={meta}
								hasSearch={true}
								hasButton={canAddTicket}>
								<Filter />
							</Header>
							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								hasMenuModal={isAdmin || canAddTicket}
								deleteAction={value => onDeleteHandler(value.id)}
								onRowClick={value => history.push(`/tickets/view/${get(value, "id")}`)}
								editAction={value => history.push(`/tickets/view/${get(value, "id")}`)}
								columns={[
									{
										title: "ID",
										dataIndex: "id",
										className: "w-4 text-center",
										render: value => <>{value}</>
									},
									{
										title: "Имя объекта",
										dataIndex: "location",
										render: value => <>{get(value, "address")}</>
									},
									{
										title: "Начало",
										dataIndex: "created_at",
										render: value => <div>{helpers.formatDate(value)}</div>
									},
									{
										title: "Конец",
										dataIndex: "created_at",
										render: value => <div>{helpers.formatDate(value)}</div>
									},
									{
										title: "Сумма инвестиций",
										dataIndex: "amount",
										render: value => <>{value ? value : 0}</>
									},
									...extraCols,
									{
										title: "Модератор",
										dataIndex: "logs",
										render: value => {
											const moderator = value.find(i => i.role === "moderator");
											return <div>{moderator ? helpers.getUserRoleLabel(get(moderator, "user.role")) : "-"}</div>;
										}
									},
									{
										title: <>Тип</>,
										dataIndex: "location",
										// onHeaderClick: value => console.log("value", value),
										render: (value, row) => {
											if (get(value, "type_id") === 2) {
												return <>Билет</>;
											} else if (get(value, "type_id") === 1) {
												return <>Дорога</>;
											} else return <>-</>;
										}
									},
									{
										title: "Статус",
										dataIndex: "status",
										className: "text-center",
										render: (value, row) => {
											const status = helpers.ticketStatus.find(status => status.value === value);
											if (get(row, "location.type_id") === 2) {
												return (
													<Popover title="Причина отклонение" content={<>{get(row, "reason")}</>} show={status.value === 3}>
														<Tag color={status.color}>{status.label}</Tag>
													</Popover>
												);
											}
										}
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
