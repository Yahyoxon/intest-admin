import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import cx from "classnames";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-build-oks";
import get from 'lodash/get';
import { FileManager } from "components";

import "./style.scss";

const Ckeditor = ({
	placeholder,
	label,
	className,
	field,
	form: { errors, setFieldValue, touched },
	disabled = false,
	multi = false,
	...otherProps
}) => {
	const editorEl = useRef(null);
	const [fmVisible, toggleFm] = useState(false);
	const [show, setShow] = useState(false);

	const theme = useSelector(state => state.system.theme);
	const classNames = cx(
		"mb-5 relative",
		touched[field.name] && errors[field.name] && "has-error",
		className ? className : "",
		theme === "dark" ? "dark" : ""
	);

	const insertImage = ({ url = "" }) => {
		const editor = editorEl.current.editor;
		const content = `<img src='${url}'/>`;

		const viewFragment = editor.data.processor.toView(content);
		const modelFragment = editor.data.toModel(viewFragment);
		editor.model.insertContent(modelFragment);
	};

	const appendImageButton = () => {
		const btn = document.createElement("div");
		btn.className = "image-upload-btn";
		btn.onclick = () => toggleFm(true);
		const selector = document.querySelector(
			multi
				? `#${field.name} .ck-file-dialog-button`
				: ".ck-file-dialog-button"
		);
		selector.appendChild(btn);
	};

	useEffect(() => {
		setTimeout(() => {
			setShow(true);
		}, 200);
	}, [multi]);

	return (
		<Fragment>
			{fmVisible && (
				<FileManager
					visible={fmVisible}
					onCancel={() => toggleFm(false)}
					addImage={(item,size) => {
						insertImage({
							url: get(item, `thumbnails[${size}].src`)
						});
					}}
					isMulti={false}
				/>
			)}
			<div className={classNames} id={field.name}>
				{label && <div className="form-label w-full">{label}</div>}
				{show && (
					<CKEditor
						disabled={disabled}
						ref={editorEl}
						editor={ClassicEditor}
						onReady={editor => {
							return (!disabled && field) ? appendImageButton() : null;
						}}
						key={field.name}
						config={{
							removePlugins: ["MediaEmbedToolbar"],
							fontSize: {
								defaultLabel: '17px',
								options: [
									{
										title: "Tiny",
										model: "11px"
									},
									{
										title: "Small",
										model: "14px"
									},
									{
										title: "Default",
										model: "17px"
									},
									{
										title: "Big",
										model: "20px"
									},
									{
										title: "Huge",
										model: "23px"
									}
								]
							},
							toolbar: {
								items: [
									"heading",
									"|",
									"bold",
									"italic",
									"link",
									"bulletedList",
									"numberedList",
									"|",
									"indent",
									"outdent",
									"|",
									"imageUpload",
									"blockQuote",
									"insertTable",
									"undo",
									"redo",
									"alignment",
									"code",
									"codeBlock",
									"fontBackgroundColor",
									"fontColor",
									"fontSize",
									"fontFamily",
									"highlight",
									"horizontalLine",
									"removeFormat",
									"underline"
								]
							},
							image: {
								toolbar: [
									"imageTextAlternative",
									"|",
									"imageStyle:alignLeft",
									"imageStyle:full",
									"imageStyle:alignRight",
									"imageStyle:alignCenter"
								],

								styles: [
									"full",
									"alignLeft",
									"alignCenter",
									"alignRight"
								]
							},
							table: {
								contentToolbar: [
									"tableColumn",
									"tableRow",
									"mergeTableCells",
									"tableCellProperties",
									"tableProperties"
								]
							},
							placeholder: placeholder,
							codeBlock: {
								languages: [
									{
										language: "javascript",
										label: "JavaScript",
										class: "js javascript js-code"
									}
								]
							},
							link: {
								decorators: {
									addClassStyle1: {
										mode: "manual",
										label: "Highlight link",
										attributes: {
											class: "highlight-link"
										}
									},
									openInNewTab: {
										mode: "manual",
										label: "Open in a new tab",
										attributes: {
											target: "_blank",
											rel: "noopener noreferrer"
										}
									}
								}
							}
						}}
						data={field.value}
						onChange={(event, editor) => {
							setFieldValue(field.name, editor.getData());
						}}
					/>
				)}
				{touched[field.name] && errors[field.name] && (
					<div className="text-theme-24 absolute left-0">
						<span>{errors[field.name]}</span>
					</div>
				)}
			</div>
		</Fragment>
	);
};

export default Ckeditor;
