import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { get, isEmpty } from "lodash";

import { PageContainer } from "components";
import EntityForm from "modules/entity/forms";
import Actions from "store/actions";
import { useNotification } from "hooks";

import Form from "./form";

const ProfilePage = ({ history }) => {
	const { notification } = useNotification();
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.data)

	return (
		<EntityForm.Default
			method="put"
			url={`/user/update-admin`}
			params={{
				include: "photo"
			}}
			onSuccess={data => {
				notification("Успешно обновлено", {
					type: "success"
				});
				dispatch(Actions.auth.GetMe.success({ data: data }));
			}}
			onError={error => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			fields={[
				{
					name: "full_name",
					value: get(user, "full_name", ""),
					required: true
				},
				{
					name: "name",
					value: get(user, "name", ""),
					required: true
				},
				{
					name: "photo_id",
					type: "array",
					value: get(user, "photo") ? get(user, "photo") : [],
					onSubmitValue: value => (isEmpty(value) ? null : String(value.id))
				}
			]}>
			{({ values, isSubmitting, setFieldValue }) => (
				<PageContainer backBtn={false}>
					<Form {...{ values, isSubmitting, setFieldValue }} />
				</PageContainer>
			)}
		</EntityForm.Default>
	);
};

export default ProfilePage;
