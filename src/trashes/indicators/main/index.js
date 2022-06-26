import React from "react";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import EntityContainer from "modules/entity/containers";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import Form from "./form";
import "../style.scss"

const MainTabComponent = ({ location, history, match, id }) => {
	const { notification } = useNotification();
	return (
		<EntityContainer.One
			entity="statistic"
			name={`all-${id}`}
			url={`/statistics/${id}`}
			id={id}
			params={{
				include: 'responsible,options'
			}}
			onError={error => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}>
			{({ item }) => {
				return (
					<EntityForm.Main
						method={id ? "put" : "post"}
						entity="indicator"
						name="all"
						url={id ? `/statistics/${id}` : "/statistics"}
						updateData={true}
						primaryKey="id"
						onSuccess={(data, resetForm) => {
							resetForm();
							history.push(`/indicators`);
						}}
						onError={error => {
							notification("Что-то пошло не так", {
								type: "danger"
							});
						}}
						fields={[
							{
								name: "title_ru",
								required: true,
								value: get(item, "title_ru") ? get(item, "title_ru") : ""
							},
							{
								name: "title_uz",
								required: true,
								value: get(item, "title_uz") ? get(item, "title_uz") : ""
							},
							{
								name: "title_en",
								required: true,
								value: get(item, "title_en") ? get(item, "title_en") : ''
							},
							{
								name: "description_ru",
								value: get(item, "description_ru") ? get(item, "description_ru") : ""
							},
							{
								name: "description_en",
								value: get(item, "description_en") ? get(item, "description_en") : ""
							},
							{
								name: "description_uz",
								value: get(item, "description_uz") ? get(item, "description_uz") : ""
							},
							{
								name: "type",
								required: true,
								value: get(item, "type") ? get(item, "type") : 1
							},
							{
								name: "chart_type",
								required: true,
								value: get(item, "chart_type") ? get(item, "chart_type") : 1
							},
							{
								name: "responsible_id",
								required: true,
								type: "object",
								value: get(item, "responsible") ? get(item, "responsible") : null,
								onSubmitValue: value => (value ? value.id : null)
							},
							{
								name: "status",
								value: !!get(item, "status"),
								onSubmitValue: value => (value ? 1 : 0)
							},
							{
								name: "is_home",
								value: !!get(item, "is_home"),
								onSubmitValue: value => (value ? 1 : 0)
							},
							{
								name: 'options',
								type: 'array',
								value: get(item, 'options', []).reduce((prev,curr) => [...prev, {uid:curr.id, value: curr.title}], []),
								onSubmitValue: value => value.reduce((prev,curr) => [...prev, curr.value], [])
							}
						]}>
						{({ values, setFieldValue, isSubmitting }) => {
							return <Form {...{ isFetched: true, values, setFieldValue, isSubmitting }} />;
						}}
					</EntityForm.Main>
				);
			}}
		</EntityContainer.One>
	);
};

export default withRouter(MainTabComponent);
