import React, { useState } from "react";

import { FileManager } from "components";
import { get, uniqBy } from "lodash";
import cx from "classnames";
import { helpers } from "services";
import "./style.scss";
import { ReactComponent as DeleteIcon } from "assets/images/icons/delete.svg";

const UploadManager = ({
	columns = 12,
	isMulti,
	isDocument = false,
	limit = 1,
	label,
	field,
	form: { touched, errors, setFieldValue, values },
	className,
	disabled
}) => {
	const [visible, setVisible] = useState(false);

	const removeHandler = selected => {
		setFieldValue(
			field.name,
			values[field.name].filter(item => item.id !== selected.id)
		);
	};

	const classNames = cx("upload-photos", touched[field.name] && errors[field.name] && "has-error", className);
	return (
		<>
			<FileManager
				addImage={selected => {
					if (isMulti) {
						setFieldValue(field.name, uniqBy([...values[field.name], ...selected], "id"));
					} else {
						setFieldValue(field.name, [selected]);
					}
				}}
				onCancel={() => {
					setVisible(false);
				}}
				isDocument={isDocument}
				visible={visible}
				isMulti={isMulti}
			/>
			<div className={classNames}>
				{label && <div className="form-label">{label}</div>}
				<div className="preview-list">
					{isDocument ? (
						<>
							{values &&
								values[field.name].map((item, i) => (
									<div className="doc-file p-0 mb-3 w-72" key={i}>
										<div className="doc-file__item">
											{!disabled && (
												<div className="delete-btn" onClick={() => removeHandler(item)}>
													<DeleteIcon height={22} width={22} />
												</div>
											)}
											<div className="doc-file__ext">{get(item, "ext")}</div>
											<div className="doc-file__content">
												<div className="doc-file__title">{get(item, "title")}</div>
												<div className="d-flex fs-12">
													<div className="w-20 pr-3 d-flex">
														<div className="">{helpers.formatBytes(get(item, "size"))}</div>
													</div>
													<div className="w-20 d-flex">
														<div className="">{helpers.formatDate(get(item, "created_at"))}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
						</>
					) : (
						<>
							{values &&
								values[field.name].map((item, i) => (
									<div className="preview-item" key={get(item, "id", `${i}`)}>
										{!disabled && (
											<div className="delete-btn" onClick={() => removeHandler(item)}>
												<DeleteIcon height={22} width={22} />
											</div>
										)}
										<img src={get(item, "thumbnails.small.src")} alt="" />
									</div>
								))}
						</>
					)}

					{!isDocument && (
						<div className="d-block">
							{limit > values[field.name].length && !disabled && (
								<div className="add-image-btn" onClick={() => setVisible(true)}>
									Загрузите
								</div>
							)}
							{field.name && touched[field.name] && errors[field.name] && <div className="text-theme-24 absolute left-0">{errors[field.name]}</div>}
						</div>
					)}
				</div>

				{isDocument && (
					<div className='preview-list'>
						<div className="d-block">
							{limit > values[field.name].length && !disabled && (
								<div className="add-image-btn" onClick={() => setVisible(true)}>
									Загрузите
								</div>
							)}
							{field.name && touched[field.name] && errors[field.name] && <div className="text-theme-24 absolute left-0">{errors[field.name]}</div>}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default UploadManager;
