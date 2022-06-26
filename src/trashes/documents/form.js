import React, { useRef, useState } from "react";

import { Fields, Grid, Button, Modal } from "components";
import { Field } from "formik";
import { useDispatch } from "react-redux";
import Actions from "../../modules/entity/actions";
import { useAccess } from "../../hooks";

const Form = ({ isUpdate, isSubmitting, setCreateModal, values, setFieldValue, setUpdateModal, id }) => {
	const [acceptModal, showAcceptModal] = useState(false);
	const [rejectModal, showRejectModal] = useState(false);

	const textareaRef = useRef(null);
	const dispatch = useDispatch();

	const handleCancel = () => {
		if (isUpdate) {
			setUpdateModal(false);
		} else {
			setCreateModal(false);
		}
	};

	const is_republic_isp_content_manager = useAccess({ roles: ["republic_isp_content_manager"] });
	const is_moderator = useAccess({ roles: ["moderator"] });
	const is_admin = useAccess({ roles: ["admin"] });

	const approveHandler = () => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "documents",
				name: `all`,
				url: `/content/approve/${id}`,
				updateData: true,
				normalizeData: data => data,
				id: id,
				primaryKey: "id",
				values: {
					type: "document"
				},
				cb: {
					success: () => {
						showAcceptModal(false);
						setUpdateModal(false);
					},
					error: () => {},
					finally: () => {}
				}
			})
		);
	};

	const rejectHandler = () => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "documents",
				name: `all`,
				url: `/content/reject/${id}`,
				updateData: true,
				normalizeData: data => data,
				id: id,
				primaryKey: "id",
				values: {
					type: "document",
					reject_message: textareaRef.current.value
				},
				cb: {
					success: () => {
						showRejectModal(false);
						setUpdateModal(false);
					},
					error: () => {},
					finally: () => {}
				}
			})
		);
	};

	return (
		<Grid.Row gutter={1}>
			<Grid.Column xs={12}>
				<Modal.Confirm
					title="Вы действительно хотите опубликовать?"
					toggle={acceptModal}
					setToggle={() => showAcceptModal(false)}
					closable
					type={"success"}
					cancelText="нет"
					okText="да"
					onOk={() => approveHandler()}
				/>

				<Modal.Confirm
					title="Вы действительно хотите отменить?"
					toggle={rejectModal}
					setToggle={() => showRejectModal(false)}
					closable
					cancelText="нет"
					okText="да"
					onOk={() => rejectHandler()}>
					<div>
						<textarea className="form-control" placeholder={"Причина отказа"} name="reject_comment" rows="5" ref={textareaRef} />
					</div>
				</Modal.Confirm>

				<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите названия Уз" label="Названия Уз" />
				<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите названия Ру" label="Названия Ру" />
				<Field component={Fields.Input} name="name_en" type="text" placeholder="Введите названия Ен" label="Названия Ен" />

				<Field component={Fields.UploadManager} name="file_id" label="Загрузите файлы" isMulti={false} isDocument={true} />

				<Field
					component={Fields.Switch}
					name="status"
					label="Статус документа"
					onChange={() => {
						setFieldValue("status", !values.status);
					}}
				/>

				{is_moderator && (
					<div className="flex justify-end">
						<Button.Default type="danger" buttonType="button" onClick={() => showRejectModal(true)}>
							Отменить
						</Button.Default>
						<Button.Default type="success" buttonType="button" onClick={() => showAcceptModal(true)} className="ml-2">
							Опубликовать
						</Button.Default>
					</div>
				)}

				{(is_admin || is_republic_isp_content_manager) && (
					<div className="flex justify-end">
						<Button.Default buttonType="submit" loading={isSubmitting}>
							{isUpdate ? "Сохранить" : "Добавить"}
						</Button.Default>
						<Button.Outline buttonType="button" onClick={() => handleCancel()}>
							Отменить
						</Button.Outline>
					</div>
				)}
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
