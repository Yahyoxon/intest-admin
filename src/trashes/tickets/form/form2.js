import React from "react";
import { Field } from "formik";
import { useDispatch } from "react-redux";

import { Grid, Fields, Button, ProgressController } from "components";
import storageActions from "store/actions/storage";

const Form2Component = ({ values, setFieldValue, isUpdate, isSubmitting, setFormStep, step, disabled }) => {
	const dispatch = useDispatch();

	return (
		<Grid.Row>
			<Grid.Column xs={12}>
				<Field
					component={Fields.Input}
					name="financing"
					type="number"
					label="Освоение"
					disabled={disabled}
					placeholder="Введите"
					onChange={e => {
						setFieldValue("process", Math.round((e.target.value * 100) / Number(String(values.amount).replace(new RegExp(",", "g"), ""))));
					}}
				/>
				<Field
					component={ProgressController}
					name="process"
					disabled={disabled}
					label="Сделано"
					onChange={e => {
						setFieldValue(
							"financing",
							Number(Math.round(Number(String(values.amount).replace(new RegExp(",", "g"), "")) * (e.target.value / 100)))
						);
					}}
				/>
				<Field component={Fields.UploadManager} name="gallery" label="Галерея" isMulti={true} limit={20} />

				<div className="d-flex align-center justify-content-between mt-5">
					<Button.Outline
						className="px-10"
						onClick={() => {
							dispatch(storageActions.SAVE_TEMPRORY_DATA.success(values));
							setFormStep(step);
						}}>
						Назад
					</Button.Outline>
					{!disabled && (
						<Button.Default buttonType="submit" type="primary" disabled={disabled} className="px-5" loading={isSubmitting}>
							Отправить
						</Button.Default>
					)}
				</div>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form2Component;
