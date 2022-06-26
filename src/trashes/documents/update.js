import React from "react";
import { get } from "lodash";

import EntityForm from "modules/entity/forms";
import { useAccess, useNotification } from "hooks";

import Form from "./form";

const Update = ({ selected, setUpdateModal }) => {
	const { notification } = useNotification();
	const is_admin = useAccess({ roles: ["admin"] });

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
						include: "file,logs.user"
					}}
					fields={[
						{
							name: "name_uz",
							value: get(selected, "name_uz") ? get(selected, "name_uz") : "",
							required: true
						},
						{
							name: "name_ru",
							value: get(selected, "name_ru") ? get(selected, "name_ru") : "",
							required: true
						},
						{
							name: "name_en",
							value: get(selected, "name_en") ? get(selected, "name_en") : "",
							required: true
						},
						{
							name: "file_id",
							type: "array",
							value: get(selected, "file") ? [get(selected, "file")] : [],
							onSubmitValue: value => (value ? value[0].id : [])
						},
						{
							name: "status",
							value: get(selected, "status") !== 0,
							onSubmitValue: value => is_admin ? (value ? 1 : 0) : (value ? 2 : 0)
						},
					]}>
					{({ isSubmitting, values, setFieldValue }) => {
						return (
							<>
								{get(selected, 'reject.message') && (
									<div className="reject-block" style={{marginTop: 0}}>
										<div className="reject-block__title">Причина отказа:</div>
										<div className="reject-block__comment">
											{get(selected, 'reject.message') }
										</div>
									</div>
								)}

								<Form
									{...{
										isUpdate: true,
										values,
										isSubmitting,
										setFieldValue,
										setUpdateModal,
										id: get(selected, "id")
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
