import React, { useState } from "react";
import { get } from "lodash";
import qs from "query-string";
import moment from "moment";

import { Tabs, Header } from "components";
import EntityContainer from "modules/entity/containers";
import EntityForm from "modules/entity/forms";
import { useNotification, useAccess } from "hooks";
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
		const hasLangItem = translations.filter(({ lang }) => lang === langCode);

		if (hasLangItem.length > 0) {
			history.push(`/news/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`);
		}
	};

	const is_republic_isp_content_manager = useAccess({ roles: ["republic_isp_content_manager"] });
	const is_moderator = useAccess({ roles: ["moderator"] });
	const is_admin = useAccess({ roles: ["admin"] });

	return (
		<EntityContainer.One
			entity="post"
			name={`all-${lang}-${id}`}
			url={`/posts/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "file,categories,tags,reject",
				extra: {
					append: "translations,documents0",
					_l: tabLang
				}
			}}>
			{({ item, isFetched }) => {
				return (
					<div className="pageContainer">
						<Header backBtn={true} title={is_moderator ? "Проверить новость" : "Изменить новость"} hasSearch={false} hasButton={false} />

						{is_republic_isp_content_manager && (
							<Tabs
								items={config.API_LANGUAGES}
								onTabChange={value => {
									setTabLang(value);
									changeTab(value, Array.isArray(item.translations) ? item.translations : []);
								}}
								activeItem={tabLang}
								className={"mt-5 intro-y"}
							/>
						)}
						{get(item, 'reject.message') && (
							<div className="reject-block">
								<div className="reject-block__title">Причина отказа:</div>
								<div className="reject-block__comment">
									{get(item, 'reject.message') }
								</div>
							</div>
						)}


						<EntityForm.Main
							method={isOwn ? "put" : "post"}
							entity="post"
							name={`all-${tabLang}`}
							url={isOwn ? `/posts/${get(item, "id")}` : "/posts"}
							updateData={isOwn}
							prependData={!isOwn}
							primaryKey="id"
							normalizeData={data => data}
							id={id}
							onSuccess={data => {
								history.push(`/news?lang=${tabLang}`)
								notification(isOwn ? "Успешно обновлено" : "Успешно добавлено", {
									type: "success"
								});
							}}
							params={{
								include: "file,categories,tags",
								extra: {
									append: "translations,documents0",
									_l: tabLang
								}
							}}
							onError={(data, resetForm) => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "title",
									required: true,
									value: isOwn ? get(item, "title") : ""
								},
								{
									name: "description",
									value: isOwn ? get(item, "description") : ""
								},
								{
									name: "content",
									value: isOwn ? (get(item, "content") ? get(item, "content") : "") : ""
								},
								{
									name: "categories",
									type: "array",
									value: get(item, "categories", []),
									onSubmitValue: value => (value.length ? value.reduce((prev, curr) => [...prev, curr.id], []) : [])
								},
								{
									name: "tags",
									type: "array",
									value: get(item, "tags", []),
									onSubmitValue: value => (value.length ? value.reduce((prev, curr) => [...prev, curr.id], []) : [])
								},
								{
									name: "file_id",
									type: "array",
									value: get(item, "file") ? [get(item, "file")] : [],
									// onSubmitValue: value => (value ? value[0].id : null)
									onSubmitValue: value => (value.length ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : "")
								},
								{
									name: "status",
									value: get(item, "status") !== 0,
									onSubmitValue: value => is_admin ? (value ? 1 : 0) : (value ? 2 : 0)
								},
								{
									name: "published_at",
									required: true,
									value: get(item, "published_at"),
									onSubmitValue: value => (value ? moment(value).unix() : null)
								},
								{
									name: "lang_hash",
									value: get(item, "lang_hash")
								}
							]}>
							{({ isSubmitting, values, setFieldValue, errors }) => {
								return (
									<>
										<Form
											{...{
												isFetched,
												values,
												setFieldValue,
												isSubmitting,
												isUpdate: isOwn ? true : false,
												lang: tabLang,
												id
											}}
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
