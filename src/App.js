import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import i18next from "i18next";

import Actions from "store/actions";
import { storage } from "services";
import config from "config";

function App({ children }) {
	const auth = useSelector(state => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		if (storage.get("token")) {
			dispatch(Actions.auth.GetMe());
		}
		if (!storage.get("theme")) {
			dispatch(Actions.system.ChangeTheme(config.DEFAULT_THEME));
			storage.set("theme", config.DEFAULT_THEME);
			document.documentElement.className = config.DEFAULT_THEME;
		} else {
			dispatch(Actions.system.ChangeTheme(storage.get("theme")));
			document.documentElement.className = storage.get("theme");
		}

		if (storage.get("language") === "uz" || storage.get("language") === "oz" || storage.get("language") === "ru" || storage.get("language") === "en") {
			dispatch(Actions.system.ChangeLanguage(storage.get("language")));
			i18next.changeLanguage(storage.get("language"));
		} else {
			dispatch(Actions.system.ChangeLanguage(config.DEFAULT_LANGUAGE));
			i18next.changeLanguage(config.DEFAULT_LANGUAGE);
		}
	}, [dispatch]);

	return (
		<>
			<div id="custom-alert-zone" />
			{children(auth)}
		</>
	);
}

export default App;
