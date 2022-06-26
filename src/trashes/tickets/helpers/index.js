import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { get } from "lodash";

import { Icon } from "leaflet";
import StartPointError from "assets/images/icons/start-point-error.svg";
import StartPointSuccess from "assets/images/icons/start-point-success.svg";
import StartPointPending from "assets/images/icons/start-point-pending.svg";
import StartPointDefault from "assets/images/icons/start-point-default.svg";
import EndPointError from "assets/images/icons/end-point-error.svg";
import EndPointSuccess from "assets/images/icons/end-point-success.svg";
import EndPointPending from "assets/images/icons/end-point-pending.svg";
import EndPointDefault from "assets/images/icons/end-point-default.svg";

import Andijan from "../geojson/andijan.json";
import Bukhara from "../geojson/bukhara.json";
import Fergana from "../geojson/fergana.json";
import Jizzakh from "../geojson/jizzakh.json";
import Karakalpakistan from "../geojson/karakalpakistan.json";
import Kashkadarya from "../geojson/kashkadarya.json";
import Khorezm from "../geojson/khorezm.json";
import Namangan from "../geojson/namangan.json";
import Navoi from "../geojson/navoi.json";
import Samarkand from "../geojson/samarkand.json";
import Surkhandarya from "../geojson/surkhandarya.json";
import Syrdarya from "../geojson/syrdarya.json";
// import TashkentCity from "../geojson/tashkent-city.json";
import TashkentRegion from "../geojson/tashkent-region.json";

export function getStartPoint(repairLocation) {
	const coordinates = repairLocation.geometry.coordinates;
	return [coordinates[0][0][1], coordinates[0][0][0]];
}

export function getEndPoint(repairLocation) {
	const coordinates = repairLocation.geometry.coordinates;
	const lastPath = coordinates[coordinates.length - 1];

	return [lastPath[lastPath.length - 1][1], lastPath[lastPath.length - 1][0]];
}

export function getTicketRoadType(type) {
	if (type === 1) {
		return {
			color: "#E8C512",
			label: "Планируемый"
		};
	} else if (type === 2) {
		return { color: "#1ECD01", label: "Отремонтированный" };
	} else if (type === 3) {
		return { color: "#E84A4A", label: "Ремонтируется" };
	} else
		return {
			color: "#DB00FF",
			label: "Не определено"
		};
}

export function getDistanceMarkerIcon(type) {
	if (type === 1) {
		return {
			start: new Icon({ iconUrl: StartPointPending, iconSize: [60, 70], iconAnchor: [24, 58] }),
			end: new Icon({ iconUrl: EndPointPending, iconSize: [60, 70], iconAnchor: [28, 58] })
		};
	} else if (type === 3) {
		return {
			start: new Icon({ iconUrl: StartPointError, iconSize: [60, 70], iconAnchor: [24, 58] }),
			end: new Icon({ iconUrl: EndPointError, iconSize: [60, 70], iconAnchor: [28, 58] })
		};
	} else if (type === 2) {
		return {
			start: new Icon({ iconUrl: StartPointSuccess, iconSize: [60, 70], iconAnchor: [24, 58] }),
			end: new Icon({ iconUrl: EndPointSuccess, iconSize: [60, 70], iconAnchor: [28, 58] })
		};
	} else
		return {
			start: new Icon({ iconUrl: StartPointDefault, iconSize: [60, 70], iconAnchor: [27, 58] }),
			end: new Icon({ iconUrl: EndPointDefault, iconSize: [60, 70], iconAnchor: [25, 56] })
		};
}

export const FlyToActiveRegion = (region, zoom) => {
	const map = useMap();
	useEffect(() => {
		if (region.id) {
			map.flyTo(get(region, "borderPoints.features[0].properties.center"), zoom, { duration: 3 });
		}
		//eslint-disable-next-line
	}, [region, zoom]);
};

export const FlyToTicketRoad = (ticketRoad, zoom) => {
	const map = useMap();
	useEffect(() => {
		if (ticketRoad) {
			map.flyTo([get(ticketRoad, "geometry.coordinates[0][0][1]"), get(ticketRoad, "geometry.coordinates[0][0][0]")], zoom, { duration: 3 });
		}
		//eslint-disable-next-line
	}, [ticketRoad, zoom]);
};

export const regions = [
	{
		id: 17,
		name_ru: "Кашкадарья",
		borderPoints: Kashkadarya,
		zoom: 9
	},
	{
		id: 16,
		name_ru: "Навои",
		borderPoints: Navoi,
		zoom: 7
	},
	{
		id: 15,
		name_ru: "Сырдарья",
		borderPoints: Syrdarya,
		zoom: 10
	},
	{
		id: 14,
		name_ru: "Хорезм",
		borderPoints: Khorezm,
		zoom: 9
	},
	{
		id: 13,
		name_ru: "Фергана",
		borderPoints: Fergana,
		zoom: 10
	},
	{
		id: 12,
		name_ru: "Сурхандарья",
		borderPoints: Surkhandarya,
		zoom: 9
	},
	{
		id: 11,
		name_ru: "Каракалпакстан",
		borderPoints: Karakalpakistan,
		zoom: 7
	},
	{
		id: 10,
		name_ru: "Андижан",
		borderPoints: Andijan,
		zoom: 10
	},
	{
		id: 9,
		name_ru: "Джизак",
		borderPoints: Jizzakh,
		zoom: 9
	},
	// {
	// 	id: 8,
	// 	name_ru: "Город Ташкент",
	// 	borderPoints: TashkentCity
	// },
	{
		id: 7,
		name_ru: "Наманган",
		borderPoints: Namangan,
		zoom: 9
	},
	{
		id: 6,
		name_ru: "Самарканд",
		borderPoints: Samarkand,
		zoom: 9
	},
	{
		id: 5,
		name_ru: "Ташкентская область",
		borderPoints: TashkentRegion,
		zoom: 8
	},
	{
		id: 4,
		name_ru: "Бухара",
		borderPoints: Bukhara,
		zoom: 8
	}
];
