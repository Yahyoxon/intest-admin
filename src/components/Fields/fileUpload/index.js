import React, { useState } from "react";
import { ReactComponent as FileIcon } from "./fileIcon.svg";
import File from "./file";
import SystemActions from "store/actions/system";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { Spinner } from "../../index";

const Index = ({ isDoc = false, isMulti = false, onChangeHandler = () => {}, limit = 1, items = [], label = "", activeFolder, field, form }) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const fileHandler = files => {
		setLoading(true);
		let formData = new FormData();
		files.forEach((file, i) => formData.append(`files[${i}]`, file));
		if (activeFolder) {
			formData.append("folder_id", activeFolder.id);
		}

		const cb = {
			success: uploadedFiles => {
				onChangeHandler([...items, ...uploadedFiles]);
			},
			failure: err => {
				// setError(err);
			},
			finally: () => {
				setLoading(false);
			}
		};

		dispatch(SystemActions.UploadFile({ files: formData, cb }));
	};

	const deleteHandler = file => {
		const newItems = items.filter(item => item.id !== file.id);
		onChangeHandler(newItems);
	};

	const { getRootProps, getInputProps } = useDropzone({
		accept: isDoc ? ".doc,.docx,.xls,.xlsx,.ppt,.txt,.pdf,image/* " : "image/*",
		onDrop: files => fileHandler(files)
	});

	return (
		<div className={`mb-5`}>
			{label && <label className="form-label">{label}</label>}
			<div
				className={`
            border-2 border-dashed rounded-md pt-4 relative
            ${field && form && form.touched[field.name] && form.errors[field.name] ? "border-theme-24" : "dark:border-dark-5"}
            `}>
				{items.length > 0 && (
					<div className="flex flex-wrap px-4">
						{items.map(item => (
							<File {...{ item, isDoc, deleteHandler }} key={item.id} />
						))}
					</div>
				)}

				{items.length < limit && (
					<div {...getRootProps({})}>
						<input {...getInputProps()} multiple={isMulti} />
						<div className="px-4 pb-4 flex items-center cursor-pointer relative dark:text-gray-500">
							<FileIcon />
							<span className="text-theme-1 dark:text-gray-300 mr-1">Upload a file</span> or drag and drop
						</div>
					</div>
				)}

				{loading && <Spinner md position={"absolute"} />}
			</div>
		</div>
	);
};

export default Index;
