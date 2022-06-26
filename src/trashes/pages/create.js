import React from "react";
import EntityForm from "modules/entity/forms";
import { Header } from "components";
import Form from "./components/form";
import { useAccess, useNotification } from "hooks";
import qs from "query-string";

const Create = ({ location, history }) => {
	const { notification } = useNotification();
	const query = qs.parse(location.search);
	const { lang } = query;
	const is_admin = useAccess({ roles: ["admin"] });

	return (
		<EntityForm.Main
			method="post"
			entity="pages"
			name={`pages-${lang}`}
			url="/pages"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/pages/update/${data.id}?lang=${lang}`);
				notification("Успешно добавлено", {
					type: "success"
				});
			}}
			params={{
				extra: {
					_l: lang,
					append: "translations"
				}
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			fields={[
				{
					name: "title",
					required: true
				},
				{
					name: "description",
					type: "string"
				},
				{
					name: "slug"
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => is_admin ? (value ? 1 : 0) : (value ? 2 : 0)
				},
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<div className="pageContainer">
						<Header title="Добавить страницы" backBtn={true} hasSearch={false} hasButton={false} />
						<Form
							{...{
								isFetched: true,
								values,
								isUpdate: false,
								setFieldValue,
								isSubmitting
							}}
						/>
					</div>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
