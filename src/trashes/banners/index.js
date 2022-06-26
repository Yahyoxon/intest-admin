import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get, truncate } from "lodash";
import qs from "query-string";

import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { Table, Pagination, Avatar, Modal, Header, Tag, Copy, Tabs } from "components";
import { useNotification } from "hooks";
import { helpers } from "services";
import config from "config";

import Filter from "./filter";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const langCode = useSelector(state => state.system.currentLangCode);
	const dispatch = useDispatch();
	const [canUpdate, setCanUpdate] = useState(false);
	const { lang, page } = params;

	// const [tabLang, setTabLang] = useState(lang || langCode);

	const tabLang = lang || langCode;
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();
	const [loadingDelete, setLoadingDelete] = useState(false);

	// const changeLangTab = lang => {
	// 	const search = { lang: lang };

	// 	history.push({
	// 		search: qs.stringify(search)
	// 	});

	// 	setTabLang(lang);
	// };

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "banners",
				name: `all-${tabLang}`,
				id: id,
				url: `/banners/${id}`,
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
				entity="post"
				name={`all-${tabLang}`}
				url="/banners"
				primaryKey="id"
				canUpdate={canUpdate}
				params={{
					sort: "-id",
					include: "file",
					limit: params["page-limit"] ? params["page-limit"] : 20,
					extra: { _l: tabLang, title: params.q },
					page
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header title="Баннеры" btnName="Добавить" btnClick={() => history.push(`/banners/create?lang=${tabLang}`)} hasSearch={true}>
								<Filter />
							</Header>
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
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								hasMenuModal={true}
								deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => history.push(`/banners/update/${value.id}/?lang=${tabLang}`)}
								columns={[
									{
										title: "ID",
										dataIndex: "id",
										className: "w-4 text-center",
										render: value => <>{value}</>
									},
									{
										title: "Фото",
										dataIndex: "file",
										className: "text-center",
										render: value => {
											return <Avatar className="avatar--rectangle mx-auto" isProduct src={get(value, "thumbnails.small.src")} />;
										}
									},
									{
										title: "Название",
										dataIndex: "title",
										render: value => <>{value}</>
									},
									{
										title: "Линк",
										dataIndex: "link",
										render: value => (
											<div className="flex align-center">
												{truncate(value, { length: 35 })}
												<Copy str={value} isVisible={false} />
											</div>
										)
									},
									{
										title: "Позиция",
										dataIndex: "sort",
										className: "text-center",
										render: value => <div className="text-center">{value}</div>
									},

									{
										title: "Дата публикации",
										dataIndex: "created_at",
										className: "text-center",
										render: value => <div className="text-center">{helpers.formatDate(value)}</div>
									},
									{
										title: "Статус",
										dataIndex: "status",
										render: value => {
											return <div>{value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</div>;
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
