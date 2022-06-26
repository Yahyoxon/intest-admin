import React from "react";

import { Fields, Grid, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

const Form = ({ isUpdate, isSubmitting, setCreateModal, setUpdateModal, setFieldValue }) => {
	const { t } = useTranslation();

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
				<Field component={Fields.Input} name="name_uz" type="text" rows={5} placeholder="Введите название" label="Название(uz)" />
				<Field component={Fields.Input} name="name_ru" type="text" rows={5} placeholder="Введите название" label="Название(ru)" />
				<Field component={Fields.Input} name="name_en" type="text" rows={5} placeholder="Введите название" label="Название(en)" />
				<Field
					component={Fields.Switch}
					name="status"
					label="Статус"
					onChange={e => {
						setFieldValue("status", e.target.checked);
					}}
				/>
				<div className="flex justify-end">
					<Button.Default type="secondary" buttonType="button" onClick={handleCancel} className="mt-5">
						{t("Отменить")}
					</Button.Default>
					<Button.Default type="blue" buttonType="submit" loading={isSubmitting} className="mt-5 ml-2">
						{isUpdate ? t("Сохранить") : t("Добавить")}
					</Button.Default>
				</div>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
