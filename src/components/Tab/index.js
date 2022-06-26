import React from "react";
import cx from "classnames";

const TabComponent = ({ className, items, activeTab, append, prepend, onChange = () => {} }) => {
	const classNames = cx(
		"intro-y nav nav-tabs d-flex flex-col sm:flex-row lg:justify-start tab-pane dark:bg-dark-3 w-full overflow-y-auto",
		className ? className : ""
	);
	return (
		<div className={classNames}>
			{prepend && <div className="nav-tab__prepend">{prepend}</div>}
			{items &&
				items.length > 0 &&
				items.map(item => (
					<div
						className={`py-5 px-5 sm:mr-8 tab-pane__item font-medium ${activeTab === item.code ? "--active" : ""}`}
						key={item.code}
						onClick={() => onChange(item)}>
						{item.title}
					</div>
				))}
			{append && <div className="nav-tab__append">{append}</div>}
		</div>
	);
};

export default TabComponent;
