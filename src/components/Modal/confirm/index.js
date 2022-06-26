import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import cx from "classnames";
import "../style.scss";
import { Button, Icon } from "components";

const getConfirmType = (type, title) => {
	switch (type) {
		case "success":
			return (
				<div className="p-5 text-center">
					<Icon name="check-circle" className="w-16 h-16 text-theme-10 mx-auto mt-3" />
					<div className="text-gray-600 mt-2">{title && title}</div>
				</div>
			);
		case "warning":
			return (
				<div className="p-5 text-center">
					<Icon name="x-circle" className="w-16 h-16 text-theme-23 mx-auto mt-3" />
					{/*<div className="text-3xl mt-5">{t("Oops")}...</div>*/}
					<div className="text-gray-600 mt-2">{title && title}</div>
				</div>
			);
		case "delete":
		default:
			return (
				<div className="p-5 text-center">
					<Icon name="x-circle" className="w-16 h-16 text-theme-24 mx-auto mt-3" />
					<div className="text-gray-600 mt-2">
						<div>{title && title}</div>
						<div>Этот процесс нельзя отменить</div>
					</div>
				</div>
			);
	}
};

const ModalConfirmComponent = ({
	type = "delete",
	toggle,
	className,
	okText = null,
	cancelText = null,
	backdrop = true,
	closable = true,
	isSubmitting = false,
	title,
	onOk,
	setToggle,
	children,
	onCancel = () => {}
}) => {
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

	const classNames = cx(`modal ${!backdrop ? "modal-static" : ""}`, toggle ? "show" : "", className && className);

	return ReactDOM.createPortal(
		<div className={classNames}>
			<div
				className="modal-overlap"
				onClick={() => {
					if (closable) {
						setToggle(false);
					}
				}}
			/>
			<div className="modal-dialog">
				<div className="modal-content">
					{type && <div className="modal-header">{getConfirmType(type, title)}</div>}
					{children && <div className="modal-body">{children}</div>}
					<div className="px-5 text-center modal-footer">
						{cancelText && (
							<button
								type="button"
								className="btn btn-outline-secondary w-24 dark:border-dark-5 dark:text-gray-300 mr-1"
								onClick={() => {
									setToggle(false);
									onCancel();
								}}>
								{cancelText}
							</button>
						)}
						{okText && (
							<Button.Default loading={isSubmitting} onClick={onOk} type="blue" buttonType="button" className={`btn w-24 btn-primary`}>
								{okText}
							</Button.Default>
						)}
					</div>
				</div>
			</div>
		</div>,
		el
	);
};

export default ModalConfirmComponent;
