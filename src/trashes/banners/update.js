import React, { useState } from "react";
import { get } from "lodash";
import qs from "query-string";

import EntityContainer from "modules/entity/containers";
import EntityForm from "modules/entity/forms";
import { Header, Tabs } from "components";
import { useNotification } from "hooks";
import config from "config";
import Form from "./form";

const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const query = qs.parse(location.search);
	const { lang } = query;
	const { id } = match.params;

	const [tabLang, setTabLang] = useState(lang);
	const isOwn = lang === tabLang;

	const changeTab = (langCode, translations) => {
		setTabLang(langCode);
		const hasLangItem = translations.filter(({ lang }) => lang === langCode);

		if (hasLangItem.length > 0) {
			history.push(`/banners/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`);
		}
	};

	return (
		<EntityContainer.One
			entity="banners"
			name={`banners-${id}`}
			url={`/banners/${id}`}
			primaryKey="id"
			id={id}
		>
			{({ item, isFetched }) => {
				return (
					<div className="pageContainer">
						<Header backBtn={true} title="Изменить новость" hasButton={false} hasSearch={false} />

						<Tabs
							items={config.API_LANGUAGES}
							onTabChange={value => {
								setTabLang(value);
								changeTab(value, Array.isArray(item.translations) ? item.translations : []);
							}}
							activeItem={tabLang}
							className={"mt-5 intro-y"}
						/>
						<EntityForm.Main
							method={isOwn ? "put" : "post"}
							entity="banners"
							name={`all-${tabLang}`}
							url={isOwn ? `/banners/${get(item, "id")}` : "/banners"}
							primaryKey="id"
							normalizeData={data => data}
							onSuccess={data => {
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/banners?lang=${tabLang}`);
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
									value: isOwn ? get(item, "title") : "",
									max: 200
								},
								{
									name: "button_text",
									value: isOwn ? get(item, "button_text") : "",
									max: 100
								},
								{
									name: "content",
									required: true,
									value: isOwn ? get(item, "content") : "",
									max: 150
								},
								{
									name: "link",
									required: true,
									value: isOwn ? get(item, "link") : ""
								},
								{
									name: "sort",
									required: true,
									value: isOwn ? get(item, "sort") : ""
								},
								{
									name: "file_id",
									type: "array",
									value: get(item, "file") ? [get(item, "file")] : [],
									onSubmitValue: value => value.length ? value[0].id : ''
								},
								{
									name: "status",
									value: get(item, "status") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "lang_hash",
									value: get(item, "lang_hash")
								}
							]}
							params={{
								extra: {
									_l: tabLang
								}
							}}>
							{({ isSubmitting, values, setFieldValue }) => {
								return (
									<>
										<Form
											{...{
												isFetched,
												values,
												setFieldValue,
												isSubmitting,
												isUpdate: true
											}}
											lang={tabLang}
										/>
									</>
								);
							}}
						</EntityForm.Main>
					</div>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
