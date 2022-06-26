import React, { useState } from "react";
import cx from "classnames";
import { get } from "lodash";

import { Icon } from "components";
import { useOutsideClick } from "hooks";
import "./style.scss";

const SelectDropdownComponent = ({ items, initialValue, optionValue, optionLabel, placeholder, setValue, className = "", ...otherProps }) => {
	const initValue = initialValue ? initialValue : placeholder;
	const [select, setSelect] = useState(initValue);
	const { ref, isVisible, setIsVisible } = useOutsideClick(false);
	const classNames = cx("select-container", isVisible ? "active" : "", className ? className : "");

	return (
		<div className={classNames} {...otherProps}>
			<div ref={ref} className="select-label" onClick={() => setIsVisible(!isVisible)}>
				<span>{select ? select.value : initialValue.value}</span>
				<Icon name={isVisible ? "chevron-up" : "chevron-down"} size={20} />
			</div>
			<div className={`select-options-containers${isVisible ? " visible" : ""}`}>
				<ul className="select-options">
					{items &&
						items.length > 0 &&
						items.map((item, i) => {
							const id = get(item, "id") ? get(item, "id") : i;
							const optValue = get(item, optionValue);
							const optLabel = get(item, optionLabel);
							return (
								<li
									className={`select-option ${select && id === select.id ? "selected" : ""}`}
									key={id}
									onClick={() => {
										setSelect({ id, value: optValue });
										setIsVisible(false);
										setValue({ id, value: optValue });
									}}>
									{optLabel}
								</li>
							);
						})}
				</ul>
			</div>
		</div>
	);
};

export default SelectDropdownComponent;
