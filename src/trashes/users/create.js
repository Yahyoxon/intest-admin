import React from "react";
import EntityForm from "modules/entity/forms";
import Form from "./form";

import { Header } from "components";

const Create = ({ history }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="user"
			name="all"
			url="/user"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/users`);
			}}
			params={{
				include: "regions,district"
			}}
			fields={[
				{
					name: "name",
					required: true
				},
				{
					name: "full_name",
					required: true
				},
				{
					name: "middle_name",
					required: true
				},
				{
					name: "phone",
					required: true
				},
				{
					name: "email",
					required: true
				},
				{
					name: "region_id",
					type: "object",
					required: true,
					onSubmitValue: value => value && value.id
				},
				{
					name: "district_id",
					type: "object",
					onSubmitValue: value => value && value.id
				},

				{
					name: "login",
					required: true
				},
				{
					name: "photo_id",
					type: "object",
					onSubmitValue: value => (value ? String(value.id) : null)
				},
				{
					name: "role",
					required: true,
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}>
			{({ values, setFieldValue, isSubmitting }) => {
				return (
					<div className="pageContainer">
						<Header title="Создать пользователя" backBtn={true} hasSearch={false} hasButton={false} />
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting }} />
					</div>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
