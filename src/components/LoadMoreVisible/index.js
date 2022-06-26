import React from "react";

import VisibilitySensor from "react-visibility-sensor";
import { withTranslation } from "react-i18next";


const LoadMoreVisible = ({ setPage = () => {} }) => {
	return (
		<VisibilitySensor
			offset={{ bottom: -250 }}
			partialVisibility
			onChange={isVisible => {
				if (isVisible) {
					setPage();
				}
			}}>
			{() => (
				<div className="d-flex justify-content-center mt-20 mb-40">
					<button
						type={"button"}
						onClick={setPage}
						className="main-btn main-btn_outline"
					/>
				</div>
			)}
		</VisibilitySensor>
	);
};

export default withTranslation("main")(LoadMoreVisible);
