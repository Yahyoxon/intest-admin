import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import qs from "query-string";
import PropTypes from "prop-types";

import { Button, Icon, Typography, Panel } from "../";
import "./style.scss";

const PageHeaderComponent = ({
	history,
	location,
	title,
	btnName,
	btnClick,
	filter,
	setFilter,
	extraFilter,
	hasBtnIcon,
	hasButton,
	hasFilter,
	hasSearch,
	backBtn,
	children,
	...otherProps
}) => {
	const [name, setName] = useState("");
	const handleKeypress = e => {
		if (e.key === "Enter") {
			history.push({
				pathname: location.pathname,
				search: qs.stringify(
					name
						? {
								q: name
						  }
						: {}
				)
			});
		}
	};

	const el = document.createElement("div");

	useEffect(() => {
		const modalRoot = document.getElementById("modal-root");
		if (filter) modalRoot.appendChild(el);
	}, [filter, el]);

	return (
		<Panel className="menu-header">
			<div className="intro-y col-span-12 flex flex-wrap justify-between lg:justify-between sm:flex-nowrap items-center" {...otherProps}>
				{title && (
					<Typography.Heading type={4} className="font-medium d-flex align-center">
						{backBtn && (
							<Button.Outline type="blue" className="mr-5" size="sm" onClick={() => history.goBack()}>
								<Icon name="chevron-left" />
							</Button.Outline>
						)}
						{title}
					</Typography.Heading>
				)}

				{extraFilter && !title && <div className="text-gray-700 dark:text-gray-300 mr-3">{extraFilter}</div>}

				<div className="sm:w-auto sm:mt-0 sm:ml-auto md:ml-0 d-flex align-center">
					{extraFilter && title && <div className="text-gray-700 dark:text-gray-300 mr-3">{extraFilter}</div>}
					{hasSearch && (
						<div className="header-input w-64 relative text-gray-700 dark:text-gray-300">
							<input
								type="text"
								className="w-64 form-control box pr-10 placeholder-theme-8"
								placeholder="Search..."
								onChange={e => setName(e.target.value)}
								onKeyPress={handleKeypress}
								defaultValue={name}
							/>
							<Icon name="search" className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
						</div>
					)}
					<div className="flex items-center">
						{hasButton && (
							<Button.Default className="shadow-md ml-4 mr-0" onClick={btnClick}>
								{hasBtnIcon ? <Icon name="plus" className="h-5 w-5 mr-2" strokeColor="white" /> : " "}
								{btnName}
							</Button.Default>
						)}
						{hasFilter && (
							<div className="ml-2">
								<button className="dropdown-toggle btn px-2 box text-gray-700 dark:text-gray-300" onClick={() => setFilter(!filter)}>
									<span className="w-5 h-5 flex items-center justify-center">
										<Icon name={filter ? "x" : "filter"} className="w-4 h-4" />
									</span>
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{hasFilter &&
				ReactDOM.createPortal(
					<div className={`filter-container`}>
						<div className="filter-container__overlay" onClick={() => setFilter(false)} />
						<div className="filter dark:bg-dark-3">
							<Icon name="x-circle" className="close-btn" strokeColor="#fff" onClick={() => setFilter(false)} />
							<div className="p-10">{children}</div>
						</div>
					</div>,
					el
				)}
		</Panel>
	);
};

PageHeaderComponent.propTypes = {
	title: PropTypes.string,
	btnName: PropTypes.string,
	btnClick: PropTypes.func,
	setFilter: PropTypes.func,
	extraFilter: PropTypes.node,
	hasBtnIcon: PropTypes.bool,
	hasButton: PropTypes.bool,
	hasFilter: PropTypes.bool,
	hasSearch: PropTypes.bool,
	backBtn: PropTypes.bool
};

PageHeaderComponent.defaultProps = {
	btnName: "Добавить",
	filter: false,
	hasBtnIcon: true,
	hasButton: true,
	hasFilter: false,
	hasSearch: true,
	backBtn: false
};

export default withRouter(PageHeaderComponent);
