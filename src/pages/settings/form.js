import React from "react";
import { useHistory } from "react-router";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

import { Fields, Grid, Panel, Button } from "components";

const Form = ({ isFetched, isUpdate, isSubmitting, setFieldValue, values }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"my-8"}>
			<Grid.Column xs={12} xl={6}>
				<Panel
					className="px-5 pt-5"
					borderColor="border-blue-100"
					footerBorder
					footer={
						<div className="flex justify-end">
							<Button.Default type="secondary" buttonType="button" onClick={() => history.goBack()}>
								{t("Отменить")}
							</Button.Default>
							<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="ml-2">
								{isUpdate ? t("Сохранить") : t("Добавить")}
							</Button.Default>
						</div>
					}>
					<Field component={Fields.Input} name="name" type="text" placeholder={t("Введите загаловок")} label={t("Заголовок")} size="large" />
					<Field
						component={Fields.Input}
						name="slug"
						type="text"
						placeholder={t("Введите слуг")}
						label={t("Слуг")}
						size="large"
						disabled={isUpdate}
					/>
					<Field component={Fields.Input} name="link" type="text" placeholder={t("Введите линк")} label={t("Линк")} size="large" />
					<Field component={Fields.Textarea} name="value" type="text" rows={5} label={t("Текст")} placeholder={t("Введите текст")} />
					<Grid.Row gutter={10} gutterX={4}>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.Input}
								name="alias"
								type="text"
								placeholder={t("Введите алиас")}
								label={t("Алиас")}
								size="large"
								disabled={isUpdate}
							/>
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field component={Fields.Input} name="sort" type="number" placeholder={t("Введите номер")} label={t("Cортировка")} size="large" />
						</Grid.Column>
					</Grid.Row>
					<Field component={Fields.UploadManager} name="file_id" isDoc={false} isMulti={false} label="Изображение заголовка" className="mt-3 mb-3" />
					<Field
						component={Fields.Switch}
						name="status"
						label="Статус"
						onChange={() => {
							setFieldValue("status", !values.status);
						}}
					/>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
