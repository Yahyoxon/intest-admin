import React from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import qs from "query-string";

import EntityContainer from "modules/entity/containers";
import { Table, Pagination, Header, Tag } from "components";
import { helpers } from "services";

import "../style.scss"
import { useAccess } from "../../../hooks";
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

	const is_moderator = useAccess({ roles: ["moderator"] });

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
					include: "responsible,lastTicket,activeTicket.moderator.user",
					extra: { append: 'total_sum' },
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
								hasButton={false}
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
										dataIndex: "total_sum",
										className: "w-60",
										render: value => <>{value ? value : '-'}</>
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
										title: "Модератор",
										dataIndex: "active_ticket",
										render: value => {
											return <div>{value ? get(value, 'moderator.user.name') : '-'}</div>;
										}
									},
									{
										dataIndex: "last_ticket",
										render: value => {
											if (get(value, "status") === 0 && is_moderator) {
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
										title: "Статус",
										dataIndex: "status",
										className: "text-center",
										render: value => {
											return <div>{value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</div>;
										}
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
