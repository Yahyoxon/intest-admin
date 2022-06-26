import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactDOM from "react-dom";
import cx from "classnames";

import Icon from "components/Icon";
import "../style.scss";

const modalRoot = document.getElementById("modal-root");

const ModalDefaultComponent = ({
	size = "md",
	toggle,
	className,
	okText = null,
	cancelText = null,
	exitBtn = false,
	backdrop = true,
	alignBtns = "right",
	alignExitBtn = "right",
	header,
	footer,
	isSuccess = false,
	onOk,
	onClick,
	setToggle,
	children,
	...otherProps
}) => {
	const { t } = useTranslation();

	const el = document.createElement("div");
	useEffect(() => {
		modalRoot.appendChild(el);
		if (toggle)
			document.body.className = `main ${
				toggle ? "overflow-y-hidden" : ""
			}`;
		else document.body.className = `main`;

		return () => {
			modalRoot.removeChild(el);
		};
	}, [toggle, el]);

	const classNames = cx(
		`modal ${!backdrop ? "modal-static" : ""}`,
		toggle ? "show" : "",
		className && className
	);

	return ReactDOM.createPortal(
		<div className={classNames} {...otherProps}>
			<div
				className="modal-overlap"
				onClick={() => {
					if (backdrop) {
						if (onClick && isSuccess) {
							onClick();
						}
					}
					setToggle(false)
				}}
			/>
			<div
				className={`modal-dialog ${
					size === "md" ? "" : `modal-${size}`
				}`}>
				<div className="modal-content">
					{(header || exitBtn) && (
						<div
							className="modal-header"
							style={{ display: `${header ? "flex" : "block"}` }}>
							{typeof header === "string" ? (
								<h2 className="font-medium text-base mr-auto">
									{t(header)}
								</h2>
							) : (
								<div className="mr-auto">{header}</div>
							)}
							{exitBtn && (
								<div className={`text-${alignExitBtn}`}>
									<Icon
										name="x"
										className="w-6 h-6 text-gray-500"
										onClick={() => setToggle(false)}
									/>
								</div>
							)}
						</div>
					)}
					<div className="modal-body">{children}</div>
					{(footer || okText || cancelText) && (
						<div className="modal-footer">
							{footer ? (
								<>{footer}</>
							) : (
								<div className={`text-${alignBtns}`}>
									{cancelText && (
										<button
											type="button"
											className="btn btn-outline-secondary w-24 dark:border-dark-5 dark:text-gray-300 mr-3"
											onClick={() => setToggle(false)}>
											{t(cancelText)}
										</button>
									)}
									{okText && (
										<button
											type="button"
											className={`btn w-24 btn-primary`}
											onClick={onOk}>
											{t(okText)}
										</button>
									)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>,
		el
	);
};

export default ModalDefaultComponent;
