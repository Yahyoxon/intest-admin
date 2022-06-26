import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { i18n, api } from "services";
import { configure as configureStore } from "store";
import Routes from "./routes";

import "./assets/styles/app.css";
import './assets/styles/custom.scss'
import './assets/styles/bootstrap-grid.min.css'

const store = configureStore();
store.subscribe(() => {
	api.subscribe(store);
});

const render = Component => {
	ReactDOM.render(
		<Provider {...{ store }}>
			<Suspense fallback="">
				<I18nextProvider i18n={i18n()}>
					<Component {...{ store }} />
				</I18nextProvider>
			</Suspense>
		</Provider>,
		document.getElementById("root")
	);
};

render(Routes);

if (module.hot) {
	module.hot.accept("./routes", () => {
		const NextApp = require("./routes").default;
		render(NextApp);
	});
}
