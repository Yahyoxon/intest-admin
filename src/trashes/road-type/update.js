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
					entity="road-type"
					name="all"
					url={`/road-types/${get(selected, "id")}`}
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
							name: "name_uz",
							required: true,
							value: get(selected, "name_uz")
						},
						{
							name: "name_ru",
							required: true,
							value: get(selected, "name_ru")
						},
						{
							name: "name_en",
							required: true,
							value: get(selected, "name_en")
						},

						// {
						// 	name: "status",
						// 	value: get(selected, "status") === 1,
						// 	onSubmitValue: value => (value ? 1 : 0)
						// }
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
