import React, { useState } from "react";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import { useHistory } from "react-router-dom";
import { Button, Fields, Modal } from "components";
import { Field } from "formik";

const RejectAction = ({ id, successPath = "/tickets" }) => {
	const { notification } = useNotification();
	const history = useHistory();
	const [rejectModal, setRejectModal] = useState(false);

	return (
		<>
			<Modal.Default header="Отклонить заявку" toggle={rejectModal} setToggle={setRejectModal}>
				<EntityForm.Default
					method="post"
					url={`/properties/reject/${id}`}
					onSuccess={(data, resetForm) => {
						resetForm();
						setRejectModal(false);
						notification("Успешно отклонено", {
							type: "success"
						});
						history.push(successPath);
					}}
					onError={() => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					}}
					fields={[
						{
							name: "reason",
							required: true
						}
					]}>
					{({ isSubmitting, values, setFieldValue }) => {
						return (
							<>
								<Field
									component={Fields.Textarea}
									name="reason"
									type="text"
									rows={5}
									placeholder="Введите причина отклонение"
									label="Причина отклонения"
								/>
								<div className="flex justify-end">
									<Button.Default type="secondary" buttonType="button" onClick={() => setRejectModal(false)} className="mt-5">
										Отменить
									</Button.Default>
									<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="mt-5 ml-2">
										Отправить
									</Button.Default>
								</div>
							</>
						);
					}}
				</EntityForm.Default>
			</Modal.Default>
			<Button.Outline onClick={() => setRejectModal(true)} type="danger" buttonType="submit">
				Отклонять
			</Button.Outline>
		</>
	);
};

export default RejectAction;
