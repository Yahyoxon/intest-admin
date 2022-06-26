import React from "react";
import { Spinner } from "../../../components";
import TableRow from "./body";
import Charts from "../Charts/index";
import "./style.scss";
import { helpers } from "services";

const ResultsChartComponent = ({ items = [], resultData, resultYear, columns = [], isFetched = false, currentMonth, title = "Нет данных" }) => {
	console.log(items);
	const yearData = [
		{
			id: 1,
			year: 2022
		},
		{
			id: 2,
			year: 2023
		}
	];
	const year = new Date().getFullYear();
	return (
		<div className="resultsChart">
			{!isFetched && <div className="--loading table-overlay" />}
			{!isFetched && <Spinner />}
			<div className="resultsChart-header d-flex align-items-center justify-between">
				<div className="resultsChart-header_main">
					<h4>{title}</h4>
					<p>
						From {currentMonth.month_ru}, {year}
					</p>
				</div>
				<div className="resultsChart-header_main">
					<select className="resultChartSelect mr-4" onChange={e => resultYear(e.target.value)}>
						{yearData.map((item, id) => (
							<option key={id} value={item.year}>
								{item.year}
							</option>
						))}
					</select>
					<select className="resultChartSelect" defaultValue={currentMonth.id} onChange={e => resultData(e.target.value)}>
						{helpers.months.map((item, i) => (
							<option key={i} value={item.id}>
								{item.month_ru}
							</option>
						))}
					</select>
				</div>
			</div>
			{items ? (
				<div className="resultsChart-main d-flex justify-between">
					<div className="resultsChart-main_left">
						<div className="resultChart-one">
							<span>{items && items.total}</span>
							<p>общее количество заявок</p>
						</div>
						{items && (
							<TableRow
								{...{
									items,
									columns
								}}
							/>
						)}
					</div>

					<div className="resultsChart-main_right">
						<Charts {...{ items }} />
					</div>
				</div>
			) : (
				"malumot yoq"
			)}
		</div>
	);
};

export default ResultsChartComponent;
