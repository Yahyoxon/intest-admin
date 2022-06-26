import React from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import qs from "query-string";
import "./style.scss";
import EntityContainer from "modules/entity/containers";
import { Table, Pagination, Header } from "components";
import { helpers } from "services";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const { page } = params;

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	return (
		<>
			<EntityContainer.All
				entity="statistic"
				name={`all`}
				url="/statistics"
				primaryKey="id"
				params={{
					limit: params["page-limit"] ? params["page-limit"] : 100,
					page,
					include: "responsible,lastTicket"
				}}>
				{({ items, isFetched, meta }) => {
					let unread = items.filter((item) => item?.last_ticket?.status === 0)
					let read = items.filter((item) => item?.last_ticket?.status !== 0)
					let sorted = [...unread, ...read]
					return (
						<div className="pageContainer">
							<Header
								title="Показатели"
								btnClick={() => history.push("/indicators/create")}
								hasSearch={true}
								hasFilter={false} />
							<Table
								items={sorted}
								rowKey="id"
								className="mt-5"
								hasMenuModal={false}
								onRowClick={row => {
									history.push(`/indicators/view/${row.id}`);
								}}
								isFetched={isFetched}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-10 text-center",
										render: value => <>{value}</>
									},
									{
										title: t("Название"),
										dataIndex: "title_ru",
										render: value => <>{value}</>
									},
									{
										title: t("Сумма"),
										dataIndex: "summa",
										className: "w-60",
										render: value => <>{value}</>
									},
									{
										title: "Тип",
										dataIndex: "type",
										render: value => {
											const type = helpers.indicatorTypes.find(type => type.value === value);
											return <>{get(type, "label")}</>;
										}
									},
									{
										dataIndex: "last_ticket",
										render: value => {
											if (get(value, "status") === 0) {
												return (
													<div className="spinner">
														<div className="double-bounce1" />
														<div className="double-bounce2" />
													</div>
												);
											}
										}
									},
									{
										title: "Исполнитель",
										dataIndex: "responsible",
										render: value => <>{get(value, "name")}</>
									}
								]}
							/>
							{get(meta, "pageCount", 1) > 1 && (
								<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1}
									handlePageClick={onChange} limit={50} />
							)}
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
