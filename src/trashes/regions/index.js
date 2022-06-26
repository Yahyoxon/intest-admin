import React, { useState } from "react";
import { get } from "lodash";
import qs from "query-string";

import EntityContainer from "modules/entity/containers";
import { Table, Header, Pagination, Modal, Tag } from "components";
import Update from "./update";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { page } = params;
	const [updateModal, setUpdateModal] = useState(false);
	const [selected, setSelected] = useState();

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	const onEdit = selected => {
		setSelected(selected);
		setUpdateModal(true);
	};
	return (
		<>
			<Modal.Default header="Измените регион" toggle={updateModal} setToggle={setUpdateModal}>
				{updateModal && <Update {...{ selected, setUpdateModal }} />}
			</Modal.Default>
			<EntityContainer.All
				entity="regions"
				name={`all`}
				url="/regions"
				primaryKey="id"
				params={{
					filter: { name_uz: params.q },
					limit: params["page-limit"] ? params["page-limit"] : 30,
					page,
					sort: "-id"
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header title="Список регионов" hasButton={false} hasFilter={false} />
							<Table
								items={items}
								rowKey="id"
								className="lg:mt-5"
								hasMenuModal={true}
								isFetched={isFetched}
								editAction={value => onEdit(value)}
								columns={[
									{
										title: "ID",
										dataIndex: "id",
										className: "w-10 text-center",
										render: value => <>{value}</>
									},
									{
										title: "Название(узбекский)",
										dataIndex: "name_uz",
										render: value => <>{value}</>
									},
									{
										title: "Название(русский)",
										dataIndex: "name_ru",
										render: value => <>{value}</>
									},
									{
										title: "Название(английский)",
										dataIndex: "name_en",
										render: value => <>{value}</>
									},
									{
										title: "Статус",
										dataIndex: "status",
										render: (value, row) => {
											return value === 1 ? <Tag color="green">Активный</Tag> : <Tag color="red">Неактивный</Tag>;
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
		</>
	);
};

export default List;
