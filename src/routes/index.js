import React, { lazy, Suspense } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Layout, Spinner } from "components";
import { history } from "store";
import App from "../App";

//routes by role
import { adminRoutes } from "./admin";

//default routes
const Login = lazy(() => import("../pages/auth/login"));
const Logout = lazy(() => import("../pages/auth/logout"));
const Profile = lazy(() => import("../pages/profile"));

//eslint-disable-next-line
export default () => (
	<Router {...{ history }}>
		<App>
			{({ isAuthenticated, isFetched, data }) => {
				return isFetched && isAuthenticated ? (
					<Layout>
						<Suspense fallback={<Spinner />}>
							<Switch>

								{data.role === 'admin' && (
									adminRoutes.map((route, key) => (
										<Route key={key} exact={route.exact} component={route.component} path={route.path} />
									))
								)}
								

								<Route path="/logout" component={Logout} exact />
								<Route path="/profile" component={Profile} exact />
							</Switch>
						</Suspense>
					</Layout>
				) : (
					<Suspense fallback={<Spinner />}>
						<Switch>
							<Route path="/" component={Login} exact />
							<Redirect from="*" to="/" />
						</Switch>
					</Suspense>
				);
			}}
		</App>
	</Router>
);
