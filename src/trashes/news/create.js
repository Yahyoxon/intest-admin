import React from "react";
import qs from "query-string";
import moment from "moment";

import EntityForm from "modules/entity/forms";
import { Header } from "components";
import { useAccess, useNotification } from "hooks";
import Form from "./form";

const Create = ({ location, history }) => {
	const { lang } = qs.parse(location.search);
	const { notification } = useNotification();
	const is_admin = useAccess({ roles: ["admin"] });

	return (
		<EntityForm.Main
			method="post"
			entity="post"
			name={`all-${lang}`}
			url="/posts"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/news/update/${data.id}?lang=${lang}`);
				notification("Успешно добавлено", {
					type: "success"
				});
			}}
			params={{
				include: "file,categories,tags",
				extra: {
					_l: lang,
					append: "translations,documents0"
				}
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			fields={[
				{
					name: "title",
					required: true,
					value: ""
				},
				{
					name: "description",
					value: "",
					required: true
				},
				{
					name: "slug",
					value: ""
				},
				{
					name: "content",
					value: ""
				},
				{
					name: "file_id",
					type: "array",
					required: true,
					value: [],
					onSubmitValue: value => (value.length ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : "")
				},
				{
					name: "published_at",
					value: new Date(),
					onSubmitValue: value => (!!value ? moment(value).unix() : "")
				},
				{
					name: "tags",
					type: "array",
					onSubmitValue: values => (values ? values.reduce((prev, curr) => [...prev, curr.id], []) : [])
				},
				{
					name: "categories",
					type: "array",
					onSubmitValue: value => (value ? value.reduce((prev, curr) => [...prev, curr.id], []) : "")
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => is_admin ? (value ? 1 : 0) : (value ? 2 : 0)
				},
				{
					name: "top",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<div className="pageContainer">
						<Header title="Добавить новости" hasSearch={false} hasButton={false} />
						<Form
							{...{
								isFetched: true,
								values,
								isUpdate: false,
								setFieldValue,
								isSubmitting,
								lang
							}}
						/>
					</div>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
