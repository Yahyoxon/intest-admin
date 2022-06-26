import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button, Ckeditor, Modal } from "components";
import { Field } from "formik";
import get from "lodash/get";
import { useAccess, useNotification } from "hooks";
import { useDispatch } from "react-redux";
import Actions from "modules/entity/actions";

const Form = ({ id, isUpdate, isSubmitting, setFieldValue, values, lang = "ru" }) => {
	const textareaRef = useRef(null);
	const history = useHistory();
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const [acceptModal, showAcceptModal] = useState(false);
	const [rejectModal, showRejectModal] = useState(false);

	const formatOptionLabel = ({ file, title_ru }) => (
		<div className="photo-bank-option">
			<img className="photo-bank-option__img" src={get(file, "[0]thumbnails.small.src")} alt="" />
			<div className="photo-bank-option__title">{title_ru}</div>
		</div>
	);

	const copyToClipboard = () => {
		const id = get(values, "gallery.id");
		const str = `[gallery-${id}]`;

		var input = document.createElement("input");
		input.value = str;
		document.body.appendChild(input);
		input.select();
		document.execCommand("copy");
		document.body.removeChild(input);

		notification("Успешно скопировано", {
			type: "success"
		});
	};

	const is_republic_isp_content_manager = useAccess({ roles: ["republic_isp_content_manager"] });
	const is_moderator = useAccess({ roles: ["moderator"] });
	const is_admin = useAccess({ roles: ["admin"] });

	const approveHandler = () => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "posts",
				name: `all-${lang}`,
				url: `/content/approve/${id}`,
				updateData: true,
				id: id,
				primaryKey: "id",
				values: {
					type: "post"
				},
				cb: {
					success: () => {
						history.push(`/news?lang=${lang}`);
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
				entity: "posts",
				name: `all-${lang}`,
				url: `/content/reject/${id}`,
				updateData: true,
				id: id,
				primaryKey: "id",
				values: {
					type: "post",
					reject_message: textareaRef.current.value
				},
				cb: {
					success: () => {
						history.push(`/news?lang=${lang}`);
					},
					error: () => {},
					finally: () => {}
				}
			})
		);
	};

	return (
		<div className="mt-3">
			<Panel className="pageContainer-inner">
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

				<Grid.Row gutter={30} gutterX={8} className={"mb-10"}>
					<Grid.Column xs={12} xl={8}>
						<div className="mt-5">
							<Field component={Fields.Input} name="title" type="text" placeholder="Введите загаловок" label="Заголовок" rows={3} />
							<Field component={Fields.Textarea} name="description" type="text" placeholder="Введите описание" label="Lead" />
							<Field component={Ckeditor} name="content" placeholder="Полный текст новости" label="Полный текст новости" />

							<div className="copy-clipboard-wrap">
								{values.gallery && (
									<Button.Default type="secondary" buttonType="button" onClick={() => copyToClipboard()}>
										Копировать код
									</Button.Default>
								)}
							</div>
						</div>
					</Grid.Column>
					<Grid.Column xs={12} xl={4}>
						<div className="mt-5">
							<Field component={Fields.DatePicker} name="published_at" label="Дата публикации" placeholder="dd-mm-yyyy" />
							<Field
								component={Fields.AsyncSelect}
								name="categories"
								placeholder="Введите Категория"
								label="Категория"
								isSearchable={true}
								isClearable={true}
								isMulti={true}
								loadOptionsUrl="/categories"
								formatOptionLabel={formatOptionLabel}
								optionLabel={`title_${lang}`}
								loadOptionsParams={title => {
									return {
										sort: `title_${lang}`
									};
								}}
							/>
							<Field
								component={Fields.AsyncSelect}
								name="tags"
								placeholder="Введите теги"
								label="Тег"
								isSearchable={true}
								isClearable={true}
								isMulti={true}
								loadOptionsUrl="/tags"
								formatOptionLabel={formatOptionLabel}
								optionLabel={`name`}
								loadOptionsParams={name => {
									return {
										sort: `name`
									};
								}}
							/>
						</div>
						<Field
							component={Fields.UploadManager}
							name="file_id"
							isDoc={false}
							isMulti={true}
							label="Изображение заголовка"
							className="mt-3 mb-3"
						/>
						<Grid.Row className="my-4">
							<Grid.Column xs={6} xl={6}>
								<Field
									component={Fields.Switch}
									name="status"
									label="Активный статус"
									onChange={() => {
										setFieldValue("status", !values.status);
									}}
								/>
							</Grid.Column>
							<Grid.Column xs={6} xl={6}>
								<Field
									component={Fields.Switch}
									name="top"
									label="Топ"
									onChange={() => {
										setFieldValue("top", !values.top);
									}}
								/>
							</Grid.Column>
						</Grid.Row>

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
								<Button.Outline buttonType="button" onClick={() => history.push(`/news?lang=${lang}`)}>
									Отменить
								</Button.Outline>
								<Button.Default buttonType="submit" type={"primary"} loading={isSubmitting}>
									{isUpdate ? "Сохранить" : "Добавить"}
								</Button.Default>
							</div>
						)}
					</Grid.Column>
				</Grid.Row>
			</Panel>
		</div>
	);
};

export default Form;
