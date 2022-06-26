import React from "react";
import cx from "classnames";

// type textFormat =
// 	| "underlined"
// 	| "deleted"
// 	| "highlighted"
// 	| "strong"
// 	| "bold"
// 	| "small"
// 	| "emphasized"
// 	| "subscript"
// 	| "superscript"
// 	| "inserted";

// interface ITextProps {
// 	weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
// 	transform?: "uppercase" | "lowercase" | "capitalize" | "normal-case";
// 	format?: textFormat;
// 	children: string;
// }

function getTextFormat(format, classNames, children) {
	switch (format) {
		case "underlined":
			return <u className={`block mt-1 ${classNames}`}>{children}</u>;
		case "deleted":
			return <del className={`block mt-1 ${classNames}`}>{children}</del>;
		case "small":
			return <small className={`block mt-1 ${classNames}`}>{children}</small>;
		case "strong":
			return <strong className={`block mt-1 ${classNames}`}>{children}</strong>;
		case "bold":
			return <b className={`${classNames}`}>{children}</b>;
		case "emphasized":
			return <em className={`${classNames}`}>{children}</em>;
		case "highlighted":
			return <mark className={`bg-yellow-200 p-1 ${classNames}`}>{children}</mark>;
		case "subscript":
			return <sub className={`${classNames}`}>{children}</sub>;

		case "superscript":
			return <sup className={`${classNames}`}>{children}</sup>;
		case "inserted":
			return <ins className={`block mt-1 ${classNames}`}>{children}</ins>;

		default:
			return <div className={classNames}>{children}</div>;
	}
}

const TextComponent = ({ weight = "normal", transform = "normal-case", format, children }) => {
	const classNames = cx(`font-${weight}`, transform);

	return <>{getTextFormat(format, classNames, children)}</>;
};

export default TextComponent;
