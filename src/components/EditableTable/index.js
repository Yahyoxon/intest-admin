import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import "./style.scss";
import Icon from "../Icon";
import cx from "classnames";

const TableComponent = ({
	items = [],
	rowKey = "id",
	columns = [],
	isFetched = false,
	deleteAction,
	emptyUiText = "No data",
	className,
	onRowClick,
	onSave
}) => {
	const classes = cx(`intro-y col-span-12 overflow-auto ${onRowClick ? "cursor-pointer" : ""}`, !isFetched && "--loading", className && className);

	const { t } = useTranslation();
	const input = useRef(null);

	return (
		<div className={classes}>
			<table className="table table-report main-table">
				<thead className="main-table-thead">
					<tr className="main-table-tr bg-gray-700 dark:bg-dark-1 text-white">
						{columns.map((col, i) => (
							<th key={i} className={`main-table-th ${get(col, "className")}`}>
								{get(col, "title")}
							</th>
						))}
						{deleteAction && <th className="whitespace-nowrap" />}
					</tr>
				</thead>
				{items.length > 0 && (
					<tbody>
						{items.map(item => {
							return (
								<tr key={item[rowKey]} className="intro-x editable__row">
									{columns.map((col, i) => (
										<td key={i} className={`${get(col, "className")} editable__td`}>
											{col.editable && (
												<div
													className={"editable__input"}
													suppressContentEditableWarning={true}
													contentEditable={true}
													ref={input}
													defaultValue={item[col.dataIndex]}
													onKeyDown={event => {
														if (col.editable && (event.keyCode === 13 || event.which === 13)) {
															onSave({
																newValue: {
																	id: get(item, "id"),
																	language: col.dataIndex,
																	translation: get(event.target, "textContent")
																}
															});

															if (document.activeElement instanceof HTMLElement) {
																document.activeElement.blur();
															}
														}
													}}>
													{item[col.dataIndex]}
												</div>
											)}
											{!col.editable && col.render(item[col.dataIndex], item)}
										</td>
									))}
									{deleteAction && (
										<td className="table-report__action w-20">
											<div className="flex">
												{deleteAction && (
													<div className="flex items-center text-theme-24 cursor-pointer" onClick={() => deleteAction(item)}>
														<Icon name="trash-2" className="w-5 h-5 mr-1" />
													</div>
												)}
											</div>
										</td>
									)}
								</tr>
							);
						})}
					</tbody>
				)}
			</table>
			{isFetched && items.length < 1 && <div className="text-center p-4 table__no-data">{t(emptyUiText)}</div>}
		</div>
	);
};

export default TableComponent;
