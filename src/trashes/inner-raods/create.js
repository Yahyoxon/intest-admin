import React from "react";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import Form from "./form";
import { storage } from "services";

const Create = ({ setCreateModal, setSuccessModal, successModal }) => {
	const { notification } = useNotification();
	return (
		<EntityForm.Default
			method="post"
			url="/inner-roads/import"
			onSuccess={(data, resetForm) => {
				resetForm();
				setSuccessModal(!successModal);
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
					name: "file_id",
					type: "array",
					value: [],
					required: true,
					onSubmitValue: value => value && value[0].id
				},
				{
					name: "_l",
					value: storage.get("lang")
				}
				// {
				// 	name: "status",
				// 	value: true,
				// 	onSubmitValue: value => (value ? 1 : 0)
				// }
			]}>
			{({ isSubmitting, values, setFieldValue, errors }) => {
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
		</EntityForm.Default>
	);
};

export default Create;
