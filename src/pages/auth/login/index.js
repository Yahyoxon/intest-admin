import React, { useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { Field } from "formik";
import get from "lodash/get";

import EntityForm from "modules/entity/forms";
import { Button, Fields, Grid } from "components";
import { useNotification } from "hooks";
import Actions from "store/actions";
import { storage } from "services";
import "../style.scss";

const Login = ({ history }) => {
	const dispatch = useDispatch();
	const { notification } = useNotification();

	useEffect(() => {
		document.body.className = "logins";
		return () => {
			document.body.className = `main`;
		};
	}, []);

	return (
		<div className="login__page dark:bg-dark-1">
			<div className="container sm:px-10">
				<Grid.Row cols={2} className="login__page--container">
					<section className="login__page--left d-flex flex-col dark:bg-dark-3">
						<h4 className="login__page--title text-black">Добро пожаловать</h4>
						<p className="login__page--info text-black">
							Мы всегда рады помочь вам по работе в электронном автоматизированном системе обработки заявок
						</p>
						<EntityForm.Default
							method="post"
							url={`/user/sign-in`}
							onSuccess={data => {
								if (get(data, "success")) {
									storage.set("token", get(data, "success.token"));
									dispatch(Actions.auth.Login.success(data));
									history.push("/");
								}
							}}
							onError={error => {
								notification(get(error, "errorMessage"), {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "name",
									required: true
								},
								{
									name: "password",
									required: true
								}
							]}>
							{({ isSubmitting }) => {
								return (
									<Fragment>
										<Field
											component={Fields.LoginInput}
											name="name"
											type="text"
											className="intro-x login__input block"
											containerClassName="mt-10"
											placeholder="Введите логин"
											label="Имя пользователя"
											extra={<img src={require("assets/images/icons/person.svg").default} alt="" />}
										/>
										<Field
											component={Fields.LoginInput}
											name="password"
											type="password"
											className="intro-x login__input block"
											placeholder="Введите пароль"
											label="Ключ авторизации"
											containerClassName="mt-10"
											extra={<img src={require("assets/images/icons/key.svg").default} alt="" />}
										/>
										<section className="intro-x mt-5 text-left">
											<Button.Default
												loading={isSubmitting}
												type="blue"
												buttonType="submit"
												className="py-5 px-5 w-full  align-top mt-10"
												style={{
													backgroundColor: "#003BCF",
													borderRadius: "12px"
												}}>
												Войти в систему
											</Button.Default>
										</section>
									</Fragment>
								);
							}}
						</EntityForm.Default>
					</section>
					<section className="login__page--right">
						<div className="login__page--modal">
							<div className="login__page--abs-1">
								<img src={require("assets/images/icons/shield.svg").default} alt="" />
							</div>
							<img src={require("assets/images/logo.svg").default} alt="" />
							<h5>Shaffofyul Admin Panel</h5>
							<a href="http://shaffofyul.uz/" target="_blank" rel="noreferrer noopener">
								shaffofyul.uz
							</a>
						</div>
						<a href="https://oks.uz/" rel="noreferrer noopener" target="_blank" className="oks-name">
							Система разработан агентсвой технологии и дизайна
						</a>
					</section>
				</Grid.Row>
			</div>
		</div>
	);
};

export default Login;
