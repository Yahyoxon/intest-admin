import React from "react";
import { GeoJSON } from "react-leaflet";

import OutsideOfUzbekistan from "../geojson/outside-of-uzbekistan.json";
import { regions } from "../helpers";

const Regions = ({ activeRegion, setActiveRegion, setShowMainRoads }) => {
	const filteredRegions = activeRegion.id ? regions.filter(region => region.id !== activeRegion.id) : [];
	return (
		<div className="map-regions">
			<GeoJSON data={OutsideOfUzbekistan} className="outside-of-uzbekistan" />
			{activeRegion.id &&
				filteredRegions.map((region, index) => {
					return (
						<GeoJSON
							key={region.id ?? index}
							data={region.borderPoints}
							eventHandlers={{
								click: e => {
									if (region) {
										setActiveRegion(region);
                                        setShowMainRoads(true)
									}
									e.target.setStyle(e => {});
								}
							}}
							style={{
								color: "#999",
								fillColor: "rgba(0,0,0,0.8)"
							}}
						/>
					);
				})}
			{!activeRegion.id &&
				regions.map((region, index) => {
					return (
						<GeoJSON
							key={region.id ?? index}
							data={region.borderPoints}
							eventHandlers={{
								click: e => {
									if (region) {
										setActiveRegion(region);
                                        setShowMainRoads(true)
									}
								}
							}}
							style={{
								color: "#999",
								fillColor: "transparent"
							}}
						/>
					);
				})}
		</div>
	);
};

export default Regions;
