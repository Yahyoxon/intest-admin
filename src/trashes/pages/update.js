import React, { useState } from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Tab, Header } from "components";
import { useAccess } from "hooks";
import { get } from "lodash";
import Form from "./components/form";
import qs from "query-string";
import config from "config";

const Update = ({ location, history, match }) => {
	const { id } = match.params;
	const query = qs.parse(location.search);
	const { lang } = query;
	const [tabLang, setTabLang] = useState(lang);
	const [currentId, setCurrentId] = useState(id);

	const isOwn = lang === tabLang;

	const changeTab = (langCode, translations) => {
		const hasLangItem = translations.filter(({ lang }) => lang === langCode);

		if (hasLangItem.length > 0) {
			history.push(`/pages/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`);
			setCurrentId(hasLangItem[0].id);
		}
	};

	const is_admin = useAccess({ roles: ["admin"] });

	return (
		<EntityContainer.One
			entity="pages"
			name={`pages-${tabLang}`}
			url={`/pages/${currentId}`}
			primaryKey="id"
			id={currentId}
			params={{
				include: "reject",
				extra: {
					append: "translations",
					_l: tabLang
				}
			}}>
			{({ item, isFetched }) => {
				return (
					<EntityForm.Main
						method={isOwn ? "put" : "post"}
						entity="pages"
						name={`pages-${lang}`}
						url={isOwn ? `/pages/${get(item, "id")}` : "/pages"}
						primaryKey="id"
						normalizeData={data => data}
						onSuccess={data => {
							history.push(`/pages?lang=${tabLang}`);
						}}
						params={{
							include: "logs.user",
							extra: {
								append: "translations",
								_l: tabLang
							}
						}}
						onError={(data, resetForm) => {
							resetForm();
						}}
						fields={[
							{
								name: "title",
								value: isOwn ? get(item, "title") : "",
								required: true
							},
							{
								name: "description",
								required: true,
								value: isOwn ? get(item, "description") : ""
							},
							{
								name: "slug",
								value: get(item, "slug") ? get(item, "slug") : ""
							},
							{
								name: "lang_hash",
								value: get(item, "lang_hash")
							},
							{
								name: "status",
								value: get(item, "status") !== 0,
								onSubmitValue: value => (is_admin ? (value ? 1 : 0) : value ? 2 : 0)
							}
						]}>
						{({ isSubmitting, values, setFieldValue }) => {
							return (
								<div className="pageContainer">
									<Header backBtn={true} title="Изменыть страницы" hasButton={false} hasSearch={false} />
									<Tab
										items={config.API_LANGUAGES}
										onChange={value => {
											setTabLang(value.code);
											changeTab(value.code, item.translations);
										}}
										activeTab={tabLang}
										className={"mt-5 mb-5 intro-y"}
									/>
									{get(item, "reject.message") && (
										<div className="reject-block">
											<div className="reject-block__title">Причина отказа:</div>
											<div className="reject-block__comment">{get(item, "reject.message")}</div>
										</div>
									)}
									<Form
										{...{
											isFetched,
											values,
											setFieldValue,
											isSubmitting,
											isUpdate: true,
											lang: tabLang,
											id
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
