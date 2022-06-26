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
			onError={() => {
				notification("Что-то пошло не так", { type: "danger" });
			}}
			fields={[
				{
					name: "title_uz",
					required: true
				},
				{
					name: "title_ru",
					required: true
				},
				{
					name: "title_en",
					required: true
				},

				{
					name: "status",
					value: 1,
					onSubmitValue: value => (value ? 1 : 0)
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
