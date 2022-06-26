import React from "react";
import { useSelector } from "react-redux";
import { get } from "lodash";
import { helpers } from "services";

import DefaultPhoto from "assets/images/user.svg";

const SidebarProfile = ({ isVisible, setIsVisible }) => {
	const profile = useSelector(state => state.auth.data);
	const photo = get(profile, "photo.thumbnails.small.src");
	return (
		<div className="profile-component__header" onClick={() => setIsVisible(!isVisible)}>
			<div className="dropdown-toggle w-8 rounded-full overflow-hidden shadow-lg profile-component__header--img">
				<img alt="" src={get(profile, "photo") ? photo : DefaultPhoto} />
			</div>
			<div className="user border-theme-12 dark:border-dark-3 font-medium">{helpers.getUserRoleLabel(get(profile, "role"))}</div>
			<img
				src={require("assets/images/icons/right-chevron.svg")}
				alt=""
				className="profile-component--chevron"
				style={{ transform: `rotate(${isVisible ? "-90deg" : "0"})` }}
			/>
		</div>
	);
};

export default SidebarProfile;
