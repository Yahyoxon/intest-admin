import React from "react";
import get from "lodash/get";

const TableRow = ({ items, columns = [] }) => {
	return (
		<>
			{columns.map((col, i) => {
				return (
					<div key={i} className="resultChart-two">
						<div className="d-flex items-center">
							<span></span>
							<p className="ml-2">{get(col, "title")}</p>
						</div>
						<p className="resultChart-two_p">{col.render(items[col.dataIndex], items)}%</p>
					</div>
				);
			})}
		</>
	);
};

export default React.memo(TableRow);
