import React from "react";

import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import Form from "./components/form";

const Create = ({ setCreateModal, tabLang }) => {
	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="menus"
			name="all"
			url="/menus"
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
			fields={[{ name: "title", required: true }, { name: "alias", required: true }, { name: "type" }]}
			params={{
				extra: { _l: tabLang }
			}}>
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
