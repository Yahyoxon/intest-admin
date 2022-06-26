import React from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { useDispatch } from "react-redux";
import { PageContainer } from "components";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import Actions from "store/actions";
import Form from "./components/form";

const Update = ({ location, history, match }) => {
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const { t } = useTranslation();
	const { id } = match.params;

	const updatePost = data => {
		dispatch(
			Actions.entities.Update.success({
				entity: "faq",
				entityId: id,
				data
			})
		);
	};

	return (
		<EntityContainer.One
			entity="faq"
			name={`all-${id}`}
			url={`/faq/${id}`}
			primaryKey="id"
			id={Number(id)}
			params={{
				include: 'categories'
			}}
		>
			{({ item, isFetched }) => {

				return (
					<EntityForm.Main
						method="put"
						entity="faq"
						name="all"
						url={`/faq/${id}`}
						primaryKey="id"
						normalizeData={data => data}
						id={Number(id)}
						updateData={true}
						params={{
							include: 'categories'
						}}
						onSuccess={(data) => {
							notification("Успешно обновлено", { type: "success" });
							updatePost(data);
						}}
						onError={(data, resetForm) => {
							resetForm();
							notification("Что-то пошло не так", {
								type: "danger"
							});
						}}
						fields={[
							{
								name: "title_uz",
								value: get(item, "title_uz")
							},
							{
								name: "title_ru",
								required: true,
								value: get(item, "title_ru")
							},
							{
								name: "title_en",
								value: get(item, "title_en")
							},
							{
								name: "description_uz",
								value: get(item, "description_uz")
							},
							{
								name: "description_ru",
								required: true,
								value: get(item, "description_ru")
							},
							{
								name: "description_en",
								value: get(item, "description_en")
							},
							{
								name: "sort",
								value: get(item, "sort")
							},
							{
								name: "categories",
								required: true,
								type: "array",
								value: get(item, "categories"),
								onSubmitValue: value => value ? value.reduce((prev, curr) => [...prev, curr.id], []) : []
							}
						]}
					>
						{({ isSubmitting, values, setFieldValue }) => {
							return (
								<PageContainer
									isLoading={!isFetched}
									pageTitle={<>{t("Изменить часто задаваемый вопрос")}</>}
								>
									<Form
										{...{
											isFetched,
											values,
											setFieldValue,
											isSubmitting,
											isUpdate: true
										}}
									/>
								</PageContainer>
							);
						}}
					</EntityForm.Main>

				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
