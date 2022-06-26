import React from "react";
import get from "lodash/get";

const TicketCols = ({value, year}) => {
	return (
		<div className="indicatorResultsInner">
			<div className="indicatorResultsInner-header">
				<h1>{year} йил</h1>
			</div>
			<div className="indicatorResultsInner-main indicatorResultsInner-main--doc">
				{value.map((value,i) => {
					let link = get(value, 'file.file.domain')  + get(value, 'file.file.folder') + get(value, 'file.file.file')
					return(
						<div className="indicatorResultsInner-main--doc-row" key={i}>
							<p>{get(value, 'file.title_ru')}</p>
							<a target="_blank" rel="noreferrer" href={link}>Скачать</a>
						</div>
					)
				})}
			</div>
		</div>
	);
};

export default TicketCols;