import React from "react";

import SideBar from "./Sidebar";
import { menu } from "./Sidebar/menu";

const Layout = ({ children }) => {
	return (
		<div className="wrapper">
			<div className="wrapper-box">
				<SideBar menu={menu} />
				<div className="content">{children}</div>
			</div>
		</div>
	);
};

export default Layout;
