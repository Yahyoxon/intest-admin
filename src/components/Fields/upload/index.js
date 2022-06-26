import React, { useEffect, useState } from "react";
import SystemActions from "store/actions/system";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { helpers } from "services";
import { get } from "lodash";
import { Icon, File } from "components";
import { useTranslation } from "react-i18next";
import { ReactComponent as UploadIcon } from "assets/images/icons/upload.svg";

const UploadComponent = props => {
	const {
		isDoc = false,
		view = 1,
		multiple = false,
		field = { name: "", value: [] },
		label,
		defaultText,
		form: { setFieldValue, touched, errors }
	} = props;
	const { getRootProps, getInputProps } = useDropzone({
		accept: isDoc ? ".doc,.docx,.txt,.pdf,.xls,.ppt,.pptx" : "image/*",
		onDrop: files => fileHandler(files)
	});
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);
	const deleteFile = id => {
		setLoading(true);
		const cb = {
			success: () => {
				setFile(null);
				setLoading(false);
			},
			failure: err => {
				setError(err);
			},
			finally: () => {
				setLoading(false);
			}
		};
		dispatch(SystemActions.DeleteFile({ id, cb }));
	};
	const fileHandler = files => {
		setLoading(true);

		let formData = new FormData();
		files.forEach(file => formData.append("files", file));

		const cb = {
			success: uploadedFile => {
				setFile(uploadedFile);
				setFieldValue(field.name, uploadedFile);
				setLoading(false);
			},
			failure: err => {
				setError(err);
			},
			finally: () => {
				setLoading(false);
			}
		};

		dispatch(SystemActions.UploadFile({ files: formData, cb }));
	};

	useEffect(() => {
		setFile(field.value);
	}, [field]);

	return (
		<div className="mt-5 mb-5">
			{label && (
				<div className="flex justify-between">
					<label htmlFor={field.name} className="form-label">
						{t(label)}
					</label>
				</div>
			)}
			<div className={`${view === 1 && file ? "" : "dropzone"}`}>
				{!file && (
					<div>
						<input {...getInputProps()} name={field.name} multiple={multiple} />
					</div>
				)}
				<div className="dz-message" {...getRootProps({})}>
					{file && view === 2 ? (
						<div className="dz-preview dz-file-preview dz-processing dz-error dz-complete">
							<div className="dz-image">
								<img src={get(file, "thumbnails.small.src")} alt="" />
							</div>
							<div className="dz-details">
								<div className="dz-size">
									<span>{helpers.formatBytes(file.size)}</span>
								</div>
								{get(file, "title") && (
									<div className="dz-filename">
										<span>{file.title}</span>
									</div>
								)}
							</div>
							{loading && (
								<div className="dz-progress">
									<div className="dz-upload" />
								</div>
							)}
							{error && (
								<div className="dz-error-message">
									<span>{error.toString()}</span>
								</div>
							)}
							<div
								title={`Удалить ${isDoc ? "документ" : "фото"}`}
								onClick={() => deleteFile(file.id)}
								className="tooltip w-5 h-5 flex items-center dropzone-remove-file justify-center absolute rounded-full text-white bg-theme-24 right-0 top-0 -mr-2 -mt-2 cursor-pointer">
								<Icon name="x" className="w-4 h-4" />
							</div>
						</div>
					) : file && view === 1 ? (
						<File
							item={file}
							mediaType={isDoc ? "file" : "image"}
							size="small"
							className="mt-5"
							bgColor="light-grey"
							isDownload={true}
							zoomIn={false}
							removable={
								<>
									{file ? (
										<div
											title={`Удалить ${isDoc ? "документ" : "фото"}`}
											onClick={() => deleteFile(file.id)}
											className="tooltip w-5 h-5 flex items-center dropzone-remove-file justify-center absolute rounded-full text-white bg-theme-24 right-0 top-0 -mr-2 -mt-2 cursor-pointer">
											<Icon name="x" className="w-4 h-4" />
										</div>
									) : null}
								</>
							}
						/>
					) : (
						<div className="d-flex align-center justify-center flex-col radius-1">
							<UploadIcon />
							<div className="text-gray-600 text-lg mt-5">{defaultText ? defaultText : <>{t(`Загрузить ${isDoc ? "документ" : "фото"}`)}</>}</div>
						</div>
					)}
				</div>
			</div>
			{touched[field.name] && errors[field.name] && (
				<div className="text-theme-24 absolute left-0">
					<span>{t(errors[field.name])}</span>
				</div>
			)}
		</div>
	);
};

export default UploadComponent;
