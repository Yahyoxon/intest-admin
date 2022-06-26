import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import qs from "query-string";

import { Table, Pagination, Modal, Header, Avatar, Tag, Tabs } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useNotification, useAccess } from "hooks";
import config from "config";
import { helpers } from "services";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const langCode = useSelector(state => state.system.currentLangCode);

	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const { page, lang } = params;

	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();
	const [loadingDelete, setLoadingDelete] = useState(false);
	const tabLang = lang || langCode;
	const is_moderator = useAccess({ roles: ["moderator"] });
	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "post",
				name: `all-${tabLang}`,
				id: id,
				url: `/posts/${id}`,
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
						setLoadingDelete(false);
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
		<Fragment>
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
				url="/posts"
				primaryKey="id"
				params={{
					include: "logs.user",
					extra: {
						title: params.q,
						_l: tabLang
					},
					sort: "-id",
					limit: params["page-limit"] ? params["page-limit"] : 30,
					page
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header
								title="Список новостей"
								hasSearch={true}
								hasButton={is_moderator ? false : true}
								btnClick={() => history.push(`/news/create?lang=${tabLang}`)}
							/>
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
								rowKey="id"
								className="mt-5"
								deleteAction={value => onDeleteHandler(value.id)}
								isFetched={isFetched}
								hasMenuModal={!is_moderator}
								editAction={value => history.push(`/news/update/${value.id}?lang=${tabLang}`)}
								onRowClick={value => history.push(`/news/update/${value.id}/?lang=${tabLang}`)}
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
										className: "w-10 text-center",
										render: value => {
											return <Avatar className="avatar--rectangle mx-auto" isProduct src={get(value, "thumbnails.small.src")} />;
										}
									},
									{
										title: "Загаловок",
										dataIndex: "title",
										render: value => <>{value}</>
									},
									{
										title: "Дата",
										dataIndex: "published_at",
										className: "text-center",
										render: value => <div className="text-center">{helpers.formatDate(value)}</div>
									},
									{
										title: t("Исполнитель"),
										dataIndex: "logs",
										render: value => {
											const republic_isp_content_manager = value ? value.find(i => i.role === "republic_isp_content_manager") : null;
											return <div>{republic_isp_content_manager ? get(republic_isp_content_manager, "user.name") : "-"}</div>;
										}
									},
									{
										title: t("Модератор"),
										dataIndex: "logs",
										render: value => {
											const moderator = value ? value.find(i => i.role === "moderator") : null;
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
							{get(meta, "pageCount", 1) > 1 && (
								<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} limit={30} />
							)}
						</div>
					);
				}}
			</EntityContainer.All>
		</Fragment>
	);
};

export default List;
