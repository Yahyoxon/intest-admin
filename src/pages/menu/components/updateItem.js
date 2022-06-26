import React from "react";
import { get } from "lodash";

import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import Form from "./formItem";

const Update = ({ menuId, selected, setUpdateModal }) => {
	const { notification } = useNotification();
	return (
		<>
			{selected && (
				<EntityForm.Main
					method="put"
					entity="menuItems"
					name={`menuItems-${menuId}`}
					url={`/menu-items/${selected.id}`}
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
					fields={[
						{
							name: "title",
							value: get(selected, "title")
						},
						{
							name: "url",
							required: true,
							value: get(selected, "url")
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
