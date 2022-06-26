import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { get } from "lodash";
// import qs from "query-string";

import { MapContainer, TileLayer, GeoJSON, MapConsumer, ZoomControl } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";

import EntityActions from "modules/entity/actions";
import { useNotification, useAccess } from "hooks";
import { Button } from "components";

import { regions, FlyToTicketRoad, FlyToActiveRegion } from "../helpers";
import ProgressBar from "./progress-bar";
import EditControl from "./draw";
import TicketRoad from "./ticket-road";
import MainRoads from "./main-roads";
import Regions from "./regions";

import { ReactComponent as SpinnerIcon } from "assets/images/spinner.svg";
import "./style.scss";

const outerBounds = [
	[53.78906249999999, 46.9502622421856],
	[28.44335937499999, 80.35321610123823]
];

const MapPage = ({ history, location, selectedRoad, setSelectedRoad, ticketRoad, activeRegion, setActiveRegion, ticketDetails, ticketID }) => {
	const dispatch = useDispatch();
	const { notification } = useNotification();

	const region_id = useSelector(state => get(state, "auth.data.region_id"));
	const isRegionIspMap = useAccess({ roles: ["region_isp_map"] });
	const isHeadToSeeFullMap = useAccess({ roles: ["moderator", "republic_isp_map", "admin"] });
	const canDrawMap = useAccess({ roles: ["region_isp_map", "republic_isp_map"] });

	const [mainRoads, setMainRoads] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const [showMainRoads, setShowMainRoads] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(null);

	const loadMainRoads = id => {
		setLoading(true);
		dispatch(
			EntityActions.LoadDefault.request({
				url: "/locations",
				params: {
					extra: {
						region_id: id
					}
				},
				cb: {
					success: data => {
						setMainRoads(data);
						const active_region = regions.find(region => region.id === id);
						setActiveRegion(active_region);
						setLoading(false);
					},
					error: error => {
						notification(get(error, "message", "Something went wrong"), { type: "danger" });
						setLoading(false);
					}
				},
				onDownloadProgress: progressEvent => {
					const total = Number(progressEvent.srcElement.getResponseHeader("Length"));
					setDownloadProgress({ total: total, loaded: get(progressEvent, "loaded") });
				}
			})
		);
	};

	useEffect(() => {
		if (isRegionIspMap && !ticketID) {
			setShowMainRoads(true);
			loadMainRoads(region_id);
		}
		//eslint-disable-next-line
	}, [ticketID]);

	useEffect(() => {
		if (showMainRoads && ticketID) {
			if (isRegionIspMap) {
				loadMainRoads(region_id);
			} else if (isHeadToSeeFullMap) {
				loadMainRoads(activeRegion.id);
			}
		}

		//eslint-disable-next-line
	}, [showMainRoads, ticketID, isRegionIspMap]);

	useEffect(() => {
		if (isHeadToSeeFullMap && activeRegion.id && !ticketID) {
			loadMainRoads(activeRegion.id);
		}
		//eslint-disable-next-line
	}, [activeRegion.id, ticketID]);

	return (
		<div className="map-wrapper">
			<MapContainer
				center={[41.3775, 64.5853]}
				zoom={6}
				minZoom={6}
				doubleClickZoom={false}
				maxBounds={outerBounds}
				zoomControl={false}
				className="map-container">
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				<ZoomControl position="topright" zoomOutTitle="Уменьшить" zoomInTitle="Увеличить" />

				<MapConsumer>
					{map => {
						FlyToTicketRoad(ticketRoad, 12);
						FlyToActiveRegion(activeRegion, get(activeRegion, "zoom"));
						return (
							<>
								<Regions {...{ activeRegion, setActiveRegion, setShowMainRoads }} />
								{showMainRoads && <MainRoads {...{ mainRoads, setSelectedRoad }} />}

								{selectedRoad ? <GeoJSON key={get(selectedRoad, "id")} data={selectedRoad} style={{ color: "#7200CC", weight: 5 }} /> : null}
								{activeRegion && <GeoJSON data={activeRegion.borderPoints} className={`active-region-border`} />}
								{ticketRoad && <TicketRoad key={get(ticketRoad, "id")} {...{ ticketRoad, mainRoads, ticketDetails }} />}
							</>
						);
					}}
				</MapConsumer>
				{canDrawMap && <EditControl {...{ activeRegion, setSelectedRoad }} />}
				<div className="map-actions">
					<Button.Default
						type="primary"
						onClick={() => {
							setShowMainRoads(!showMainRoads);
							setDownloadProgress(null);
						}}>
						{showMainRoads ? "Скрыть основные дороги" : "Показать основные дороги"}
					</Button.Default>
				</div>
			</MapContainer>
			{isLoading && <ProgressBar downloadProgress={downloadProgress} />}
			{isLoading && (
				<div className="map-spinner">
					<SpinnerIcon />
				</div>
			)}
		</div>
	);
};

export default withRouter(MapPage);
