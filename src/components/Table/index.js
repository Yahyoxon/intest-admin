import React from "react";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import cx from "classnames";

import { Spinner } from "components";
import TableRow from "./body";
import "./style.scss";

const TableComponent = ({
	items = [],
	id,
	rowKey = "id",
	columns = [],
	theadSquared = false,
	isFetched = false,
	hasDelete = false,
	hasEdit = false,
	hasSave = false,
	hasMenuModal = false,
	editAction,
	editIcon,
	deleteAction,
	saveAction,
	emptyUiText = "Нет данных",
	className,
	onRowClick,
	onRowClass = () => {return ""}
}) => {
	const { t } = useTranslation();
	const classes = cx(`intro-y col-span-12 table-container`, className ? className : "");
	return (
		<div className={classes}>
			{!isFetched && <div className="--loading table-overlay" />}
			{!isFetched && <Spinner />}
			<table id={id} className="table table-report main-table">
				<thead className="main-table-thead">
					<tr className={`main-table-tr${theadSquared ? "__squared" : ""} bg-gray-700 text-white`}>
						{columns.map((col, i) => (
							<th
								key={i}
								className={`main-table-th ${get(col, "className")}`}
								onClick={() => {
									return typeof col.onHeaderClick === "function" ? col.onHeaderClick(col) : null;
								}}>
								{get(col, "title")}
							</th>
						))}
						{(hasEdit || hasDelete || hasSave || hasMenuModal) && <th className="whitespace-nowrap" />}
					</tr>
				</thead>

				<tbody className={`main-table-tbody`}>
					{items.length > 0 &&
						items.map((item, i) => (
							<TableRow
								key={i}
								{...{
									item,
									rowKey,
									columns,
									hasDelete,
									hasEdit,
									hasSave,
									editAction,
									deleteAction,
									saveAction,
									editIcon,
									onRowClick,
									onRowClass,
									hasMenuModal
								}}
							/>
						))}
				</tbody>
			</table>
			{isFetched && items.length < 1 && <div className="text-center p-4 bg-gray-300 rounded dark:bg-dark-2">{t(emptyUiText)}</div>}
		</div>
	);
};

export default TableComponent;
