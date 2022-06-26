import React from "react";
import Avatar from "./avatar.svg";
import Pattern from "assets/images/pattern.jpg";
import "./style.scss";
import cx from "classnames";

// size?: "lg" | "md";
const AvatarComponent = ({ className = "", size = "md", src, hasBadge, isProduct, isRectangle, zoomIn = true }) => {
	const classNames = cx("avatar", `avatar--${size}`, isRectangle ? "avatar--rectangle" : "", zoomIn ? "zoom-in" : "", className);

	return (
		<div className={classNames}>
			{isProduct ? <img src={src ? src : Pattern} alt="" /> : <img src={src ? src : Avatar} alt="" />}

			{hasBadge ? <span className="avatar__badge" /> : null}
		</div>
	);
};

export default AvatarComponent;
