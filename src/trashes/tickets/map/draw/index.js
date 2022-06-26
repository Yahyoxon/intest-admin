import React, { useState } from "react";
import { get } from "lodash";

import { FeatureGroup, Polyline, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
// import { Icon } from "leaflet";

// import markerIconPng from "leaflet/dist/images/marker-icon.png";

// const MarkerIcon = new Icon({ iconUrl: markerIconPng, iconSize: [20, 30], iconAnchor: [12, 41] });

import DrawForm from "./form";

const DrawComponent = ({ setSelectedRoad }) => {
	const [layers, setLayers] = useState([]);
	const [layerEvent, setLayerEvent] = useState(null);
	const [activeLayer, setActiveLayer] = useState(null);

	const onEdited = e => {
		const {
			layers: { _layers }
		} = e;

		Object.values(_layers).map(({ _latlngs, _leaflet_id }) =>
			setLayers(layers =>
				layers.map(l => {
					if (l.id === _leaflet_id) {
						return { ...l, index: l.index + 1, distance: `${convertObjToStr(_latlngs)}`, latlngs: _latlngs };
					} else {
						return l;
					}
				})
			)
		);
	};

	const onDeleted = e => {
		const {
			layers: { _layers }
		} = e;

		Object.values(_layers).map(({ editing, _leaflet_id }) => setLayers(layers => layers.filter(l => l.id !== _leaflet_id)));
	};

	const convertObjToStr = latlngs => {
		let mDistanse = 0;
		for (let i = 1; i < latlngs.length; i++) {
			mDistanse += latlngs[i].distanceTo(latlngs[i - 1]);
		}
		return (mDistanse / 1000).toFixed(1);
	};

	const onCreated = e => {
		const { layer, layerType } = e;
		const { _leaflet_id } = layer;

		setLayers(layers => [
			...layers,
			{
				id: _leaflet_id,
				index: _leaflet_id,
				type: layerType,
				distance: `${convertObjToStr(layer._latlngs)}`,
				latlngs: layer._latlngs
			}
		]);
	};

	return (
		<div className="draw-component">
			<FeatureGroup>
				<EditControl
					position="topright"
					onCreated={onCreated}
					onEdited={onEdited}
					onDeleted={onDeleted}
					draw={{
						circlemarker: false,
						circle: false,
						polygon: false,
						rectangle: false,
						polyline: {
							shapeOptions: {
								color: "green"
							},
							showLength: true
						},
						marker: false
					}}
				/>
			</FeatureGroup>
			{layers.length > 0 &&
				layers.map((layer, index) => {
					return (
						<Polyline
							key={get(layer, "index")}
							positions={get(layer, "latlngs")}
							color="red"
							eventHandlers={{
								dblclick: e => {
									setLayerEvent(e);
									setActiveLayer(layer);
								}
							}}
						/>
					);
				})}

			{activeLayer && (
				<Popup
					key={get(activeLayer, "index")}
					position={get(layerEvent, "latlng")}
					closeButton={false}>
					<DrawForm {...{ layer: activeLayer, layerEvent, setActiveLayer, setSelectedRoad }} />
				</Popup>
			)}
		</div>
	);
};

export default DrawComponent;
