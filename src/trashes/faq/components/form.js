import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button, Ckeditor } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

const Form = ({ isUpdate, values, setFieldValue, isSubmitting }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5 p-5">
					<Field component={Fields.Input} name="title_uz" type="text" placeholder="Введите название" label="Название(Узбекский)" />
					<Field component={Ckeditor} name="description_uz" placeholder="Описание(Узбекский)" label="Введите описание" multi={true} />
					<Field component={Fields.Input} name="title_ru" type="text" placeholder="Введите название" label="Название(Русский)" />
					<Field component={Ckeditor} name="description_ru" placeholder="Описание(Русский)" label="Введите описание" multi={true} />
					<Field component={Fields.Input} name="title_en" type="text" placeholder="Введите название" label="Название(Английский)" />
					<Field component={Ckeditor} name="description_en" placeholder="Описание(Английский)" label="Введите описание" multi={true} />
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel
					className="mt-5 p-5"
					footer={
						<div className="flex justify-end">
							<Button.Default type="secondary" buttonType="button" onClick={() => history.goBack()}>
								{t("Отменить")}
							</Button.Default>
							<Button.Default type="blue" buttonType="submit" loading={isSubmitting} className="ml-2">
								{isUpdate ? t("Сохранить") : t("Добавить")}
							</Button.Default>
						</div>
					}>
					<Field
						component={Fields.AsyncSelect}
						name="categories"
						placeholder="Выберите категорию"
						label="Главный банк"
						isSearchable={true}
						isClearable={true}
						optionLabel={"name_uz"}
						isMulti={true}
						loadOptionsUrl="/categories"
						loadOptionsParams={() => {
							return {
								sort: "-id",
								extra: {
									type: 3
								}
							};
						}}
					/>
					<Field component={Fields.Input} name="sort" type="number" placeholder="Введите номер" label="Сорт" />
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
