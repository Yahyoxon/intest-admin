import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import { useDispatch } from "react-redux";
import cx from "classnames";

import storageActions from "store/actions/storage";
import { Typography, Button, Icon } from "components";
import { ReactComponent as TicketIcon } from "assets/images/ticket.svg";

const ModalConfirmComponent = ({ history, location, match, toggle, className, backdrop = true, closable = true, setToggle, hasData, onCancel = () => {} }) => {
	const dispatch = useDispatch();
	const el = document.createElement("div");

	useEffect(() => {
		const modalRoot = document.getElementById("modal-root");
		modalRoot.appendChild(el);
		if (toggle) document.body.className = `main ${toggle ? "overflow-y-hidden" : ""}`;
		else document.body.className = `main`;

		return () => {
			modalRoot.removeChild(el);
		};
	}, [toggle, el]);

	const classNames = cx(`modal ${!backdrop ? "modal-static" : ""}`, toggle ? "show" : "", className ? className : "");

	return ReactDOM.createPortal(
		<div className={classNames}>
			<div
				className="modal-overlap"
				onClick={() => {
					if (closable) {
						setToggle(false);
						dispatch(storageActions.SAVE_TEMPRORY_DATA.success({}));
						history.push("/tickets");
					}
				}}
			/>
			{/* style={{marginTop: '12rem'}} */}
			<div className={`modal-dialog modal-sm`}>
				<div className="modal-content">
					<div className="modal-body p-10">
						<div className="d-flex align-center justify-content-center flex-col">
							<TicketIcon />
							<Typography.Heading type={5} className="mt-5">
								Билет успешно {hasData ? "обновлен" : "создан"}
							</Typography.Heading>
							<div className="mt-1">Хотите взглянуть на билет?</div>
							<Button.Outline
								type="secondary"
								buttonType="button"
								className="mt-5"
								onClick={() => {
									dispatch(storageActions.SAVE_TEMPRORY_DATA.success({}));
									setToggle(false);
									history.push("/tickets");
								}}>
								Перейти к билету <Icon name="chevron-right" className="ml-3" />
							</Button.Outline>
						</div>
					</div>
				</div>
			</div>
		</div>,
		el
	);
};

export default withRouter(ModalConfirmComponent);
