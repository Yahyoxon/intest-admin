import React from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";

import Actions from "modules/entity/actions";
import { Spinner } from "../../components";
import { time } from "services";
import EntityContainer from "../../modules/entity/containers";
import { useDispatch } from "react-redux";

const Index = () => {
	const dispatch = useDispatch();

	const updateDay = info => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "days",
				name: "working-days",
				updateData: true,
				id: info.id,
				normalizeData: data => data,
				url: `/working-days`,
				values: {
					status: info.status === 1 ? 0 : 1,
					time: info.time
				},
				cb: {
					success: data => {},
					error: data => {},
					finally: data => {}
				}
			})
		);
	};

	return (
		<div className="pageContainer">
			<h4 className="font-medium intro-y font-medium mb-5 text-xl">Рабочие дни</h4>

			<div>
				<EntityContainer.All
					entity="days"
					name={`working-days`}
					url="/working-days"
					primaryKey="id"
					params={{
						limit: 400
					}}>
					{({ items, isFetched }) => {
						const weekends = () => {
							return items && items.filter(item => item.status === 0);
						};
						const eventsArr = weekends().reduce(
							(prev, curr) => [
								...prev,
								{
									title: "Дам олиш куни",
									date: time.to(curr.time, "YYYY-MM-DD"),
									timestamp: curr.time
								}
							],
							[]
						);

						return (
							<div className="weekends-calendar">
								<FullCalendar
									plugins={[dayGridPlugin, interactionPlugin]}
									initialView="dayGridMonth"
									dateClick={info => {
										const dayData = items.find(item => time.to(item.time, "YYYY-MM-DD") === info.dateStr);
										updateDay(dayData);
									}}
									events={eventsArr}
								/>

								{!isFetched && <Spinner className="md" />}
							</div>
						);
					}}
				</EntityContainer.All>
			</div>
		</div>
	);
};

export default Index;
