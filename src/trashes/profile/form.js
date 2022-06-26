import React, { useState } from "react";
import { get } from "lodash";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

import { Fields, Grid, Panel, Button, Upload, Spinner } from "components";
import { ReactComponent as Camera } from "assets/images/icons/camera.svg";
import DefaultUser from "assets/images/default-user-img.svg";

const MainForm = ({ values, isSubmitting, setFieldValue }) => {
	const [loading, setLoading] = useState(false);
	const { t } = useTranslation();
	return (
		<Grid.Row gutter={10} gutterX={4} cols={12}>
			<Grid.Column xs={12} lg={6}>
				<Panel
					borderColor="border-blue-100"
					headerBorder
					header={<h2 className="font-medium mr-auto text-base">{t("Личная информация")}</h2>}
					footerBorder
					footer={
						<div className="d-flex align-center justify-content-end">
							<Button.Default type="blue" buttonType="submit" loading={isSubmitting}>
								{t("Сохранить")}
							</Button.Default>
						</div>
					}>
					<div className="px-5">
						<div className="user__photo w-80 pt-5">
							<div className="user__photo--photo">
								<img src={get(values, "photo_id.thumbnails.small.src", DefaultUser)} alt="" />
								{loading && <Spinner />}
							</div>
							<Upload
								successCb={data => {
									setLoading(false);
									setFieldValue("photo_id", data);
								}}
								onLoad={(total, loaded, loading) => {}}
								isDoc={false}>
								{({ file, loading }) => {
									setLoading(loading);
									return (
										<div className="user__photo--icon">
											<Camera />
										</div>
									);
								}}
							</Upload>
						</div>
						<Field component={Fields.Input} name="full_name" type="text" placeholder="Введите имя" label="Имя" className="w-80" />
						<Field component={Fields.Input} name="name" type="text" placeholder="Введите логин" label="Логин" className="w-80" />
						<Field
							component={Fields.Input}
							name="password"
							type="password"
							registration
							placeholder="Введите пароль"
							label="Пароль"
							className="w-80"
						/>
					</div>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default MainForm;
