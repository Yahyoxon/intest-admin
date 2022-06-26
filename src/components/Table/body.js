import React from "react";
import { get } from "lodash";
import { Icon } from "components";
import { useOutsideClick } from "hooks";

const TableRow = ({
					  item,
					  rowKey = "id",
					  columns = [],
					  hasDelete = false,
					  hasEdit = false,
					  hasSave = false,
					  editAction,
					  deleteAction,
					  saveAction,
					  onRowClick,
					  editIcon,
					  hasMenuModal,
					  onRowClass
				  }) => {
	const { ref, isVisible, setIsVisible } = useOutsideClick(false);
	return (
		<tr key={item[rowKey]} className={`main-table-tr ${onRowClick ? "cursor-pointer" : ""} ${onRowClass(item)}`}>
			{columns.map((col, i) => (
				<td
					key={i}
					className={`main-table-td ${get(col, "className")}`}
					onClick={() => {
						if (!get(col, "isClickable") && onRowClick) {
							onRowClick(item);
						}
					}}>
					{col.render(item[col.dataIndex], item)}
				</td>
			))}
			{hasMenuModal ? (
				<td ref={ref} className="text-right">
					<Icon name="more-vertical" className="more-vertical-hover mr-3"
						  onClick={() => setIsVisible(!isVisible)} />
					<div className={isVisible ? "menuModal" : "d-none"}>
						{editAction && (
							<div key={1} className="menuModal__item flex items-center cursor-pointer"
								 onClick={() => !!editAction && editAction(item)}>
								<Icon name="edit" className="w-5 h-5 mr-1" />
								Изменить
							</div>
						)}
						{deleteAction && (
							<div key={2} className="menuModal__item flex items-center text-theme-24 cursor-pointer"
								 onClick={() => deleteAction(item)}>
								<Icon name="trash-2" className="w-5 h-5 mr-1" />
								Удалить
							</div>
						)}
					</div>
				</td>
			) : (
				<>
					{(hasDelete || hasSave) && (
						<td className="table-report__action w-20 main-table-td">
							<div className="flex">
								{!!editAction && hasEdit && (
									<div key={1} className="flex items-center mr-3 cursor-pointer"
										 onClick={() => !!editAction && editAction(item)}>
										<Icon name="edit" className="w-5 h-5 mr-1" />
									</div>
								)}
								{hasSave && saveAction && (
									<div key={2} className="flex items-center mr-3 cursor-pointer"
										 onClick={() => saveAction(item)}>
										<Icon name="check-circle" strokeColor="#28A745" className="w-5 h-5 mr-1" />
									</div>
								)}
								{hasDelete && deleteAction && (
									<div key={3} className="flex items-center text-theme-24 cursor-pointer"
										 onClick={() => deleteAction(item)}>
										<Icon name="trash-2" className="w-5 h-5 mr-1" />
									</div>
								)}
								{editIcon && (
									<div key={1} className="flex items-center mr-3 cursor-pointer"
										 onClick={() => !!editAction && editAction(item)}>
										<>{editIcon}</>
									</div>
								)}
							</div>
						</td>
					)}
				</>
			)}
		</tr>
	);
};

export default React.memo(TableRow);
