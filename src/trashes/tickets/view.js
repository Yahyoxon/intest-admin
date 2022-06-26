import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import { get } from "lodash";

import EntityActions from "modules/entity/actions";
import { Grid, Header, Board } from "components";
import { useNotification, useAccess } from "hooks";

import AcceptAction from "./actions/accept";
import RejectAction from "./actions/reject";
import MapForm from "./form";
import MapView from "./map";
import { regions } from "./helpers";

const MapPage = ({ location, history, match }) => {
	const dispatch = useDispatch();
	//eslint-disable-next-line
	const params = qs.parse(location.search);

	const isModerator = useAccess({ roles: ["moderator"] });
	// const isExecutor = useAccess({ roles: ["map_specialist"] });
	const { id } = match.params;

	const { notification } = useNotification();
	const [ticketDetails, setTicketDetails] = useState(null);
	const [ticketRoad, setTicketRoad] = useState();
	const [selectedRoad, setSelectedRoad] = useState(null);
	const [activeRegion, setActiveRegion] = useState({});

	const loadMapDetails = () => {
		dispatch(
			EntityActions.LoadDefault.request({
				url: `/properties/${id}`,
				params: {
					include: "contractor,scheduler,location",
					extra: {
						append: "gallery0"
					}
				},
				cb: {
					success: data => {
						setTicketDetails(data);
						const active_region = regions.find(region => region.id === get(data, "location.region_id"));
						setActiveRegion(active_region);
						setTicketRoad(get(data, "location"));
					},
					error: error => {
						notification(get(error, "message", "Something went wrong"), { type: "danger" });
					}
				}
			})
		);
	};

	useEffect(() => {
		if (id) {
			loadMapDetails(id);
		}
		//eslint-disable-next-line
	}, [id]);

	return (
		<div className="pageContainer">
			<Header
				title={`Билет${id ? "-" + id : ""}`}
				backBtn={true}
				hasButton={false}
				hasSearch={false}
				extraFilter={
					isModerator &&
					get(ticketDetails, "status") === 1 && (
						<div className="d-flex">
							<RejectAction id={id} />
							<AcceptAction id={id} />
						</div>
					)
				}
			/>
			<Board className="mt-5">
				<Grid.Row>
					<Grid.Column xs={12} xl={4} xxl={3}>
						<MapForm
							data={ticketDetails}
							{...{
								ticketRoad,
								setTicketRoad,
								selectedRoad,
								setSelectedRoad,
								activeRegion
							}}
						/>
					</Grid.Column>
					<Grid.Column xs={12} xl={8} xxl={9}>
						<MapView
							{...{
								selectedRoad,
								setSelectedRoad,
								ticketRoad,
								ticketDetails,
								setActiveRegion,
								activeRegion,
								ticketID: id
							}}
						/>
					</Grid.Column>
				</Grid.Row>
			</Board>
		</div>
	);
};

export default withRouter(MapPage);
