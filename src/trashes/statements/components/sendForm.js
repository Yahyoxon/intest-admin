import React from "react";

import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import { get } from "lodash";
import { Field } from "formik";
import { Button, Fields } from "components";

const Create = ({ showSendModal, id, sendModal }) => {
	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="feedback"
			name={`all-${id}`}
			url={`/feedback/approve/${id}`}
			updateData={true}
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showSendModal(false);
				notification("Успешно отправлено", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			params={{
				include: "results"
			}}
			fields={[
				{
					name: "text",
					required: true
				},
				{
					name: "files",
					type: "array",
					value: [],
					onSubmitValue: value => (value.length > 0 ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : "")
				}
			]}>
			{({ isSubmitting, setFieldValue, values }) => {
				return (
					<div>
						<Field component={Fields.Textarea} name="text" placeholder="Введите резултать" />

						{sendModal && (
							<Field
								component={Fields.FileUpload}
								name="files"
								label="Загрузите файлы"
								items={get(values, "files")}
								onChangeHandler={data => {
									setFieldValue("files", data);
								}}
								multiple={false}
								isDoc={true}
								limit={3}
							/>
						)}

						<div className="flex justify-end">
							<Button.Default type="secondary" buttonType="button" onClick={() => showSendModal(false)} className="mt-5">
								Отменить
							</Button.Default>
							<Button.Default type="blue" buttonType="submit" loading={isSubmitting} className="mt-5 ml-2">
								Сохранить
							</Button.Default>
						</div>
					</div>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
