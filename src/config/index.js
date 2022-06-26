const { REACT_APP_API_ROOT } = process.env;

const config = {
	API_ROOT: REACT_APP_API_ROOT,
	DEFAULT_LANGUAGE: "ru",
	DEFAULT_THEME: "light",
	API_LANGUAGES: [
		{ id: 1, code: "uz", title: "Узбекский" },
		{ id: 2, code: "oz", title: "O'zbekcha" },
		{ id: 3, code: "ru", title: "Русский" },
		{ id: 4, code: "en", title: "Английский" },
		// { id: 4, code: "oz", title: "На Кириллице" }
	],
	THEMES: [
		{ id: 1, theme: "light" },
		{ id: 2, theme: "dark" }
	]
};

export default config;
