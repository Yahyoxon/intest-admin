import React from "react";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import { get } from "lodash";
import Form from "./form";

const Update = ({ selected, setUpdateModal }) => {
	const { notification } = useNotification();
	return (
		<>
			{selected && (
				<EntityForm.Main
					method="put"
					entity="categories"
					name="all"
					url={`/categories/${get(selected, "id")}`}
					primaryKey="id"
					updateData={true}
					normalizeData={data => data}
					id={get(selected, "id")}
					onSuccess={(data, resetForm) => {
						resetForm();
						setUpdateModal(false);
						notification("Успешно обновлено", {
							type: "success"
						});
					}}
					onError={() => {
						notification("Что-то пошло не так", { type: "danger" });
					}}
					fields={[
						{
							name: "title_uz",
							required: true,
							value: get(selected, "title_uz")
						},
						{
							name: "title_ru",
							required: true,
							value: get(selected, "title_ru")
						},
						{
							name: "title_en",
							required: true,
							value: get(selected, "title_en")
						},

						{
							name: "status",
							value: get(selected, "status") === 1,
							onSubmitValue: value => (value ? 1 : 0)
						}
					]}>
					{({ isSubmitting, values, setFieldValue }) => {
						return (
							<>
								<Form
									{...{
										isUpdate: true,
										values,
										isSubmitting,
										setFieldValue,
										setUpdateModal
									}}
								/>
							</>
						);
					}}
				</EntityForm.Main>
			)}
		</>
	);
};

export default Update;
