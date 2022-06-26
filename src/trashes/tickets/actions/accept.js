import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { get } from "lodash";

import { Button, Modal } from "components";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";

const AcceptAction = ({ id, successPath = "/tickets" }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { notification } = useNotification();

	const [submitAccept, setSubmitAccept] = useState(false);
	const [acceptModal, setAcceptModal] = useState(false);

	const acceptAction = () => {
		setSubmitAccept(true);
		dispatch(
			Actions.FormDefault.request({
				method: "post",
				url: `/properties/approve/${id}`,
				cb: {
					success: data => {
						notification("Успешно принят", { type: "success" });
						history.push(successPath);
					},

					error: error => {
						const message = get(error, "message");
						notification(message, { type: "danger" });
					},
					finally: () => {
						setAcceptModal(false);
						setSubmitAccept(false);
					}
				}
			})
		);
	};

	return (
		<div>
			<Modal.Confirm
				title="Вы действительно хотите принять билет?"
				toggle={acceptModal}
				setToggle={setAcceptModal}
				closable
				cancelText="Нет"
				okText="Да"
				onOk={() => acceptAction()}
				type="success"
				isSubmitting={submitAccept}
			/>

			<Button.Outline onClick={() => setAcceptModal(true)} type="success" buttonType="button">
				Подтвердить
			</Button.Outline>
		</div>
	);
};

export default AcceptAction;
