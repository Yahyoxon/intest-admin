import React from "react";
import { get, truncate } from "lodash";
import cx from "classnames";
import { Icon } from "components";
// import { helpers } from "services";
import { ReactComponent as XLS } from "assets/images/icons/xls.svg";
import { ReactComponent as ZIP } from "assets/images/icons/zip.svg";
import { ReactComponent as TXT } from "assets/images/icons/txt.svg";
import { ReactComponent as DOC } from "assets/images/icons/doc.svg";
import { ReactComponent as PDF } from "assets/images/icons/pdf.svg";
import { ReactComponent as PPT } from "assets/images/icons/ppt.svg";
import { ReactComponent as IMG } from "assets/images/icons/img.svg";

const getFileIcon = extensionType => {
	switch (extensionType) {
		case "pdf":
			return <PDF className="w-24 h-24" />;
		case "doc":
		case "docx":
			return <DOC className="w-24 h-24" />;
		case "ppt":
			return <PPT className="w-24 h-24" />;
		case "xls":
		case "xlsx":
			return <XLS className="w-24 h-24" />;
		case "txt":
			return <TXT className="w-24 h-24" />;
		case "zip":
		case "rar":
			return <ZIP className="w-24 h-24" />;
		case "jpg":
		case "jpeg":
		case "png":
		case "svg":
		default:
			return <IMG className="w-24 h-24" />;
	}
};

function getFileType(fileType) {
	switch (fileType) {
		case "file":
			return "directory";
		case "image":
			return "image";
		case "video":
		case "music":
		default:
			return "file";
	}
}

function getBgColor(color) {
	switch (color) {
		case "light-grey":
			return "bg-gray-200";
		case "light-grey-2":
			return "bg-gray-300";
		case "grey":
			return "bg-gray-400";
		case "dark-grey":
			return "bg-gray-700";
		case "dark-blue":
			return "bg-theme-1";
		case "orange":
			return "bg-theme-22";
		case "yellow":
			return "bg-theme-23";
		case "red":
			return "bg-theme-24";
		case "green":
			return "bg-theme-10";
		case "blue":
			return "bg-theme-17";
		default:
			return "";
	}
}

// type TMedia = "file" | "music" | "image" | "video";
// type TBgColors =
// 	| "dark-blue"
// 	| "orange"
// 	| "yellow"
// 	| "red"
// 	| "green"
// 	| "blue"
// 	| "light-grey"
// 	| "light-grey-2"
// 	| "grey"
// 	| "dark-grey";

const FileComponent = ({
	item,
	link,
	mediaType = "file",
	size = "large",
	hasSelect = false,
	hasMenu = false,
	menu,
	bgColor,
	isDownload = true,
	zoomIn = false,
	removable,
	bgImage = "type1",
	className,
	onSelect,
	...otherProps
}) => {
	const classNames = cx(
		`file rounded-md relative mr-3`,
		size === "large" ? "pt-4 pb-4 sm:px-5" : "w-44 ",
		zoomIn ? "zoom-in" : "",
		bgColor ? getBgColor(bgColor) : "",
		className ? className : ""
	);
	const domain = item && get(item, "domain");
	const folder = item && get(item, "folder");
	const file = item && get(item, "file");
	const imgFile = item && get(item, "thumbnails.small.src");
	const docFile = `${domain}/${folder}/${file}`;
	const fileLink = link ? link : docFile;
	return (
		<div className={classNames} {...otherProps}>
			{hasSelect && (
				<div className="absolute left-0 top-0 mt-3 ml-3">
					<input className="form-check-input border-theme-17" type="checkbox" onChange={e => onSelect && onSelect(item, e)} />
				</div>
			)}
			<a
				href={fileLink}
				// target="_blank"
				download={isDownload}
				className={`w-6 file__icon ${bgImage === "type1" ? `file__icon--${getFileType(mediaType)}` : ""} mx-auto`}>
				{mediaType === "image" ? (
					<div className="file__icon--image__preview image-fit">
						<img src={imgFile ? imgFile : null} alt="" />
					</div>
				) : (
					<div className="file__icon__file-name w-10 h-5">{getFileIcon(get(item, "ext"))}</div>
				)}
			</a>
			<a
				href={fileLink ? fileLink : ""}
				// target="_blank"
				download={isDownload}
				className="block font-medium mt-4 d-none text-center truncate">
				{truncate(get(item, "title", "unknown"), { length: 15 })}
			</a>
			{/* {fileLink ? <div className="text-gray-600 text-xs text-center mt-0.5">{helpers.formatBytes(get(item, "size", "unknown"))}</div> : null} */}
			{hasMenu && (
				<div className="absolute top-0 right-0 mr-2 mt-2 dropdown ml-auto">
					<a href="#ewfef" className="dropdown-toggle w-5 h-5 block">
						<Icon name="more-vertical" className="w-5 h-5 text-gray-600" />
					</a>
					<div className="dropdown-menu w-40">
						<div className="dropdown-menu__content box dark:bg-dark-1 p-2">{menu}</div>
					</div>
				</div>
			)}
			{removable && removable}
		</div>
	);
};

export default FileComponent;
