import React from "react";
import EntityForm from "modules/entity/forms";
import Form from "./components/form";

const Create = ({ history }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="feedback"
			name="all"
			url="/feedback"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/users`);
			}}
			fields={[
				{
					name: "name",
					required: true
				},
				{
					name: "region_id",
					required: true
				},
				{
					name: "",
					required: true
				},
				{
					name: "phone",
					required: true
				},
				{
					name: "login",
					required: true
				},
				{
					name: "password",
					required: true
				},
				{
					name: "photo_id",
					type: "object",
					onSubmitValue: value => (value ? String(value.id) : null)
				},
				{
					name: "role",
					type: "array",
					required: true,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.value], [])
				}
			]}>
			{({ values, setFieldValue, isSubmitting }) => {
				return (
					<div className="page-container">
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting }} />
					</div>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
