import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import SystemActions from "store/actions/system";
import config from "config";
import {storage} from 'services'
import "./style.scss";

const ThemeComponent = () => {
	const dispatch = useDispatch();
	const theme = useSelector((state) => state.system.theme);
	const { t } = useTranslation();
	const darkTheme = config.THEMES[1].theme;
	const lightTheme = config.THEMES[0].theme;

	const changeTheme = () => {
		if (theme === config.DEFAULT_THEME) {
			dispatch(SystemActions.ChangeTheme(darkTheme));
			storage.set("theme", darkTheme)
			document.documentElement.className = darkTheme;
		} else {
			document.documentElement.className = lightTheme;
			storage.set("theme", lightTheme)
			dispatch(SystemActions.ChangeTheme(lightTheme));
		}
	};

	return (
		<div
			className="dark-mode-switcher dark:bg-dark-2"
			onClick={changeTheme}>
			<div className="mr-4 text-base text-gray-500 dark:text-gray-300 hidden xl:show">
				{t("Темный режим")}
			</div>
			<div className={`dark-mode-switcher__toggle ${storage.get("theme") === "dark" ? "dark-mode-switcher__toggle--active" : ""}`}></div>
		</div>
	);
};

export default ThemeComponent;
