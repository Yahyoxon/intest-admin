import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/dashboard"));
const Translation = lazy(() => import("../pages/translation"));

const Menu = lazy(() => import("../pages/menu"));
const MenuView = lazy(() => import("../pages/menu/view"));

const News = lazy(() => import("../pages/news"));
const NewsCreate = lazy(() => import("../pages/news/create"));
const NewsUpdate = lazy(() => import("../pages/news/update"));

const Categories = lazy(() => import("../pages/categories"));

const Settings = lazy(() => import("../pages/settings"));
const SettingsCreate = lazy(() => import("../pages/settings/create"));
const SettingsUpdate = lazy(() => import("../pages/settings/update"));

export const adminRoutes = [
	{ path: "/", exact: true, component: Dashboard },
	{ path: "/dashboard", exact: true, component: Dashboard },

	{ path: "/menu", exact: true, component: Menu },
	{ path: "/menus/:id", exact: true, component: MenuView },

	{ path: "/news", exact: true, component: News },
	{ path: "/news/create", exact: true, component: NewsCreate },
	{ path: "/news/update/:id", exact: true, component: NewsUpdate },

	{ path: "/translation", exact: true, component: Translation },
	{ path: "/categories", exact: true, component: Categories },

	{ path: "/settings", exact: true, component: Settings },
	{ path: "/settings/create", exact: true, component: SettingsCreate },
	{ path: "/settings/update/:id", exact: true, component: SettingsUpdate }
];
