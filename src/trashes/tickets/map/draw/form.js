import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { Field } from "formik";
import { get } from "lodash";
import qs from "query-string";

import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import { Fields, Button, Typography } from "components";

const DrawForm = ({ history, location, layer, layerEvent, setActiveLayer, setSelectedRoad }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { activeRegionID } = params;
	const userRegionID = useSelector(state => get(state, "auth.data.region_id"));

	const { notification } = useNotification();
	return (
		<EntityForm.Default
			method="post"
			url="/locations/new"
			params={{
				include: 'properties'
			}}
			onSuccess={(data, resetForm) => {
				resetForm();
				notification("Дорога была успешно создана", {
					type: "success"
				});
				if (get(data, "type_id") === 2) {
					setSelectedRoad(data);
					setActiveLayer(null);
				} else {
					history.push('/tickets')
				}
			}}
			onError={() => {
				notification("Что-то пошло не так", { type: "danger" });
			}}
			fields={[
				{
					name: "address",
					required: true
				},
				{
					name: "distance",

					value: get(layer, "distance")
				},
				{
					name: "latlngs",
					type: "array",
					value: get(layer, "latlngs")
						? get(layer, "latlngs").map(latlng => {
								return { x: latlng.lng, y: latlng.lat };
						  })
						: []
				},
				{
					name: "type",
					value: "MultiLineString"
				},
				{
					name: "region_id",
					value: activeRegionID ? activeRegionID : userRegionID
				},
				{
					name: "type_id",
					requried: true,
					value: 2
				}
			]}>
			{({ isSubmitting, values, setFieldValue, errors }) => {
				return (
					<>
						<Typography.Heading type={5} className="mt-3 mb-3 border-b">
							Добавить детали дороги
						</Typography.Heading>
						<Field component={Fields.Input} name="address" type="text" size="sm" placeholder="Введите название дороги" label="Название" />
						<Field
							component={Fields.Select}
							name="type_id"
							placeholder="Выберите тип дороги"
							label="Тип дороги"
							optionValue="value"
							optionLabel="label"
							options={[
								{ value: 1, label: "Главная дорога" },
								{ value: 2, label: "Билет" }
							]}
						/>
						<div className="d-flex align-center justify-content-end">
							<Button.Default type="secondary" buttonType="button" size="sm" onClick={() => setActiveLayer(null)} className="mr-5">
								Отменить
							</Button.Default>
							<Button.Default type="primary" buttonType="submit" size="sm" loading={isSubmitting}>
								Добавить
							</Button.Default>
						</div>
					</>
				);
			}}
		</EntityForm.Default>
	);
};

export default withRouter(DrawForm);
