import numberToWordsRu from "number-to-words-ru";

const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const formatDate = (date, format) => {
	let dt = new Date(date);
	let month = ("00" + (dt.getMonth() + 1)).slice(-2);
	let day = ("00" + dt.getDate()).slice(-2);
	let year = dt.getFullYear();
	let hours = ("00" + dt.getHours()).slice(-2);
	let minutes = ("00" + dt.getMinutes()).slice(-2);
	let seconds = ("00" + dt.getSeconds()).slice(-2);

	switch (format) {
		case "DD":
			return dt.getDate();
		case "DD-MM-YYYY":
			return day + "-" + month + "-" + year;
		case "YYYY-MM-DD":
			return year + "-" + month + "-" + day;
		case "DD.MM.YYYY / HH:mm:ss":
			return day + "." + month + "." + year + " / " + hours + ":" + minutes + ":" + seconds;
		case "DD-MM-YYYY / HH:mm:ss":
			return day + "-" + month + "-" + year + " / " + hours + ":" + minutes + ":" + seconds;
		case "dd.MM.yyyy HH:mm":
			return day + "." + month + "." + year + " " + hours + ":" + minutes;
		default:
			return day + "." + month + "." + year;
	}
};

const numberReadable = value => {
	//value should be number and integer
	const newValue =
		value &&
		numberToWordsRu.convert(value, {
			currency: "number",
			declension: "nominative",
			roundNumber: -1,
			convertMinusSignToWord: false,
			showNumberParts: {
				integer: true,
				fractional: true
			},
			convertNumbertToWords: {
				integer: true,
				fractional: false
			},
			showCurrency: {
				integer: true,
				fractional: true
			}
		});

	return newValue;
};

function convertToReadable(number) {
	function isFloat(n) {
		return Number(n) === n && n % 1 !== 0;
	}

	let newValue;
	if (isFloat(Number(number))) {
		newValue = number.toString().split(".");
		newValue[0] = newValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		newValue = newValue.join(".");
	} else {
		newValue = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}

	return newValue;
}

const isEnableLang = lang => {
	switch (lang) {
		case "ru":
			return true;
		case "uz":
			return true;
		case "en":
			return true;
		default:
			return false;
	}
};

const stringToCode = element => {
	const content = element.textContent;

	function toNode(iframeString) {
		const div = document.createElement("div");
		div.innerHTML = iframeString;
		return div;
	}

	const parent = element.parentNode;
	const childOembed = parent.querySelector("code");
	childOembed.replaceWith(toNode(content));
};

const userRoles = [
	{ name: "Админ", value: "admin" },
	{ name: "Модератор", value: "moderator" },
	{ name: "Региональный исполнитель по обработке карты", value: "region_isp_map" },
	{ name: "Республиканский исполнитель по обработке карты", value: "republic_isp_map" },
	{ name: "Исполнитель по обратке заявок", value: "region_isp_feedback" },
	{ name: "Исполнитель по заполнению подрадчиков", value: "republic_isp_contractor" },
	{ name: "Исполнитель по заполнению инфографики", value: "republic_isp_indicator_excel" },
	{ name: "Исполнитель по заполнению контента", value: "republic_isp_content_manager" },
	{ name: "Правительство по обратке заявок", value: "government_isp_feedback" }
];

const getUserRoleLabel = role => {
	switch (role) {
		case "admin":
			return "Админ";
		case "moderator":
			return "Модератор";
		case "region_isp_map":
			return "Региональный исполнитель по обработке карты";
		case "republic_isp_map":
			return "Республиканский исполнитель по обработке карты";
		case "region_isp_feedback":
			return "Исполнитель по обратке заявок";
		case "government_isp_feedback":
			return "Правительство по обратке заявок";
		case "republic_isp_contractor":
			return "Исполнитель по заполнению подрадчиков";
		case "republic_isp_indicator_excel":
			return "Исполнитель по заполнению инфографики";
		case "republic_isp_content_manager":
			return "Исполнитель по заполнению контента"
		default:
			return "-";
	}
};

const months = [
	{
		id: 1,
		month_oz: "Январ",
		month_uz: "Yanvar",
		month_ru: "Январь",
		month_en: "January"
	},
	{
		id: 2,
		month_oz: "Феврал",
		month_uz: "Fevral",
		month_ru: "Февраль",
		month_en: "February"
	},
	{
		id: 3,
		month_oz: "Март",
		month_uz: "Mart",
		month_ru: "Марть",
		month_en: "March"
	},
	{
		id: 4,
		month_oz: "Апрел",
		month_uz: "Aprel",
		month_ru: "Апрель",
		month_en: "Aprel"
	},
	{
		id: 5,
		month_oz: "Май",
		month_uz: "May",
		month_ru: "Май",
		month_en: "May"
	},
	{
		id: 6,
		month_oz: "Июн",
		month_uz: "Iyun",
		month_ru: "Июнь",
		month_en: "June"
	},
	{
		id: 7,
		month_oz: "Июл",
		month_uz: "Iyul",
		month_ru: "Июль",
		month_en: "July"
	},
	{
		id: 8,
		month_oz: "Август",
		month_uz: "Avgust",
		month_ru: "Августь",
		month_en: "August"
	},
	{
		id: 9,
		month_oz: "Сентябр",
		month_uz: "Sentabr",
		month_ru: "Сентябрь",
		month_en: "September"
	},
	{
		id: 10,
		month_oz: "Октябр",
		month_uz: "Oktabr",
		month_ru: "Октябрь",
		month_en: "October"
	},
	{
		id: 11,
		month_oz: "Ноябр",
		month_uz: "Noyabr",
		month_ru: "Ноябрь",
		month_en: "November"
	},
	{
		id: 12,
		month_oz: "Декабр",
		month_uz: "Dekabr",
		month_ru: "Декабрь",
		month_en: "December"
	}
];

const currencies = [
	{ value: 1, label: "UZS" },
	{ value: 2, label: "USD" },
	{ value: 3, label: "EUR" },
];

const ticketTypes = [
	{ value: 1, label: "Планируемый" },
	{ value: 2, label: "Отремонтированный" },
	{ value: 3, label: "Ремонтируется" }
];

const indicatorTypes = [
	{ value: 1, label: "Регион" },
	{ value: 2, label: "Месяц" },
	{ value: 3, label: "Направление" },
	{ value: 4, label: "Документ" },
	{ value: 5, label: "Диаграмма" },
];

const ticketStatus = [
	{ value: 1, label: "В процессе", color: "#E8C512" },
	{ value: 2, label: "Принято", color: "#1ECD01" },
	{ value: 3, label: "Отклоненный", color: "#E84A4A" }
];

// CATEGORY TYPE ---------
const categoryType = [
	{ name: "Новости", value: 0 },
	{ name: "Вопросы-Ответы", value: 1 },
	{ name: "Библиотека", value: 2 }
];

// CONTRACTOR ------------------
const evaluationSystemOne = [
	{ id: 1, label: "50% гача", value: 1 },
	{ id: 2, label: "70% гача", value: 2 },
	{ id: 3, label: "90% гача", value: 3 },
	{ id: 4, label: "100%  ва ундан юқори", value: 4 }
];
const evaluationSystemTwo = [
	{ id: 1, label: "3 ой кечикиб", value: 4 },
	{ id: 2, label: "2 ой кечикиб", value: 6 },
	{ id: 3, label: "1 ой кечикиб", value: 8 },
	{ id: 4, label: "ўз вақтида", value: 10 }
];
const evaluationSystemThree = [
	{ id: 1, label: "50 млрд. сўмгача", value: 2 },
	{ id: 2, label: "50-100 млрд.сўмгача", value: 3 },
	{ id: 3, label: "100-200 млрд.сўмгача", value: 4 },
	{ id: 4, label: "200 млрд.сўм ва ундан юқори", value: 5 }
];

const evaluationSystemFour = [
	{ id: 1, label: "2 йилгача", value: 1 },
	{ id: 2, label: "3 йилгача", value: 2 },
	{ id: 3, label: "4 йилгача", value: 3 },
	{ id: 4, label: "5 йил ва ундан ортиқ", value: 4 }
];
const evaluationSystemFive = [
	{ id: 1, label: "100дан - 200 млн.сўмгача", value: 1 },
	{ id: 2, label: "200дан - 300 млн.сўмгача", value: 2 },
	{ id: 3, label: "300дан - 400 млн.сўмгача", value: 3 },
	{ id: 4, label: "400 млн.сўм  ва ундан юқори", value: 4 }
];

const evaluationSystemSix = [
	{ id: 1, label: "0,2 ≤ 3 балл", value: "3" },
	{ id: 2, label: "0,2 > 0 балл", value: "0" }
];
const evaluationSystemSeven = [
	{ id: 1, label: "5тадан-8тагача", value: 4 },
	{ id: 2, label: "8тадан-12тагача", value: 6 },
	{ id: 3, label: "12тадан-17тагача", value: 8 },
	{ id: 4, label: "17та ва ундан кўп", value: 10 }
];
const evaluationSystemEight = [
	{ id: 1, label: "3тадан кўп бўлганда", value: "0" },
	{ id: 2, label: "3 та", value: "2" },
	{ id: 3, label: "2 та", value: "3" },
	{ id: 4, label: "1 та", value: "4" }
];
const evaluationSystemNine = [
	{ id: 1, label: "50 % дан ортиқ", value: "0" },
	{ id: 2, label: "30 дан - 50 % гача", value: "2" },
	{ id: 3, label: "15 дан - 30 % гача", value: "3" },
	{ id: 4, label: "0 дан - 15 % гача", value: "4" }
];

const evaluationSystemTen = [
	{ id: 1, label: "мавжуд - 2 балл", value: "2" },
	{ id: 2, label: "мавжуд эмас - 0 балл", value: "0" }
];

// DESIGNER ------------------
const designerEvaluationSystemOne = [
	{ id: 1, label: "2 йил", value: 1 },
	{ id: 2, label: "3 йил", value: 3 },
	{ id: 3, label: "4 йил", value: 5 },
	{ id: 4, label: "5 йил ва ундан ортиқ", value: 7 }
];

const designerEvaluationSystemTwo = [
	{ id: 1, label: "3 ой ва ундан кўп кечиктирилган", value: 1 },
	{ id: 2, label: "2 ойгача кечиктирилган", value: 2 },
	{ id: 3, label: "1 ойгача кечиктирилган", value: 3 },
	{ id: 4, label: "ўз муддатида", value: 4 }
];

const designerEvaluationSystemThree = [
	{ id: 1, label: "1 та бўлим", value: 1 },
	{ id: 2, label: "2 та бўлим", value: 2 },
	{ id: 3, label: "3 та бўлим", value: 3 },
	{ id: 4, label: "4 та  ва ундан кўп бўлим", value: 4 }
];

const designerEvaluationSystemFour = [
	{ id: 1, label: "4 та мутахассис", value: 1 },
	{ id: 2, label: "6 та мутахассис", value: 2 },
	{ id: 3, label: "8 та мутахассис", value: 3 },
	{ id: 4, label: "10 та  ва ундан кўп мутахассис", value: 4 }
];

const designerEvaluationSystemFive = [
	{ id: 1, label: "мавжуд", value: "3" },
	{ id: 2, label: "мавжуд эмас", value: "0" }
];

const designerEvaluationSystemSix = [
	{ id: 1, label: "1 та техник ходим", value: 1 },
	{ id: 2, label: "2 та техник ходим", value: 2 },
	{ id: 3, label: "3 та техник ходим", value: 3 },
	{ id: 4, label: "4 та  ва ундан кўп техник ходим", value: 4 }
];

const designerEvaluationSystemSeven = [
	{ id: 1, label: "мавжуд", value: "4" },
	{ id: 2, label: "мавжуд эмас", value: "0" }
];
const designerEvaluationSystemEight = [
	{ id: 1, label: "50 млн.сўм ва ундан юқори", value: 1 },
	{ id: 2, label: "100 млн.сўм ва ундан юқори", value: 2 },
	{ id: 3, label: "150 млн.сўм ва ундан юқори", value: 3 },
	{ id: 4, label: "200 млн.сўм ва ундан юқори", value: 4 }
];

const designerEvaluationSystemNine = [
	{ id: 1, label: "0,2 ≤ 3 балл", value: "3" },
	{ id: 2, label: "0,2> 0 балл", value: "0" }
];

const designerEvaluationSystemTen = [
	{ id: 1, label: "200 млн.сўм ва ундан юқори", value: 1 },
	{ id: 2, label: "300 млн.сўм ва ундан юқори", value: 2 },
	{ id: 2, label: "500 млн.сўм ва ундан юқори", value: 3 },
	{ id: 2, label: "1000 млн.сўм ва ундан юқори", value: 4 }
];

const designerEvaluationSystemEleven = [
	{ id: 1, label: "100 млн.сўм ва ундан юқори", value: 1 },
	{ id: 2, label: "200 млн.сўм ва ундан юқори", value: 2 },
	{ id: 2, label: "300 млн.сўм ва ундан юқори", value: 3 },
	{ id: 2, label: "500 млн.сўм ва ундан юқори", value: 5 }
];
const designerEvaluationSystemTwelve = [
	{ id: 1, label: "4 та ва ундан кўп", value: 1 },
	{ id: 2, label: "6 та ва ундан кўп", value: 2 },
	{ id: 2, label: "8 та ва ундан кўп", value: 3 },
	{ id: 2, label: "10 та  ва ундан кўп", value: 4 }
];

const contentStatus = status => {
	switch (status){
		case 0:
			return {color: 'black', label: 'Черновик'}
		case 1:
			return {color: 'green', label: 'Активный'}
		case 2:
			return {color: 'orange', label: 'В ожидании'}
		case 3:
			return {color: 'red', label: "Отмененные"}
		default:
			return {color: 'black', label: '-'}
	}
}
const feedbackStatus = status => {
	switch (status){
		case 0:
			return {color: 'orange', label: 'Новый'}
		case 1:
			return {color: 'blue', label: 'В процессе'}
		case 2:
			return {color: 'purple', label: 'В модерации'}
		case 3:
			return {color: 'green', label: "Принятый"}
		case 4:
			return {color: 'red', label: "Отклоненный"}
		default:
			return {color: 'black', label: '-'}
	}
}

const valueTypeList = [
	{ value: 1, label: "-" },
	{ value: 2, label: "UZS" },
	{ value: 3, label: "USD" },
	{ value: 4, label: "EUR" },
	{ value: 5, label: "км" },
	{ value: 6, label: "м" },
	{ value: 7, label: "шт" },
]
const getValueTypeLabel = valueType => {
	switch (valueType) {
		case 1:
			return '';
		case 2:
			return 'UZS';
		case 3:
			return 'USD';
		case 4:
			return 'EUR';
		case 5:
			return 'км';
		case 6:
			return 'м';
		case 7:
			return 'шт';
		default:
			return '';
	}
}
/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
	formatDate,
	stringToCode,
	numberReadable,
	convertToReadable,
	isEnableLang,
	formatBytes,
	userRoles,
	getUserRoleLabel,
	currencies,
	ticketTypes,
	categoryType,
	indicatorTypes,
	ticketStatus,
	evaluationSystemOne,
	evaluationSystemTwo,
	evaluationSystemThree,
	evaluationSystemFour,
	evaluationSystemFive,
	evaluationSystemSix,
	evaluationSystemSeven,
	evaluationSystemEight,
	evaluationSystemNine,
	evaluationSystemTen,
	designerEvaluationSystemOne,
	designerEvaluationSystemTwo,
	designerEvaluationSystemThree,
	designerEvaluationSystemFour,
	designerEvaluationSystemFive,
	designerEvaluationSystemSix,
	designerEvaluationSystemSeven,
	designerEvaluationSystemEight,
	designerEvaluationSystemNine,
	designerEvaluationSystemTen,
	designerEvaluationSystemEleven,
	designerEvaluationSystemTwelve,
	months,
	contentStatus,
	feedbackStatus,
	valueTypeList,
	getValueTypeLabel
};
