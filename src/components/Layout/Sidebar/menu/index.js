const adminMenus = [
	{
		id: "dashboard",
		icon: "dashboard",
		link: "/dashboard",
		title: "Мониторинг",
		access: ["admin"]
	},

	// {
	// 	id: "menu",
	// 	icon: "menu-cubic",
	// 	link: "/menu",
	// 	title: "Меню",
	// 	access: ["admin"]
	// },
	{
		id: "news",
		icon: "box",
		link: "/news",
		title: "Товары",
		access: ["admin"]
	},
	{
		id: "categories",
		title: "Категории",
		link: "/categories",
		icon: "cubic",
		access: ["admin"]
	},
	{
		id: "settings",
		title: "Настройки",
		icon: "settings-white",
		access: ["admin"],
		submenu: [
			{
				id: "settings",
				title: "Основные настройки",
				link: "/settings",
				icon: "settings-white",
				access: ["admin"]
			},
			{
				id: "translation",
				title: "Переводы",
				link: "/translation",
				icon: "globe",
				access: ["admin"]
			}
		]
	}
];

export const menu = [...adminMenus];
