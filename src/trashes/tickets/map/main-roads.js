import React from "react";
import { GeoJSON } from "react-leaflet";
import { get } from "lodash";

const MainRoads = ({ mainRoads, setSelectedRoad }) => {
	return (
		<div className="main-roads">
			{mainRoads &&
				mainRoads.length > 0 &&
				mainRoads.map((_object, index) => {
					return (
						<GeoJSON
							key={get(_object, "id") ?? index}
							data={_object}
							eventHandlers={{
								click: e => {
									if (_object) {
										setSelectedRoad(_object);
									}
								}
							}}
							style={{ color: "#286EF2" }}
						/>
					);
				})}
		</div>
	);
};

export default MainRoads;
