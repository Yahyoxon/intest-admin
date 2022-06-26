import React from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import EntityForm from "modules/entity/forms";
import { Header } from "components";
import { useNotification } from "hooks";

import Form from "./form";

const Create = ({ location, history }) => {
	const { lang } = qs.parse(location.search);
	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="settings"
			name={`all-${lang}`}
			url="/settings"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			params={{
				include: "file",
				extra: {
					_l: lang,
					append: "translations"
				}
			}}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/settings/update/${data.id}?lang=${lang}`);
				notification("Успешно добавлено", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			fields={[
				{
					name: "name",
					required: true
				},
				{
					name: "value",
					value: ""
				},
				{
					name: "link",
					value: ""
				},
				{
					name: "slug",
					value: "",
					onSubmitValue: value => (value ? value : null)
				},
				{
					name: "alias"
				},
				{
					name: "sort",
					type: "number"
				},
				{
					name: "file_id",
					type: "array",
					required: true,
					value: [],
					onSubmitValue: value => (value && value.length > 0 ? value[0].id : [])
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<div className="pageContainer">
						<Header title="Добавить сеты" hasSearch={false} hasButton={false} />
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting }} />
					</div>
				);
			}}
		</EntityForm.Main>
	);
};

export default withRouter(Create);
