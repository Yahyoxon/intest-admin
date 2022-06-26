import React from "react";
import { useDispatch } from "react-redux";
import { get } from "lodash";

import EntityContainer from "modules/entity/containers";
import EntityForm from "modules/entity/forms";
import Actions from "store/actions";
import { useNotification } from "hooks";
import { Header } from "components";

import Form from "./form";

const Update = ({ history, match }) => {
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const { id } = match.params;

	const UpdateUser = data => {
		dispatch(
			Actions.entities.Update.success({
				entity: "user",
				entityId: id,
				data
			})
		);
	};

	return (
		<EntityContainer.One
			entity="user"
			name={`user`}
			url={`/user/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "region,district"
			}}>
			{({ item, isFetched }) => {
				return (
					<div className="page-container">
						<EntityForm.Main
							method="put"
							entity="user"
							name="user"
							url={`/user/${id}`}
							primaryKey="id"
							normalizeData={data => data}
							id={id}
							onSuccess={data => {
								UpdateUser(data);
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push("/users");
							}}
							onError={error => {
								let message = get(error, "message");
								notification(message, {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "name",
									required: true,
									value: get(item, "name", "")
								},
								{
									name: "full_name",
									value: get(item, "full_name", "")
								},
								{
									name: "middle_name",
									value: get(item, "middle_name", "")
								},
								{
									name: "phone",
									required: true,
									value: get(item, "phone")
								},
								{
									name: "email",
									required: true,
									value: get(item, "email")
								},

								{
									name: "password",
									required: true,
									value: get(item, "password")
								},
								{
									name: "region_id",
									type: "object",
									value: get(item, "region", ""),
									onSubmitValue: value => value && value.id
								},
								{
									name: "district_id",
									type: "object",
									value: get(item, "district", ""),
									onSubmitValue: value => value && value.id
								},
								{
									name: "photo_id",
									type: "object",
									value: get(item, "photo", ""),
									onSubmitValue: value => (value ? String(value.id) : null)
								},
								{
									name: "login",
									value: get(item, "login") ? get(item, "login") : ""
								},
								{
									name: "role",
									required: true,
									value: get(item, "role"),
								},
								{
									name: "status",
									value: get(item, "status") ? get(item, "status") : 1,
									onSubmitValue: value => (value ? 1 : 0)
								}
							]}>
							{({ values, setFieldValue, isSubmitting }) => {
								return (
									<div className="pageContainer">
										<Header title="Редатирование пользователя" backBtn={true} hasSearch={false} hasButton={false} />
										<Form
											{...{
												isUpdate: true,
												isFetched,
												values,
												setFieldValue,
												isSubmitting,
												item
											}}
										/>
									</div>
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
