import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button, Ckeditor, Modal } from "components";
import { Field } from "formik";
import { useAccess } from "../../../hooks";
import Actions from "../../../modules/entity/actions";
import { useDispatch } from "react-redux";
import clipboard from "assets/images/icons/clipboard.png";

const Form = ({ isUpdate, isSubmitting, lang, id, setFieldValue, values }) => {
	const textareaRef = useRef(null);
	const history = useHistory();
	const dispatch = useDispatch();
	const [acceptModal, showAcceptModal] = useState(false);
	const [rejectModal, showRejectModal] = useState(false);

	const is_republic_isp_content_manager = useAccess({ roles: ["republic_isp_content_manager"] });
	const is_moderator = useAccess({ roles: ["moderator"] });
	const is_admin = useAccess({ roles: ["admin"] });

	const approveHandler = () => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "pages",
				name: `pages-${lang}`,
				url: `/content/approve/${id}`,
				updateData: true,
				id: id,
				primaryKey: "id",
				values: {
					type: "page"
				},
				cb: {
					success: () => {
						history.push(`/pages?lang=${lang}`);
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
				entity: "pages",
				name: `pages-${lang}`,
				url: `/content/reject/${id}`,
				updateData: true,
				id: id,
				primaryKey: "id",
				values: {
					type: "page",
					reject_message: textareaRef.current.value
				},
				cb: {
					success: () => {
						history.push(`/pages?lang=${lang}`);
					},
					error: () => {},
					finally: () => {}
				}
			})
		);
	};

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
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

				<Panel
					className="p-5"
					footer={
						<div className="d-flex justify-content-between align-items-center">
							<Field
								component={Fields.Switch}
								name="status"
								label="Активный статус"
								onChange={() => {
									setFieldValue("status", !values.status);
								}}
							/>

							{is_moderator && (
								<div className="flex flex-wrap justify-start">
									<Button.Default type="danger" buttonType="button" onClick={() => showRejectModal(true)}>
										Отменить
									</Button.Default>
									<Button.Default type="success" buttonType="button" onClick={() => showAcceptModal(true)} className="ml-2">
										Опубликовать
									</Button.Default>
								</div>
							)}

							{(is_admin || is_republic_isp_content_manager) && (
								<div className="flex flex-wrap justify-start">
									<Button.Default buttonType="submit" loading={isSubmitting}>
										{isUpdate ? "Сохранить" : "Добавить"}
									</Button.Default>
									<Button.Outline className="mr-0" buttonType="button" onClick={() => history.push(`/pages?lang=${lang}`)}>
										Отменить
									</Button.Outline>
								</div>
							)}
						</div>
					}>
					<Field component={Fields.Input} name="title" type="text" placeholder="Введите название" label="Название" />
					<div className="slug-box" style={{ position: "relative" }}>
						<Field
							component={Fields.Input}
							style={{
								width: "50%"
							}}
							disabled={isUpdate}
							name="slug"
							type="text"
							placeholder="Введите slug"
							label="Slug"
						/>
						<img
							title="Копировать"
							src={clipboard}
							style={{ width: "25px", cursor: "pointer", position: "absolute", left: "52%", top: 33 }}
							alt="clipboard"
							onClick={() => {
								navigator.clipboard.writeText(values.slug);
							}}
						/>
					</div>

					<Field component={Ckeditor} name="description" placeholder="Описание" label="Введите описание" />
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
