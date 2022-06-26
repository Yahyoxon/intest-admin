import React, { useState } from "react";
import qs from "query-string";
import get from "lodash/get";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import EntityContainer from "modules/entity/containers";
import { useNotification } from "hooks";
import { EditableTable, Pagination, Header } from "components";

const List = () => {
	const [isLoading, setLoading] = useState(false);
	const { notification } = useNotification();
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	const { page } = qs.parse(location.search);
	const { t } = useTranslation();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	const handleSave = ({ newValue }) => {
		setLoading(true);

		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "translation",
				name: "all",
				url: "/translations/list",
				primaryKey: "id",
				id: newValue.id,
				values: newValue,
				updateData: true,
				normalizeData: data => data,
				cb: {
					success: () => {
						notification("Успешно", {
							type: "success",
							duration: 2
						});
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger",
							duration: 2
						});
					},
					finally: () => {
						setLoading(false);
					}
				}
			})
		);
	};

	return (
		<div className="pageContainer">
			<EntityContainer.All
				entity="translation"
				name="all"
				url="/translations/list"
				params={{
					limit: params["page-limit"] ? params["page-limit"] : 100,
					sort: "-id",
					page,
					extra: { message: params.q }
				}}>
				{({ items, isFetched, meta = {} }) => (
					<>
						<Header title="Список переводов" hasButton={false} hasFilter={false} />
						<EditableTable
							items={items}
							pagination={true}
							onSave={handleSave}
							isFetched={isFetched || !isLoading}
							className="mt-5"
							emptyUiText="Не найдено никакого перевода"
							columns={[
								{
									title: "ID",
									dataIndex: "id",
									className: "w-5 text-center",
									render: value => <>{value}</>
								},
								{
									title: t("Источник"),
									dataIndex: "message",
									className: "w-80",
									render: value => <>{value}</>
								},
								{
									title: t("На латыни"),
									dataIndex: "uz",
									editable: true,
									// className: "text-center",
									render: value => <>{value}</>
								},
								{
									title: t("На русском языке"),
									dataIndex: "ru",
									editable: true,
									// className: "text-center",
									render: value => <>{value}</>
								},
								{
									title: t("На английском языке"),
									dataIndex: "en",
									editable: true,
									// className: "text-center",
									render: value => <>{value}</>
								}
							]}
						/>

						{get(meta, "pageCount", 1) > 1 && (
							<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} limit={100} />
						)}
					</>
				)}
			</EntityContainer.All>
		</div>
	);
};

export default List;
