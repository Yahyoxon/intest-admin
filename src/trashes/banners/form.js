import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values, lang = "ru" }) => {
	const history = useHistory();

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5 p-5">
					<Field
						component={Fields.Input}
						name="title"
						type="text"
						placeholder="Введите загаловок"
						label="Загаловка"
					/>
					<Field
						component={Fields.Textarea}
						name="content"
						type="text"
						placeholder="Введите описание"
						label="Описание"
					/>
					<div className="row">
						<div className="col-6">
							<Field
								component={Fields.Input}
								name="button_text"
								type="text"
								placeholder="Введите текст кнопку"
								label="Текст кнопку"
							/>
						</div>
						<div className="col-6">
							<Field
								component={Fields.Input}
								name="link"
								type="text"
								placeholder="Введите линк кнопку"
								label="Линк кнопку"
								rows={3}
							/>
						</div>
					</div>
					<Field
						component={Fields.Input}
						name="sort"
						type="number"
						placeholder="Введите позицию"
					   	label="Позиция" rows={3}
					/>
					 <Field
						 component={Fields.UploadManager}
						 name="file_id"
						 label="Фоновое изображение"
						 className="mt-3 mb-3"
					 />

					<div className="d-flex align-items-center justify-content-between">
						<Field
							component={Fields.Switch}
							name="status"
							label="Статус"
							onChange={() => {
								setFieldValue("status", !values.status);
							}}
						/>

						<div className="flex justify-start">
							<Button.Default
								type="secondary"
								buttonType="button"
								onClick={() => history.push(`/banners`)}
							>
								Отменить
							</Button.Default>
							<Button.Default type="blue" className="all-btn ml-2" buttonType="submit" loading={isSubmitting}>
								{isUpdate ? "Сохранить" : "Добавить"}
							</Button.Default>
						</div>
					</div>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
