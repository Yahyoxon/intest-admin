import React from "react";
import qs from "query-string";
import { get } from "lodash";

import EntityForm from "modules/entity/forms";
import { Header } from "components";
import { useNotification } from "hooks";

import Form from "./form";

const Create = ({ history, location }) => {
	const query = qs.parse(location.search);
	const { lang } = query;

	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="banners"
			name={`all-${lang}`}
			url="/banners"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/banners/update/${get(data, "id")}?lang=${lang}`);
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
					name: "title",
					required: true,
					value: "",
					max: 150
				},
				{
					name: "content",
					required: true,
					value: "",
					max: 150
				},
				{
					name: "button_text",
					required: true,
					value: "",
					max: 100
				},
				{
					name: "link",
					value: "https://"
				},
				{
					name: "sort"
				},
				{
					name: "file_id",
					type: "array",
					value: [],
					onSubmitValue: value => value.length ? value[0].id : ''
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}
			params={{
				extra: {
					_l: lang
				}
			}}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<div className="pageContainer">
						<Header title="Создать баннеры" backBtn={true} hasButton={false} hasSearch={false} />

						<Form
							{...{
								isFetched: true,
								values,
								setFieldValue,
								isSubmitting
							}}
							lang={lang}
						/>
					</div>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
