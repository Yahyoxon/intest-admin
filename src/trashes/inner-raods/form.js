import React from "react";
import { get } from "lodash";

import { Fields, Grid, Button } from "components";
import { Field } from "formik";

const Form = ({ isUpdate, isSubmitting, setCreateModal, values, setFieldValue, setUpdateModal }) => {
	const handleCancel = () => {
		if (isUpdate) {
			setUpdateModal(false);
		} else {
			setCreateModal(false);
		}
	};

	return (
		<Grid.Row gutter={1}>
			<Grid.Column xs={12}>
				<Field
					component={Fields.FileUpload}
					name="file_id"
					label="Загрузите файлы"
					items={get(values, "file_id")}
					onChangeHandler={data => {
						setFieldValue("file_id", data);
					}}
					multiple={false}
					isDoc={true}
				/>
				{/* <Field
					component={Fields.Switch}
					name="status"
					label="Статус документа"
					onChange={() => {
						setFieldValue("status", !values.status);
					}}
				/> */}
				<div className="flex justify-end">
					<Button.Default type="secondary" buttonType="button" onClick={handleCancel} className="mt-5">
						Отменить
					</Button.Default>
					<Button.Default type="blue" buttonType="submit" loading={isSubmitting} className="mt-5 ml-2">
						{isUpdate ? "Сохранить" : "Добавить"}
					</Button.Default>
				</div>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
