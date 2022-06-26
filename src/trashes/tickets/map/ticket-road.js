import React, { useState } from "react";
import { GeoJSON, Marker, Popup } from "react-leaflet";
import { get } from "lodash";

import { getEndPoint, getStartPoint, getTicketRoadType, getDistanceMarkerIcon } from "../helpers";

const TicketRoad = ({ ticketRoad, mainRoads, ticketDetails }) => {
	const [popupPosition, setPopupPosition] = useState(null);
	const ticketIndex = get(ticketRoad, 'id') + (get(ticketRoad, "to_distance") - get(ticketRoad, "from_distance"));
	return (
		<div className="ticket-road">
			<GeoJSON
				key={ticketIndex}
				data={ticketRoad}
				style={{ color: getTicketRoadType(get(ticketDetails, "type", null)).color, weight: 9 }}
				eventHandlers={{
					click: e => {
						if (ticketRoad) {
							setPopupPosition([get(e, "latlng.lat"), get(e, "latlng.lng")]);
						}
					}
				}}
			/>
			<Marker position={getStartPoint(ticketRoad)} icon={getDistanceMarkerIcon(get(ticketDetails, "type", null)).start} />
			<Marker position={getEndPoint(ticketRoad)} icon={getDistanceMarkerIcon(get(ticketDetails, "type", null)).end} />
			{popupPosition && <Popup position={popupPosition}>{Number(get(ticketRoad, 'to_distance')) - Number(get(ticketRoad, 'from_distance'))} km</Popup>}
		</div>
	);
};

export default TicketRoad;
