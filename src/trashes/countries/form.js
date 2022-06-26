import React from "react";

import { Fields, Grid, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

const Form = ({ isUpdate, isSubmitting, setCreateModal, setUpdateModal }) => {
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
				<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите названию" label="Название(узбекский)" />
				<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите названию" label="Название(русский)" />
				<Field component={Fields.Input} name="name_en" type="text" placeholder="Введите названию" label="Название(английский)" />

				<Field component={Fields.Input} name="code" type="text" placeholder="Введите код" label="Код" />

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
