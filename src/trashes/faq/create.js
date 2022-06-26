import React from "react";
import EntityForm from "modules/entity/forms";
import { PageContainer } from "../../components";
import { useTranslation } from "react-i18next";
import Form from "./components/form";
import { useNotification } from "hooks";

const Create = ({ location, history }) => {
	const { t } = useTranslation();
	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="faq"
			name="all"
			url="/faq"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/faq`);
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
					name: "title_uz",
				},
				{
					name: "title_ru",
					required: true
				},
				{
					name: "title_en",
				},
				{
					name: "description_uz",
					type: 'string',
				},
				{
					name: "description_ru",
					type: 'string',
					required: true
				},
				{
					name: "description_en",
					type: 'string',
				},
				{
					name: "sort",
					required: true
				},
				{
					name: "categories",
					required: true,
					type: "array",
					onSubmitValue: value => value ? value.reduce((prev, curr) => [...prev, curr.id], []) : []
				},
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<PageContainer
						isLoading={false}
						pageTitle={<>{t("Создать часто задаваемый вопрос")}</>}
					>
						<Form
							{...{
								isFetched: true,
								values,
								setFieldValue,
								isSubmitting
							}}
						/>
					</PageContainer>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
