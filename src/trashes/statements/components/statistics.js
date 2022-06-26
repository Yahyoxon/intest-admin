import Actions from "modules/entity/actions";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../style.scss";

export default function RegionResults({ setActiveRegion }) {
	const dispatch = useDispatch();
	const [regionData, setRegionData] = useState();
	const [resultData, setResultData] = useState();
	useEffect(() => {
		dispatch(
			Actions.LoadDefault.request({
				url: "regions",
				cb: {
					success: data => {
						// let d = data.data.unshift({ id: 0, name_ru: "All" });
						setRegionData(data);
					}
				}
			})
		);
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		dispatch(
			Actions.LoadDefault.request({
				url: "/feedback/total-count",
				cb: {
					success: data => {
						setResultData(data);
					}
				}
			})
		);
		//eslint-disable-next-line
	}, []);

	return (
		<div className="regionResults">
			<div className="regionResults-inner">
				<div className="regionResults-inner-region">
					Region:
					<select onChange={e => setActiveRegion(e.target.value)}>
						{regionData && regionData
							? regionData.data.map((item, i) => (
									<option key={i} value={item.id}>
										{item.name_ru}
									</option>
							  ))
							: null}
					</select>
				</div>
				<div className="regionResults-inner-all">
					All: <span>{resultData && resultData.TOTAL}</span>
				</div>
				<div className="regionResults-inner-completed">
					Completed: <span>{resultData && resultData.COMPLETED}</span>
				</div>
				<div className="regionResults-inner-progress">
					In Progress: <span>{resultData && resultData.ACCEPTED}</span>
				</div>
				<div className="regionResults-inner-pending">
					Pending: <span>{resultData && resultData.REJECTED}</span>
				</div>
			</div>
		</div>
	);
}
