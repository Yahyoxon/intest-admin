import React from "react";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import Form from "./formItem";

const Create = ({ setCreateModal, menuId }) => {
	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="menuItems"
			name={`menuItems-${menuId}`}
			url="/menu-items"
			prependData={true}
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
			fields={[
				{
					name: "title",
					required: true
				},
				{
					name: "url",
					required: true
				},
				{
					name: "menu_id",
					value: Number(menuId)
				},
				{
					name: "status",
					value: true,
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
