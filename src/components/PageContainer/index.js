import React from "react";
import cx from "classnames";
import { useHistory } from "react-router-dom";

import { Spinner, Typography, Button, Icon } from "components";

const PageContainerComponent = ({ isLoading = false, className, children, headerRight, pageTitle = "", backBtn = true, ...otherProps }) => {
	const history = useHistory();

	const classNames = cx("page-container", className ? className : "");

	return (
		<div className={classNames} {...otherProps}>
			<div className="pt-10">
				{isLoading && (
					<div className="spinner-overlay">
						<Spinner />
					</div>
				)}
				<div className="d-flex align-center justify-content-between">
					<Typography.Heading type={4} className="intro-y font-medium mb-5 d-flex align-center">
						{backBtn && (
							<Button.Outline type="blue" className="mr-5" size="sm" onClick={() => history.goBack()}>
								<Icon name="chevron-left" />
							</Button.Outline>
						)}
						{pageTitle}
					</Typography.Heading>
					{headerRight}
				</div>
				{children}
			</div>
		</div>
	);
};

export default PageContainerComponent;
