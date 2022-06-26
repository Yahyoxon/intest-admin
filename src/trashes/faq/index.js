import React, { useState } from "react";
import { Table, Pagination, Modal, Header } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification } from "hooks";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page } = params;
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "faq",
				name: `all`,
				id: id,
				url: `/faq/${id}`,
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
				entity="faq"
				name={`all`}
				url="/faq"
				primaryKey="id"
				params={{
					extra: { title: params.q },
					sort: "-id",
					limit: params["page-limit"] ? params["page-limit"] : 20,
					page
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="page-container">
							<div className="pt-10">
								<Header title="Часто задаваемые вопросы" btnName="Добавить" btnClick={() => history.push(`/faq/create`)} hasFilter={false} />
								<Table
									items={items}
									rowKey="id"
									className="mt-5"
									deleteAction={value => onDeleteHandler(value.id)}
									isFetched={isFetched}
									editAction={value => history.push(`/faq/update/${get(value, "id")}`)}
									hasEdit={true}
									hasDelete={false}
									columns={[
										{
											title: t("ID"),
											dataIndex: "id",
											className: "w-10 text-center",
											render: value => <>{value}</>
										},
										{
											title: t("Название(Узбекский)"),
											dataIndex: "title_uz",
											render: value => <>{value}</>
										},
										{
											title: t("Название(Русский)"),
											dataIndex: "title_ru",
											render: value => <>{value}</>
										},
										{
											title: t("Название(Английский)"),
											dataIndex: "title_en",
											render: value => <>{value}</>
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
