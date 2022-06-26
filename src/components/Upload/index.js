import React, { useState } from "react";
import SystemActions from "store/actions/system";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";

const Upload = props => {
	const { children, successCb, isDoc = true, format=".doc,.docx,.pdf,.ppt,.txt,.xls,.xlsx" } = props;
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);

	const fileHandler = files => {
		setLoading(true);
		let formData = new FormData();
		files.forEach(file => formData.append("files", file));

		const cb = {
			success: (uploadedFiles) => {
				setFile(uploadedFiles);
				successCb(uploadedFiles);
			},
			failure: e => {
			},
			finally: () => {
				setLoading(false);
			}
		};

		dispatch(SystemActions.UploadFile({ files: formData, cb }));
	};

	return (
		<Dropzone
			onDrop={fileHandler}
			accept={isDoc ? format : "image/*"}
			className={props.className}
			>
			{({ getRootProps, getInputProps }) => (
				<div className="default-dropzone" {...getRootProps()}>
					{children({
						file,
						loading
					})}
					<input {...getInputProps()} id={"file"} />
				</div>
			)}
		</Dropzone>
	);
};

export default Upload;
