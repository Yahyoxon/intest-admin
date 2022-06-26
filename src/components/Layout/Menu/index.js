import React from "react";
import { useTranslation } from "react-i18next";

import { Icon, Typography } from "components";
import { useOutsideClick } from "hooks";

import Profile from "./profile";
import Theme from "../Theme";
import OKS from "./oks";
import "./style.scss";

const className = "flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md";

const links = [
	{
		id: 1,
		url: "/profile",
		title: "Профиль",
		icon: "user",
		className: className
	},
	{
		id: 3,
		url: "/logout",
		title: "Выход",
		icon: "log-out",
		className: className
	}
];

const ProfileComponent = () => {
	const { t } = useTranslation();
	const { ref, isVisible, setIsVisible } = useOutsideClick(false);

	return (
		<div className="side-nav__footer">
			<Theme />
			<div className="profile-component intro-y dropdown w-8 cursor-pointer --line" ref={ref}>
				<Profile {...{ isVisible, setIsVisible }} />
				<div className={`dropdown-menu${isVisible ? " show" : ""} w-62`}>
					<div className="dropdown-menu__content box bg-theme-11 dark:bg-dark-6 text-white">
						<div className="p-2">
							{links.map(link => (
								<Typography.Link key={link.id} url={link.url} className={link.className}>
									<Icon name={link.icon} className="w-4 h-4 mr-2 mb-1" />
									{t(link.title)}
								</Typography.Link>
							))}
						</div>
					</div>
				</div>
			</div>
			<OKS />
		</div>
	);
};

export default ProfileComponent;
