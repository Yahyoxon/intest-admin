import React from "react";
import Form from "./main/form";
import EntityForm from "../../modules/entity/forms";
import { useNotification } from "../../hooks";
import { Header } from "../../components";
import "./style.scss";

const Create = ({ history }) => {
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method={"post"}
			entity="indicator"
			name="all"
			url={"/statistics"}
			updateData={true}
			primaryKey="id"
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/indicators`);
			}}
			onError={error => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			fields={[
				{
					name: "title_ru",
					required: true
				},
				{
					name: "title_uz",
					required: true
				},
				{
					name: "title_en",
					required: true
				},
				{
					name: "description_ru"
				},
				{
					name: "description_en"
				},
				{
					name: "description_uz"
				},
				{
					name: "type",
					value: 1,
					required: true
				},
				{
					name: "chart_type",
					value: 1,
					required: true
				},
				{
					name: "responsible_id",
					required: true,
					type: "object",
					onSubmitValue: value => (value ? value.id : null)
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "is_home",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "options",
					type: "array",
					value: [
						{
							uid: "000D",
							value: ""
						}
					],
					onSubmitValue: value => value.reduce((prev, curr) => [...prev, curr.value], [])
				}
			]}>
			{({ values, setFieldValue, isSubmitting }) => {
				return (
					<div className="pageContainer">
						<Header title="Добавить показател" backBtn={true} hasSearch={false} hasButton={false} />
						<Form {...{ isCreate: true, isFetched: true, values, setFieldValue, isSubmitting }} />
					</div>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
