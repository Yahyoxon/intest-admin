import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import logoImage from "assets/images/logo.svg";
import { get } from "lodash";
import Icon from "components/Icon";
import Menu from "components/Layout/Menu";
import { useOutsideClick } from "hooks";

const Sidebar = ({ menu }) => {
	const role = useSelector(state => get(state, "auth.data.role"));
	const { t } = useTranslation();
	const { pathname } = useLocation();
	const { isVisible, setIsVisible, ref } = useOutsideClick();

	const toggleSubmenu = id => {
		if (id === isVisible) {
			setIsVisible(null);
		} else {
			setIsVisible(id);
		}
	};

	const admin = menu.filter(m => m.access.includes("admin"));
	const moderator = menu.filter(m => m.access.includes("moderator"));
	const region_isp_feedback = menu.filter(m => m.access.includes("region_isp_feedback"));
	const government_isp_feedback = menu.filter(m => m.access.includes("government_isp_feedback"));
	const region_isp_map = menu.filter(m => m.access.includes("region_isp_map"));
	const republic_isp_map = menu.filter(m => m.access.includes("republic_isp_map"));
	const republic_isp_content_manager = menu.filter(m => m.access.includes("republic_isp_content_manager"));
	const republic_isp_contractor = menu.filter(m => m.access.includes("republic_isp_contractor"));
	const republic_isp_indicator_excel = menu.filter(m => m.access.includes("republic_isp_indicator_excel"));

	const roleList = {
		admin,
		moderator,
		region_isp_feedback,
		government_isp_feedback,
		region_isp_map,
		republic_isp_map,
		republic_isp_content_manager,
		republic_isp_contractor,
		republic_isp_indicator_excel
	};

	const renderRole = role => {
		return role && role.replace(/-/g, "_");
	};
	return (
		<nav className="side-nav">
			<div className="side-nav__header">
				<a
					href="http://apply.epauzb.uz/"
					target="_blank"
					rel="noopener noreferrer"
					className="-intro-x hidden d-flex align-items-center flex-col items-center">
					<img
						className="w-24 d-block"
						src={logoImage}
						alt="OKS"
						style={{
							width: "60px",
							objectFit: "contain"
						}}
					/>
				</a>
			</div>

			<ul className="mt-5 mb-20" ref={ref}>
				{get(roleList, `${renderRole(role)}`, []).map((m, i) =>
					get(m, "submenu") ? (
						<li key={get(m, "id")}>
							<div
								className={`side-menu cursor-pointer${pathname === get(m, "link") ? " side-menu--active" : ""}`}
								onClick={() => toggleSubmenu(get(m, "id"))}>
								<div className="side-menu__icon">
									<Icon name={get(m, "icon")} />
								</div>
								<div className="side-menu__title">
									{t(get(m, "title"))}
									<div className={`side-menu__sub-icon${isVisible === get(m, "id") ? " transform rotate-180" : ""}`}>
										<Icon name="chevron-down" />
									</div>
								</div>
							</div>
							<ul className={isVisible === get(m, "id") ? "side-menu__sub-open" : ""}>
								{get(m, "submenu", []).map((sm, i) => (
									<li key={get(sm, "id")}>
										<NavLink
											key={get(sm, "id")}
											to={get(sm, "link")}
											className={`side-menu ${pathname === get(sm, "link") ? "side-menu--active" : ""}`}>
											<div className="side-menu__icon mr-2">
												<Icon name={get(sm, "icon")} />
											</div>

											<div className="side-menu__title">{t(get(sm, "title"))}</div>
										</NavLink>
									</li>
								))}
							</ul>
						</li>
					) : (
						<li key={get(m, "id")}>
							<NavLink to={get(m, "link")} className={`side-menu ${pathname === get(m, "link") ? "side-menu--active" : ""}`}>
								<div className="side-menu__icon">
									<Icon name={get(m, "icon")} />
								</div>
								<div className="side-menu__title">{t(get(m, "title"))}</div>
							</NavLink>
						</li>
					)
				)}
			</ul>
			<Menu />
		</nav>
	);
};

export default Sidebar;
