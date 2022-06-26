import React from "react";
import get from "lodash/get";
import helpers from "services/helpers"

const TicketCols = ({value, year}) => {
	return (
		<div className="indicatorResultsInner">
			<div className="indicatorResultsInner-header">
				<h1>{year} йил</h1>
			</div>
			<div className="indicatorResultsInner-main">
				<div className="indicatorMonth">
					{value.map((value,i) => (
						<p key={i}>{get(value, 'option.title')}</p>
					))}
				</div>
				<div className="indicatorMoney">
					{value.map((value,i) => {
						const text = get(value, 'value', "");
						const hasDrop = text ? text.includes('/') : false

						let a = "";
						let b = "";
						if(hasDrop){
							a = get(value, 'value').split('/')[0];
							b = get(value, 'value').split('/')[1];
						}

						return(
							<p key={i}>
								{hasDrop ? (
									<span>
										{a ? Number(a).toLocaleString() : 0} /
										{b ? Number(b).toLocaleString() : 0}
									</span>
								) : (
									<span>
										{value.value ? Number(value.value).toLocaleString() : '0'}
									</span>
								)}
								<span className="pl-2">{helpers.getValueTypeLabel(value.value_type)}</span>
							</p>
						)
					})}
				</div>
			</div>
		</div>
	);
};

export default TicketCols;