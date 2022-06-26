import React from "react";
import { get } from "lodash";

import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";

import Form from "./form";

const Update = ({ selected, setUpdateModal }) => {
	const { notification } = useNotification();
	return (
		<>
			{selected && (
				<EntityForm.Main
					method="put"
					entity="documents"
					name="all"
					url={`/documents/${get(selected, "id")}`}
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
						notification("Что-то пошло не так", {
							type: "danger"
						});
					}}
					params={{
						include: "file"
					}}
					fields={[
						{
							name: "name_uz",
							value: get(selected, "name_uz") ? get(selected, "name_uz") : '',
							required: true
						},
						{
							name: "file_id",
							type: "array",
							value: get(selected, "file") ? [get(selected, "file")] : [],
							onSubmitValue: value => value ? value[0].id : []
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
