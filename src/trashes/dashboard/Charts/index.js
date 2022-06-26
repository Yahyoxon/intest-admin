import React from "react";
import Chart from "react-apexcharts";
import get from "lodash/get";
import "./index.css";
export default function Donut({ items }) {
	console.log(items);
	const result = {
		options: {
			colors: ["#FF8675", "#CDF4FF", "#6C5DD3", "#df1646", "#7fdf16", "#df16c3"]
		},

		series: [
			get(items, "completed.percentage", "") ? get(items, "completed.percentage", "") : get(items, "active.percentage", ""),
			get(items, "accepted.percentage", "") ? get(items, "accepted.percentage", "") : get(items, "inactive.percentage", ""),
			get(items, "new.percentage", "") ? get(items, "new.percentage", "") : get(items, "rejected.percentage", "")
		],
		labels: ["C", "D", "E"]
	};
	return (
		<div className="donut">
			<Chart options={result.options} series={result.series} type="donut" width="300" />
		</div>
	);
}
