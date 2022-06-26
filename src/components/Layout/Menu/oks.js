import React from "react";

import OKS from "assets/images/logo-oks.svg";
import { useTranslation } from "react-i18next";

const OKSComponent = () => {
	const { t } = useTranslation();
	return (
		<div className="profile-component oks-component intro-y dropdown cursor-pointer dark:bg-dark-3">
			<a className="profile-component__header" href="https://oks.uz/" rel="noreferrer noopener" target="_blank">
				<div className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg profile-component__header--img">
					<img alt="" src={OKS} />
				</div>
				<div className="user  border-theme-12 dark:border-dark-3 oks-component__text">{t("Дизайн и разработка платформы OKS Technologies")}</div>
			</a>
		</div>
	);
};

export default OKSComponent;
