import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import "./style.scss";
import { Fields, Grid, Panel, Upload, Button, Spinner } from "components";
import { helpers } from "services";

import { ReactComponent as Camera } from "assets/images/icons/camera.svg";
import DefaultUser from "assets/images/default-user-img.svg";

const Form = ({ setFieldValue, values, isUpdate = false, isSubmitting, history }) => {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);

	return (
		<Grid.Row gutter={10} gutterX={4} cols={12} className={"mb-10"}>
			<Grid.Column xxl={9}>
				<Grid.Row className={"mb-10"} cols={12}>
					<Grid.Column xl={8} xxl={8}>
						<div className="mt-5 px-0">
							<Panel className="py-4 px-4 shadow-none">
								<Grid.Row cols={12}>
									<Grid.Column xs={12} xxl={7}>
										<Field component={Fields.Input} name="name" type="text" placeholder="Введите ваше имя" label="Имя" />
									</Grid.Column>
								</Grid.Row>
								<Grid.Row cols={12}>
									<Grid.Column xs={12} xxl={7}>
										<Field component={Fields.Input} name="full_name" type="text" placeholder="Введите вашу фамилию" label="Фамилия" />
									</Grid.Column>
								</Grid.Row>
								<Grid.Row cols={12}>
									<Grid.Column xs={12} xxl={7}>
										<Field component={Fields.Input} name="middle_name" type="text" placeholder="Введите вашу отчеству" label="Отчество" />
									</Grid.Column>
								</Grid.Row>
								<Grid.Row cols={12}>
									<Grid.Column xs={12} xxl={7}>
										<Field component={Fields.InputMask} name="phone" placeholder="Введите ваш телефон" label="Телефон номер" />
									</Grid.Column>
								</Grid.Row>
								<Grid.Row cols={12}>
									<Grid.Column xs={12} xxl={7}>
										<Field component={Fields.Input} name="email" placeholder="Введите вашу почту" label="Почта" />
									</Grid.Column>
								</Grid.Row>
								<Grid.Row cols={12}>
									<Grid.Column xs={12} xxl={7}>
										<Field
											component={Fields.AsyncSelect}
											name={`region_id`}
											label="Область"
											placeholder="Укажите область"
											isSearchable={true}
											isClearable={true}
											loadOptionsUrl="/regions"
											optionLabel="name_ru"
											optionValue="id"
											loadOptionsParams={search => {
												return {
													extra: { name: search },
													sort: "-id"
												};
											}}
											onChange={() => {
												setFieldValue("district_id", null);
												setFieldValue("region_id", null);
											}}
										/>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row cols={12}>
									<Grid.Column xs={12} xxl={7}>
										<Field
											component={Fields.AsyncSelect}
											name={`district_id`}
											label="Район"
											isDisabled={!get(values, "region_id")}
											placeholder="Укажите Район"
											isSearchable={true}
											isClearable={true}
											loadOptionsUrl={`/districts`}
											optionLabel="name_ru"
											filterParams={{
												region_id: get(values, "region_id.id")
											}}
											loadOptionsParams={search => {
												return {
													extra: { name: search },
													sort: "-id"
												};
											}}
										/>
									</Grid.Column>
								</Grid.Row>
							</Panel>
							<div className="loginParol">
								<div className="px-9">
									<Grid.Row cols={12} className="pt-5">
										<Grid.Column xs={12} xxl={7}>
											<Field component={Fields.Input} name="login" type="text" placeholder="Введите логин" label="Имя пользователя" />
										</Grid.Column>
									</Grid.Row>
									<Grid.Row cols={12}>
										<Grid.Column xs={12} xxl={7}>
											<Field component={Fields.Input} name="password" type="password" placeholder="Введите пароль" label="Пароль" />
										</Grid.Column>
									</Grid.Row>
								</div>
							</div>
						</div>
					</Grid.Column>
					<Grid.Column xl={4} xxl={4}>
						<Panel className="mt-5 p-8">
							<div className="user__photo">
								<div className="user__photo--photo">
									<img src={get(values, "photo_id.thumbnails.small.src", DefaultUser)} alt="" />
									{loading && <Spinner />}
								</div>
								<Upload
									successCb={data => {
										setLoading(false);
										setFieldValue("photo_id", data);
									}}
									onLoad={(total, loaded, loading) => {
										setLoading(true);
									}}
									isDoc={false}>
									{({ file, loading }) => (
										<div className="user__photo--icon">
											<Camera />
										</div>
									)}
								</Upload>
							</div>
							<Field
								component={Fields.Select}
								name="role"
								label="Роль"
								placeholder="Выберите роль"
								options={helpers.userRoles}
								optionLabel={"name"}
								optionValue={"value"}
							/>

							<Field
								component={Fields.Switch}
								name="status"
								label="Активный статус"
								onChange={() => {
									setFieldValue("status", !values.status);
								}}
							/>
							<Button.Default loading={isSubmitting} type="primary" buttonType="submit" className="user__profile--button">
								{isUpdate ? t("Сохранить") : t("Добавить")}
							</Button.Default>
						</Panel>
					</Grid.Column>
				</Grid.Row>
			</Grid.Column>
			<Grid.Column xl={3}></Grid.Column>
		</Grid.Row>
	);
};

export default withRouter(Form);
