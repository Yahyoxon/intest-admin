import React from "react";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import { MapContainer, TileLayer, ZoomControl, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import './style.scss'

import StartPointSuccess from "assets/images/icons/start-point-success.svg";
// const outerBounds = [
// 	[53.78906249999999, 46.9502622421856],
// 	[28.44335937499999, 80.35321610123823]
// ];

const FlyToThePoint = ({ lat, long }) => {
	const map = useMap();

	if (lat && long) {
		map.flyTo([lat, long], 17, { duration: 4 });
	}

	return (
		<Marker position={[lat, long]} className="marker-statement" icon={new Icon({ iconUrl: StartPointSuccess, iconSize: [60, 70], iconAnchor: [28, 55] })}>
			<Popup className="marker">
                <div>lat: {lat}</div>
                <div>long: {long}</div>
            </Popup>
		</Marker>
	);
};

const StatementMap = ({ history, location, data }) => {
	const lat = data ? Number(get(data, "lat")) : 41.3775;
	const long = data ? Number(get(data, "long")) : 64.5853;
	return (
		<MapContainer
			center={[41.3775, 64.5853]}
			zoom={5}
			minZoom={5}
			doubleClickZoom={false}
			// maxBounds={outerBounds}
			zoomControl={false}
			className="map-container-statement">
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			/>
			<ZoomControl position="topright" zoomOutTitle="Уменьшить" zoomInTitle="Увеличить" />
			{data && lat && long && <FlyToThePoint lat={lat} long={long} />}
		</MapContainer>
	);
};

export default withRouter(StatementMap);
