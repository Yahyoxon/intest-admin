import React from "react";
import EntityForm from "modules/entity/forms";
import Form from "./form";
import { useNotification } from "hooks";

const Create = ({ setCreateModal }) => {
	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="categories"
			name="all"
			url="/categories"
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
			onError={() => { notification("Что-то пошло не так", { type: "danger" })}}
			fields={[
				{
					name: "name_uz",
					required: true,
				},
				{
					name: "name_ru",
					required: true,
				},
				{
					name: "name_en",
					required: true,
				},
				{
					name: "status",
					value: 1,
					onSubmitValue: value => value ? 1 : 0
				},
				{
					name: "type",
					value: 3
				}
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
