import React from "react";

import EntityForm from "modules/entity/forms";
import { useAccess, useNotification } from "hooks";

import Form from "./form";

const Create = ({ setCreateModal }) => {
	const { notification } = useNotification();
	const is_admin = useAccess({ roles: ["admin"] });

	return (
		<EntityForm.Main
			method="post"
			entity="documents"
			name="all"
			url="/documents"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				setCreateModal(false);
				notification("Успешно добавлено", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			params={{
				include: "file,logs.user"
			}}
			fields={[
				{
					name: "name_uz",
					required: true
				},
				{
					name: "name_ru",
					required: true
				},
				{
					name: "name_en",
					required: true
				},
				{
					name: "file_id",
					type: "array",
					value: [],
					onSubmitValue: value => value && value[0].id
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => is_admin ? (value ? 1 : 0) : (value ? 2 : 0)
				},
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<Form
							{...{
								isFetched: true,
								values,
								isSubmitting,
								setFieldValue,
								setCreateModal
							}}
						/>
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
