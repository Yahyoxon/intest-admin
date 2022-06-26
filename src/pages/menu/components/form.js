import React from "react";
import { useTranslation } from "react-i18next";
import { Field } from "formik";

import { Fields, Grid, Button } from "components";

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
				<Field component={Fields.Input} name="title" type="text" label={t("Введите заголовок")} placeholder={t("Введите заголовок")} size="large" />
				<Field
					component={Fields.Input}
					name="alias"
					type="text"
					label={t("Введите алиас")}
					placeholder={t("Введите алиас")}
					size="large"
					disabled={isUpdate}
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
