import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import qs from "query-string";

import { Table, Pagination, Avatar, Modal, Header, Tag, Tab } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";
import config from "config";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const langCode = useSelector(state => state.system.currentLangCode);

	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, lang } = params;
	const { notification } = useNotification();

	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [tabLang, setTabLang] = useState(lang || langCode);

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "settings",
				name: `all-${tabLang}`,
				id: id,
				url: `/settings/${id}`,
				deleteData: true,
				primaryKey: "id",
				cb: {
					success: () => {
						notification("Успешно удалена", {
							type: "success"
						});
						setModal(false);
						setLoadingDelete(false);
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
						setModal(false);
						setLoadingDelete(false);
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
				entity="settings"
				name={`all-${tabLang}`}
				url="/settings"
				primaryKey="id"
				params={{
					sort: "-id",
					limit: params["page-limit"] ? params["page-limit"] : 20,
					page,
					extra: {
						name: params.q,
						_l: tabLang
					}
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header
								title="Социальная сеть"
								buttonName="Добавить"
								btnClick={() => history.push(`/settings/create?lang=${tabLang}`)}
								hasFilter={false}
								hasButton={true}
							/>
							<Tab items={config.API_LANGUAGES} onChange={item => setTabLang(item.code)} activeTab={tabLang} className={"mt-5 mb-5 intro-y"} />
							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								hasMenuModal={true}
								emptyUiText="Список пусто"
								hasEdit={true}
								deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => history.push(`/settings/update/${value.id}?lang=${tabLang}`)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4 text-center",
										render: value => <>{value}</>
									},
									{
										title: t("Фото"),
										dataIndex: "files",
										className: "w-8 text-center",
										render: value => {
											return <Avatar isProduct src={get(value, "thumbnails.small.src")} />;
										}
									},
									{
										title: t("Названия"),
										dataIndex: "name",
										render: value => <>{value}</>
									},
									{
										title: t("Значения"),
										dataIndex: "value",
										render: value => <>{value}</>
									},
									{
										title: t("Алиас"),
										dataIndex: "alias",
										render: value => <>{value}</>
									},
									{
										title: t("Слуг"),
										dataIndex: "slug",
										render: value => <>{value}</>
									},
									{
										title: t("Статус"),
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
