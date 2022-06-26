import React, { useState } from "react";
import { useSelector } from "react-redux";
import { get } from "lodash";
import qs from "query-string";

import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Header, Tab } from "components";
import { useNotification } from "hooks";
import config from "config";

import Form from "./form";

const Update = ({ location, history, match }) => {
	const langCode = useSelector(state => state.system.currentLangCode);
	const { notification } = useNotification();
	const { id } = match.params;

	const { lang } = qs.parse(location.search);
	const [tabLang, setTabLang] = useState(lang || langCode);

	const isOwn = lang === tabLang;

	const changeTab = (langCode, translations) => {
		const hasLangItem = translations.filter(({ lang }) => lang === langCode);

		if (hasLangItem.length > 0) {
			history.push(`/settings/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`);
		}
	};
	return (
		<EntityContainer.One
			entity="settings"
			name={`all-${lang}-${id}`}
			url={`/settings/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "file",
				extra: {
					append: "translations",
					_l: tabLang
				}
			}}>
			{({ item, isFetched }) => {
				return (
					<EntityForm.Main
						method={isOwn ? "put" : "post"}
						entity="settings"
						name={`all${isOwn ? `-${lang}` : `-${tabLang}`}`}
						url={isOwn ? `/settings/${get(item, "id")}` : "/settings"}
						updateData={isOwn}
						prependData={!isOwn}
						primaryKey="id"
						normalizeData={data => data}
						id={id}
						params={{
							include: "file",
							extra: {
								append: "translations",
								_l: tabLang
							}
						}}
						onSuccess={() => {
							notification(isOwn ? "Успешно обновлено" : "Успешно добавлено", {
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
								name: "name",
								value: isOwn ? get(item, "name") : "",
								required: true
							},
							{
								name: "value",
								value: isOwn ? get(item, "value") : ""
							},
							{
								name: "link",
								value: isOwn ? get(item, "link") : ""
							},
							{
								name: "slug",
								value: isOwn ? get(item, "slug") : "",
								onSubmitValue: value => (value ? value : null)
							},
							{
								name: "alias",
								value: get(item, "alias") ? get(item, "alias") : ""
							},
							{
								name: "sort",
								type: "number",
								value: get(item, "sort") ? get(item, "sort") : ""
							},
							{
								name: "file_id",
								type: "array",
								value: get(item, "file") ? [get(item, "file")] : [],
								onSubmitValue: value => (value && value.length > 0 ? value[0].id : [])
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
						]}>
						{({ isSubmitting, values, setFieldValue }) => {
							return (
								<div className="pageContainer">
									<Header title="Изменить сеты" hasSearch={false} hasButton={false} />
									<Tab
										items={config.API_LANGUAGES}
										onChange={value => {
											setTabLang(value.code);
											changeTab(value.code, item.translations);
										}}
										activeTab={tabLang}
										className={"mt-5 mb-5 intro-y"}
									/>
									<Form
										{...{
											isFetched,
											values,
											setFieldValue,
											isSubmitting,
											isUpdate: isOwn ? true : false
										}}
									/>
								</div>
							);
						}}
					</EntityForm.Main>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
