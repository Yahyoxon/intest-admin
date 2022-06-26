import React, { useState } from "react";
import { Table, Pagination, Modal, Header, Tabs, Tag } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import qs from "query-string";
import { useAccess, useNotification } from "hooks";
import config from "config";
import { helpers } from "services";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();
	const langCode = useSelector(state => state.system.currentLangCode);
	const { page, lang } = params;
	const tabLang = lang || langCode;

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "pages",
				name: `pages-${tabLang}`,
				id: id,
				url: `/pages/${id}`,
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

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	const is_moderator = useAccess({ roles: ["is_moderator"] });

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
				entity="pages"
				name={`pages-${tabLang}`}
				url="/pages"
				primaryKey="id"
				params={{
					include: "logs.user",
					extra: { _l: tabLang },
					filter: { title: params.q },
					sort: "-id",
					limit: params["page-limit"] ? params["page-limit"] : 20,
					page
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="page-container">
							<div className="pt-10">
								<Header
									title="Список страниц по умолчанию"
									btnName="Добавить"
									btnClick={() => history.push(`/pages/create?lang=${tabLang}`)}
									hasFilter={false}
								/>
								<Tabs
									items={config.API_LANGUAGES}
									onTabChange={value => {
										const search = { ...params, lang: value };
										history.push({ search: qs.stringify(search) });
									}}
									activeItem={tabLang}
									className={"mt-5 mb-5 intro-y"}
								/>
								<Table
									items={items}
									rowKey="id"
									className="mt-5"
									deleteAction={value => onDeleteHandler(value.id)}
									hasMenuModal={!is_moderator}
									isFetched={isFetched}
									editAction={value => history.push(`/pages/update/${value.id}?lang=${tabLang}`)}
									onRowClick={value => history.push(`/pages/update/${value.id}?lang=${tabLang}`)}
									columns={[
										{
											title: t("ID"),
											dataIndex: "id",
											className: "w-10 text-center",
											render: value => <>{value}</>
										},
										{
											title: t("Имя"),
											dataIndex: "title",
											render: value => <>{value}</>
										},
										{
											title: t("Созданное время"),
											className: "w-60 text-center",
											dataIndex: "created_at",
											render: value => <>{helpers.formatDate(value, "DD.MM.YYYY / HH:mm:ss")}</>
										},
										{
											title: t("Исполнитель"),
											dataIndex: "logs",
											render: value => {
												const republic_isp_content_manager = value.find(i => i.role === "republic_isp_content_manager");
												return <div>{republic_isp_content_manager ? get(republic_isp_content_manager, "user.name") : "-"}</div>;
											}
										},
										{
											title: t("Модератор"),
											dataIndex: "logs",
											render: value => {
												const moderator = value.find(i => i.role === "moderator");
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
									<Pagination
										pageCount={get(meta, "pageCount", 1)}
										currentPage={page ? Number(page) : 1}
										handlePageClick={onChange}
										limit={20}
									/>
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
